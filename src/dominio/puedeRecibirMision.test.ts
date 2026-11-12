import { describe, expect, it } from 'vitest';
import { puedeRecibirMision } from './puedeRecibirMision';

const naveDisponible = { enReparacion: false, combustible: 60 };
const naveEnReparacion = { enReparacion: true, combustible: 60 };

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

  it.each([0, 24])(
    'rechaza una nave con combustible %i, menor a 25 (CA-1.3.13)',
    (combustible) => {
      expect(
        puedeRecibirMision({ enReparacion: false, combustible }, 0),
      ).toEqual({ puede: false, motivo: 'combustible-bajo' });
    },
  );

  it('admite una nave con exactamente 25 % de combustible (CA-1.3.14)', () => {
    expect(
      puedeRecibirMision({ enReparacion: false, combustible: 25 }, 0),
    ).toEqual({ puede: true });
  });

  it('evalúa la reparación antes que el combustible', () => {
    expect(
      puedeRecibirMision({ enReparacion: true, combustible: 24 }, 0),
    ).toEqual({ puede: false, motivo: 'en-reparacion' });
  });

  it('evalúa el combustible antes que el límite', () => {
    expect(
      puedeRecibirMision({ enReparacion: false, combustible: 24 }, 3),
    ).toEqual({ puede: false, motivo: 'combustible-bajo' });
  });
});
