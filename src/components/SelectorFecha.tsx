import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { fechaLocalComoTexto } from '../dominio/fechaLocalComoTexto';
import { textoComoFechaLocal } from '../dominio/textoComoFechaLocal';
import { colores, espacio, radio, texto, toque } from '../tema';

interface PropsSelectorFecha {
  etiqueta: string;
  // Fecha elegida como 'AAAA-MM-DD', o '' si todavía no hay.
  valor: string;
  alCambiar: (valor: string) => void;
  minimo: Date;
  ayuda?: string;
  error?: string;
}

export function SelectorFecha({
  etiqueta,
  valor,
  alCambiar,
  minimo,
  ayuda,
  error,
}: PropsSelectorFecha) {
  const [abierto, setAbierto] = useState(false);
  const fecha = textoComoFechaLocal(valor);
  const fechaVisible = fecha === null ? null : fecha.toLocaleDateString('es');

  function elegir(_evento: DateTimePickerChangeEvent, elegida: Date) {
    setAbierto(false);
    alCambiar(fechaLocalComoTexto(elegida));
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Pressable
        onPress={() => setAbierto((actual) => !actual)}
        accessibilityRole="button"
        accessibilityLabel={`${etiqueta}, ${fechaVisible ?? 'sin elegir'}`}
        accessibilityHint="Abre el calendario"
        accessibilityState={{ expanded: abierto }}
        style={({ pressed }) => [
          estilos.campo,
          error !== undefined && estilos.campoError,
          pressed && estilos.campoPresionado,
        ]}
      >
        <Text style={fechaVisible === null ? estilos.sinFecha : estilos.fecha}>
          {fechaVisible ?? 'Elige una fecha'}
        </Text>
      </Pressable>

      {abierto && (
        <DateTimePicker
          value={fecha ?? minimo}
          mode="date"
          minimumDate={minimo}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          accentColor={colores.primario}
          themeVariant="light"
          onValueChange={elegir}
          onDismiss={() => setAbierto(false)}
        />
      )}

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
  campo: {
    minHeight: toque.minimo,
    justifyContent: 'center',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.bordeControl,
    borderRadius: radio.control,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
  },
  campoError: { borderColor: colores.noApta },
  campoPresionado: { backgroundColor: colores.primarioSuave },
  fecha: { ...texto.cuerpo, color: colores.tinta },
  sinFecha: { ...texto.cuerpo, color: colores.tintaTenue },
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
