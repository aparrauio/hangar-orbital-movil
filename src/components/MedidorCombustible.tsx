import { StyleSheet, Text, View } from 'react-native';
import { COMBUSTIBLE_MINIMO_PARA_MISION } from '../dominio/puedeRecibirMision';
import { etiquetaCombustible } from '../screens/mensajes';
import { colores, espacio, radio, texto } from '../tema';

interface PropsMedidorCombustible {
  porcentaje: number;
}

const ALTO_BARRA = 8;
const ANCHO_MARCA = 2;

export function MedidorCombustible({ porcentaje }: PropsMedidorCombustible) {
  const valor = Math.min(100, Math.max(0, porcentaje));
  const suficiente = valor >= COMBUSTIBLE_MINIMO_PARA_MISION;

  return (
    <View
      style={estilos.contenedor}
      accessible
      accessibilityLabel={etiquetaCombustible(valor)}
    >
      <View style={estilos.barra}>
        <View
          style={[
            estilos.relleno,
            { width: `${valor}%` },
            suficiente ? estilos.rellenoSuficiente : estilos.rellenoBajo,
          ]}
        />
        <View
          style={[
            estilos.marca,
            { left: `${COMBUSTIBLE_MINIMO_PARA_MISION}%` },
          ]}
        />
      </View>
      <Text style={estilos.dato}>{valor} %</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
  },
  barra: {
    flex: 1,
    height: ALTO_BARRA,
    borderRadius: radio.pastilla,
    backgroundColor: colores.borde,
    overflow: 'visible',
  },
  relleno: {
    height: ALTO_BARRA,
    borderRadius: radio.pastilla,
  },
  rellenoSuficiente: { backgroundColor: colores.primario },
  rellenoBajo: { backgroundColor: colores.atencion },
  marca: {
    position: 'absolute',
    top: -espacio.xs,
    bottom: -espacio.xs,
    width: ANCHO_MARCA,
    marginLeft: -ANCHO_MARCA / 2,
    backgroundColor: colores.tinta,
  },
  dato: { ...texto.dato, color: colores.tinta },
});
