# Spec 02: interfaz

Historia: HU-1.2 (ver las naves registradas).
Fuentes: `DESIGN.md`, `docs/prd/hangar-mvp.md`, `docs/backlog/E1-flota-y-misiones.md` y la revisión de la interfaz contra `DESIGN.md` del 2026-11-12.
Fecha: 2026-11-12.

`DESIGN.md` es la fuente de las decisiones de diseño y `src/tema/` guardará los valores. Esta spec cita sus secciones y no repite sus valores.

## 1. HU-1.2 · Ver las naves registradas

Como jefe de hangar, quiero ver las naves registradas, para saber con qué flota cuento y cuáles pueden recibir misiones.

**Reglas del PRD que aplica:**
- Una nave admite como máximo 3 misiones entre revisiones.
- Una nave con menos de 25 % de combustible no puede recibir misiones; con exactamente 25 % sí puede.
- Una nave en dique seco no puede recibir misiones.
- [SUPUESTO del PRD] Cuando una nave no puede recibir misiones, la app indica el motivo.

**Criterios de aceptación:**

| Id | DADO | CUANDO | ENTONCES |
|---|---|---|---|
| CA-1.2.1 | naves registradas | el jefe abre la flota | cada nave muestra nombre, clase, combustible, misiones desde su revisión ("N de 3") y fecha de última revisión |
| CA-1.2.2 | una nave con 25 % o más de combustible, menos de 3 misiones desde su revisión y fuera de reparación | el jefe ve la lista | la nave muestra "Puede recibir misiones" y permite asignarle una misión |
| CA-1.2.3 | una nave con menos de 25 % de combustible | el jefe ve la lista | la nave muestra "Combustible bajo" y no permite asignarle una misión |
| CA-1.2.4 | una nave con exactamente 25 % de combustible y menos de 3 misiones | el jefe ve la lista | la nave muestra "Puede recibir misiones" |
| CA-1.2.5 | una nave con 3 misiones desde su revisión | el jefe ve la lista | la nave muestra "Necesita revisión" y no permite asignarle una misión |
| CA-1.2.6 | una nave en reparación | el jefe ve la lista | la nave muestra "En reparación" y no permite asignarle una misión |
| CA-1.2.7 | la lista se está cargando | el jefe abre la flota | se muestra un indicador de carga con un mensaje, no la lista vacía |
| CA-1.2.8 | no hay naves registradas | el jefe abre la flota | se muestra un mensaje de que todavía no hay naves |
| CA-1.2.9 | la lista no se pudo cargar | el jefe abre la flota sin conexión | se muestra un mensaje de error con la acción "Reintentar", que vuelve a cargar la lista |

Cuando una nave cumple varios motivos, se muestra el primero según el orden de `puedeRecibirMision` (spec 01, §4): reparación, combustible y límite de misiones.

## 2. Alcance

### 2.1 Tema: `src/tema/`

- `src/tema/index.ts` exporta `colores`, `espacio`, `radio`, `texto` y `toque` con los valores de `DESIGN.md` §2.1 a §2.5.
- `src/tema/` no importa `firebase`. Solo importa `react-native` para tipos de estilo.
- `src/tema/sinColoresFijos.test.ts` (ya existe, sin commit) comprueba la regla de `DESIGN.md` §2: ningún archivo de `src/` fuera de `src/tema/`, ni `App.tsx`, escribe un color en hexadecimal.

### 2.2 Componentes en `src/components/`

Todos cumplen `DESIGN.md` §3 (introducción), §6 (accesibilidad) y §2.5 (alto mínimo de toque).

| Componente | Qué se hace | Referencia |
|---|---|---|
| `Boton` | Nuevo | `DESIGN.md` §3 `Boton` |
| `CampoTexto` | Se ajusta a los tokens: colores, tamaños, alto mínimo, y las props `error?` y `ayuda?` | `DESIGN.md` §3 `CampoTexto` |
| `EstadoPantalla` | Nuevo | `DESIGN.md` §3 `EstadoPantalla` |
| `MedidorCombustible` | Nuevo, con la marca del mínimo para recibir misiones en `COMBUSTIBLE_MINIMO_PARA_MISION` | `DESIGN.md` §3 `MedidorCombustible` |
| `InsigniaAptitud` | Nuevo; recibe el `ResultadoPuedeRecibirMision` | `DESIGN.md` §3 `InsigniaAptitud` |
| `TarjetaNave` | Nuevo; recibe una `NaveConAptitud` (§3) y `alAsignarMision` | `DESIGN.md` §3 `TarjetaNave` |

