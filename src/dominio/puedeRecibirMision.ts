import type { Nave } from '../types/nave';

export const MAXIMO_MISIONES_ENTRE_REVISIONES = 3;
export const COMBUSTIBLE_MINIMO_PARA_MISION = 25;

export type MotivoRechazoMision =
  'en-reparacion' | 'combustible-bajo' | 'limite-misiones';

export type ResultadoPuedeRecibirMision =
  { puede: true } | { puede: false; motivo: MotivoRechazoMision };

export function puedeRecibirMision(
  nave: Pick<Nave, 'enReparacion' | 'combustible'>,
  misionesDesdeRevision: number,
): ResultadoPuedeRecibirMision {
  if (nave.enReparacion) {
    return { puede: false, motivo: 'en-reparacion' };
  }
  if (nave.combustible < COMBUSTIBLE_MINIMO_PARA_MISION) {
    return { puede: false, motivo: 'combustible-bajo' };
  }
  if (misionesDesdeRevision >= MAXIMO_MISIONES_ENTRE_REVISIONES) {
    return { puede: false, motivo: 'limite-misiones' };
  }
  return { puede: true };
}
