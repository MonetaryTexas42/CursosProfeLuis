# 07 · UX y accesibilidad

## 1. Resumen

La interfaz tiene una **identidad visual coherente**, dos temas (oscuro/claro), un layout responsive con 15 puntos de quiebre y un flujo de login claro por rol. Para un piloto, la experiencia es más que suficiente: el alumno entiende qué hacer, el profesor encuentra sus grupos y el admin tiene un panel denso pero organizado.

Las brechas están en **accesibilidad, consistencia de diálogos y feedback**:

- Solo dos reglas `:focus-visible`; muchos elementos interactivos no tienen indicador de foco.
- Los diálogos usan `aria-modal` pero no atrapan el foco ni lo restauran de forma sistemática.
- Los errores son genéricos y no ayudan a resolver.
- No hay `aria-live` explícito en actualizaciones dinámicas.
- Algunas tablas y grids se comprimen en móvil.
- No hay confirmación en acciones destructivas como cerrar una unidad.

**Nivel de riesgo UX:** **Medio**; no bloquea el piloto, pero afecta a usuarios con discapacidad y a la confianza en operaciones delicadas.

---

## 2. Principios visuales observados

### 2.1. Temas

- Tema oscuro por defecto (`:root` con `--bg: #0a0f1f`).
- Tema claro con `:root[data-theme="light"]` (`styles.css:43`).
- Persistencia en `localStorage` (`ecoems_theme`, `app.js:459-467`).
- Botón de cambio de tema en el header.

### 2.2. Layout

- Shell con header, sidebar colapsable y main.
- Sidebar persistente en escritorio; menú móvil en pantallas pequeñas.
- 15 media queries: 1040, 900, 860, 720, 640, 360 px.
- Tarjetas (`card`), listas (`data-list`), pestañas (`mode-tabs`, `staff-tab-btn`).

### 2.3. Tipografía y color

- Variables CSS para color, borde, fondo, texto, marca, éxito, error.
- Contraste no medido con herramienta; a simple vista, el texto principal sobre fondo oscuro es legible.
- Colores de materia por `subject.color`.

### 2.4. Movimiento

- `prefers-reduced-motion` en dos bloques (`styles.css:989`, `2214`).
- Animaciones de ficha, barras y toasts se reducen.
- No hay animaciones que bloqueen la interacción.

---

## 3. Accesibilidad

### 3.1. Lo que está bien

| Práctica | Evidencia |
|---|---|
| `lang="es"` | `index.html` |
| `meta viewport` | `index.html` |
| Roles de pestañas | `role="tablist"`, `role="tab"`, `aria-selected` (`app.js:534-536`) |
| Diálogos con `role="dialog"` y `aria-modal="true"` | `app.js:2731, 3601, 3625, 4703, 5401` |
| `aria-labelledby` en diálogos | Mismos bloques |
| Etiquetas en formularios | 57 `<label>` |
| `role="status"` en alertas | `alertMarkup` (`app.js:439`) |
| `prefers-reduced-motion` | `styles.css:989, 2214` |
| Foco visible en botones y pestañas | `styles.css:422-425` |
| Foco visible en inputs | `box-shadow` (`styles.css:362-365`) |

### 3.2. Brechas

| Brecha | Evidencia | Impacto |
|---|---|---|
| Pocos `:focus-visible` | Solo `.btn` y `.mode-tab` (`styles.css:422`) | Enlaces, tarjetas y controles personalizados pueden no mostrar foco |
| Sin focus trap en diálogos | `aria-modal` sin `inert` ni ciclo de foco | El tabulador sale del diálogo y recorre el fondo |
| Sin restauración de foco | Al cerrar, no se devuelve el foco al disparador | El usuario de teclado pierde el contexto |
| Sin `aria-live` explícito | `role="status"` ayuda, pero no cubre toasts ni cambios de tab | Cambios dinámicos no se anuncian |
| Contraste no verificado | Sin medición | Posible incumplimiento WCAG AA en textos secundarios |
| Textos pequeños | `fine-print`, `small` | Difícil de leer en móvil |
| Iconos sin texto alternativo | Emojis y SVG decorativos | Lectores de pantalla pueden leer emojis sin contexto |
| Tablas no semánticas | Listas y grids con `div` | Sin encabezados de tabla para lectores |
| Sin “saltar al contenido” | No hay skip link | Navegación por teclado más lenta |
| Sin atajos documentados | No hay ayuda de teclado | Usuarios avanzados no los descubren |