`MedidorCombustible` y `TarjetaNave` importan `COMBUSTIBLE_MINIMO_PARA_MISION` y `MAXIMO_MISIONES_ENTRE_REVISIONES` desde `src/dominio/puedeRecibirMision.ts`. No escriben 25 ni 3.

### 2.3 Textos en `src/screens/mensajes.ts`

Funciones puras nuevas, sin importar `react-native`, para poder probarlas con Vitest:

```ts
// "✓ Puede recibir misiones", "✕ Combustible bajo", "✕ Necesita revisión" o "✕ En reparación".
export function textoAptitud(resultado: ResultadoPuedeRecibirMision): string;

// "Misiones desde la revisión: 2 de 3".
export function textoMisionesDesdeRevision(misiones: number): string;

// "Carguera": inicial mayúscula al mostrarla (DESIGN.md §2.4).
export function nombreClase(clase: ClaseNave): string;

// "Combustible 60 por ciento" (DESIGN.md §3 MedidorCombustible).
export function etiquetaCombustible(porcentaje: number): string;
```

Mensajes nuevos de la lista, con la voz de `DESIGN.md` §5:

| Situación | Mensaje |
|---|---|
| Cargando | Cargando naves… |
| Vacío | Todavía no hay naves registradas. |
| Error | Se mantiene el mensaje actual de `conexion` al listar (spec 01, §6). |
| Acción de error | Reintentar |

### 2.4 Pantallas y `App.tsx`

- **`App.tsx`:** envuelve la app en `SafeAreaProvider` (§5) y usa `colores.fondo`. La vista de misión guarda una `NaveConAptitud`, no solo la `Nave`.
- **`FlotaScreen`** (`DESIGN.md` §4, Flota):
  - Respeta el área segura arriba y abajo, sin `paddingTop` fijo.
  - Botón "Registrar nave" con `Boton` primario. `CampoTexto` para nombre y combustible.
  - Lista con `listarNavesConAptitud` (§3): `TarjetaNave` por nave, o `EstadoPantalla` según CA-1.2.7 a CA-1.2.9.
  - Al registrar una nave, recarga la lista.
- **`MisionScreen`** (`DESIGN.md` §4, Asignar misión):
  - Respeta el área segura.
  - Volver con `Boton` variante texto, de 44 de alto.
  - Resumen de la nave con nombre, `InsigniaAptitud` y `MedidorCombustible`.
  - La fecha usa `ayuda` "AAAA-MM-DD" en lugar de texto de ejemplo. Reemplazado por el calendario de la spec 03.
  - Asignar con `Boton` primario.
- **Mientras no existan `SelectorClase`, `Aviso` y `EncabezadoPantalla`** (fuera de alcance, §6):
  - El selector de clase sigue en `FlotaScreen`, pero con tokens, alto `toque.minimo` y `nombreClase`.
  - Los mensajes de resultado siguen como texto, pero con los tokens `apta` o `noApta`, el símbolo ✓ o ✕ y `accessibilityRole="alert"`.
  - El título de cada pantalla usa `texto.titulo`.
- El botón "Asignar misión" de cada tarjeta tiene una etiqueta de accesibilidad con el nombre de la nave (por ejemplo, "Asignar misión a Aurora"), para cumplir `DESIGN.md` §6.

## 3. Datos

Se agrega a `src/services/misionesService.ts` una función que combina `listarNaves` y `contarMisionesDesdeRevision`. Va ahí y no en `navesService.ts` porque `misionesService` ya importa desde `navesService`, y lo contrario crearía una dependencia circular. **Las funciones existentes no cambian**, y tampoco `firestore.rules` ni `src/dominio/`.

```ts
export interface NaveConAptitud {
  nave: Nave;
  misionesDesdeRevision: number;
  aptitud: ResultadoPuedeRecibirMision;
}

export type ResultadoListarNavesConAptitud =
  | { ok: true; naves: NaveConAptitud[] }
  | { ok: false; error: { tipo: 'conexion' } };

export function listarNavesConAptitud(): Promise<ResultadoListarNavesConAptitud>;
```

