# Auditoría del sprint 1

**Fecha:** 2026-11-12

**Alcance:** el código de `src/`, `App.tsx` y `firestore.rules`, comparado con `docs/prd/hangar-mvp.md`, `docs/specs/01-flota-y-misiones.md` y los criterios de `docs/backlog/E1-flota-y-misiones.md`.

**Verificación:**
- `npm test`: 5 archivos y 40 tests pasan. Vitest avisa sobre el formato de `vitest.config.ts` (H-12).
- `npx tsc --noEmit`: sin errores.

**Lo que cumple:**
- Respeta las capas: las pantallas no llaman a Firebase y `src/dominio/` no importa `react-native` ni `firebase`.
- No usa `any`, y la configuración de Firebase se lee de variables `EXPO_PUBLIC_FIREBASE_*`.
- Los tipos, firmas, códigos de error y mensajes coinciden con la spec 01.
- Todos los criterios que la sección 8 de la spec asigna a Vitest tienen test.

## Hallazgos

| Id | Hallazgo | Evidencia | Gravedad | Decisión |
|---|---|---|---|---|
| H-01 | El límite de 3 misiones se puede superar: si dos jefes asignan a la vez, la nave puede quedar con 4. Además, las reglas de Firestore no aplican el límite, así que un cliente directo puede saltárselo. | `src/services/misionesService.ts`: `crearMision` y `contarMisionesDesdeRevision` (`getCountFromServer` no forma parte de la transacción). `firestore.rules`: `match /misiones/{misionId}`. | Alta | Riesgo conocido, no se corrige en este sprint (decisión del cliente). |
| H-02 | Una nave con menos de 25 % de combustible puede recibir misiones. | `src/dominio/puedeRecibirMision.ts`: `puedeRecibirMision` no recibe el combustible. Spec 01, §10. | Media | Se corrige. El cliente decidió que con menos de 25 % no recibe misiones, con exactamente 25 % sí, y que las misiones que ya tenía siguen contando. La spec 01 y el backlog ya lo incluyen (CA-1.3.13, CA-1.3.14 y ticket T-08); falta implementarlo. |
| H-03 | Una nave que llega a 3 misiones queda bloqueada para siempre, porque no se pueden registrar revisiones y las reglas prohíben modificar naves. Por la misma razón, `enReparacion` siempre es `false`. | `firestore.rules`: `allow update, delete: if false` en `match /naves/{naveId}`. | Media | Sin decisión del cliente. Depende de E2. |
| H-04 | CA-1.1.1 pide confirmar el registro "con esos datos", pero la confirmación solo muestra el nombre. El código sigue la tabla de mensajes de la spec, que contradice el criterio. | `src/screens/mensajes.ts`: `mensajeNaveRegistrada`. Spec 01, §6. | Media | Sin decisión del cliente. |
| H-05 | No hay evidencia de las pruebas manuales en Expo Go de CA-1.1.1, CA-1.1.6, CA-1.1.9, CA-1.3.1, CA-1.3.3 y CA-1.3.6. | `docs/backlog/E1-flota-y-misiones.md`: las Definition of Done de T-04 y T-07 siguen sin marcar y no hay resultados anotados. | Media | Sin decisión del cliente. |
| H-06 | Las reglas no comprueban que el id de la nave sea el nombre normalizado, así que un cliente directo puede saltarse la unicidad del nombre. La lectura y la creación están abiertas a cualquiera. | `firestore.rules`: `esNaveValida`. | Baja | Se anota. Se corrige si sobra tiempo. |
| H-07 | Algunos nombres que el mensaje de error dice que están permitidos se rechazan: `Aurora - Uno` (que se convierte en `aurora---uno`), `Aurora-` y `Ωmega`. | `src/dominio/normalizarNombre.ts`, `src/dominio/validarNave.ts` y el mensaje `nombre-invalido` en `src/screens/mensajes.ts`. | Baja | Se anota. Se corrige si sobra tiempo. |
| H-08 | Una nave inexistente se informa con el mensaje de error de conexión. Así lo pide la spec, pero confunde al jefe. | `src/services/misionesService.ts`: `crearMision`. | Baja | Se anota. Se corrige si sobra tiempo. |
| H-09 | Una duración muy grande (por ejemplo `100000000000000000000`) pasa la validación del dominio, las reglas la rechazan por no ser entera y el jefe ve el mensaje de conexión. Es una deducción a partir del código, no se probó contra Firestore. | `src/dominio/validarMision.ts`; `firestore.rules`: `esMisionValida`. | Baja | Se anota. Se corrige si sobra tiempo. |
| H-10 | Las misiones se cuentan por `creadaEn`, así que tras una revisión dejarían de contar las misiones que ya estaban programadas (punto abierto 1). Hoy no tiene efecto porque no se pueden registrar revisiones. | `src/services/misionesService.ts`: `contarMisionesDesdeRevision`. Spec 01, §10. | Baja | Se anota. Se corrige si sobra tiempo. |
| H-11 | No hay tests de los servicios ni de las reglas con el emulador de Firestore, y nada confirma que las reglas publicadas sean las del repositorio. | `vitest.config.ts` solo incluye `src/**/*.test.ts`. | Baja | Se anota. Se corrige si sobra tiempo. |
| H-12 | Vitest avisa que `vitest.config.ts` usa sintaxis ESM en un archivo cargado como CommonJS. Dejará de funcionar en una versión futura de Vite. | Salida de `npm test`. | Baja | Se anota. Se corrige si sobra tiempo. |

## Riesgos conocidos

- **El conteo de misiones no es atómico (H-01).** Si dos jefes asignan a la vez a una nave con 2 misiones, puede quedar con 4. El cliente lo acepta como riesgo durante este sprint.
- **El límite de 3 misiones solo lo aplica la app (H-01).** Las reglas de Firestore no pueden contar documentos.
- **Las reglas de Firestore son temporales (H-06).** Sin inicio de sesión no distinguen quién accede, y cualquiera con la configuración pública puede leer y crear naves y misiones.
- **Revisiones y dique seco dependen de E2 (H-03).** Mientras E2 no exista, una nave con 3 misiones no puede volver a recibir misiones y CA-1.3.5 solo se comprueba en el dominio.
- **Misiones programadas al pasar revisión (H-10).** Queda pendiente el punto abierto 1 del PRD.
- **Margen de fecha en las reglas.** Las reglas admiten fechas hasta un día antes de la fecha UTC; la fecha exacta solo la exige la app.
- **La regla de combustible aún no está implementada (H-02).** Hasta que se actualicen la spec, el código y las reglas, una nave con menos de 25 % sigue pudiendo recibir misiones.
- **Despegues sin registrar.** Sin ese dato no se puede comprobar la métrica de éxito del PRD (punto abierto 3).
