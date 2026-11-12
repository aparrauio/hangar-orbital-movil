# Spec 01: flota y misiones

Historias: HU-1.1 (registrar una nave) y HU-1.3 (asignar una misión a una nave).
Actualizada el 2026-11-12 con la regla de combustible mínimo para recibir misiones (punto abierto 4 del PRD, resuelto).
Fuentes: `docs/prd/hangar-mvp.md` y `docs/backlog/E1-flota-y-misiones.md`.

## 1. Modelo en Firestore

### Colección `naves`

El id de cada documento es el nombre normalizado, para que un nombre repetido choque.

| Campo | Tipo | Regla |
|---|---|---|
| `nombre` | texto | Nombre tal como lo escribió el jefe, sin espacios al inicio ni al final |
| `clase` | texto | `exploradora`, `carguera` o `transporte` |
| `combustible` | entero | De 0 a 100 |
| `enReparacion` | booleano | `false` al registrar |
| `ultimaRevision` | fecha y hora | Hora del servidor al registrar |
| `creadaEn` | fecha y hora | Hora del servidor al registrar |

**Normalización del nombre (en este orden):** quitar espacios al inicio y al final, pasar a minúsculas, descomponer con `normalize('NFD')`, quitar las marcas `̀` a `ͯ` y reemplazar cada grupo de espacios por un guion.

- `Áurora Uno`, `aurora uno` y `AURORA  UNO` producen `aurora-uno` y por lo tanto son el mismo nombre.
- La `ñ` se convierte en `n`.
- El resultado debe cumplir `^[a-z0-9]+(-[a-z0-9]+)*$`. Así se evita que caracteres como `/` rompan la ruta del documento.

### Subcolección `naves/{naveId}/misiones`

El id de cada documento lo genera Firestore.

| Campo | Tipo | Regla |
|---|---|---|
| `destino` | texto | No vacío, sin espacios al inicio ni al final |
| `fechaDespegue` | texto | `AAAA-MM-DD`, fecha real, no anterior a hoy |
| `duracionDias` | entero | Mínimo 1 |
| `creadaEn` | fecha y hora | Hora del servidor al crear |

## 2. `firestore.rules`

Son temporales porque, sin inicio de sesión, no distinguen quién accede, y porque E2 necesitará modificar naves.

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function esTextoNoVacio(valor) {
      return valor is string && valor.trim().size() > 0;
    }

    function esNaveValida(naveId, datos) {
      let campos = ['nombre', 'clase', 'combustible', 'enReparacion', 'ultimaRevision', 'creadaEn'];
      return naveId.matches('^[a-z0-9]+(-[a-z0-9]+)*$')
        && datos.keys().hasAll(campos)
        && datos.keys().hasOnly(campos)
        && esTextoNoVacio(datos.nombre)
        && datos.clase in ['exploradora', 'carguera', 'transporte']
        && datos.combustible is int
        && datos.combustible >= 0
        && datos.combustible <= 100
        && datos.enReparacion == false
        && datos.ultimaRevision == request.time
        && datos.creadaEn == request.time;
    }

    // La app exige la fecha local exacta. Aquí se admite un día de margen
    // porque request.time está en UTC y el teléfono puede ir detrás.
    function esFechaAdmitida(fecha) {
      let partes = fecha.split('-');
      return fecha is string
        && fecha.matches('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
        && timestamp.date(int(partes[0]), int(partes[1]), int(partes[2]))
          >= request.time.date() - duration.value(1, 'd');
    }

    function esMisionValida(datos) {
      let campos = ['destino', 'fechaDespegue', 'duracionDias', 'creadaEn'];
      return datos.keys().hasAll(campos)
        && datos.keys().hasOnly(campos)
        && esTextoNoVacio(datos.destino)
        && esFechaAdmitida(datos.fechaDespegue)
        && datos.duracionDias is int
        && datos.duracionDias >= 1
        && datos.creadaEn == request.time;
    }

    // Fuera de reparación y con al menos 25 % de combustible.
    function naveAdmiteMision(naveId) {
      let nave = get(/databases/$(database)/documents/naves/$(naveId)).data;
      return nave.enReparacion == false
        && nave.combustible >= 25;
    }

    match /naves/{naveId} {
      allow read: if true;
      allow create: if esNaveValida(naveId, request.resource.data);
      allow update, delete: if false;

      match /misiones/{misionId} {
        allow read: if true;
        allow create: if esMisionValida(request.resource.data)
          && naveAdmiteMision(naveId);
        allow update, delete: if false;
      }
    }
  }
}
```

Estas reglas no pueden contar documentos, así que el límite de 3 misiones se aplica en `misionesService`.

## 3. Tipos de TypeScript

`src/types/` no importa `firebase`. Los servicios convierten los `Timestamp` a `Date`.

```ts
// src/types/nave.ts
export const CLASES_NAVE = ['exploradora', 'carguera', 'transporte'] as const;
export type ClaseNave = (typeof CLASES_NAVE)[number];

