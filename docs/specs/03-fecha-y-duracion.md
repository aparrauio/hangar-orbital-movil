# Spec 03: fecha y duración de la misión

Historia: HU-1.3 (asignar una misión a una nave).
Fuentes: pedido del cliente del 2026-11-12, `DESIGN.md`, `docs/specs/01-flota-y-misiones.md` y `docs/specs/02-interfaz.md`.
Fecha: 2026-11-12.

## 1. Decisiones del cliente

- La fecha de despegue se elige con un calendario, para que sea más fácil e intuitivo.
- El calendario es el selector nativo del sistema: `@react-native-community/datetimepicker`. Es la decisión pendiente "Selector de fecha nativo" de `DESIGN.md` §8, que el cliente aprobó el 2026-11-12. `DESIGN.md` todavía no lo refleja.
- El campo de duración acepta únicamente dígitos, sin letras ni caracteres especiales.

## 2. Criterios de aceptación

Se agregan a HU-1.3. Los criterios CA-1.3.7 a CA-1.3.12 de la spec 01 siguen vigentes.

| Id | DADO | CUANDO | ENTONCES |
|---|---|---|---|
| CA-1.3.15 | la pantalla de asignar misión | el jefe toca el campo de fecha de despegue | se abre el calendario del sistema y, al elegir un día, el campo lo muestra con el formato visible de `DESIGN.md` §2.4 (`20/11/2026`) |
| CA-1.3.16 | el calendario abierto | el jefe intenta elegir un día anterior a hoy | el calendario no lo permite; hoy sí se puede elegir |
| CA-1.3.17 | el campo de duración | el jefe escribe o pega texto que tiene letras, espacios, comas, puntos, signos u otros caracteres que no son dígitos | el campo no lo acepta y conserva el valor anterior |
| CA-1.3.18 | el campo de duración | el jefe lo toca | se abre un teclado solo numérico |

**Relación con los criterios anteriores:**
- **CA-1.3.8 y CA-1.3.9 (fecha de ayer y de hoy):** el calendario impide elegir fechas pasadas. `validarMision` las sigue rechazando como defensa.
- **CA-1.3.12 (duración de 1,5 días):** la coma ya no se puede escribir. `validarMision` sigue rechazando `1,5` como defensa, y se sigue verificando con Vitest.
- **`fecha-invalida`:** ya no se puede producir desde la pantalla, porque la fecha solo sale del calendario. El código y su mensaje se mantienen en el dominio.

## 3. Diseño

### 3.1 Componente `SelectorFecha` (`src/components/SelectorFecha.tsx`)

`DESIGN.md` §3 no define este componente. Sigue el patrón de `CampoTexto` (`DESIGN.md` §3) para que el formulario se vea uniforme:

- Props: `etiqueta`, `valor` (texto `AAAA-MM-DD`, o `''` si no hay fecha), `alCambiar(valor: string)`, `minimo: Date`, `ayuda?` y `error?`.
- **Campo:**
  - Es un control tocable con la etiqueta arriba y alto mínimo `toque.minimo`.
  - Borde `bordeControl` y fondo `superficie`. Si hay error, borde `noApta`.
  - Muestra la fecha elegida con `toLocaleDateString('es')`. Sin fecha, muestra "Elige una fecha" en `tintaTenue`.
- **Accesibilidad:**
  - `accessibilityRole="button"`.
  - `accessibilityLabel` con la etiqueta y la fecha elegida, o "sin elegir" si no hay ninguna.
- **Calendario:**
  - Usa `mode="date"`, `minimumDate={minimo}` y, como valor inicial, la fecha elegida o `minimo`.
  - **Android:** se abre como diálogo. Al aceptar, guarda la fecha; al cancelar, no cambia nada. En ambos casos se cierra.
  - **iOS:** se muestra en línea, con `display="inline"`, debajo del campo. Al elegir un día, guarda la fecha y se cierra.
  - Los colores del calendario salen de `src/tema/`: en iOS, `accentColor` y `themeVariant` claro.
- **Conversión de fechas:** de la fecha elegida al texto con `fechaLocalComoTexto` (spec 01, §4), y del texto a fecha con la función nueva `textoComoFechaLocal` (§3.3).

### 3.2 Duración en `MisionScreen`

- El campo usa `teclado="number-pad"`.
- Cada cambio pasa por `entradaSoloDigitos(anterior, nueva)` (§3.3). Si el texto nuevo tiene algún carácter que no es dígito, el campo conserva el valor anterior.
- Se rechaza el cambio entero, y no se quitan los caracteres sobrantes. Así, pegar `1,5` no se convierte en `15` sin que el jefe lo note.

### 3.3 Funciones puras nuevas en `src/dominio/`

```ts
// src/dominio/entradaSoloDigitos.ts
// Devuelve `nueva` si solo tiene dígitos (o está vacía); si no, `anterior`.
export function entradaSoloDigitos(anterior: string, nueva: string): string;

// src/dominio/textoComoFechaLocal.ts
// Convierte 'AAAA-MM-DD' en la medianoche local de ese día. Es la inversa de fechaLocalComoTexto.
// Devuelve null si el texto no es una fecha real.
export function textoComoFechaLocal(texto: string): Date | null;
```

