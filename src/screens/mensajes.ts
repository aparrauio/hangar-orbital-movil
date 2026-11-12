import {
  MAXIMO_MISIONES_ENTRE_REVISIONES,
  type MotivoRechazoMision,
  type ResultadoPuedeRecibirMision,
} from '../dominio/puedeRecibirMision';
import type { CodigoErrorMision } from '../dominio/validarMision';
import type { CodigoErrorNave } from '../dominio/validarNave';
import type { ClaseNave } from '../types/nave';

export const MENSAJES_ERROR_MISION: Record<CodigoErrorMision, string> = {
  'nave-requerida': 'Elige una nave.',
  'destino-requerido': 'Escribe el destino de la misión.',
  'fecha-requerida': 'Indica la fecha de despegue.',
  'fecha-invalida': 'La fecha debe ser real y tener el formato AAAA-MM-DD.',
  'fecha-pasada': 'La fecha de despegue no puede ser anterior a hoy.',
  'duracion-requerida': 'Indica la duración en días.',
  'duracion-no-entera': 'La duración debe ser un número entero de días.',
  'duracion-minima': 'La duración mínima es 1 día.',
};

export const MENSAJES_RECHAZO_MISION: Record<MotivoRechazoMision, string> = {
  'limite-misiones':
    'Esta nave ya tiene 3 misiones desde su última revisión. Necesita una revisión antes de recibir otra.',
  'en-reparacion': 'Esta nave está en reparación y no puede recibir misiones.',
  'combustible-bajo':
    'El combustible de esta nave no alcanza: necesita al menos 25 % para recibir misiones.',
};

export function mensajeMisionAsignada(destino: string, nombre: string): string {
  return `Misión a ${destino} asignada a ${nombre}.`;
}

export const MENSAJES_ERROR_NAVE: Record<CodigoErrorNave, string> = {
  'nombre-requerido': 'Escribe el nombre de la nave.',
  'nombre-invalido':
    'El nombre solo puede tener letras, números, espacios y guiones.',
  'clase-requerida': 'Elige la clase de la nave.',
  'clase-invalida': 'La clase debe ser exploradora, carguera o transporte.',
  'combustible-requerido': 'Indica el combustible de la nave.',
  'combustible-no-entero': 'El combustible debe ser un número entero.',
  'combustible-fuera-de-rango': 'El combustible debe estar entre 0 y 100.',
};

export const MENSAJE_NOMBRE_REPETIDO = 'Ya existe una nave con ese nombre.';
export const MENSAJE_ERROR_GUARDAR =
  'No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.';
export const MENSAJE_ERROR_LISTAR =
  'No se pudieron cargar las naves. Revisa tu conexión e inténtalo de nuevo.';

export const MENSAJE_CARGANDO_NAVES = 'Cargando naves…';
export const MENSAJE_SIN_NAVES = 'Todavía no hay naves registradas.';
export const TEXTO_REINTENTAR = 'Reintentar';

// Textos cortos de InsigniaAptitud (DESIGN.md §3).
export const TEXTOS_MOTIVO_NO_APTA: Record<MotivoRechazoMision, string> = {
  'combustible-bajo': 'Combustible bajo',
  'limite-misiones': 'Necesita revisión',
  'en-reparacion': 'En reparación',
};

export function textoAptitud(resultado: ResultadoPuedeRecibirMision): string {
  return resultado.puede
    ? '✓ Puede recibir misiones'
    : `✕ ${TEXTOS_MOTIVO_NO_APTA[resultado.motivo]}`;
}

export function textoMisionesDesdeRevision(misiones: number): string {
  return `Misiones desde la revisión: ${misiones} de ${MAXIMO_MISIONES_ENTRE_REVISIONES}`;
}

export function nombreClase(clase: ClaseNave): string {
  return clase.charAt(0).toUpperCase() + clase.slice(1);
}

export function etiquetaCombustible(porcentaje: number): string {
  return `Combustible ${porcentaje} por ciento`;
}

export function mensajeNaveRegistrada(nombre: string): string {
  return `Nave ${nombre} registrada. Queda revisada hoy y sin misiones desde esa revisión.`;
}
