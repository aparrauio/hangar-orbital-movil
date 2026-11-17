import { describe, expect, it } from 'vitest';
import {
  etiquetaCombustible,
  nombreClase,
  textoAptitud,
  textoMisionesDesdeRevision,
} from './mensajes';

describe('textoAptitud', () => {
  it('indica que la nave puede recibir misiones (CA-1.2.2)', () => {
    expect(textoAptitud({ puede: true })).toBe('✓ Puede recibir misiones');
  });

  it('indica combustible bajo (CA-1.2.3)', () => {
    expect(textoAptitud({ puede: false, motivo: 'combustible-bajo' })).toBe(
      '✕ Combustible bajo',
    );
  });

  it('indica que necesita revisión (CA-1.2.5)', () => {
    expect(textoAptitud({ puede: false, motivo: 'limite-misiones' })).toBe(
      '✕ Necesita revisión',
    );
  });

  it('indica que está en reparación (CA-1.2.6)', () => {
    expect(textoAptitud({ puede: false, motivo: 'en-reparacion' })).toBe(
      '✕ En reparación',
    );
  });
});

describe('textoMisionesDesdeRevision', () => {
  it('muestra las misiones sobre el máximo (CA-1.2.1)', () => {
    expect(textoMisionesDesdeRevision(2)).toBe(
      'Misiones desde la revisión: 2 de 3',
    );
  });
});

describe('nombreClase', () => {
  it.each([
    ['exploradora', 'Exploradora'],
    ['carguera', 'Carguera'],
    ['transporte', 'Transporte'],
  ] as const)('muestra %s como %s (CA-1.2.1)', (clase, esperado) => {
    expect(nombreClase(clase)).toBe(esperado);
  });
});

describe('etiquetaCombustible', () => {
  it('describe el porcentaje para el lector de pantalla', () => {
    expect(etiquetaCombustible(60)).toBe('Combustible 60 por ciento');
  });
});