### 3.4 `MisionScreen`

- El campo "Fecha de despegue" pasa a ser un `SelectorFecha`, con `minimo` igual a la medianoche local de hoy. Deja de existir la entrada de texto de la fecha, y también la ayuda "AAAA-MM-DD".
- `crearMision` sigue recibiendo la fecha como `AAAA-MM-DD` y `hoy` como `fechaLocalComoTexto(new Date())`. Los servicios y `validarMision` no cambian.

## 4. Dependencias

- **`@react-native-community/datetimepicker`**, instalada con `npx expo install @react-native-community/datetimepicker`. Está incluida en Expo Go.
- Junto con `react-native-safe-area-context` (spec 02), son las únicas dependencias nuevas permitidas.

## 5. Fuera de alcance

- Cambiar `validarMision`, los servicios o `firestore.rules`.
- Elegir la hora del despegue.
- Aplicar el filtro de dígitos al campo de combustible de `FlotaScreen`.
- Fijar una duración máxima (hallazgo H-09 de `docs/AUDITORIA.md`).
- Modificar `DESIGN.md`. Agregar `SelectorFecha` a su §3 y quitar el pendiente de su §8 lo decide quien mantiene el documento.

## 6. Criterio → verificación

| Criterio | Verificación | Detalle |
|---|---|---|
| CA-1.3.15 | Vitest y manual en Expo Go | `textoComoFechaLocal` ida y vuelta con `fechaLocalComoTexto`; en el teléfono (Android y, si hay, iOS), abrir el calendario, elegir un día y comprobar el campo |
| CA-1.3.16 | Manual en Expo Go | Comprobar que los días anteriores a hoy aparecen desactivados y que hoy se puede elegir |
| CA-1.3.17 | Vitest y manual en Expo Go | `entradaSoloDigitos` con dígitos, vacío, letras, espacio, coma, punto, signo menos y `1,5`; en el teléfono, pegar `1,5` y comprobar que el campo no cambia |
| CA-1.3.18 | Manual en Expo Go | Tocar la duración y comprobar el teclado numérico |
| `DESIGN.md` §2 | Vitest | `sinColoresFijos.test.ts` sigue pasando |

## 7. Tickets

### T-13 · Calendario para la fecha de despegue
- **Historia:** HU-1.3
- **Crea:** `src/components/SelectorFecha.tsx`, `src/dominio/textoComoFechaLocal.ts`, `src/dominio/textoComoFechaLocal.test.ts`.
- **Modifica:** `src/screens/MisionScreen.tsx`, `package.json`, `package-lock.json` y `app.json` (el plugin que agrega `npx expo install`).
- **Dependencias:** T-12.
- **Definition of Done:**
  - [ ] `@react-native-community/datetimepicker` está instalada con `npx expo install`, y no hay otras dependencias nuevas.
  - [ ] Se usan `onValueChange` y `onDismiss`, no `onChange`, que está obsoleto en la versión 9.
  - [ ] `SelectorFecha` cumple §3.1: alto 44, colores de `src/tema/`, rol y etiqueta accesibles.
  - [ ] El calendario no permite días anteriores a hoy (CA-1.3.16).
  - [ ] `textoComoFechaLocal` tiene tests, incluida la ida y vuelta con `fechaLocalComoTexto`.
  - [ ] CA-1.3.15 y CA-1.3.16 se comprobaron en Expo Go.
  - [ ] No se usa `any`, y `src/dominio/` no importa `react-native` ni `firebase`.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

### T-14 · Duración solo con dígitos
- **Historia:** HU-1.3
- **Crea:** `src/dominio/entradaSoloDigitos.ts`, `src/dominio/entradaSoloDigitos.test.ts`.
- **Modifica:** `src/screens/MisionScreen.tsx`.
- **Dependencias:** T-12.
- **Definition of Done:**
  - [ ] `entradaSoloDigitos` tiene los tests de §6.
  - [ ] El campo de duración usa teclado numérico y conserva el valor anterior ante cualquier carácter que no sea dígito (CA-1.3.17 y CA-1.3.18).
  - [ ] CA-1.3.17 y CA-1.3.18 se comprobaron en Expo Go.
  - [ ] No se usa `any`.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

**Orden:** T-13 y T-14 son independientes.

## 8. Límites conocidos

- **Diferencias entre plataformas:** el calendario se ve distinto en Android (diálogo) y en iOS (en línea), porque es el del sistema.
- **Medianoche local:** si el jefe deja la pantalla abierta pasada la medianoche, el mínimo del calendario sigue siendo el día anterior hasta que vuelva a abrir la pantalla. `validarMision` rechaza esa fecha al guardar (`fecha-pasada`).
- **Pegar con espacios:** pegar ` 3` con un espacio se rechaza entero. El jefe tiene que escribir el número.
