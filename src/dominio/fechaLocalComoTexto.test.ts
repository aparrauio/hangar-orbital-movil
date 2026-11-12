import { describe, expect, it } from 'vitest';
import { fechaLocalComoTexto } from './fechaLocalComoTexto';

describe('fechaLocalComoTexto', () => {
  it('rellena mes y día con ceros', () => {
    expect(fechaLocalComoTexto(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });

  it.each([
    [0, 0],
    [23, 59],
  ])('usa el día local a las %i:%i', (hora, minuto) => {
    expect(fechaLocalComoTexto(new Date(2026, 10, 10, hora, minuto))).toBe(
      '2026-11-10',
    );
  });
});
