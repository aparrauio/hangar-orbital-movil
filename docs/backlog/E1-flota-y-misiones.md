# E1 · Flota y misiones: historias de usuario

Fuentes: `docs/prd/hangar-mvp.md` y `docs/backlog/epicas.md`. Los puntos de alcance corresponden a la sección 4 del PRD y los puntos abiertos, a su sección 8.

## Dentro del alcance

### HU-1.1 · Registrar una nave
Como jefe de hangar, quiero registrar una nave nueva, para que forme parte de la flota que se controla.

- **Validación:** dentro de alcance, punto 1 ("registrar naves"). La nave cuenta como revisada en su fecha de registro.
- **Depende de:** ninguna.

### HU-1.2 · Ver las naves registradas
Como jefe de hangar, quiero ver las naves registradas, para saber con qué flota cuento.

- **Validación:** dentro de alcance, punto 4 (parte de consulta asignada a E1).
- **Depende de:** HU-1.1.

### HU-1.3 · Asignar una misión a una nave
Como jefe de hangar, quiero asignar una misión a una nave, para dejar constancia de lo que tiene programado.

- **Validación:** dentro de alcance, punto 3. La misión cuenta desde que se asigna y no cambia el combustible de la nave.
- **Depende de:** HU-1.1.
- **Puntos abiertos que la afectan:** 4 (nave con menos de 25 %) y 8 (información mínima de una misión).

### HU-1.4 · Impedir una cuarta misión sin revisión
Como jefe de hangar, quiero que no se pueda asignar una misión a una nave que ya tiene 3 desde su última revisión, para evitar que encadene misiones sin pasar por revisión.

- **Validación:** dentro de alcance, punto 3 ("respetando las reglas de negocio").
- **Depende de:** HU-1.3. Para volver a asignarle misiones a la nave hace falta registrar una revisión, que pertenece a E2.
- **Puntos abiertos que la afectan:** 1 (misiones programadas al pasar revisión) y 6 (misiones canceladas o abortadas).

### HU-1.5 · Impedir misiones a naves en dique seco
Como jefe de hangar, quiero que no se pueda asignar una misión a una nave en dique seco, para no programar naves que están en reparación.

- **Validación:** dentro de alcance, punto 3 ("respetando las reglas de negocio").
- **Depende de:** HU-1.3. Registrar la entrada y salida de dique seco pertenece a E2.
- **Puntos abiertos que la afectan:** 5 (misiones pendientes de una nave en dique seco).

## Fuera de alcance

Estas historias surgieron al descomponer la épica, pero ningún punto del alcance del PRD las incluye. No se implementan salvo que el cliente las agregue al alcance.

### HU-1.6 · Ver las misiones de una nave · fuera de alcance
Como jefe de hangar, quiero ver las misiones asignadas a una nave, para saber qué tiene programado y cuántas lleva desde su última revisión.

- **Validación:** fuera de alcance. El PRD incluye asignar misiones, pero no consultarlas.

### HU-1.7 · Cancelar una misión · fuera de alcance
Como jefe de hangar, quiero cancelar una misión asignada, para que la nave no conserve una misión que ya no se hará.

- **Validación:** fuera de alcance. El PRD no incluye cancelar misiones, y el punto abierto 6 aún no define cómo afectaría al límite de 3.
