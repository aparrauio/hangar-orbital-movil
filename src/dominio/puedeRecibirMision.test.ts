import { describe, expect, it } from 'vitest';
import { puedeRecibirMision } from './puedeRecibirMision';

const naveDisponible = { enReparacion: false };
const naveEnReparacion = { enReparacion: true };

describe('puedeRecibirMision', () => {
  it.each([0, 1, 2])(
    'admite una nave con %i misiones (CA-1.3.2)',
    (misiones) => {
      expect(puedeRecibirMision(naveDisponible, misiones)).toEqual({
        puede: true,
      });
    },
  );

  it.each([3, 4])(
    'rechaza una nave con %i misiones (CA-1.3.3 y CA-1.3.4)',
    (misiones) => {
      expect(puedeRecibirMision(naveDisponible, misiones)).toEqual({
        puede: false,
        motivo: 'limite-misiones',
      });
    },
  );

  it('rechaza una nave en reparación (CA-1.3.5)', () => {
    expect(puedeRecibirMision(naveEnReparacion, 0)).toEqual({
      puede: false,
      motivo: 'en-reparacion',
    });
  });

  it('evalúa la reparación antes que el límite', () => {
    expect(puedeRecibirMision(naveEnReparacion, 3)).toEqual({
      puede: false,
      motivo: 'en-reparacion',
    });
  });
});
