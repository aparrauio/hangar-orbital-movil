# Hangar Orbital: épicas del MVP

Fuente: `docs/prd/hangar-mvp.md`. Los puntos de alcance corresponden a su sección 4 y las reglas, a su sección 6.

## E1 · Flota y misiones

**Objetivo:** que los jefes de hangar tengan registradas y a la vista las naves del hangar y puedan asignarles misiones dentro de los límites permitidos.

**Puntos del alcance que cubre:**
- Punto 1, parte "registrar naves".
- Punto 3, completo: "asignar misiones a las naves, respetando las reglas de negocio".
- Punto 4, parte de consulta: ver las naves registradas.

**Reglas de negocio que le aplican:**
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave recién registrada cuenta como revisada en su fecha de registro.
- Una nave en dique seco no puede recibir misiones.
- Asignar una misión no cambia el combustible: se actualiza a mano.

## E2 · Mantenimiento

**Objetivo:** que los jefes de hangar sepan qué naves no están aptas para despegar y mantengan al día su combustible, sus revisiones y su reparación.

**Puntos del alcance que cubre:**
- Punto 1, parte "actualizar a mano su combustible".
- Punto 2, completo: "registrar revisiones y entradas y salidas de dique seco".
- Punto 4, parte de aptitud: saber qué naves están aptas y cuáles no.

**Reglas de negocio que le aplican:**
- El combustible es un porcentaje entero de 0 a 100.
- Una nave está apta si tiene al menos 25 % de combustible (con exactamente 25 % está apta) y no supera 3 misiones desde su última revisión.
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión. Aquí aplica porque registrar la revisión es lo que libera a la nave.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave recién registrada cuenta como revisada en su fecha de registro. Aquí aplica como punto de partida del conteo de misiones.
- Una nave en dique seco no puede recibir misiones. Aquí aplica porque las entradas y salidas de dique seco determinan esa condición.
- Asignar una misión no cambia el combustible: se actualiza a mano.

## Cobertura del alcance

Ningún punto del alcance quedó fuera de ambas épicas. Los puntos 1 y 4 se reparten entre E1 y E2, el punto 3 queda completo en E1 y el punto 2, completo en E2.
