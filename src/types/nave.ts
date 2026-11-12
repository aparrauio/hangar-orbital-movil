export const CLASES_NAVE = ['exploradora', 'carguera', 'transporte'] as const;
export type ClaseNave = (typeof CLASES_NAVE)[number];

export interface Nave {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: boolean;
  ultimaRevision: Date;
  creadaEn: Date;
}

// Valores tal como llegan del formulario.
export interface EntradaNave {
  nombre: string;
  clase: string;
  combustible: string;
}

export interface NaveValidada {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
}
