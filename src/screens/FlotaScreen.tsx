import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Boton } from '../components/Boton';
import { CampoTexto } from '../components/CampoTexto';
import { EstadoPantalla } from '../components/EstadoPantalla';
import { TarjetaNave } from '../components/TarjetaNave';
import {
  listarNavesConAptitud,
  type NaveConAptitud,
} from '../services/misionesService';
import { crearNave } from '../services/navesService';
import { colores, espacio, radio, texto, toque } from '../tema';
import { CLASES_NAVE, type ClaseNave } from '../types/nave';
import {
  MENSAJE_CARGANDO_NAVES,
  MENSAJE_ERROR_GUARDAR,
  MENSAJE_ERROR_LISTAR,
  MENSAJE_NOMBRE_REPETIDO,
  MENSAJE_SIN_NAVES,
  MENSAJES_ERROR_NAVE,
  TEXTO_REINTENTAR,
  mensajeNaveRegistrada,
  nombreClase,
} from './mensajes';

interface PropsFlotaScreen {
  alAsignarMision: (nave: NaveConAptitud) => void;
}

type EstadoLista =
  | { tipo: 'cargando' }
  | { tipo: 'error' }
  | { tipo: 'lista'; naves: NaveConAptitud[] };

export function FlotaScreen({ alAsignarMision }: PropsFlotaScreen) {
  const [nombre, setNombre] = useState('');
  const [clase, setClase] = useState<ClaseNave | ''>('');
  const [combustible, setCombustible] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [confirmacion, setConfirmacion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [lista, setLista] = useState<EstadoLista>({ tipo: 'cargando' });
  const guardandoAhora = useRef(false);

  const cargarNaves = useCallback(async (mostrarCarga: boolean) => {
    if (mostrarCarga) {
      setLista({ tipo: 'cargando' });
    }
    const resultado = await listarNavesConAptitud();
    setLista(
      resultado.ok
        ? { tipo: 'lista', naves: resultado.naves }
        : { tipo: 'error' },
    );
  }, []);

  useEffect(() => {
    void cargarNaves(true);
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
      await cargarNaves(false);
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
    <SafeAreaView style={estilos.pantalla} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={estilos.contenedor}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.titulo} accessibilityRole="header">
          Flota
        </Text>

        <CampoTexto etiqueta="Nombre" valor={nombre} alCambiar={setNombre} />

        <Text style={estilos.etiqueta}>Clase</Text>
        <View style={estilos.clases} accessibilityRole="radiogroup">
          {CLASES_NAVE.map((opcion) => {
            const seleccionada = clase === opcion;
            return (
              <Pressable
                key={opcion}
                onPress={() => setClase(opcion)}
                accessibilityRole="radio"
                accessibilityLabel={nombreClase(opcion)}
                accessibilityState={{ selected: seleccionada }}
                style={[
                  estilos.clase,
                  seleccionada && estilos.claseSeleccionada,
                ]}
              >
                <Text
                  style={[
                    estilos.textoClase,
                    seleccionada && estilos.textoClaseSeleccionada,
                  ]}
                >
                  {nombreClase(opcion)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <CampoTexto
          etiqueta="Combustible (%)"
          valor={combustible}
          alCambiar={setCombustible}
          teclado="numbers-and-punctuation"
        />

        <Boton
          texto="Registrar nave"
          alPresionar={() => void registrar()}
          cargando={guardando}
        />

        {errores.map((error) => (
          <Text key={error} style={estilos.error} accessibilityRole="alert">
            ✕ {error}
          </Text>
        ))}
        {confirmacion !== '' && (
          <Text style={estilos.confirmacion} accessibilityRole="alert">
            ✓ {confirmacion}
          </Text>
        )}

        <Text style={estilos.subtitulo} accessibilityRole="header">
          Naves registradas
        </Text>
        {lista.tipo === 'cargando' && (
          <EstadoPantalla tipo="cargando" mensaje={MENSAJE_CARGANDO_NAVES} />
        )}
        {lista.tipo === 'error' && (
          <EstadoPantalla
            tipo="error"
            mensaje={MENSAJE_ERROR_LISTAR}
            accion={{
              texto: TEXTO_REINTENTAR,
              alPresionar: () => void cargarNaves(true),
            }}
          />
        )}
        {lista.tipo === 'lista' && lista.naves.length === 0 && (
          <EstadoPantalla tipo="vacio" mensaje={MENSAJE_SIN_NAVES} />
        )}
        {lista.tipo === 'lista' &&
          lista.naves.map((naveConAptitud) => (
            <TarjetaNave
              key={naveConAptitud.nave.id}
              naveConAptitud={naveConAptitud}
              alAsignarMision={alAsignarMision}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenedor: { padding: espacio.l },
  titulo: {
    ...texto.titulo,
    color: colores.tinta,
    marginBottom: espacio.l,
  },
  subtitulo: {
    ...texto.subtitulo,
    color: colores.tinta,
    marginTop: espacio.xl,
    marginBottom: espacio.s,
  },
  etiqueta: {
    ...texto.etiqueta,
    color: colores.tinta,
    marginBottom: espacio.xs,
  },
  clases: {
    flexDirection: 'row',
    gap: espacio.s,
    marginBottom: espacio.m,
  },
  clase: {
    flex: 1,
    minHeight: toque.minimo,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.bordeControl,
    borderRadius: radio.control,
    paddingHorizontal: espacio.xs,
  },
  claseSeleccionada: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  textoClase: { ...texto.etiqueta, color: colores.tinta },
  textoClaseSeleccionada: { color: colores.sobrePrimario },
  error: { ...texto.cuerpo, color: colores.noApta, marginTop: espacio.s },
  confirmacion: {
    ...texto.cuerpo,
    color: colores.apta,
    marginTop: espacio.s,
  },
});
