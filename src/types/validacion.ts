export type ResultadoValidacion<TDatos, TCodigo extends string> =
  { valido: true; datos: TDatos } | { valido: false; errores: TCodigo[] };
