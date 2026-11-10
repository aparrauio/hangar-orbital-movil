# Hangar Orbital

## Proyecto
App móvil para registrar las naves de un hangar, asignarles misiones y saber cuáles pueden despegar.

## Stack
- Expo + React Native + TypeScript.
- Firebase JS SDK (Firestore).
- Tests con Vitest y formato con Prettier.
- Se prueba en Expo Go.

## Estructura prevista
- `src/firebase/config.ts`
- `src/types/`
- `src/dominio/`: funciones puras y sus tests.
- `src/services/`
- `src/screens/`
- `src/components/`
- `firestore.rules`
- `docs/prd/`, `docs/backlog/`, `docs/specs/`

## Comandos
- `npx expo start`
- `npm test`
- `npx tsc --noEmit`

## Convenciones
- Nombres del dominio en español y camelCase.
- Nunca usar `any`.
- Las pantallas no llaman a Firebase, solo los servicios de `src/services/`.
- `src/dominio/` no importa `react-native` ni `firebase`.
- Las dependencias de Expo se instalan con `npx expo install`.

## Reglas
- Nunca leer ni modificar `.env`.
- Nunca escribir la configuración de Firebase en el código, solo variables `EXPO_PUBLIC_FIREBASE_*` leídas desde `.env`.
- Ninguna funcionalidad se implementa sin una spec en `docs/specs`.
- Ejecutar `npm test` y `npx tsc --noEmit` antes de dar una tarea por terminada.
