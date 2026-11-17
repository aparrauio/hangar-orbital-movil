import { Pressable, StyleSheet, Text } from 'react-native';
import { colores, espacio, radio, texto, toque } from '../tema';

export type VarianteBoton = 'primario' | 'secundario' | 'texto';

interface PropsBoton {
  texto: string;
  alPresionar: () => void;
  variante?: VarianteBoton;
  deshabilitado?: boolean;
  cargando?: boolean;
  etiquetaAccesible?: string;
}

export function Boton({
  texto: contenido,
  alPresionar,
  variante = 'primario',
  deshabilitado = false,
  cargando = false,
  etiquetaAccesible,
}: PropsBoton) {
  const inactivo = deshabilitado || cargando;
  const esPrimario = variante === 'primario';

  return (
    <Pressable
      onPress={alPresionar}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityLabel={etiquetaAccesible}
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [
        estilos.base,
        variante === 'primario' && estilos.fondoPrimario,
        variante === 'secundario' && estilos.fondoSecundario,
        variante === 'texto' && estilos.fondoTexto,
        pressed && esPrimario && estilos.presionadoPrimario,
        pressed && !esPrimario && estilos.presionadoOtro,
        inactivo && estilos.inactivo,
      ]}
    >
      <Text
        style={[
          estilos.contenido,
          esPrimario ? estilos.contenidoPrimario : estilos.contenidoOtro,
        ]}
      >
        {cargando ? 'Guardando…' : contenido}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: toque.minimo,
    borderRadius: radio.control,
    paddingHorizontal: espacio.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fondoPrimario: { backgroundColor: colores.primario },
  fondoSecundario: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.primario,
  },
  fondoTexto: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
  presionadoPrimario: { backgroundColor: colores.primarioPresionado },
  presionadoOtro: { backgroundColor: colores.primarioSuave },
  inactivo: { opacity: 0.5 },
  contenido: { ...texto.cuerpo, fontWeight: '600' },
  contenidoPrimario: { color: colores.sobrePrimario },
  contenidoOtro: { color: colores.primario },
});
