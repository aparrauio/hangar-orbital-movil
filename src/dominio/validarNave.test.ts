import { describe, expect, it } from 'vitest';
import type { EntradaNave } from '../types/nave';
import { validarNave } from './validarNave';

const entradaValida: EntradaNave = {
  nombre: 'Aurora',
  clase: 'carguera',
  combustible: '60',
};

describe('validarNave', () => {
  it('devuelve los datos validados y el id normalizado', () => {
    expect(validarNave({ ...entradaValida, nombre: ' Áurora Uno ' })).toEqual({
      valido: true,
      datos: {
        id: 'aurora-uno',
        nombre: 'Áurora Uno',
        clase: 'carguera',
        combustible: 60,
      },
    });
  });

  it.each(['0', '100'])('acepta combustible %s (CA-1.1.2)', (combustible) => {
    expect(validarNave({ ...entradaValida, combustible }).valido).toBe(true);
  });

  it.each(['-1', '101'])('rechaza combustible %s (CA-1.1.3)', (combustible) => {
    expect(validarNave({ ...entradaValida, combustible })).toEqual({
      valido: false,
      errores: ['combustible-fuera-de-rango'],
    });
  });

  it('rechaza combustible 25,5 (CA-1.1.4)', () => {
    expect(validarNave({ ...entradaValida, combustible: '25,5' })).toEqual({
      valido: false,
      errores: ['combustible-no-entero'],
    });
  });

  it('informa cada dato obligatorio que falta (CA-1.1.5)', () => {
    expect(validarNave({ nombre: ' ', clase: '', combustible: '' })).toEqual({
      valido: false,
      errores: ['nombre-requerido', 'clase-requerida', 'combustible-requerido'],
    });
  });

  it.each(['exploradora', 'carguera', 'transporte'])(
    'acepta la clase %s (CA-1.1.7)',
    (clase) => {
      expect(validarNave({ ...entradaValida, clase }).valido).toBe(true);
    },
  );

  it('rechaza una clase desconocida (CA-1.1.8)', () => {
    expect(validarNave({ ...entradaValida, clase: 'caza' })).toEqual({
      valido: false,
      errores: ['clase-invalida'],
    });
  });

  it('rechaza un nombre que no se puede convertir en id', () => {
    expect(validarNave({ ...entradaValida, nombre: 'A/B' })).toEqual({
      valido: false,
      errores: ['nombre-invalido'],
    });
  });
});
