import { describe, expect, it } from 'vitest';
import { entradaSoloDigitos } from './entradaSoloDigitos';

describe('entradaSoloDigitos', () => {
  it.each(['3', '15', '007'])('acepta %j (CA-1.3.17)', (nueva) => {
    expect(entradaSoloDigitos('1', nueva)).toBe(nueva);
  });

  it('acepta borrar el campo', () => {
    expect(entradaSoloDigitos('3', '')).toBe('');
  });

  it.each(['3a', 'tres', '3 ', ' 3', '1,5', '1.5', '-1', '+2', '3!', '٣'])(
    'rechaza %j y conserva el valor anterior (CA-1.3.17)',
    (nueva) => {
      expect(entradaSoloDigitos('3', nueva)).toBe('3');
    },
  );
});
