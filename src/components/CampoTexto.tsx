import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';

interface PropsCampoTexto {
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  sugerencia?: string;
  teclado?: KeyboardTypeOptions;
}

export function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  sugerencia,
  teclado,
}: PropsCampoTexto) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={estilos.entrada}
        value={valor}
        onChangeText={alCambiar}
        placeholder={sugerencia}
        keyboardType={teclado}
        accessibilityLabel={etiqueta}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginBottom: 12 },
  etiqueta: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  entrada: {
    borderWidth: 1,
    borderColor: '#9aa5b1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
});
