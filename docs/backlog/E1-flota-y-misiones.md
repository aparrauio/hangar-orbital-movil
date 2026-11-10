# E1 · Flota y misiones: historias de usuario

Fuentes: `docs/prd/hangar-mvp.md` y `docs/backlog/epicas.md`. Los puntos de alcance corresponden a la sección 4 del PRD y los puntos abiertos, a su sección 8.

## Dentro del alcance

### HU-1.1 · Registrar una nave
**Estado:** refinada para el sprint.

Como jefe de hangar, quiero registrar una nave nueva, para que forme parte de la flota que se controla.

- **Validación:** dentro de alcance, punto 1 ("registrar naves").
- **Depende de:** ninguna.

**Reglas del PRD:**
- El combustible es un porcentaje entero de 0 a 100.
- Una nave recién registrada cuenta como revisada en su fecha de registro.

**Decisiones del cliente:**
- Nombre, clase y combustible son obligatorios al registrar una nave.
- El nombre no se puede repetir.
- La clase es exploradora, carguera o transporte.

**Criterios de aceptación:**

| Id | DADO | CUANDO | ENTONCES |
|---|---|---|---|
| CA-1.1.1 | una nave sin registrar | el jefe la registra con nombre Aurora, clase carguera y 60 % de combustible | se confirma el registro con esos datos y la nave ya puede recibir misiones |
| CA-1.1.2 | una nave sin registrar | el jefe la registra con 0 % o con 100 % de combustible | el registro se acepta |
| CA-1.1.3 | una nave sin registrar | el jefe indica -1 % o 101 % de combustible | la nave no se registra y se le informa que debe ser de 0 a 100 |
| CA-1.1.4 | una nave sin registrar | el jefe indica 25,5 % de combustible | la nave no se registra y se le informa que debe ser un número entero |
| CA-1.1.5 | una nave sin registrar | el jefe no indica el nombre, la clase o el combustible | la nave no se registra y se le informa qué falta |
| CA-1.1.6 | una nave registrada hoy | el jefe consulta la confirmación del registro | la nave figura como revisada hoy y sin misiones desde esa revisión |
| CA-1.1.7 | una nave sin registrar | el jefe la registra como exploradora, carguera o transporte | el registro se acepta con esa clase |
| CA-1.1.8 | una nave sin registrar | el jefe intenta registrarla con otra clase | la nave no se registra y se le informa cuáles son las clases válidas |
| CA-1.1.9 | una nave registrada con nombre Aurora | el jefe intenta registrar otra nave con nombre Aurora | la nueva nave no se registra, se le informa que el nombre ya existe y Aurora no cambia |

### HU-1.2 · Ver las naves registradas
**Estado:** por refinar.

Como jefe de hangar, quiero ver las naves registradas, para saber con qué flota cuento.

- **Validación:** dentro de alcance, punto 4 (parte de consulta asignada a E1). La lista de `FlotaScreen` en la spec 01 adelanta parte de esta historia.
- **Depende de:** HU-1.1.

### HU-1.3 · Asignar una misión a una nave
**Estado:** refinada para el sprint.

Como jefe de hangar, quiero asignar una misión a una nave, para dejar constancia de lo que tiene programado.

- **Validación:** dentro de alcance, punto 3. La misión cuenta desde que se asigna y no cambia el combustible de la nave.
- **Depende de:** HU-1.1.
- **Puntos abiertos que la afectan:** 4 (nave con menos de 25 %) y 9 (misiones con fechas superpuestas).

**Reglas del PRD:**
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave en dique seco no puede recibir misiones.
- Asignar una misión no cambia el combustible: se actualiza a mano.

**Decisiones del cliente:**
- Una misión necesita nave, destino, fecha de despegue y duración.
- La fecha de despegue no puede ser anterior a hoy; hoy sí se permite.
- La duración es un número entero de días, mínimo 1.

**Criterios de aceptación:**

| Id | DADO | CUANDO | ENTONCES |
|---|---|---|---|
| CA-1.3.1 | una nave sin misiones desde su última revisión | el jefe le asigna una misión con destino, fecha de despegue futura y duración de 3 días | se confirma la asignación a esa nave |
| CA-1.3.2 | una nave con 2 misiones desde su última revisión | el jefe le asigna otra misión válida | la tercera misión se asigna |
| CA-1.3.3 | una nave con 3 misiones desde su última revisión | el jefe intenta asignarle otra | la misión no se asigna y se le informa que la nave necesita una revisión |
| CA-1.3.4 | una nave con 3 misiones programadas y ninguna realizada | el jefe intenta asignarle otra | la misión no se asigna |
| CA-1.3.5 | una nave en reparación | el jefe intenta asignarle una misión | la misión no se asigna y se le informa el motivo |
| CA-1.3.6 | una nave con 60 % de combustible | el jefe le asigna una misión | la nave sigue con 60 % |
| CA-1.3.7 | una misión por asignar | el jefe no indica la nave, el destino, la fecha de despegue o la duración | la misión no se asigna y se le informa qué falta |
| CA-1.3.8 | una nave que puede recibir misiones | el jefe indica como fecha de despegue el día de ayer | la misión no se asigna y se le informa que la fecha no puede ser anterior a hoy |
| CA-1.3.9 | una nave que puede recibir misiones | el jefe indica como fecha de despegue el día de hoy | la misión se asigna |
| CA-1.3.10 | una nave que puede recibir misiones | el jefe indica una duración de 0 días | la misión no se asigna y se le informa que el mínimo es 1 día |
| CA-1.3.11 | una nave que puede recibir misiones | el jefe indica una duración de 1 día | la misión se asigna |
| CA-1.3.12 | una nave que puede recibir misiones | el jefe indica una duración de 1,5 días | la misión no se asigna y se le informa que debe ser un número entero de días |

