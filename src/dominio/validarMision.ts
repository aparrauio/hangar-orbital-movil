import type { EntradaMision, MisionValidada } from '../types/mision';
import type { ResultadoValidacion } from '../types/validacion';

export type CodigoErrorMision =
  | 'nave-requerida'
  | 'destino-requerido'
  | 'fecha-requerida'
  | 'fecha-invalida'
  | 'fecha-pasada'
  | 'duracion-requerida'
  | 'duracion-no-entera'
  | 'duracion-minima';

const PATRON_FECHA = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const PATRON_ENTERO = /^-?[0-9]+$/;

function esFechaReal(fecha: string): boolean {
  if (!PATRON_FECHA.test(fecha)) {
    return false;
  }
  const anio = Number(fecha.slice(0, 4));
  const mes = Number(fecha.slice(5, 7));
  const dia = Number(fecha.slice(8, 10));
  const calculada = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    calculada.getUTCFullYear() === anio &&
    calculada.getUTCMonth() === mes - 1 &&
    calculada.getUTCDate() === dia
  );
}

export function validarMision(
  entrada: EntradaMision,
  hoy: string,
): ResultadoValidacion<MisionValidada, CodigoErrorMision> {
  const errores: CodigoErrorMision[] = [];
  const naveId = entrada.naveId.trim();
  const destino = entrada.destino.trim();
  const fechaDespegue = entrada.fechaDespegue.trim();
  const duracionTexto = entrada.duracionDias.trim();

  if (naveId === '') {
    errores.push('nave-requerida');
  }
  if (destino === '') {
    errores.push('destino-requerido');
  }

  if (fechaDespegue === '') {
    errores.push('fecha-requerida');
  } else if (!esFechaReal(fechaDespegue)) {
    errores.push('fecha-invalida');
  } else if (fechaDespegue < hoy) {
    errores.push('fecha-pasada');
  }

  let duracionDias: number | undefined;
  if (duracionTexto === '') {
    errores.push('duracion-requerida');
  } else if (!PATRON_ENTERO.test(duracionTexto)) {
    errores.push('duracion-no-entera');
  } else if (Number(duracionTexto) < 1) {
    errores.push('duracion-minima');
  } else {
    duracionDias = Number(duracionTexto);
  }

  if (errores.length > 0 || duracionDias === undefined) {
    return { valido: false, errores };
  }

  return {
    valido: true,
    datos: { naveId, destino, fechaDespegue, duracionDias },
  };
}
