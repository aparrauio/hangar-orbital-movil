# Hangar Orbital: mini-PRD del MVP

## 1. Problema
Los jefes de hangar deciden de memoria qué nave despega. El mes pasado una nave salió con el tanque casi vacío y otra encadenó seis misiones sin pasar por revisión.

## 2. Usuarios
De 3 a 5 jefes de hangar del Centro de Comando Espacial, desde su teléfono en la pista. Todos tienen el mismo permiso.

## 3. Objetivo y métrica de éxito
- **Objetivo:** saber en cualquier momento qué naves están aptas para despegar.
- **Métrica:** en un mes, cero despegues de naves no aptas.

## 4. Alcance del MVP
1. Registrar naves y actualizar a mano su combustible.
2. Registrar revisiones y entradas y salidas de dique seco.
3. Asignar misiones a las naves, respetando las reglas de negocio.
4. Consultar en cualquier momento qué naves están aptas.

## 5. No-alcance
Tripulación (ya la gestiona el Centro de Comando), usuarios e inicio de sesión, notificaciones, mapas o trayectorias, cálculo automático del consumo de combustible y versión web o de escritorio.

## 6. Reglas de negocio
- El combustible es un porcentaje entero de 0 a 100.
- Una nave está apta si tiene al menos 25 % de combustible (con exactamente 25 % está apta) y no supera 3 misiones desde su última revisión.
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave recién registrada cuenta como revisada en su fecha de registro.
- Una nave en dique seco no puede recibir misiones.
- Asignar una misión no cambia el combustible: se actualiza a mano.

## 7. Supuestos
- [SUPUESTO] Una nave con exactamente 3 misiones sigue apta: solo deja de recibir misiones nuevas.
- [SUPUESTO] Cuando una nave no está apta, la app indica el motivo.
- [SUPUESTO] Los jefes consultan la app antes de cada despegue. La app informa, pero no puede impedir físicamente un despegue.
- [SUPUESTO] El combustible registrado refleja el nivel real de la nave en el momento de la consulta.

## 8. Puntos abiertos
1. Si una nave con misiones programadas pasa revisión, ¿esas misiones siguen contando? Si no cuentan, podría recibir 3 más y encadenar 6 sin otra revisión.
2. ¿Quién actualiza el combustible, cuándo y qué se indica si el dato no se actualizó desde la última misión?
3. ¿Se registran los despegues? Sin ese dato no se puede comprobar la métrica de éxito.
4. ¿Una nave con menos de 25 % puede recibir misiones? ¿Qué pasa con las que ya tenía si baja de ese nivel?
5. ¿Una nave en dique seco es siempre no apta? ¿Salir de dique seco cuenta como revisión? ¿Qué pasa con sus misiones pendientes?
6. ¿Las misiones canceladas o abortadas siguen contando para el límite de 3?
7. ¿Qué hace válida una revisión y basta con que cualquier jefe la registre?
8. ¿Qué información mínima debe indicarse al asignar una misión?
