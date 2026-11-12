import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { fechaLocalComoTexto } from '../dominio/fechaLocalComoTexto';
import { crearMision } from '../services/misionesService';
import type { Nave } from '../types/nave';
import {
  MENSAJE_ERROR_GUARDAR,
  MENSAJES_ERROR_MISION,
  MENSAJES_RECHAZO_MISION,
  mensajeMisionAsignada,
} from './mensajes';

interface PropsMisionScreen {
  nave: Nave;
  alVolver: () => void;
}

export function MisionScreen({ nave, alVolver }: PropsMisionScreen) {
  const [destino, setDestino] = useState('');
  const [fechaDespegue, setFechaDespegue] = useState('');
  const [duracionDias, setDuracionDias] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [confirmacion, setConfirmacion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const guardandoAhora = useRef(false);

  async function asignar() {
    if (guardandoAhora.current) {
      return;
    }
    guardandoAhora.current = true;
    setGuardando(true);
    setErrores([]);
    setConfirmacion('');

    const resultado = await crearMision(
      { naveId: nave.id, destino, fechaDespegue, duracionDias },
      fechaLocalComoTexto(new Date()),
    );

    if (resultado.ok) {
      setConfirmacion(mensajeMisionAsignada(destino.trim(), nave.nombre));
      setDestino('');
      setFechaDespegue('');
      setDuracionDias('');
    } else if (resultado.error.tipo === 'validacion') {
      setErrores(
        resultado.error.errores.map((codigo) => MENSAJES_ERROR_MISION[codigo]),
      );
    } else if (resultado.error.tipo === 'rechazada') {
      setErrores([MENSAJES_RECHAZO_MISION[resultado.error.motivo]]);
    } else {
      setErrores([MENSAJE_ERROR_GUARDAR]);
    }

    guardandoAhora.current = false;
    setGuardando(false);
  }

  return (
    <ScrollView
      contentContainerStyle={estilos.contenedor}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={alVolver} accessibilityRole="button">
        <Text style={estilos.volver}>‹ Volver a la flota</Text>
      </Pressable>

      <Text style={estilos.titulo}>Asignar misión</Text>
      <Text style={estilos.nave}>Nave: {nave.nombre}</Text>

      <CampoTexto etiqueta="Destino" valor={destino} alCambiar={setDestino} />
      <CampoTexto
        etiqueta="Fecha de despegue"
        valor={fechaDespegue}
        alCambiar={setFechaDespegue}
        sugerencia="AAAA-MM-DD"
        teclado="numbers-and-punctuation"
      />
      <CampoTexto
        etiqueta="Duración (días)"
        valor={duracionDias}
        alCambiar={setDuracionDias}
        teclado="numbers-and-punctuation"
      />

      <Pressable
        onPress={() => void asignar()}
        disabled={guardando}
        accessibilityRole="button"
        style={[estilos.boton, guardando && estilos.botonInactivo]}
      >
        <Text style={estilos.textoBoton}>
          {guardando ? 'Guardando…' : 'Asignar misión'}
        </Text>
      </Pressable>

      {errores.map((error) => (
        <Text key={error} style={estilos.error}>
          {error}
        </Text>
      ))}
      {confirmacion !== '' && (
        <Text style={estilos.confirmacion}>{confirmacion}</Text>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { padding: 16, paddingTop: 56 },
  volver: { color: '#1f4e79', fontSize: 16, marginBottom: 12 },
  titulo: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  nave: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  boton: {
    backgroundColor: '#1f4e79',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonInactivo: { opacity: 0.5 },
  textoBoton: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  error: { color: '#b3261e', marginTop: 8 },
  confirmacion: { color: '#1b6e3c', marginTop: 8 },
});
