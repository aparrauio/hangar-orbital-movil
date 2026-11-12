import { describe, expect, it } from 'vitest';
import type { EntradaMision } from '../types/mision';
import { validarMision } from './validarMision';

const HOY = '2026-11-10';
const entradaValida: EntradaMision = {
  naveId: 'aurora',
  destino: 'Marte',
  fechaDespegue: '2026-11-20',
  duracionDias: '3',
};

describe('validarMision', () => {
  it('devuelve los datos validados', () => {
    expect(
      validarMision({ ...entradaValida, destino: '  Marte ' }, HOY),
    ).toEqual({
      valido: true,
      datos: {
        naveId: 'aurora',
        destino: 'Marte',
        fechaDespegue: '2026-11-20',
        duracionDias: 3,
      },
    });
  });

  it('informa cada dato obligatorio que falta (CA-1.3.7)', () => {
    expect(
      validarMision(
        { naveId: '', destino: ' ', fechaDespegue: '', duracionDias: '' },
        HOY,
      ),
    ).toEqual({
      valido: false,
      errores: [
        'nave-requerida',
        'destino-requerido',
        'fecha-requerida',
        'duracion-requerida',
      ],
    });
  });

  it('rechaza la fecha de ayer (CA-1.3.8)', () => {
    expect(
      validarMision({ ...entradaValida, fechaDespegue: '2026-11-09' }, HOY),
    ).toEqual({ valido: false, errores: ['fecha-pasada'] });
  });

  it('acepta la fecha de hoy (CA-1.3.9)', () => {
    expect(
      validarMision({ ...entradaValida, fechaDespegue: HOY }, HOY).valido,
    ).toBe(true);
  });

  it.each(['2026-02-30', '2026-13-01', '10/11/2026', '2026-1-5'])(
    'rechaza la fecha mal formada o inexistente %s',
    (fechaDespegue) => {
      expect(
        validarMision({ ...entradaValida, fechaDespegue }, '2026-01-01'),
      ).toEqual({ valido: false, errores: ['fecha-invalida'] });
    },
  );

  it.each(['0', '-1'])('rechaza una duración de %s días (CA-1.3.10)', (d) => {
    expect(validarMision({ ...entradaValida, duracionDias: d }, HOY)).toEqual({
      valido: false,
      errores: ['duracion-minima'],
    });
  });

  it('acepta una duración de 1 día (CA-1.3.11)', () => {
    expect(
      validarMision({ ...entradaValida, duracionDias: '1' }, HOY).valido,
    ).toBe(true);
  });

  it('rechaza una duración de 1,5 días (CA-1.3.12)', () => {
    expect(
      validarMision({ ...entradaValida, duracionDias: '1,5' }, HOY),
    ).toEqual({ valido: false, errores: ['duracion-no-entera'] });
  });
});
