import { StyleSheet, Text, View } from 'react-native';
import type { ResultadoPuedeRecibirMision } from '../dominio/puedeRecibirMision';
import { textoAptitud } from '../screens/mensajes';
import { colores, espacio, radio, texto } from '../tema';

interface PropsInsigniaAptitud {
  resultado: ResultadoPuedeRecibirMision;
}

export function InsigniaAptitud({ resultado }: PropsInsigniaAptitud) {
  return (
    <View
      style={[
        estilos.pastilla,
        resultado.puede ? estilos.fondoApta : estilos.fondoNoApta,
      ]}
    >
      <Text
        style={[
          estilos.texto,
          resultado.puede ? estilos.textoApta : estilos.textoNoApta,
        ]}
      >
        {textoAptitud(resultado)}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pastilla: {
    alignSelf: 'flex-start',
    borderRadius: radio.pastilla,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.xs,
  },
  fondoApta: { backgroundColor: colores.aptaFondo },
  fondoNoApta: { backgroundColor: colores.noAptaFondo },
  texto: texto.etiqueta,
  textoApta: { color: colores.apta },
  textoNoApta: { color: colores.noApta },
});
