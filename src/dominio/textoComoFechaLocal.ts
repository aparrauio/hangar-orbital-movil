const PATRON_FECHA = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

// Inversa de fechaLocalComoTexto: 'AAAA-MM-DD' a la medianoche local de ese día.
export function textoComoFechaLocal(texto: string): Date | null {
  const partes = PATRON_FECHA.exec(texto);
  if (partes === null) {
    return null;
  }
  const anio = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const fecha = new Date(anio, mes - 1, dia);
  fecha.setFullYear(anio);
  const esReal =
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia;
  return esReal ? fecha : null;
}
