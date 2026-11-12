# DESIGN.md · Hangar Orbital

Sistema de diseño de la app móvil. Léelo antes de crear o modificar cualquier archivo de `src/screens/`, `src/components/` o `src/tema/`.

- **Fuente de verdad de los valores:** `src/tema/`. Este documento explica las decisiones; el código guarda los valores.
- **Si algo no está aquí:** no lo inventes. Usa el componente o token más cercano y anota el hueco en "Decisiones pendientes".

## 1. Principios

1. **Legible en la pista.** Los jefes de hangar usan la app al aire libre y con prisa: alto contraste, texto de 16 como base y nada que dependa de matices de color.
2. **El estado se ve sin leer.** Si una nave puede o no recibir misiones, se nota en la tarjeta antes de leer los números.
3. **Cada rechazo dice el motivo.** Ningún botón se desactiva sin explicar por qué.
4. **Un toque, una acción.** Todo lo que se toca mide al menos 44 × 44.
5. **Continuidad.** Este sistema formaliza los colores y tamaños que la app ya usa (azul `#1F4E79`, radio 6, títulos de 26). No es un rediseño.

## 2. Tokens

Se exportan desde `src/tema/index.ts` como `colores`, `espacio`, `radio`, `texto` y `toque`. Ningún archivo fuera de `src/tema/` escribe un color en hexadecimal ni un tamaño suelto.

### 2.1 Colores

| Token | Valor | Uso |
| --- | --- | --- |
| `colores.fondo` | `#F3F5F7` | Fondo de pantalla |
| `colores.superficie` | `#FFFFFF` | Tarjetas, campos, hojas |
| `colores.tinta` | `#0F1D2B` | Texto principal (15,6:1 sobre fondo) |
| `colores.tintaSuave` | `#4A5866` | Texto secundario, etiquetas de datos (6,7:1) |
| `colores.tintaTenue` | `#5F6E7C` | Sugerencias dentro de campos |
| `colores.borde` | `#D3DAE1` | Separadores y borde de tarjetas |
| `colores.bordeControl` | `#8593A0` | Borde de campos y controles (3:1 mínimo) |
| `colores.primario` | `#1F4E79` | Acción principal, selección, enlaces |
| `colores.primarioPresionado` | `#173B5C` | Botón primario presionado |
| `colores.primarioSuave` | `#E4ECF4` | Fondo de opción seleccionada secundaria |
| `colores.sobrePrimario` | `#FFFFFF` | Texto sobre primario (8,7:1) |
| `colores.apta` / `colores.aptaFondo` | `#1B6E3C` / `#E2F2E8` | Nave apta, confirmaciones |
| `colores.noApta` / `colores.noAptaFondo` | `#B3261E` / `#FBE8E6` | Nave no apta, errores |
| `colores.atencion` / `colores.atencionFondo` | `#8A5300` / `#FCF0DA` | Combustible bajo, avisos |

Reglas de color:

- Verde, rojo y ámbar son **semánticos**: solo para estado. Nunca decoran.
- El color nunca es la única señal: siempre va con texto y un símbolo (✓, ✕, !).
- Solo modo claro en el MVP (`userInterfaceStyle: light` en `app.json`).

### 2.2 Espacio

Escala de 4: `espacio.xs` 4 · `espacio.s` 8 · `espacio.m` 12 · `espacio.l` 16 · `espacio.xl` 24 · `espacio.xxl` 32.

- Margen lateral de pantalla: `l` (16).
- Separación entre campos de un formulario: `m` (12).
- Separación entre secciones: `xl` (24).
- Relleno interno de tarjeta: `l` (16).

### 2.3 Radio

`radio.control` 6 (botones, campos) · `radio.tarjeta` 10 · `radio.pastilla` 999 (insignias).

### 2.4 Texto

Fuente del sistema (San Francisco en iOS, Roboto en Android). No se cargan fuentes externas.

| Token | Tamaño / interlineado | Peso | Uso |
| --- | --- | --- | --- |
| `texto.titulo` | 26 / 32 | 700 | Título de pantalla, uno por pantalla |
| `texto.subtitulo` | 20 / 26 | 700 | Secciones |
| `texto.nombre` | 17 / 22 | 700 | Nombre de nave en tarjeta |
| `texto.cuerpo` | 16 / 22 | 400 | Texto general y campos |
| `texto.etiqueta` | 14 / 20 | 600 | Etiquetas de campos y datos |
| `texto.nota` | 13 / 18 | 400 | Ayudas y texto secundario |
| `texto.dato` | 16 / 22 | 600 + `tabular-nums` | Números que se comparan: combustible, misiones |

Convenciones: porcentaje con espacio (`60 %`), fechas visibles como `11/11/2026` con `toLocaleDateString('es')`, clases de nave con inicial mayúscula al mostrarlas (`Carguera`).

### 2.5 Toque

`toque.minimo` 44: alto mínimo de botones, opciones y filas tocables. `hitSlop` para elementos visuales menores.

## 3. Componentes

Todos viven en `src/components/`, reciben props en español y usan `StyleSheet.create` con tokens. Sin librerías de UI ni de íconos.

