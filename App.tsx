import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FlotaScreen } from './src/screens/FlotaScreen';
import { MisionScreen } from './src/screens/MisionScreen';
import type { NaveConAptitud } from './src/services/misionesService';
import { colores } from './src/tema';

type VistaActual =
  { pantalla: 'flota' } | { pantalla: 'mision'; nave: NaveConAptitud };

export default function App() {
  const [vista, setVista] = useState<VistaActual>({ pantalla: 'flota' });

  return (
    <SafeAreaProvider>
      <View style={estilos.contenedor}>
        {vista.pantalla === 'flota' ? (
          <FlotaScreen
            alAsignarMision={(nave) => setVista({ pantalla: 'mision', nave })}
          />
        ) : (
          <MisionScreen
            nave={vista.nave}
            alVolver={() => setVista({ pantalla: 'flota' })}
          />
        )}
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
});
