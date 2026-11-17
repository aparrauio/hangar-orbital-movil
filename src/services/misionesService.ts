import {
  collection,
  doc,
  getCountFromServer,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {
  type MotivoRechazoMision,
  puedeRecibirMision,
  type ResultadoPuedeRecibirMision,
} from '../dominio/puedeRecibirMision';
import {
  type CodigoErrorMision,
  validarMision,
} from '../dominio/validarMision';
import { db } from '../firebase/config';
import type { EntradaMision } from '../types/mision';
import type { Nave } from '../types/nave';
import { convertirNave, listarNaves } from './navesService';

export interface NaveConAptitud {
  nave: Nave;
  misionesDesdeRevision: number;
  aptitud: ResultadoPuedeRecibirMision;
}

export type ResultadoListarNavesConAptitud =
  | { ok: true; naves: NaveConAptitud[] }
  | { ok: false; error: { tipo: 'conexion' } };

export type ErrorCrearMision =
  | { tipo: 'validacion'; errores: CodigoErrorMision[] }
  | { tipo: 'rechazada'; motivo: MotivoRechazoMision }
  | { tipo: 'conexion' };

export type ResultadoCrearMision =
  { ok: true; id: string } | { ok: false; error: ErrorCrearMision };

export async function contarMisionesDesdeRevision(
  nave: Pick<Nave, 'id' | 'ultimaRevision'>,
): Promise<number> {
  const resumen = await getCountFromServer(
    query(
      collection(db, 'naves', nave.id, 'misiones'),
      where('creadaEn', '>=', nave.ultimaRevision),
    ),
  );
  return resumen.data().count;
}

export async function listarNavesConAptitud(): Promise<ResultadoListarNavesConAptitud> {
  const listado = await listarNaves();
  if (!listado.ok) {
    return listado;
  }

  try {
    const naves = await Promise.all(
      listado.naves.map(async (nave) => {
        const misionesDesdeRevision = await contarMisionesDesdeRevision(nave);
        return {
          nave,
          misionesDesdeRevision,
          aptitud: puedeRecibirMision(nave, misionesDesdeRevision),
        };
      }),
    );
    return { ok: true, naves };
  } catch {
    return { ok: false, error: { tipo: 'conexion' } };
  }
}

export async function crearMision(
  entrada: EntradaMision,
  hoy: string,
): Promise<ResultadoCrearMision> {
  const validacion = validarMision(entrada, hoy);
  if (!validacion.valido) {
    return {
      ok: false,
      error: { tipo: 'validacion', errores: validacion.errores },
    };
  }

  const { naveId, destino, fechaDespegue, duracionDias } = validacion.datos;
  const referenciaNave = doc(db, 'naves', naveId);
  const referenciaMision = doc(collection(referenciaNave, 'misiones'));

  try {
    return await runTransaction<ResultadoCrearMision>(
      db,
      async (transaccion) => {
        const documentoNave = await transaccion.get(referenciaNave);
        if (!documentoNave.exists()) {
          return { ok: false, error: { tipo: 'conexion' } };
        }

        const nave = convertirNave(documentoNave.id, documentoNave.data());
        const misiones = await contarMisionesDesdeRevision(nave);
        const decision = puedeRecibirMision(nave, misiones);
        if (!decision.puede) {
          return {
            ok: false,
            error: { tipo: 'rechazada', motivo: decision.motivo },
          };
        }

        transaccion.set(referenciaMision, {
          destino,
          fechaDespegue,
          duracionDias,
          creadaEn: serverTimestamp(),
        });
        return { ok: true, id: referenciaMision.id };
      },
    );
  } catch {
    return { ok: false, error: { tipo: 'conexion' } };
  }
}
