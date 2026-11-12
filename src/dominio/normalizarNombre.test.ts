import { describe, expect, it } from 'vitest';
import { normalizarNombre } from './normalizarNombre';

describe('normalizarNombre', () => {
  it.each(['Áurora Uno', 'aurora uno', 'AURORA  UNO', '  Aurora Uno  '])(
    'convierte %j en el mismo id (CA-1.1.9)',
    (nombre) => {
      expect(normalizarNombre(nombre)).toBe('aurora-uno');
    },
  );

  it('convierte la ñ en n', () => {
    expect(normalizarNombre('Cañón')).toBe('canon');
  });

  it('conserva los caracteres no permitidos para que se puedan rechazar', () => {
    expect(normalizarNombre('A/B')).toBe('a/b');
  });
});