export interface Nave {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: boolean;
  ultimaRevision: Date;
  creadaEn: Date;
}

// Valores tal como llegan del formulario.
export interface EntradaNave {
  nombre: string;
  clase: string;
  combustible: string;
}

export interface NaveValidada {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
}
```

```ts
// src/types/mision.ts
export interface Mision {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
  creadaEn: Date;
}

export interface EntradaMision {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: string;
}

export interface MisionValidada {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
}
```

```ts
// src/types/validacion.ts
export type ResultadoValidacion<TDatos, TCodigo extends string> =
  | { valido: true; datos: TDatos }
  | { valido: false; errores: TCodigo[] };
```

## 4. Funciones puras en `src/dominio/`

```ts
export type CodigoErrorNave =
  | 'nombre-requerido'
  | 'nombre-invalido'
  | 'clase-requerida'
  | 'clase-invalida'
  | 'combustible-requerido'
  | 'combustible-no-entero'
  | 'combustible-fuera-de-rango';

export function normalizarNombre(nombre: string): string;

export function validarNave(
  entrada: EntradaNave,
): ResultadoValidacion<NaveValidada, CodigoErrorNave>;
```

```ts
export type CodigoErrorMision =
  | 'nave-requerida'
  | 'destino-requerido'
  | 'fecha-requerida'
  | 'fecha-invalida'
  | 'fecha-pasada'
  | 'duracion-requerida'
  | 'duracion-no-entera'
  | 'duracion-minima';

// hoy tiene formato AAAA-MM-DD.
export function validarMision(
  entrada: EntradaMision,
  hoy: string,
): ResultadoValidacion<MisionValidada, CodigoErrorMision>;

// Devuelve la fecha local del teléfono como AAAA-MM-DD, sin usar UTC.
export function fechaLocalComoTexto(fecha: Date): string;
```

```ts
export const MAXIMO_MISIONES_ENTRE_REVISIONES = 3;
export const COMBUSTIBLE_MINIMO_PARA_MISION = 25;

export type MotivoRechazoMision =
  | 'en-reparacion'
  | 'combustible-bajo'
  | 'limite-misiones';

export type ResultadoPuedeRecibirMision =
  | { puede: true }
  | { puede: false; motivo: MotivoRechazoMision };

export function puedeRecibirMision(
  nave: Pick<Nave, 'enReparacion' | 'combustible'>,
  misionesDesdeRevision: number,
): ResultadoPuedeRecibirMision;
```

**Comportamiento:**
- Los valores numéricos se aceptan como enteros solo si cumplen `^-?[0-9]+$`. Así `25,5` y `1,5` dan error de entero, y `-1` da error de rango o de mínimo.
- `validarNave` devuelve `nombre-invalido` si el nombre normalizado no cumple el patrón de la sección 1.
- `validarMision` comprueba que la fecha exista en el calendario, por ejemplo rechaza `2026-02-30`. La compara con `hoy` como texto: `hoy` se acepta y una fecha anterior no.
- `puedeRecibirMision` evalúa en este orden: `enReparacion`, el combustible y el límite de misiones, y devuelve el primer motivo que falle. Puede recibir con 0, 1 o 2 misiones, y no con 3 o más.
- Con menos de `COMBUSTIBLE_MINIMO_PARA_MISION` (24 % o menos) devuelve `combustible-bajo`. Con exactamente 25 % puede recibir misiones.
- El combustible solo decide si la nave recibe una misión nueva. Las misiones que ya tenía siguen contando para el límite de 3, aunque el combustible baje de 25 %.

## 5. Servicios

Los servicios no lanzan errores hacia las pantallas: devuelven un resultado tipado. Cualquier fallo de Firestore se devuelve como `conexion`. Los datos de `snapshot.data()` se asignan a un tipo explícito, sin usar `any`.

### `src/services/navesService.ts`

```ts
export type ErrorCrearNave =
  | { tipo: 'validacion'; errores: CodigoErrorNave[] }
  | { tipo: 'nombre-repetido' }
  | { tipo: 'conexion' };

export type ResultadoCrearNave =
  | { ok: true; id: string; nombre: string }
  | { ok: false; error: ErrorCrearNave };