### `Boton`
- Props: `texto`, `alPresionar`, `variante` (`'primario' | 'secundario' | 'texto'`), `deshabilitado?`, `cargando?`.
- Primario: fondo `primario`, texto `sobrePrimario`. Secundario: borde `primario`, fondo `superficie`. Texto: sin borde, color `primario`.
- Estados: presionado (`primarioPresionado`), deshabilitado (opacidad 0,5) y cargando (texto "Guardando…", no acepta toques).
- Alto mínimo `toque.minimo`. `accessibilityRole="button"` y `accessibilityState`.

### `CampoTexto`
- Props actuales más `error?` y `ayuda?`.
- Etiqueta arriba (`texto.etiqueta`), campo con borde `bordeControl`, alto mínimo 44.
- Con error: borde `noApta` y mensaje debajo en `noApta` con "✕". La ayuda va en `texto.nota`.

### `SelectorClase`
- Tres opciones en fila (control segmentado): Exploradora, Carguera, Transporte.
- Seleccionada: fondo `primario`, texto `sobrePrimario`. Sin seleccionar: borde `bordeControl`.
- `accessibilityRole="radio"` en cada opción; alto 44.

### `MedidorCombustible`
- Props: `porcentaje` (0 a 100).
- Barra horizontal de 8 de alto, radio pastilla, con una **marca vertical en 25 %**, el mínimo para recibir misiones.
- Relleno `primario` si es 25 o más; `atencion` si es menor. Texto a la derecha con `texto.dato` (`60 %`).
- `accessibilityLabel`: "Combustible 60 por ciento".

### `InsigniaAptitud`
- Props: `resultado` (lo que devuelve `puedeRecibirMision`).
- Apta: "✓ Puede recibir misiones" en `apta` sobre `aptaFondo`.
- No apta: "✕" + el motivo en `noApta` sobre `noAptaFondo`. Textos: "Combustible bajo", "Necesita revisión", "En reparación".
- Forma de pastilla, `texto.etiqueta`.

### `TarjetaNave`
- Contenido, en este orden: nombre y clase · `InsigniaAptitud` · `MedidorCombustible` · "Misiones desde la revisión: 2 de 3" · "Última revisión: 11/11/2026" · `Boton` secundario "Asignar misión".
- Si la nave no es apta, el botón se desactiva y la insignia ya dice por qué.
- Fondo `superficie`, borde `borde`, radio `tarjeta`, sin sombras.

### `Aviso`
- Props: `tipo` (`'exito' | 'error' | 'atencion'`), `mensaje`.
- Franja con fondo suave del tipo, texto del color del tipo y símbolo ✓, ✕ o !.
- `accessibilityRole="alert"` para que el lector de pantalla lo anuncie.

### `EstadoPantalla`
- Props: `tipo` (`'cargando' | 'vacio' | 'error'`), `mensaje`, `accion?` (texto y función).
- Cargando: `ActivityIndicator` en `primario` + mensaje. Vacío: mensaje + acción opcional. Error: mensaje + `Boton` "Reintentar".

### `EncabezadoPantalla`
- Props: `titulo`, `alVolver?`.
- Si hay `alVolver`, un `Boton` variante texto "‹ Volver" de 44 de alto encima del título.
- Respeta el área segura superior: no usar `paddingTop` fijo.

## 4. Pantallas

- **Flota:** encabezado "Flota" · formulario de registro (nombre, `SelectorClase`, combustible, botón primario) · `Aviso` del resultado · sección "Naves registradas" con `TarjetaNave` por nave o `EstadoPantalla`.
- **Asignar misión:** encabezado con volver · resumen de la nave (nombre, insignia y medidor) · formulario (destino, fecha con ayuda "AAAA-MM-DD", duración) · botón primario · `Aviso`.
- Toda pantalla usa `colores.fondo`, margen lateral 16 y área segura arriba y abajo.

## 5. Voz y textos

- Tuteo e imperativo breve, como los mensajes actuales: "Escribe el destino de la misión."
- Un error dice qué pasó y qué hacer. Sin disculpas ni "Error:".
- Los botones dicen la acción exacta: "Registrar nave", "Asignar misión". Nunca "Aceptar" ni "Enviar".

## 6. Accesibilidad

- Contraste mínimo 4,5:1 para texto y 3:1 para bordes de controles. Los tokens ya lo cumplen.
- Todo control tiene `accessibilityRole` y una etiqueta que se entiende sin ver la pantalla.
- El estado (apta, error, seleccionado) se comunica con texto, no solo con color.

## 7. Sí y no

| Sí | No |
| --- | --- |
| `colores.noApta` desde `src/tema/` | `'#b3261e'` escrito en una pantalla |
| Desactivar "Asignar misión" y mostrar el motivo | Un botón gris sin explicación |
| Una insignia con símbolo y texto | Un punto rojo sin texto |
| Bordes para separar tarjetas | Sombras, degradados o fondos con imagen |
| Reutilizar `Boton` | Crear un `Pressable` con estilos nuevos en cada pantalla |

## 8. Decisiones pendientes

- Selector de fecha nativo (requiere una dependencia nueva).
- Modo oscuro.
- Íconos: hoy se usan símbolos de texto.
