import type { MotivoRechazoMision } from '../dominio/puedeRecibirMision';
import type { CodigoErrorMision } from '../dominio/validarMision';
import type { CodigoErrorNave } from '../dominio/validarNave';

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

export function mensajeNaveRegistrada(nombre: string): string {
  return `Nave ${nombre} registrada. Queda revisada hoy y sin misiones desde esa revisión.`;
}
