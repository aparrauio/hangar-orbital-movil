import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Boton } from '../components/Boton';
import { CampoTexto } from '../components/CampoTexto';
import { InsigniaAptitud } from '../components/InsigniaAptitud';
import { MedidorCombustible } from '../components/MedidorCombustible';
import { SelectorFecha } from '../components/SelectorFecha';
import { entradaSoloDigitos } from '../dominio/entradaSoloDigitos';
import { fechaLocalComoTexto } from '../dominio/fechaLocalComoTexto';
import { crearMision, type NaveConAptitud } from '../services/misionesService';
import { colores, espacio, radio, texto } from '../tema';
import {
  MENSAJE_ERROR_GUARDAR,
  MENSAJES_ERROR_MISION,
  MENSAJES_RECHAZO_MISION,
  mensajeMisionAsignada,
} from './mensajes';

interface PropsMisionScreen {
  nave: NaveConAptitud;
  alVolver: () => void;
}

function medianocheDeHoy(): Date {
  const ahora = new Date();
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
}

export function MisionScreen({
  nave: naveConAptitud,
  alVolver,
}: PropsMisionScreen) {
  const { nave, aptitud } = naveConAptitud;
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
    <SafeAreaView style={estilos.pantalla} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={estilos.contenedor}
        keyboardShouldPersistTaps="handled"
      >
        <Boton
          texto="‹ Volver"
          variante="texto"
          alPresionar={alVolver}
          etiquetaAccesible="Volver a la flota"
        />

        <Text style={estilos.titulo} accessibilityRole="header">
          Asignar misión
        </Text>

        <View style={estilos.resumen}>
          <Text style={estilos.nombre}>{nave.nombre}</Text>
          <InsigniaAptitud resultado={aptitud} />
          <MedidorCombustible porcentaje={nave.combustible} />
        </View>

        <CampoTexto etiqueta="Destino" valor={destino} alCambiar={setDestino} />
        <SelectorFecha
          etiqueta="Fecha de despegue"
          valor={fechaDespegue}
          alCambiar={setFechaDespegue}
          minimo={medianocheDeHoy()}
        />
        <CampoTexto
          etiqueta="Duración (días)"
          valor={duracionDias}
          alCambiar={(nueva) =>
            setDuracionDias((anterior) => entradaSoloDigitos(anterior, nueva))
          }
          teclado="number-pad"
        />

        <Boton
          texto="Asignar misión"
          alPresionar={() => void asignar()}
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
    marginTop: espacio.s,
    marginBottom: espacio.l,
  },
  resumen: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.tarjeta,
    padding: espacio.l,
    gap: espacio.m,
    marginBottom: espacio.xl,
  },
  nombre: { ...texto.nombre, color: colores.tinta },
  error: { ...texto.cuerpo, color: colores.noApta, marginTop: espacio.s },
  confirmacion: {
    ...texto.cuerpo,
    color: colores.apta,
    marginTop: espacio.s,
  },
});
