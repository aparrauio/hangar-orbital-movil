import type { Nave } from '../types/nave';

export const MAXIMO_MISIONES_ENTRE_REVISIONES = 3;

export type MotivoRechazoMision = 'en-reparacion' | 'limite-misiones';

export type ResultadoPuedeRecibirMision =
  { puede: true } | { puede: false; motivo: MotivoRechazoMision };

export function puedeRecibirMision(
  nave: Pick<Nave, 'enReparacion'>,
  misionesDesdeRevision: number,
): ResultadoPuedeRecibirMision {
  if (nave.enReparacion) {
    return { puede: false, motivo: 'en-reparacion' };
  }
  if (misionesDesdeRevision >= MAXIMO_MISIONES_ENTRE_REVISIONES) {
    return { puede: false, motivo: 'limite-misiones' };
  }
  return { puede: true };
}
