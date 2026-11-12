import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colores, espacio, texto } from '../tema';
import { Boton } from './Boton';

export type TipoEstadoPantalla = 'cargando' | 'vacio' | 'error';

interface AccionEstadoPantalla {
  texto: string;
  alPresionar: () => void;
}

interface PropsEstadoPantalla {
  tipo: TipoEstadoPantalla;
  mensaje: string;
  accion?: AccionEstadoPantalla;
}

export function EstadoPantalla({ tipo, mensaje, accion }: PropsEstadoPantalla) {
  return (
    <View
      style={estilos.contenedor}
      accessibilityRole={tipo === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
    >
      {tipo === 'cargando' && (
        <ActivityIndicator color={colores.primario} size="large" />
      )}
      <Text style={[estilos.mensaje, tipo === 'error' && estilos.error]}>
        {tipo === 'error' ? `✕ ${mensaje}` : mensaje}
      </Text>
      {accion && tipo !== 'cargando' && (
        <Boton
          texto={accion.texto}
          alPresionar={accion.alPresionar}
          variante={tipo === 'error' ? 'primario' : 'secundario'}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: espacio.m,
    paddingVertical: espacio.xl,
  },
  mensaje: {
    ...texto.cuerpo,
    color: colores.tintaSuave,
    textAlign: 'center',
  },
  error: { color: colores.noApta },
});