`listarNavesConAptitud`:
1. Llama a `listarNaves`. Si falla, devuelve `conexion`.
2. Para cada nave, llama a `contarMisionesDesdeRevision`. Si alguna cuenta falla, devuelve `conexion` y no una lista parcial.
3. Decide la aptitud con `puedeRecibirMision(nave, misionesDesdeRevision)`. No repite la regla.
4. Conserva el orden por nombre de `listarNaves`.

La aptitud que muestra la lista es la del momento de la carga. La decisión final sigue siendo la de `crearMision`, que vuelve a contar al guardar (spec 01, §5).

## 4. Dependencias

- **`react-native-safe-area-context`**, instalada con `npx expo install react-native-safe-area-context`. Es la única dependencia nueva permitida.
- Se usan `SafeAreaProvider` en `App.tsx` y `SafeAreaView` (o `useSafeAreaInsets`) en las pantallas.

## 5. Fuera de alcance

- Cambiar `firestore.rules` o `src/dominio/`.
- Los componentes `SelectorClase`, `Aviso` y `EncabezadoPantalla` de `DESIGN.md` §3.
- Librerías de navegación, de UI o de íconos.
- Cualquier dependencia distinta de `react-native-safe-area-context`. La spec 03 agrega después `@react-native-community/datetimepicker`.
- Las decisiones pendientes de `DESIGN.md` §8: selector de fecha nativo, modo oscuro e íconos. El selector de fecha lo resuelve después la spec 03.
- Mostrar o cancelar las misiones de una nave (HU-1.6 y HU-1.7).

## 6. Criterio → verificación

| Criterio | Verificación | Detalle |
|---|---|---|
| CA-1.2.1 | Vitest y manual en Expo Go | `textoMisionesDesdeRevision(2)` y `nombreClase('carguera')`; en el teléfono, comprobar los cinco datos en una tarjeta |
| CA-1.2.2 | Vitest y manual en Expo Go | `textoAptitud({ puede: true })`; en el teléfono, una nave con 60 % y 0 misiones tiene el botón activo |
| CA-1.2.3 | Vitest y manual en Expo Go | `textoAptitud` con `combustible-bajo`; en el teléfono, registrar una nave con 24 % y comprobar la insignia y el botón desactivado |
| CA-1.2.4 | Manual en Expo Go | Registrar una nave con 25 % y comprobar "Puede recibir misiones". La regla ya tiene test en `puedeRecibirMision` (CA-1.3.14) |
| CA-1.2.5 | Vitest y manual en Expo Go | `textoAptitud` con `limite-misiones`; en el teléfono, asignar 3 misiones a una nave de prueba, volver a la flota y comprobar la insignia y el botón |
| CA-1.2.6 | Vitest | `textoAptitud` con `en-reparacion`; de punta a punta queda pendiente de E2 |
| CA-1.2.7 | Manual en Expo Go | Abrir la flota con red lenta y comprobar el indicador antes de la lista |
| CA-1.2.8 | Manual en Expo Go | Con un proyecto de Firestore sin naves, abrir la flota y comprobar el mensaje |
| CA-1.2.9 | Manual en Expo Go | Abrir la flota en modo avión, comprobar el mensaje, activar la red, tocar "Reintentar" y comprobar que carga |
| `DESIGN.md` §2 | Vitest | `sinColoresFijos.test.ts` pasa |
| `DESIGN.md` §2.5 y §6 | Manual en Expo Go | Todo control mide al menos 44 de alto y el lector de pantalla anuncia su rol y etiqueta |

## 7. Tickets

Los números siguen al T-08 de la spec 01.

### T-09 · Tema y área segura
- **Historia:** HU-1.2
- **Crea:** `src/tema/index.ts`. Incorpora al repositorio `src/tema/sinColoresFijos.test.ts`.
- **Modifica:** `App.tsx`, `package.json`, `package-lock.json`.
- **Dependencias:** ninguna.
- **Definition of Done:**
  - [ ] `src/tema/index.ts` exporta `colores`, `espacio`, `radio`, `texto` y `toque` con los valores de `DESIGN.md` §2.
  - [ ] `react-native-safe-area-context` está instalada con `npx expo install`, y no hay otras dependencias nuevas.
  - [ ] `App.tsx` usa `SafeAreaProvider` y `colores.fondo`, y su caso de `sinColoresFijos` pasa.
  - [ ] No se usa `any`.
  - [ ] `npm test` pasa salvo los casos de `sinColoresFijos` de los archivos que corrigen T-10 y T-12. `npx tsc --noEmit` pasa.

