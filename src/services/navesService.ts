import {
  collection,
  doc,
  getDocsFromServer,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';
import { type CodigoErrorNave, validarNave } from '../dominio/validarNave';
import { db } from '../firebase/config';
import type { ClaseNave, EntradaNave, Nave } from '../types/nave';

export type ErrorCrearNave =
  | { tipo: 'validacion'; errores: CodigoErrorNave[] }
  | { tipo: 'nombre-repetido' }
  | { tipo: 'conexion' };

export type ResultadoCrearNave =
  | { ok: true; id: string; nombre: string }
  | { ok: false; error: ErrorCrearNave };

export type ResultadoListarNaves =
  { ok: true; naves: Nave[] } | { ok: false; error: { tipo: 'conexion' } };

interface NaveEnFirestore {
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: boolean;
  ultimaRevision: Timestamp;
  creadaEn: Timestamp;
}

export function convertirNave(id: string, datos: DocumentData): Nave {
  const nave = datos as NaveEnFirestore;
  return {
    id,
    nombre: nave.nombre,
    clase: nave.clase,
    combustible: nave.combustible,
    enReparacion: nave.enReparacion,
    ultimaRevision: nave.ultimaRevision.toDate(),
    creadaEn: nave.creadaEn.toDate(),
  };
}

export async function crearNave(
  entrada: EntradaNave,
): Promise<ResultadoCrearNave> {
  const validacion = validarNave(entrada);
  if (!validacion.valido) {
    return {
      ok: false,
      error: { tipo: 'validacion', errores: validacion.errores },
    };
  }

  const { id, nombre, clase, combustible } = validacion.datos;
  const referencia = doc(db, 'naves', id);

  try {
    const yaExiste = await runTransaction(db, async (transaccion) => {
      const existente = await transaccion.get(referencia);
      if (existente.exists()) {
        return true;
      }
      transaccion.set(referencia, {
        nombre,
        clase,
        combustible,
        enReparacion: false,
        ultimaRevision: serverTimestamp(),
        creadaEn: serverTimestamp(),
      });
      return false;
    });

    if (yaExiste) {
      return { ok: false, error: { tipo: 'nombre-repetido' } };
    }
    return { ok: true, id, nombre };
  } catch {
    return { ok: false, error: { tipo: 'conexion' } };
  }
}

export async function listarNaves(): Promise<ResultadoListarNaves> {
  try {
    const resultado = await getDocsFromServer(
      query(collection(db, 'naves'), orderBy('nombre')),
    );
    return {
      ok: true,
      naves: resultado.docs.map((documento) =>
        convertirNave(documento.id, documento.data()),
      ),
    };
  } catch {
    return { ok: false, error: { tipo: 'conexion' } };
  }
}
