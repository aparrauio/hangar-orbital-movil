import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { crearNave, listarNaves } from '../services/navesService';
import { CLASES_NAVE, type ClaseNave, type Nave } from '../types/nave';
import {
  MENSAJE_ERROR_GUARDAR,
  MENSAJE_ERROR_LISTAR,
  MENSAJE_NOMBRE_REPETIDO,
  MENSAJES_ERROR_NAVE,
  mensajeNaveRegistrada,
} from './mensajes';

interface PropsFlotaScreen {
  alAsignarMision: (nave: Nave) => void;
}

export function FlotaScreen({ alAsignarMision }: PropsFlotaScreen) {
  const [nombre, setNombre] = useState('');
  const [clase, setClase] = useState<ClaseNave | ''>('');
  const [combustible, setCombustible] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [confirmacion, setConfirmacion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [naves, setNaves] = useState<Nave[]>([]);
  const [errorLista, setErrorLista] = useState('');
  const guardandoAhora = useRef(false);

  const cargarNaves = useCallback(async () => {
    const resultado = await listarNaves();
    if (resultado.ok) {
      setNaves(resultado.naves);
      setErrorLista('');
    } else {
      setErrorLista(MENSAJE_ERROR_LISTAR);
    }
  }, []);

  useEffect(() => {
    void cargarNaves();
  }, [cargarNaves]);

  async function registrar() {
    if (guardandoAhora.current) {
      return;
    }
    guardandoAhora.current = true;
    setGuardando(true);
    setErrores([]);
    setConfirmacion('');

    const resultado = await crearNave({ nombre, clase, combustible });

    if (resultado.ok) {
      setNombre('');
      setClase('');
      setCombustible('');
      setConfirmacion(mensajeNaveRegistrada(resultado.nombre));
      await cargarNaves();
    } else if (resultado.error.tipo === 'validacion') {
      setErrores(
        resultado.error.errores.map((codigo) => MENSAJES_ERROR_NAVE[codigo]),
      );
    } else if (resultado.error.tipo === 'nombre-repetido') {
      setErrores([MENSAJE_NOMBRE_REPETIDO]);
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
      <Text style={estilos.titulo}>Flota</Text>

      <CampoTexto etiqueta="Nombre" valor={nombre} alCambiar={setNombre} />

      <Text style={estilos.etiqueta}>Clase</Text>
      <View style={estilos.clases}>
        {CLASES_NAVE.map((opcion) => (
          <Pressable
            key={opcion}
            onPress={() => setClase(opcion)}
            accessibilityRole="radio"
            accessibilityState={{ selected: clase === opcion }}
            style={[
              estilos.clase,
              clase === opcion && estilos.claseSeleccionada,
            ]}
          >
            <Text
              style={clase === opcion ? estilos.textoSeleccionado : undefined}
            >
              {opcion}
            </Text>
          </Pressable>
        ))}
      </View>

      <CampoTexto
        etiqueta="Combustible (%)"
        valor={combustible}
        alCambiar={setCombustible}
        teclado="numbers-and-punctuation"
      />

      <Pressable
        onPress={() => void registrar()}
        disabled={guardando}
        accessibilityRole="button"
        style={[estilos.boton, guardando && estilos.botonInactivo]}
      >
        <Text style={estilos.textoBoton}>
          {guardando ? 'Guardando…' : 'Registrar nave'}
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

      <Text style={estilos.subtitulo}>Naves registradas</Text>
      {errorLista !== '' && <Text style={estilos.error}>{errorLista}</Text>}
      {errorLista === '' && naves.length === 0 && (
        <Text>Todavía no hay naves registradas.</Text>
      )}
      {naves.map((nave) => (
        <View key={nave.id} style={estilos.nave}>
          <Text style={estilos.nombreNave}>{nave.nombre}</Text>
          <Text>Clase: {nave.clase}</Text>
          <Text>Combustible: {nave.combustible} %</Text>
          <Text>
            Última revisión: {nave.ultimaRevision.toLocaleDateString('es')}
          </Text>
          <Pressable
            onPress={() => alAsignarMision(nave)}
            accessibilityRole="button"
            style={estilos.accionNave}
          >
            <Text style={estilos.textoAccionNave}>Asignar misión</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { padding: 16, paddingTop: 56 },
  titulo: { fontSize: 26, fontWeight: '700', marginBottom: 16 },
  subtitulo: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  etiqueta: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  clases: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  clase: {
    borderWidth: 1,
    borderColor: '#9aa5b1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  claseSeleccionada: { backgroundColor: '#1f4e79', borderColor: '#1f4e79' },
  textoSeleccionado: { color: '#ffffff' },
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
  nave: {
    borderWidth: 1,
    borderColor: '#d5dbe1',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  nombreNave: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  accionNave: { marginTop: 8 },
  textoAccionNave: { color: '#1f4e79', fontWeight: '600' },
});
