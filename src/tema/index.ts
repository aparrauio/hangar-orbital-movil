import type { TextStyle } from 'react-native';

// Valores de DESIGN.md §2. Este archivo es la fuente de verdad de los tokens.

export const colores = {
  fondo: '#F3F5F7',
  superficie: '#FFFFFF',
  tinta: '#0F1D2B',
  tintaSuave: '#4A5866',
  tintaTenue: '#5F6E7C',
  borde: '#D3DAE1',
  bordeControl: '#8593A0',
  primario: '#1F4E79',
  primarioPresionado: '#173B5C',
  primarioSuave: '#E4ECF4',
  sobrePrimario: '#FFFFFF',
  apta: '#1B6E3C',
  aptaFondo: '#E2F2E8',
  noApta: '#B3261E',
  noAptaFondo: '#FBE8E6',
  atencion: '#8A5300',
  atencionFondo: '#FCF0DA',
} as const;

export const espacio = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radio = {
  control: 6,
  tarjeta: 10,
  pastilla: 999,
} as const;

export const texto = {
  titulo: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  subtitulo: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  nombre: { fontSize: 17, lineHeight: 22, fontWeight: '700' },
  cuerpo: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  etiqueta: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  nota: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  dato: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
} as const satisfies Record<string, TextStyle>;

export const toque = {
  minimo: 44,
} as const;