**Límites de comprobación:**
- CA-1.3.5 solo se puede comprobar cuando E2 permita registrar la entrada a dique seco.
- CA-1.3.6 se comprueba con el combustible que muestra la lista de naves de `FlotaScreen`.

### HU-1.4 · Impedir una cuarta misión sin revisión
**Estado:** por refinar. CA-1.3.3 y CA-1.3.4 ya cubren su regla.

Como jefe de hangar, quiero que no se pueda asignar una misión a una nave que ya tiene 3 desde su última revisión, para evitar que encadene misiones sin pasar por revisión.

- **Validación:** dentro de alcance, punto 3 ("respetando las reglas de negocio").
- **Depende de:** HU-1.3. Para volver a asignarle misiones a la nave hace falta registrar una revisión, que pertenece a E2.
- **Puntos abiertos que la afectan:** 1 (misiones programadas al pasar revisión) y 6 (misiones canceladas o abortadas).

### HU-1.5 · Impedir misiones a naves en dique seco
**Estado:** por refinar. CA-1.3.5 ya cubre su regla.

Como jefe de hangar, quiero que no se pueda asignar una misión a una nave en dique seco, para no programar naves que están en reparación.

- **Validación:** dentro de alcance, punto 3 ("respetando las reglas de negocio").
- **Depende de:** HU-1.3. Registrar la entrada y salida de dique seco pertenece a E2.
- **Puntos abiertos que la afectan:** 5 (misiones pendientes de una nave en dique seco).

## Fuera de alcance

Estas historias surgieron al descomponer la épica, pero ningún punto del alcance del PRD las incluye. No se implementan salvo que el cliente las agregue al alcance.

### HU-1.6 · Ver las misiones de una nave · fuera de alcance
**Estado:** por refinar.

Como jefe de hangar, quiero ver las misiones asignadas a una nave, para saber qué tiene programado y cuántas lleva desde su última revisión.

- **Validación:** fuera de alcance. El PRD incluye asignar misiones, pero no consultarlas.

### HU-1.7 · Cancelar una misión · fuera de alcance
**Estado:** por refinar.

Como jefe de hangar, quiero cancelar una misión asignada, para que la nave no conserve una misión que ya no se hará.

- **Validación:** fuera de alcance. El PRD no incluye cancelar misiones, y el punto abierto 6 aún no define cómo afectaría al límite de 3.

## Tickets del sprint

**Spec:** `docs/specs/01-flota-y-misiones.md` cubre HU-1.1 y HU-1.3. T-02, T-03, T-05 y T-06 se implementan según esa spec, y cada criterio se verifica como indica su sección 8.

### T-01 · Preparar la base del proyecto
- **Historia:** HU-1.1
- **Tipo:** Configuración
- **Descripción:** capa de configuración. Dejar el proyecto listo para probar funciones de dominio y conectarse a Firestore, con la estructura de carpetas prevista.
- **Dependencias:** ninguna.
- **Definition of Done:**
  - [ ] Firebase, Vitest y Prettier están instalados; las dependencias de Expo, con `npx expo install`.
  - [ ] `npm test` ejecuta Vitest correctamente.
  - [ ] `src/firebase/config.ts` lee solo variables `EXPO_PUBLIC_FIREBASE_*`, sin valores en el código.
  - [ ] `firestore.rules` existe y solo permite el acceso que necesitan naves y misiones.
  - [ ] `.env` no está en el repositorio.
  - [ ] `npx tsc --noEmit` pasa sin errores.

### T-02 · Reglas de registro de una nave
- **Historia:** HU-1.1
- **Tipo:** Modelo/Dominio
- **Descripción:** capas `src/types/` y `src/dominio/`. Definir qué es una nave y validar sus datos de registro con funciones puras.
- **Dependencias:** T-01.
- **Definition of Done:**
  - [ ] La validación cubre las reglas de CA-1.1.2, CA-1.1.3, CA-1.1.4, CA-1.1.5, CA-1.1.7 y CA-1.1.8.
  - [ ] `normalizarNombre` tiene tests con variantes de un mismo nombre (CA-1.1.9).
  - [ ] Los tests de dominio incluyen los límites 0, 100, -1, 101 y 25,5.
  - [ ] `src/dominio/` no importa `react-native` ni `firebase`, y no se usa `any`.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