### 3.3. Formularios

- Los campos tienen `<label>` y `name`.
- Algunos usan `placeholder` como única pista; no debe ser el único.
- Errores se muestran en un `alert` global, no junto al campo.
- No hay `aria-describedby` que una el error con el input.
- No hay `autocomplete` consistente (`new-password` en cambio de contraseña, sí).

### 3.4. Navegación por teclado

- Los botones son `<button>`, lo que ayuda.
- Las tarjetas clicables pueden ser `div` con `data-*` y listener; si no tienen `tabindex` ni `role`, no son accesibles por teclado. Revisar `data-open-unit`, `data-activate-unit`, `data-manage-assignment`.
- Los diálogos se abren con `requestAnimationFrame` y enfocan un botón, pero no atrapan el foco.
- `Escape` está implementado en el diálogo de pagos (`app.js:2835-2840`), pero no se verificó en todos.

---

## 4. Responsive

### 4.1. Lo que está bien

- 15 media queries cubren 1040, 900, 860, 720, 640, 360 px.
- Sidebar colapsable y menú móvil.
- Grids que pasan a una columna.
- Botones con tamaño táctil razonable (44 px en inputs).

### 4.2. Brechas

- Tablas de pagos y calificaciones pueden requerir scroll horizontal; no hay indicador.
- `data-list` con muchas columnas se comprime.
- Textos largos (nombres, correos) pueden desbordar; revisar `overflow-wrap`.
- En 360 px, algunos botones pueden quedar muy juntos.
- No hay pruebas en dispositivos reales.

---

## 5. Feedback y estados

### 5.1. Estados de carga

- `renderLoading()` muestra un estado inicial.
- `loadDashboard` no muestra skeleton por tarjeta; el usuario ve la pantalla anterior hasta que termina.
- Los botones se deshabilitan y cambian texto (“Guardando…”, “Conectando…”), lo cual es bueno.

### 5.2. Errores

- `setError` muestra un mensaje global.
- Muchos mensajes son genéricos: “No se pudo guardar”, “Revisa la conexión”.
- No hay código de error ni pasos siguientes.
- Los errores de Supabase se traducen parcialmente en login, pero no en el resto.

### 5.3. Éxito

- `setNotice` muestra un mensaje temporal.
- No hay confirmación persistente ni historial.
- Los toasts de ficha (`ficha-toast`) desaparecen solos.

### 5.4. Vacíos

- Mensajes “Sin grupos”, “Sin tutores”, “Sin vínculos” son claros.
- No siempre hay una acción sugerida (“Crear el primero” sí en admin).

---

## 6. Hallazgos de UX y accesibilidad

### UX-01 · Accesibilidad limitada: foco, contraste y semántica

- **Severidad:** Medio
- **Categoría:** UX / accesibilidad
- **Ubicación:** `frontend/src/styles.css:422-425` (solo 2 `:focus-visible`); `app.js` (diálogos, tarjetas); `index.html`
- **Evidencia:** solo `.btn` y `.mode-tab` tienen `:focus-visible`; no hay skip link; no hay `aria-live`; las tablas se construyen con `div`; el contraste no se midió.
- **Problema:** usuarios de teclado, lectores de pantalla y baja visión pueden no identificar el foco, no entender los cambios dinámicos o no navegar eficientemente.
- **Escenario:** un alumno con baja visión usa el teclado; al tabular por las tarjetas de unidad no ve dónde está; al abrir un diálogo, el foco se escapa al fondo.
- **Impacto:** exclusión, incumplimiento de buenas prácticas (WCAG 2.1 AA), mala experiencia.
- **Recomendación:**
  1. Añadir `:focus-visible` global para `a`, `button`, `[tabindex]`, `input`, `select`, `textarea`.
  2. Implementar focus trap y restauración en todos los diálogos.
  3. Añadir skip link (“Saltar al contenido”).
  4. Usar `aria-live="polite"` en alertas y toasts.
  5. Revisar contraste con una herramienta (axe, Lighthouse).
  6. Usar tablas semánticas o roles `table`/`row`/`cell` en grids de datos.
  7. Añadir `aria-label` a iconos interactivos.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### UX-02 · Diálogos sin focus trap ni cierre consistente con Escape

