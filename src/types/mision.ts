export interface Mision {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
  creadaEn: Date;
}

export interface EntradaMision {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: string;
}

export interface MisionValidada {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
}