### T-03 · Guardar y registrar una nave desde el teléfono
- **Historia:** HU-1.1
- **Tipo:** Datos/Pantalla
- **Descripción:** capas `src/services/`, `src/screens/` y `src/components/`. Permitir que el jefe registre una nave, que se guarde, que vea la confirmación o el motivo del rechazo, y que vea la lista de naves.
- **Dependencias:** T-01, T-02.
- **Definition of Done:**
  - [ ] Un registro válido se guarda con la última revisión en la hora del servidor y se confirma con sus datos (CA-1.1.1 y CA-1.1.6).
  - [ ] La lista muestra nombre, clase, combustible y fecha de última revisión de cada nave.
  - [ ] Un nombre repetido se rechaza y la nave existente no cambia (CA-1.1.9).
  - [ ] Cada rechazo le indica al jefe el motivo.
  - [ ] La pantalla no llama a Firebase: solo usa `src/services/`.
  - [ ] No se usa `any`.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

### T-04 · Aceptación del registro en Expo Go
- **Historia:** HU-1.1
- **Tipo:** Test
- **Descripción:** prueba de punta a punta en un teléfono. Comprobar que el registro cumple lo que el jefe de hangar puede observar.
- **Dependencias:** T-03.
- **Definition of Done:**
  - [ ] CA-1.1.1, CA-1.1.6 y CA-1.1.9 se comprobaron en Expo Go.
  - [ ] Los demás criterios de HU-1.1 pasan en Vitest, como indica la sección 8 de la spec.
  - [ ] Los defectos encontrados están corregidos o anotados.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

### T-05 · Reglas de asignación de una misión
- **Historia:** HU-1.3
- **Tipo:** Modelo/Dominio
- **Descripción:** capas `src/types/` y `src/dominio/`. Definir qué es una misión y decidir con funciones puras si una nave puede recibirla.
- **Dependencias:** T-01, T-02.
- **Definition of Done:**
  - [ ] La validación cubre los datos obligatorios, la fecha y la duración (CA-1.3.7 a CA-1.3.12).
  - [ ] Una nave con 2 misiones recibe otra y una con 3 no, sean realizadas o programadas (CA-1.3.2 a CA-1.3.4).
  - [ ] Una nave en reparación no recibe misiones (CA-1.3.5).
  - [ ] `fechaLocalComoTexto` devuelve la fecha local del teléfono, sin usar UTC.
  - [ ] Los tests de dominio incluyen ayer, hoy y las duraciones 0, 1 y 1,5.
  - [ ] `src/dominio/` no importa `react-native` ni `firebase`, y no se usa `any`.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

### T-06 · Guardar y asignar una misión desde el teléfono
- **Historia:** HU-1.3
- **Tipo:** Datos/Pantalla
- **Descripción:** capas `src/services/`, `src/screens/` y `src/components/`. Permitir que el jefe elija una nave registrada y le asigne una misión, aplicando las reglas de dominio.
- **Dependencias:** T-03, T-05.
- **Definition of Done:**
  - [ ] Una misión válida se guarda y se confirma para esa nave (CA-1.3.1).
  - [ ] La cuenta de misiones considera todas las asignadas desde la última revisión.
  - [ ] Una nave con 3 misiones desde su última revisión no recibe otra, no se guarda nada y el jefe ve que necesita una revisión (CA-1.3.3 y CA-1.3.4).
  - [ ] Guardar una misión no modifica el combustible de la nave (CA-1.3.6).
  - [ ] Cada rechazo le indica al jefe el motivo.
  - [ ] La pantalla no llama a Firebase: solo usa `src/services/`.
  - [ ] No se usa `any`.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

### T-07 · Aceptación de la asignación en Expo Go
- **Historia:** HU-1.3
- **Tipo:** Test
- **Descripción:** prueba de punta a punta en un teléfono. Comprobar que la asignación cumple lo que el jefe de hangar puede observar.
- **Dependencias:** T-06.
- **Definition of Done:**
  - [ ] CA-1.3.1, CA-1.3.3 y CA-1.3.6 se comprobaron en Expo Go.
  - [ ] Los demás criterios de HU-1.3 pasan en Vitest, como indica la sección 8 de la spec.
  - [ ] CA-1.3.5 queda anotado como pendiente de punta a punta hasta que exista E2.
  - [ ] Los defectos encontrados están corregidos o anotados.
  - [ ] `npm test` y `npx tsc --noEmit` pasan.

### Orden de ejecución sugerido
1. T-01
2. T-02
3. T-03 y T-05, que pueden avanzar en paralelo
4. T-04
5. T-06
6. T-07
