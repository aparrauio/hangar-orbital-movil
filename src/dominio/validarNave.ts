import {
  CLASES_NAVE,
  type ClaseNave,
  type EntradaNave,
  type NaveValidada,
} from '../types/nave';
import type { ResultadoValidacion } from '../types/validacion';
import { normalizarNombre } from './normalizarNombre';

export type CodigoErrorNave =
  | 'nombre-requerido'
  | 'nombre-invalido'
  | 'clase-requerida'
  | 'clase-invalida'
  | 'combustible-requerido'
  | 'combustible-no-entero'
  | 'combustible-fuera-de-rango';

const PATRON_ID_NAVE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PATRON_ENTERO = /^-?[0-9]+$/;

function esClaseNave(valor: string): valor is ClaseNave {
  return CLASES_NAVE.some((clase) => clase === valor);
}

export function validarNave(
  entrada: EntradaNave,
): ResultadoValidacion<NaveValidada, CodigoErrorNave> {
  const errores: CodigoErrorNave[] = [];
  const nombre = entrada.nombre.trim();
  const id = normalizarNombre(nombre);
  const claseTexto = entrada.clase.trim();
  const combustibleTexto = entrada.combustible.trim();

  if (nombre === '') {
    errores.push('nombre-requerido');
  } else if (!PATRON_ID_NAVE.test(id)) {
    errores.push('nombre-invalido');
  }

  let clase: ClaseNave | undefined;
  if (claseTexto === '') {
    errores.push('clase-requerida');
  } else if (esClaseNave(claseTexto)) {
    clase = claseTexto;
  } else {
    errores.push('clase-invalida');
  }

  let combustible: number | undefined;
  if (combustibleTexto === '') {
    errores.push('combustible-requerido');
  } else if (!PATRON_ENTERO.test(combustibleTexto)) {
    errores.push('combustible-no-entero');
  } else {
    const valor = Number(combustibleTexto);
    if (valor < 0 || valor > 100) {
      errores.push('combustible-fuera-de-rango');
    } else {
      combustible = valor;
    }
  }

  if (errores.length > 0 || clase === undefined || combustible === undefined) {
    return { valido: false, errores };
  }

  return { valido: true, datos: { id, nombre, clase, combustible } };
}
