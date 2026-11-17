import { StyleSheet, Text, View } from 'react-native';
import { nombreClase, textoMisionesDesdeRevision } from '../screens/mensajes';
import type { NaveConAptitud } from '../services/misionesService';
import { colores, espacio, radio, texto } from '../tema';
import { Boton } from './Boton';
import { InsigniaAptitud } from './InsigniaAptitud';
import { MedidorCombustible } from './MedidorCombustible';

interface PropsTarjetaNave {
  naveConAptitud: NaveConAptitud;
  alAsignarMision: (naveConAptitud: NaveConAptitud) => void;
}

export function TarjetaNave({
  naveConAptitud,
  alAsignarMision,
}: PropsTarjetaNave) {
  const { nave, misionesDesdeRevision, aptitud } = naveConAptitud;

  return (
    <View style={estilos.tarjeta}>
      <View>
        <Text style={estilos.nombre}>{nave.nombre}</Text>
        <Text style={estilos.clase}>{nombreClase(nave.clase)}</Text>
      </View>
      <InsigniaAptitud resultado={aptitud} />
      <MedidorCombustible porcentaje={nave.combustible} />
      <Text style={estilos.detalle}>
        {textoMisionesDesdeRevision(misionesDesdeRevision)}
      </Text>
      <Text style={estilos.detalle}>
        Última revisión: {nave.ultimaRevision.toLocaleDateString('es')}
      </Text>
      <Boton
        texto="Asignar misión"
        variante="secundario"
        deshabilitado={!aptitud.puede}
        alPresionar={() => alAsignarMision(naveConAptitud)}
        etiquetaAccesible={`Asignar misión a ${nave.nombre}`}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.tarjeta,
    padding: espacio.l,
    gap: espacio.m,
    marginBottom: espacio.m,
  },
  nombre: { ...texto.nombre, color: colores.tinta },
  clase: { ...texto.etiqueta, color: colores.tintaSuave },
  detalle: { ...texto.cuerpo, color: colores.tintaSuave },
});