- **Severidad:** Medio
- **Categoría:** UX / accesibilidad
- **Ubicación:** `app.js:2731` (pagos), `3601/3625` (tests), `4703` (asignación), `5401` (ficha)
- **Evidencia:** todos usan `role="dialog" aria-modal="true"`, pero no hay `inert` en el fondo ni un ciclo de foco. El diálogo de pagos registra `Escape` (`app.js:2835-2840`); no se verificó en los demás.
- **Problema:** el foco puede salir del diálogo y activar elementos del fondo; el usuario de teclado puede quedar atrapado o perdido.
- **Escenario:** se abre la ficha; se tabula hasta el fondo; se activa un botón de la página sin querer.
- **Impacto:** errores, frustración, accesibilidad.
- **Recomendación:** crear un helper `openDialog` que:
  - Guarde el elemento disparador.
  - Enfoque el primer control.
  - Atrape `Tab`/`Shift+Tab`.
  - Cierre con `Escape`.
  - Restaure el foco al cerrar.
  - Marque el fondo con `inert` o `aria-hidden`.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### UX-03 · Mensajes de error genéricos y sin pasos siguientes

- **Severidad:** Bajo
- **Categoría:** UX / feedback
- **Ubicación:** `app.js` (múltiples `setError('No se pudo...')`)
- **Evidencia:** por ejemplo, “No se pudo guardar la activación.”, “No se pudo registrar el consentimiento. Revisa la conexión.”, “No se pudo iniciar sesión. Revisa tus datos o consulta a soporte.”
- **Problema:** el usuario no sabe si el problema es de red, permisos, datos o servidor; no hay código para soporte.
- **Escenario:** el profesor intenta activar una unidad y recibe “No se pudo guardar”; no sabe que el problema es que no hay versión publicada.
- **Impacto:** soporte reactivo, abandono.
- **Recomendación:** mapear errores de Supabase a mensajes accionables; incluir un código corto (`ERR-ACT-01`) y un enlace a ayuda; registrar el error completo en consola.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### UX-04 · Estados de carga inconsistentes

- **Severidad:** Bajo
- **Categoría:** UX / feedback
- **Ubicación:** `app.js` (`renderLoading`, `loadDashboard`)
- **Evidencia:** hay un estado inicial, pero no skeletons por tarjeta ni indicadores de progreso en consultas largas.
- **Problema:** el usuario no sabe si la app está cargando o congelada.
- **Escenario:** el dashboard admin tarda varios segundos; el usuario pulsa de nuevo y duplica acciones.
- **Impacto:** percepción de lentitud, acciones duplicadas.
- **Recomendación:** añadir skeletons o `aria-busy` por sección; deshabilitar acciones mientras carga; mostrar tiempo estimado si es largo.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### UX-05 · Tablas y grids que se comprimen en móvil

- **Severidad:** Bajo
- **Categoría:** UX / responsive
- **Ubicación:** `styles.css` (media queries), `app.js` (pagos, calificaciones, asistencia)
- **Evidencia:** grids con muchas columnas y listas `data-list`; no hay scroll horizontal explícito ni vista de tarjetas en móvil.
- **Problema:** en pantallas pequeñas, la información se vuelve ilegible o se desborda.
- **Escenario:** un tutor revisa pagos en su teléfono y no puede leer la tabla completa.
- **Impacto:** mala experiencia móvil, que es el canal probable de los tutores.
- **Recomendación:** convertir tablas en tarjetas apiladas en `< 640px`; usar `overflow-x: auto` con indicador; acortar etiquetas.
- **Prioridad:** P3
- **Confianza:** Media
- **Estado:** Abierto

---

### UX-06 · Falta un indicador “solo lectura” consistente