export type ResultadoListarNaves =
  | { ok: true; naves: Nave[] }
  | { ok: false; error: { tipo: 'conexion' } };

export function crearNave(entrada: EntradaNave): Promise<ResultadoCrearNave>;
export function listarNaves(): Promise<ResultadoListarNaves>;
```

`crearNave`:
1. Llama a `validarNave` y devuelve `validacion` si falla.
2. Dentro de `runTransaction`, lee `naves/{id}`. Si existe, devuelve `nombre-repetido` sin escribir.
3. Si no existe, escribe la nave con `enReparacion: false` y `serverTimestamp()` en `ultimaRevision` y `creadaEn`.

Se usa una transacción porque falla sin conexión en lugar de confirmar un guardado pendiente, y porque distingue un nombre repetido de un dato rechazado por las reglas.

`listarNaves` usa `getDocsFromServer`, ordenada por `nombre`, para no mostrar una flota vacía cuando no hay señal.

### `src/services/misionesService.ts`

```ts
export type ErrorCrearMision =
  | { tipo: 'validacion'; errores: CodigoErrorMision[] }
  | { tipo: 'rechazada'; motivo: MotivoRechazoMision }
  | { tipo: 'conexion' };

export type ResultadoCrearMision =
  | { ok: true; id: string }
  | { ok: false; error: ErrorCrearMision };

export function contarMisionesDesdeRevision(
  nave: Pick<Nave, 'id' | 'ultimaRevision'>,
): Promise<number>;