### T-10 · Componentes base
- **Historia:** HU-1.2
- **Crea:** `src/components/Boton.tsx`, `src/components/EstadoPantalla.tsx`.
- **Modifica:** `src/components/CampoTexto.tsx`.
- **Dependencias:** T-09.
- **Definition of Done:**
  - [ ] `Boton` cumple `DESIGN.md` §3: tres variantes y los estados presionado, deshabilitado y cargando, con alto mínimo `toque.minimo`.
  - [ ] `CampoTexto` usa tokens, tiene alto mínimo 44 y acepta `error?` y `ayuda?`. Su caso de `sinColoresFijos` pasa.
  - [ ] `EstadoPantalla` cumple `DESIGN.md` §3 en sus tres tipos, y el de error usa `Boton` "Reintentar".
  - [ ] Todo control tiene `accessibilityRole` y una etiqueta (`DESIGN.md` §6).
  - [ ] No se usa `any`, y los componentes no importan servicios ni Firebase.
  - [ ] `npm test` pasa salvo los casos de `sinColoresFijos` de las pantallas. `npx tsc --noEmit` pasa.

### T-11 · Aptitud visible
- **Historia:** HU-1.2
- **Crea:** `src/components/MedidorCombustible.tsx`, `src/components/InsigniaAptitud.tsx`, `src/components/TarjetaNave.tsx`, `src/screens/mensajes.test.ts`.
- **Modifica:** `src/services/misionesService.ts`, `src/screens/mensajes.ts`.
- **Dependencias:** T-10.
- **Definition of Done:**
  - [ ] `listarNavesConAptitud` cumple §3: decide con `puedeRecibirMision`, devuelve `conexion` ante cualquier fallo y no cambia las funciones existentes.
  - [ ] `textoAptitud`, `textoMisionesDesdeRevision`, `nombreClase` y `etiquetaCombustible` tienen tests en `mensajes.test.ts`, con los cuatro resultados posibles de aptitud.
  - [ ] `MedidorCombustible`, `InsigniaAptitud` y `TarjetaNave` cumplen `DESIGN.md` §3 y toman el 25 y el 3 de las constantes del dominio.
  - [ ] Si la nave no puede recibir misiones, el botón de `TarjetaNave` está desactivado y la insignia muestra el motivo.
  - [ ] No se usa `any`.
  - [ ] `npm test` pasa salvo los casos de `sinColoresFijos` de las pantallas. `npx tsc --noEmit` pasa.

### T-12 · Pantallas
- **Historia:** HU-1.2
- **Modifica:** `src/screens/FlotaScreen.tsx`, `src/screens/MisionScreen.tsx`, `App.tsx`.
- **Dependencias:** T-11.
- **Definition of Done:**
  - [ ] Las pantallas cumplen §2.4 y `DESIGN.md` §4, con área segura y sin `paddingTop` fijo.
  - [ ] La flota muestra `TarjetaNave` o `EstadoPantalla` según CA-1.2.7 a CA-1.2.9.
  - [ ] Las pantallas no usan `Pressable` con estilos propios, salvo el selector de clase mientras no exista `SelectorClase`.
  - [ ] Las pantallas no llaman a Firebase: solo usan `src/services/`.
  - [ ] Los criterios de §6 marcados como manuales se comprobaron en Expo Go y el resultado está anotado en el backlog.
  - [ ] `npm test` pasa completo, incluido `sinColoresFijos`, y `npx tsc --noEmit` pasa.

**Orden:** T-09 → T-10 → T-11 → T-12.

## 8. Límites conocidos

- **Una consulta por nave:** `listarNavesConAptitud` cuenta las misiones de cada nave por separado. Es aceptable para la flota del MVP, de 3 a 5 jefes y pocas naves.
- **Aptitud del momento de la carga:** la lista no se actualiza sola. Se recarga al volver de `MisionScreen` y al registrar una nave. `MisionScreen` muestra la aptitud con la que se abrió.
- **Conteo no atómico:** el riesgo H-01 de `docs/AUDITORIA.md` sigue vigente.
- **Componentes que faltan:** mientras no existan `SelectorClase`, `Aviso` y `EncabezadoPantalla`, esas partes siguen dentro de las pantallas, con tokens. La regla "Reutilizar `Boton`" de `DESIGN.md` §7 tiene esa única excepción, en el selector de clase.
- **Estado vacío:** las reglas no permiten borrar naves, así que CA-1.2.8 solo se puede comprobar con un proyecto de Firestore sin naves.
