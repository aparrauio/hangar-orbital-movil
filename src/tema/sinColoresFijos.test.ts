import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// DESIGN.md §2: ningún archivo fuera de src/tema/ escribe un color en hexadecimal.

const RAIZ = path.resolve(__dirname, '..', '..');
const CARPETA_SRC = path.join(RAIZ, 'src');
const CARPETA_TEMA = path.join(CARPETA_SRC, 'tema');
const EXTENSIONES = new Set(['.ts', '.tsx']);
const PATRON_COLOR_HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/i;

function listarArchivos(carpeta: string): string[] {
  if (carpeta === CARPETA_TEMA) {
    return [];
  }
  return fs.readdirSync(carpeta, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = path.join(carpeta, entrada.name);
    if (entrada.isDirectory()) {
      return listarArchivos(ruta);
    }
    return EXTENSIONES.has(path.extname(entrada.name)) ? [ruta] : [];
  });
}

function rutaRelativa(ruta: string): string {
  return path.relative(RAIZ, ruta).split(path.sep).join('/');
}

function buscarColoresFijos(ruta: string): string[] {
  return fs
    .readFileSync(ruta, 'utf8')
    .split(/\r?\n/)
    .flatMap((linea, indice) => {
      const coincidencia = PATRON_COLOR_HEX.exec(linea);
      return coincidencia
        ? [`${rutaRelativa(ruta)}:${indice + 1} usa ${coincidencia[0]}`]
        : [];
    });
}

const archivos = [
  ...listarArchivos(CARPETA_SRC),
  path.join(RAIZ, 'App.tsx'),
].map((ruta) => [rutaRelativa(ruta), ruta]);

describe('sin colores fijos fuera de src/tema/', () => {
  it('encuentra archivos que revisar', () => {
    expect(archivos.length).toBeGreaterThan(0);
  });

  it.each(archivos)('%s no escribe colores en hexadecimal', (_, ruta) => {
    expect(
      buscarColoresFijos(ruta),
      'Usa los tokens de colores de src/tema/ (DESIGN.md §2.1)',
    ).toEqual([]);
  });
});
