import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { colores, espacio, radio, texto, toque } from '../tema';

interface PropsCampoTexto {
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  sugerencia?: string;
  teclado?: KeyboardTypeOptions;
  error?: string;
  ayuda?: string;
}

export function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  sugerencia,
  teclado,
  error,
  ayuda,
}: PropsCampoTexto) {
  const descripcion = [error, ayuda].filter(Boolean).join('. ');

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[estilos.entrada, error !== undefined && estilos.entradaError]}
        value={valor}
        onChangeText={alCambiar}
        placeholder={sugerencia}
        placeholderTextColor={colores.tintaTenue}
        keyboardType={teclado}
        accessibilityLabel={etiqueta}
        accessibilityHint={descripcion === '' ? undefined : descripcion}
      />
      {ayuda !== undefined && <Text style={estilos.ayuda}>{ayuda}</Text>}
      {error !== undefined && <Text style={estilos.error}>✕ {error}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginBottom: espacio.m },
  etiqueta: {
    ...texto.etiqueta,
    color: colores.tinta,
    marginBottom: espacio.xs,
  },
  entrada: {
    ...texto.cuerpo,
    minHeight: toque.minimo,
    color: colores.tinta,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.bordeControl,
    borderRadius: radio.control,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
  },
  entradaError: { borderColor: colores.noApta },
  ayuda: {
    ...texto.nota,
    color: colores.tintaSuave,
    marginTop: espacio.xs,
  },
  error: {
    ...texto.nota,
    color: colores.noApta,
    marginTop: espacio.xs,
  },
});