export function crearMision(
  entrada: EntradaMision,
  hoy: string,
): Promise<ResultadoCrearMision>;
```

`contarMisionesDesdeRevision` usa `getCountFromServer` sobre `naves/{id}/misiones` con `creadaEn >= ultimaRevision`.

`crearMision`:
1. Llama a `validarMision` y devuelve `validacion` si falla.
2. Dentro de `runTransaction`, lee la nave. Si no existe, devuelve `conexion`.
3. Cuenta sus misiones con `contarMisionesDesdeRevision` y llama a `puedeRecibirMision`.
4. Si no puede, devuelve `rechazada` con el motivo, sin escribir.
5. Si puede, escribe la misión con `serverTimestamp()` en `creadaEn`. No escribe nada en la nave.

## 6. Pantallas

No se usan librerías de navegación. `App.tsx` guarda con un estado la vista actual: `{ pantalla: 'flota' }` o `{ pantalla: 'mision'; nave: Nave }`. Las pantallas solo llaman a `src/services/`, y `src/screens/mensajes.ts` traduce cada código a su mensaje.

### `FlotaScreen`

- Formulario con nombre, selector de las tres clases y combustible.
- Lista de naves con nombre, clase, combustible y fecha de última revisión.
- Cada nave tiene una acción "Asignar misión", que abre `MisionScreen` con esa nave.
- Al registrar correctamente, limpia el formulario, muestra la confirmación y recarga la lista.
- El botón de guardar se deshabilita mientras se guarda, para evitar un doble registro.

### `MisionScreen`

- Muestra la nave elegida y permite volver a la flota.
- Formulario con destino, fecha de despegue (texto `AAAA-MM-DD`) y duración en días.
- Calcula `hoy` con `fechaLocalComoTexto(new Date())` y lo pasa a `crearMision`.
- Al asignar correctamente, limpia el formulario y muestra la confirmación.
- El botón de guardar se deshabilita mientras se guarda, para evitar una misión duplicada.

### Mensajes para el jefe de hangar

| Código o situación | Mensaje |
|---|---|
| `nombre-requerido` | Escribe el nombre de la nave. |
| `nombre-invalido` | El nombre solo puede tener letras, números, espacios y guiones. |
| `clase-requerida` | Elige la clase de la nave. |
| `clase-invalida` | La clase debe ser exploradora, carguera o transporte. |
| `combustible-requerido` | Indica el combustible de la nave. |
| `combustible-no-entero` | El combustible debe ser un número entero. |
| `combustible-fuera-de-rango` | El combustible debe estar entre 0 y 100. |
| `nombre-repetido` | Ya existe una nave con ese nombre. |
| Nave registrada | Nave {nombre} registrada. Queda revisada hoy y sin misiones desde esa revisión. |
| `nave-requerida` | Elige una nave. |
| `destino-requerido` | Escribe el destino de la misión. |
| `fecha-requerida` | Indica la fecha de despegue. |
| `fecha-invalida` | La fecha debe ser real y tener el formato AAAA-MM-DD. |
| `fecha-pasada` | La fecha de despegue no puede ser anterior a hoy. |
| `duracion-requerida` | Indica la duración en días. |
| `duracion-no-entera` | La duración debe ser un número entero de días. |
| `duracion-minima` | La duración mínima es 1 día. |
| `limite-misiones` | Esta nave ya tiene 3 misiones desde su última revisión. Necesita una revisión antes de recibir otra. |
| `en-reparacion` | Esta nave está en reparación y no puede recibir misiones. |
| `combustible-bajo` | Esta nave tiene menos de 25 % de combustible y no puede recibir misiones. |
| Misión asignada | Misión a {destino} asignada a {nombre}. |
| `conexion` al guardar | No se pudo guardar. Revisa tu conexión e inténtalo de nuevo. |
| `conexion` al listar | No se pudieron cargar las naves. Revisa tu conexión e inténtalo de nuevo. |

## 7. Criterios de aceptación

### HU-1.1 · Registrar una nave

| Id | Criterio |
|---|---|
| CA-1.1.1 | Al registrar una nave con nombre, clase y combustible válidos, la app DEBE confirmar el registro con esos datos y la nave DEBE poder recibir misiones. |
| CA-1.1.2 | La app DEBE aceptar un combustible de 0 % y de 100 %. |
| CA-1.1.3 | La app NO DEBE registrar una nave con combustible de -1 % o 101 % y DEBE informar que debe estar entre 0 y 100. |
| CA-1.1.4 | La app NO DEBE registrar una nave con combustible 25,5 % y DEBE informar que debe ser un número entero. |
| CA-1.1.5 | La app NO DEBE registrar una nave sin nombre, clase o combustible y DEBE informar qué falta. |
| CA-1.1.6 | Una nave registrada hoy DEBE figurar como revisada hoy y sin misiones desde esa revisión. |
| CA-1.1.7 | La app DEBE aceptar las clases exploradora, carguera y transporte. |
| CA-1.1.8 | La app NO DEBE registrar una nave con otra clase y DEBE informar cuáles son las válidas. |
| CA-1.1.9 | La app NO DEBE registrar una nave con un nombre ya existente, DEBE informar que el nombre ya existe y NO DEBE modificar la nave existente. |

### HU-1.3 · Asignar una misión a una nave

| Id | Criterio |
|---|---|
| CA-1.3.1 | Al asignar una misión válida a una nave sin misiones desde su última revisión, la app DEBE confirmar la asignación a esa nave. |
| CA-1.3.2 | Una nave con 2 misiones desde su última revisión DEBE poder recibir una tercera. |
| CA-1.3.3 | Una nave con 3 misiones desde su última revisión NO DEBE recibir otra y la app DEBE informar que necesita una revisión. |
| CA-1.3.4 | Una nave con 3 misiones programadas y ninguna realizada NO DEBE recibir otra. |
| CA-1.3.5 | Una nave en reparación NO DEBE recibir misiones y la app DEBE informar el motivo. |
| CA-1.3.6 | Asignar una misión NO DEBE cambiar el combustible de la nave. |
| CA-1.3.7 | La app NO DEBE asignar una misión sin nave, destino, fecha de despegue o duración y DEBE informar qué falta. |
| CA-1.3.8 | La app NO DEBE asignar una misión con fecha anterior a hoy y DEBE informar que no puede ser anterior a hoy. |
| CA-1.3.9 | La app DEBE aceptar una fecha de despegue igual a hoy. |
| CA-1.3.10 | La app NO DEBE asignar una misión de 0 días y DEBE informar que el mínimo es 1 día. |
| CA-1.3.11 | La app DEBE aceptar una duración de 1 día. |
| CA-1.3.12 | La app NO DEBE asignar una misión de 1,5 días y DEBE informar que debe ser un número entero de días. |
| CA-1.3.13 | Una nave con 24 % de combustible NO DEBE recibir misiones y la app DEBE informar que tiene menos de 25 %. |
| CA-1.3.14 | Una nave con exactamente 25 % de combustible DEBE poder recibir misiones. |

## 8. Criterio → verificación

| Criterio | Verificación | Detalle |
|---|---|---|
| CA-1.1.1 | Manual en Expo Go | Registrar Aurora, carguera, 60 % y comprobar la confirmación y que aparece en la lista |
| CA-1.1.2 | Vitest (dominio) | `validarNave` con 0 y 100 |
| CA-1.1.3 | Vitest (dominio) | `validarNave` con -1 y 101 |
| CA-1.1.4 | Vitest (dominio) | `validarNave` con `25,5` |
| CA-1.1.5 | Vitest (dominio) | `validarNave` sin cada dato obligatorio |
| CA-1.1.6 | Manual en Expo Go | Registrar una nave y comprobar la confirmación y la fecha de revisión en la lista |
| CA-1.1.7 | Vitest (dominio) | `validarNave` con las tres clases |
| CA-1.1.8 | Vitest (dominio) | `validarNave` con una clase desconocida |
| CA-1.1.9 | Vitest (dominio) y manual en Expo Go | `normalizarNombre` con variantes del nombre; registrar dos veces Aurora y comprobar el mensaje |
| CA-1.3.1 | Manual en Expo Go | Asignar una misión válida y comprobar la confirmación |
| CA-1.3.2 | Vitest (dominio) | `puedeRecibirMision` con 2 misiones |
| CA-1.3.3 | Vitest (dominio) y manual en Expo Go | `puedeRecibirMision` con 3 misiones; asignar cuatro misiones y comprobar el mensaje |
| CA-1.3.4 | Vitest (dominio) | `puedeRecibirMision` con 3 misiones |
| CA-1.3.5 | Vitest (dominio) | `puedeRecibirMision` con `enReparacion: true`; de punta a punta queda pendiente de E2 |
| CA-1.3.6 | Manual en Expo Go | Comprobar el combustible en la lista antes y después de asignar |
| CA-1.3.7 | Vitest (dominio) | `validarMision` sin cada dato obligatorio |
| CA-1.3.8 | Vitest (dominio) | `validarMision` con la fecha de ayer |
| CA-1.3.9 | Vitest (dominio) | `validarMision` con la fecha de hoy |
| CA-1.3.10 | Vitest (dominio) | `validarMision` con `0` |
| CA-1.3.11 | Vitest (dominio) | `validarMision` con `1` |
| CA-1.3.12 | Vitest (dominio) | `validarMision` con `1,5` |
| CA-1.3.13 | Vitest (dominio) y manual en Expo Go | `puedeRecibirMision` con 24 %; registrar una nave con 24 %, intentar asignarle una misión y comprobar el mensaje |
| CA-1.3.14 | Vitest (dominio) | `puedeRecibirMision` con 25 % |

## 9. Ticket → archivos

| Ticket | Crea | Modifica |
|---|---|---|
| T-01 | `src/firebase/config.ts`, `firestore.rules`, `vitest.config.ts`, `.prettierrc`, `.env.example` | `package.json`, `package-lock.json` |
| T-02 | `src/types/nave.ts`, `src/types/validacion.ts`, `src/dominio/normalizarNombre.ts`, `src/dominio/normalizarNombre.test.ts`, `src/dominio/validarNave.ts`, `src/dominio/validarNave.test.ts` | Ninguno |
| T-03 | `src/services/navesService.ts`, `src/screens/FlotaScreen.tsx`, `src/screens/mensajes.ts`, `src/components/CampoTexto.tsx` | `App.tsx` |
| T-04 | Ninguno | `docs/backlog/E1-flota-y-misiones.md` (resultado de la prueba) |
| T-05 | `src/types/mision.ts`, `src/dominio/validarMision.ts`, `src/dominio/validarMision.test.ts`, `src/dominio/fechaLocalComoTexto.ts`, `src/dominio/fechaLocalComoTexto.test.ts`, `src/dominio/puedeRecibirMision.ts`, `src/dominio/puedeRecibirMision.test.ts` | Ninguno |
| T-06 | `src/services/misionesService.ts`, `src/screens/MisionScreen.tsx` | `App.tsx`, `src/screens/FlotaScreen.tsx`, `src/screens/mensajes.ts` |
| T-07 | Ninguno | `docs/backlog/E1-flota-y-misiones.md` (resultado de la prueba) |
| T-08 | Ninguno | `src/dominio/puedeRecibirMision.ts`, `src/dominio/puedeRecibirMision.test.ts`, `src/screens/mensajes.ts`, `firestore.rules` |

## 10. Límites conocidos

- **Simultaneidad:** contar y crear no es atómico, porque una transacción del SDK no puede incluir una consulta. Si dos jefes asignan a la vez a una nave con 2 misiones, puede quedar con 4.
- **Revisión con misiones programadas (punto abierto 1):** contar por `creadaEn` deja de contar las misiones creadas antes de una revisión, aunque aún no se hayan realizado.
- **Fechas superpuestas (punto abierto 9):** no se validan.
- **Reparación:** `enReparacion` siempre es `false` en este sprint, porque las reglas no permiten modificar naves.
- **Margen de fecha en las reglas:** las reglas admiten un día antes de la fecha UTC. La fecha exacta la exige la app.