- **Severidad:** Bajo
- **Categoría:** UX / claridad
- **Ubicación:** `app.js:3942` (pill “Solo lectura” en tutor); otras vistas no lo tienen
- **Evidencia:** el panel del tutor muestra “Solo lectura” en la cabecera, pero las secciones de pagos y ficha no repiten el estado; el alumno no tiene indicador en unidades cerradas.
- **Problema:** el usuario no siempre sabe si puede editar.
- **Escenario:** un tutor intenta editar un pago y no entiende por qué no hay controles.
- **Impacto:** confusión menor.
- **Recomendación:** mostrar un badge de modo (Edición / Solo lectura) en cada vista; deshabilitar visualmente los controles no disponibles.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### UX-07 · Acciones destructivas sin confirmación

- **Severidad:** Bajo
- **Categoría:** UX / prevención de errores
- **Ubicación:** `app.js:4960-4995` (cerrar unidad); `6389-6390` (activar/desactivar usuario sí confirma)
- **Evidencia:** cerrar o reabrir una unidad no pide confirmación; desactivar usuario sí.
- **Problema:** un clic accidental puede cerrar una unidad y afectar a todo el grupo.
- **Escenario:** el profesor pulsa “Cerrar” sin querer; los alumnos pierden acceso hasta que la reabra.
- **Impacto:** interrupción del estudio, soporte.
- **Recomendación:** confirmar acciones que afecten a varios alumnos; mostrar el alcance (“se cerrará para 20 alumnos”); ofrecer deshacer.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### UX-08 · Sin ayuda contextual sobre intentos y completado

- **Severidad:** Bajo
- **Categoría:** UX / aprendizaje
- **Ubicación:** `app.js` (quiz, botón “Completar unidad”)
- **Evidencia:** la UI muestra “Reintentar” sin explicar cuántos intentos quedan ni cómo afecta; “Completar unidad” no dice qué falta.
- **Problema:** el alumno no entiende las reglas del juego.
- **Escenario:** el alumno reintenta un quiz varias veces sin saber que solo cuenta el primer intento (o que no hay límite).
- **Impacto:** frustración, sensación de injusticia.
- **Recomendación:** mostrar la política antes de empezar (“Tienes 3 intentos; cuenta el mejor”), el progreso (“2 de 5 ejercicios”) y un resumen al completar.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

## 7. Matriz de heurísticas

| Heurística | Evaluación | Comentario |
|---|---|---|
| Visibilidad del estado | Parcial | Cargas y guardados existen, pero no siempre son visibles |
| Correspondencia con el mundo real | Buena | Lenguaje educativo claro (“unidad”, “tutor”, “materia”) |
| Control y libertad | Parcial | Diálogos cerrables; faltan deshacer y confirmaciones |
| Consistencia y estándares | Parcial | Componentes repetidos, pero patrones de diálogo variables |
| Prevención de errores | Parcial | Validaciones básicas; faltan confirmaciones y ayudas |
| Reconocimiento vs. recuerdo | Buena | Etiquetas y agrupación por materia/grupo |
| Flexibilidad y eficiencia | Parcial | Sin atajos ni acciones masivas avanzadas |
| Diseño estético y minimalista | Buena | Interfaz limpia, sin ruido |
| Ayuda para reconocer y recuperarse de errores | Débil | Mensajes genéricos |
| Ayuda y documentación | Débil | Sin ayuda contextual ni enlaces a guías |

---

## 8. Recomendaciones de UX

1. **Accesibilidad primero:** foco global, focus trap, skip link, `aria-live`, contraste.
2. **Unificar diálogos** con un helper común.
3. **Errores accionables** con código y pasos.
4. **Skeletons** en dashboards y listas.
5. **Tablas → tarjetas** en móvil.
6. **Confirmaciones** en acciones que afectan a varios alumnos.
7. **Ayuda contextual** en quizzes y completado.
8. **Badge de modo** en cada vista.
9. **Probar con teclado y lector de pantalla** antes del piloto.
10. **Medir contraste** con axe o Lighthouse y corregir lo que falle.

---

## 9. Conclusión

La UX es **clara y agradable para el caso feliz**. El alumno sabe qué hacer, el profesor encuentra lo importante y el diseño no estorba. Las brechas son de **accesibilidad y de confianza en operaciones delicadas**, no de concepto.

Con un pequeño conjunto de mejoras —foco, diálogos, errores, móvil y confirmaciones— la plataforma puede pasar de “se ve bien” a “se siente sólida” para todos, incluidos quienes usan teclado o lector de pantalla.
