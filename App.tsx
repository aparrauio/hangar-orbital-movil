import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import { FlotaScreen } from './src/screens/FlotaScreen';
import { MisionScreen } from './src/screens/MisionScreen';
import type { Nave } from './src/types/nave';

type VistaActual = { pantalla: 'flota' } | { pantalla: 'mision'; nave: Nave };

export default function App() {
  const [vista, setVista] = useState<VistaActual>({ pantalla: 'flota' });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
      <StatusBar style="auto" />
    </View>
  );
}
