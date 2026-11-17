const PATRON_SOLO_DIGITOS = /^[0-9]*$/;

// Si `nueva` tiene algún carácter que no es dígito, se conserva `anterior`
// completo, para que pegar "1,5" no se convierta en "15".
export function entradaSoloDigitos(anterior: string, nueva: string): string {
  return PATRON_SOLO_DIGITOS.test(nueva) ? nueva : anterior;
}
