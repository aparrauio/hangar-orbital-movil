import { describe, expect, it } from 'vitest';
import { fechaLocalComoTexto } from './fechaLocalComoTexto';
import { textoComoFechaLocal } from './textoComoFechaLocal';

describe('textoComoFechaLocal', () => {
  it('devuelve la medianoche local del día', () => {
    const fecha = textoComoFechaLocal('2026-11-20');
    expect(fecha).not.toBeNull();
    expect(fecha?.getFullYear()).toBe(2026);
    expect(fecha?.getMonth()).toBe(10);
    expect(fecha?.getDate()).toBe(20);
    expect(fecha?.getHours()).toBe(0);
    expect(fecha?.getMinutes()).toBe(0);
  });

  it.each(['2026-01-05', '2026-11-20', '2028-02-29', '2026-12-31'])(
    'ida y vuelta con fechaLocalComoTexto para %s (CA-1.3.15)',
    (texto) => {
      const fecha = textoComoFechaLocal(texto);
      expect(fecha).not.toBeNull();
      if (fecha !== null) {
        expect(fechaLocalComoTexto(fecha)).toBe(texto);
      }
    },
  );

  it.each(['', '2026-02-30', '2026-13-01', '20/11/2026', '2026-1-5'])(
    'devuelve null para %j',
    (texto) => {
      expect(textoComoFechaLocal(texto)).toBeNull();
    },
  );
});
