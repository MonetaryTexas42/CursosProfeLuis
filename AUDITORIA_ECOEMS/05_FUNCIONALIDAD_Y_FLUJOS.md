# 05 · Funcionalidad y flujos

## 1. Resumen

La plataforma cubre el ciclo completo de un piloto: alta de alumnos y tutores, activación de unidades, estudio con ejercicios y quizzes, tests de personalidad y orientación vocacional, ficha del alumno, pagos y consentimiento. Los flujos principales funcionan en el código y están conectados a RPCs y Edge Functions.

Las brechas funcionales más importantes son:

1. **El tutor no ve lo que la ley y la promesa del producto sugieren:** calificaciones, asistencia y observaciones familiares. La base lo permite, la UI no lo muestra.
2. **Los pagos no responden a la operación real:** no hay saldo, periodo cubierto, detección de duplicados ni anulación.
3. **La activación parcial de una unidad deja una puerta abierta:** los alumnos que se incorporan después al grupo heredan el acceso.
4. **Los reintentos de quiz son ilimitados** y no hay política de intentos.
5. **El alumno puede marcar una unidad como completada** sin haberla trabajado.

**Nivel de riesgo funcional:** **Alto** para el piloto con tutores; **Medio** para el resto.

---

## 2. Flujo de acceso

### 2.1. Login de alumno

```
1. Elige pestaña "Alumno".
2. Escribe usuario (p. ej. "ana.lopez") y contraseña.
3. app.js:684-687 construye "ana.lopez@alumnos.ecoems.mx".
4. supabase.auth.signInWithPassword.
5. handleSession consulta profiles.
6. Si active=false → signOut + error.
7. Si must_change_password=true → pantalla de cambio.
8. Si no → fetchStudentDashboard.
```

**Observaciones:**

- El alumno no puede usar su correo real; el dominio es fijo (`VITE_STUDENT_EMAIL_DOMAIN`, por defecto `alumnos.ecoems.mx`). Ver `FUN-07`.
- No hay “olvidé mi contraseña”; el mensaje pide al profesor una temporal (`app.js:572`). Ver `FUN-06`.
- El cambio de contraseña es evitable (`SEC-03`).

### 2.2. Login de profesor y tutor

- Profesor: correo real + contraseña.
- Tutor: correo real + contraseña, o magic link generado por `invite-guardian`.
- El tutor no tiene autorregistro; la cuenta la crea el staff.

### 2.3. Sesión y cierre

- `onAuthStateChange` mantiene la sesión.
- `signOut` limpia estado y vuelve al login.
- No hay cierre por inactividad propio; depende de la expiración de Supabase (no verificada).

---

## 3. Flujo de alta de alumno

### 3.1. Camino A · Edge Function `admin-create-student`

```
1. Profesor/admin abre "Alumnos" → "Nuevo alumno".
2. Envía nombre, contraseña temporal, grupo, teléfono, fecha de nacimiento, matrícula, usuario.
3. requireCaller valida sesión y perfil activo.
4. assertAdminOrTeacherOfGroup valida permiso.
5. admin.auth.admin.createUser({ email: usuario@dominio, password, email_confirm: true }).
6. Inserta profiles (role=student), students, student_profiles.
7. Registra audit.
8. Devuelve credenciales para entregar.
```

**Observaciones:**

- La contraseña la elige el profesor; no se genera aleatoria.
- `email_confirm: true` evita el correo de confirmación; es coherente con el correo sintético.
- No se exige cambio de contraseña en el primer ingreso (`must_change_password` no se activa en este camino; revisar `admin-create-student/index.ts`).
- Si falla un paso, hay compensación manual (borra perfil) en el `catch`; revisar que no deje usuarios huérfanos.

### 3.2. Camino B · RPC `app_link_student_account`

```
1. Profesor/admin abre "Vincular cuenta".
2. Envía correo, nombre, grupo, matrícula, usuario.
3. La RPC busca auth.users por correo.
4. Si existe y no tiene perfil, crea profiles + students.
5. Fuerza email_confirmed_at.
6. Devuelve ids.
```

**Observaciones:**

- No verifica titularidad (`SEC-02`).
- No activa `must_change_password`.
- No registra auditoría.
- Puede vincular una cuenta creada por un tercero.

### 3.3. Casos límite

| Caso | Comportamiento actual | Riesgo |
|---|---|---|
| Correo ya tiene perfil | Error `P0002` | Correcto |
| Matrícula duplicada | Error `23505` | Correcto |
| Grupo de otro profesor | Error de permiso | Correcto |
| Usuario duplicado | Reintenta con sufijo | Correcto |
| Falla la creación de `student_profiles` | Puede quedar perfil sin ficha | Medio |
| Contraseña débil | Solo mínimo 8 en la función | Medio |

---

## 4. Flujo de activación de unidades

### 4.1. Activación para todo el grupo

```
1. Profesor entra a "Unidades".
2. Elige una unidad publicada y una versión.
3. Pulsa "Activar".
4. Se abre el diálogo con todos los alumnos seleccionados.
5. Inserta unit_assignments (group_id, unit_id, unit_version_id, status='active', visible=true).
6. Los alumnos del grupo ven la unidad.
```

### 4.2. Activación para un subconjunto

```
1. El profesor desmarca alumnos.
2. Se inserta la asignación de grupo.
3. Para cada alumno excluido, se hace upsert en student_unit_overrides con status='closed'.
4. El reproductor filtra por override.
```

**Problema (`FUN-03`):** la asignación es de grupo, no de alumno. Un alumno que se incorpore después no tiene override `closed`, así que **hereda el acceso** sin que el profesor lo haya seleccionado. Además, la asignación es visible para todo el grupo; el filtro es de cliente.

### 4.3. Cierre y reapertura

- `setAssignmentStatus` (`app.js:4960-4995`) cambia `status` a `closed` o `active` y ajusta `closes_at`.
- El progreso se conserva.
- No hay confirmación antes de cerrar (`UX-07`).

### 4.4. Casos límite

| Caso | Comportamiento | Riesgo |
|---|---|---|
| Unidad sin versión publicada | La UI bloquea (`if (!active.versionId)`) | Correcto |
| Asignación duplicada | Se crea otra fila | `DB-01` |
| Alumno sin grupo | No aparece en el diálogo | Bajo |
| Alumno inactivo | No debería aparecer; verificar | Bajo |
| Fechas invertidas | `check (closes_at > opens_at)` | Correcto |

---

## 5. Flujo de estudio

### 5.1. Abrir unidad

```
1. El alumno ve sus unidades activas en el dashboard.
2. Pulsa "Abrir".
3. openUnit(assignmentId) busca la unidad en state.dashboard.units.
4. Consulta unit_versions.content.
5. Llama app_start_unit(assignment_id).
6. Renderiza secciones, ejercicios, quiz y reto.
```

**Observaciones:**

- `openUnit` depende de que la unidad esté en `state.dashboard.units`, que viene filtrado por el frontend. Si la asignación no está, no abre.
- `app_start_unit` crea/actualiza `unit_progress` con `status='in_progress'`.
- El contenido se renderiza con `textBlock` y `escapeHtml`.

### 5.2. Ejercicios

```
1. El alumno responde.
2. app_record_exercise_attempt(assignment_id, exercise_key, answer, duration_ms).
3. El servidor busca el ejercicio en content.exercises o content.sections.
4. Compara índice o texto normalizado.
5. Calcula is_correct, attempt_no, accuracy.
6. Actualiza unit_progress.
7. Devuelve explicación y resultado.
```

**Bien:** la evaluación es de servidor; el cliente no decide.

### 5.3. Quiz

```
1. El alumno elige una opción.
2. app_submit_quiz_answer(assignment_id, part, question_key, selected_index).
3. El servidor evalúa contra correctIndex.
4. Devuelve is_correct, explanation, attempt_no.
5. La UI muestra "Reintentar" si falló.
```

**Problema (`FUN-04`):** no hay límite de intentos, penalización ni bloqueo tras acertar. El `attempt_no` se muestra, pero no se usa para nada.

### 5.4. Completar unidad

```
1. El alumno pulsa "Completar unidad".
2. app_complete_unit(assignment_id).
3. El servidor marca status='completed'.
```

**Problema (`FUN-05` / `DB-04`):** no se exige haber respondido ejercicios ni alcanzado precisión. La UI no advierte.

### 5.5. Casos límite

| Caso | Comportamiento | Riesgo |
|---|---|---|
| Contenido malformado | `jsonb_array_elements` puede fallar | Medio |
| Ejercicio sin `correctIndex` | Se trata como texto; puede marcar incorrecto | Medio |
| Quiz sin explicación | Se muestra vacío | Bajo |
| Asignación cerrada mientras estudia | La RPC falla; la UI muestra error genérico | Medio |
| Sesión expirada | Error de red; no hay reintento automático | Bajo |
| Reintento tras cerrar | La UI conserva `unitResults` solo en memoria | Bajo |

---

## 6. Flujo de tests (personalidad y vocacional)

```
1. El alumno abre "Tests".
2. Responde pasos.
3. Al terminar, se guarda en student_profiles (personality, aptitude, career_suggestions).
4. La ficha del profesor muestra los resultados.
```

**Observaciones:**

- `0016_student_tests.sql` crea RPC para que el alumno guarde sus resultados sin editar campos del staff.
- Los tests son orientativos; no hay validación psicométrica.
- La UI avanza automáticamente al responder (`7766a7a`).
- El tutor no ve estos resultados en su panel, aunque RLS podría permitirlo (`PRIV-03`).

---

## 7. Flujo de ficha del alumno

```
1. Profesor/admin abre "Alumnos" → ficha.
2. app_student_detail(student_id) devuelve avance e intentos.
3. La ficha muestra datos, tutores, plan, pagos, tests, observaciones.
4. El profesor puede editar carrera, debilidades, notas vocacionales.
```

**Observaciones:**

- La ficha es la vista más completa; concentra datos sensibles.
- `student_profiles.select('*')` se carga en el dashboard admin (`FUN-08`).
- No hay historial de cambios visible (`FUN-10`).

---

## 8. Flujo de pagos

### 8.1. Registro

```
1. Profesor/admin abre "Pagos".
2. Elige alumno.
3. Define plan (semanal, quincenal, mensual, contado, beca, otro), cuota y notas.
4. Registra pagos con monto, fecha, método y concepto.
```

### 8.2. Visualización

- Staff: resumen del mes, ingreso total, alumnos con plan, lista de pagos.
- Tutor: plan, total pagado, últimos 3 pagos, solo lectura.
- Alumno: sin acceso.

### 8.3. Brechas (`FUN-02`)

- No hay **saldo** ni **adeudo**.
- No hay **periodo cubierto** (solo `paid_at`).
- No hay **detección de duplicados**.
- No hay **anulación/reembolso**.
- No hay **recibo** ni folio.
- No hay **conciliación** con el plan.
- No hay **alerta de vencimiento**.

**Impacto:** el módulo sirve para registrar, no para cobrar ni rendir cuentas.

---

## 9. Flujo de tutores

### 9.1. Vinculación

```
1. Profesor/admin abre la ficha del alumno.
2. "Invitar tutor": nombre, correo, teléfono, relación.
3. invite-guardian crea/reutiliza cuenta, crea guardians y student_guardians.
4. Genera magic link y arma enlace de WhatsApp.
5. El tutor entra, ve a sus hijos y acepta el aviso.
```

### 9.2. Panel actual

`fetchGuardianDashboard` (`app.js:1296-1400`) consulta:

- `students` (hijos, por RLS).
- `profiles` (nombres).
- `groups` (grupo).
- `privacy_consents`.
- `student_billing`.
- `payments`.

`guardianDashboardMarkup` (`app.js:3937-3970`) muestra:

- Lista de hijos con matrícula y grupo.
- Estado de consentimiento o botón para aceptar.
- Plan y pagos (solo lectura).

**No muestra:** calificaciones, asistencia, observaciones familiares, tareas, avance por unidad, tests.

**Problema (`FUN-01`):** la base permite ver calificaciones (`app_can_view_grade`), asistencia (`app_can_access_student`) y observaciones `family` (`observations_select`), pero la UI no las consulta. El tutor queda como un espectador de pagos, no como un acompañante académico.

### 9.3. Consentimiento

- El botón “Aceptar aviso de privacidad” llama a `guardian-consent`.
- No bloquea el acceso; el panel ya muestra datos antes de aceptar.
- No hay enlace al texto completo.
- No hay revocación visible.
- Ver `PRIV-01`.

### 9.4. Casos límite

| Caso | Comportamiento | Riesgo |
|---|---|---|
| Tutor con varios hijos | Lista todos | Correcto |
| Tutor sin hijos | Mensaje “Sin vínculos” | Correcto |
| Tutor inactivo | No debería ver datos | Verificar RLS |
| Consentimiento revocado | Se muestra botón de nuevo | Correcto |
| Magic link reenviado | Cualquiera con el enlace entra | `SEC-06` |

---

## 10. Flujo de administración

### 10.1. Dashboard admin

`fetchAdminDashboard` (`app.js:813-860`) carga en paralelo:

- año académico activo
- grupos
- perfiles
- alumnos
- tutores
- vínculos
- settings
- stats de contenido
- unidades
- overview del staff
- tablero de materias
- `student_profiles` (todas las columnas)
- términos
- asignaciones
- versiones
- overrides
- tareas
- actividad
- cuentas externas
- billing
- pagos

**Problema (`FUN-08`):** carga todo aunque el admin esté en una sola pestaña. Con 600 alumnos y 400 versiones, el navegador recibe mucho más de lo necesario y varias consultas se truncan por `.limit()` (`FUN-09`).

### 10.2. Gestión de usuarios

- Crear profesor (`admin-create-teacher`).
- Crear alumno (`admin-create-student`).
- Resetear contraseña (`admin-reset-student-password`).
- Activar/desactivar (`deactivate-user`).
- Banear cuentas externas (`app_ban_account`).
- Vincular cuentas (`app_link_student_account`).

**Observaciones:**

- Desactivar no banea en Auth (`SEC-04`).
- Resetear contraseña no obliga a cambiarla (`SEC-03`).
- Banear no audita (`SEC-07`).
- No hay vista de auditoría (`FUN-10`).

### 10.3. Configuración

- `settings` permite editar clave/valor desde la UI (`app.js:1670-1700`).
- Incluye `privacy_document_version`.
- No hay validación de esquema; un JSON malformado puede romper la app.

---

## 11. Hallazgos funcionales

### FUN-01 · El tutor no ve calificaciones, asistencia ni observaciones familiares

- **Severidad:** Alto
- **Categoría:** Funcionalidad / tutores
- **Ubicación:** `app/frontend/src/ui/app.js:1296-1400` (consulta) y `3937-3970` (render)
- **Evidencia:** `fetchGuardianDashboard` solo consulta `students`, `profiles`, `groups`, `privacy_consents`, `student_billing` y `payments`. `guardianDashboardMarkup` solo renderiza hijos, consentimiento y pagos. No hay llamadas a `grades`, `attendance`, `observations` ni `tasks`.
- **Problema:** la base y la RLS permiten al tutor ver calificaciones visibles, asistencia y observaciones `family`, pero la interfaz no las muestra. La finalidad declarada del tutor (“acompañar el avance”) no se cumple.
- **Escenario:** un tutor entra, ve el plan y los pagos, pero no sabe si su hijo asistió, cómo va en la materia o si el profesor dejó una observación familiar. Llama al profesor o pide una reunión.
- **Impacto:** baja adopción del rol tutor, carga operativa para el profesor, incumplimiento de la promesa del producto.
- **Recomendación:** añadir pestañas de solo lectura en el panel del tutor:
  - **Avance:** unidades activas/completadas, precisión, última actividad.
  - **Calificaciones:** evaluaciones con `visible_to_guardian = true`.
  - **Asistencia:** sesiones y estado.
  - **Observaciones:** solo `visibility = 'family'`.
  - **Tareas:** entregas y estado.
  Reutilizar las políticas existentes; no ampliar RLS. Añadir un indicador “Solo lectura”.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-02 · Pagos sin saldo, periodo, duplicados ni anulación

- **Severidad:** Alto
- **Categoría:** Funcionalidad / finanzas
- **Ubicación:** `app/supabase/migrations/0020_payments.sql`; `app.js:2593-2700` (staff) y `3966-4020` (tutor)
- **Evidencia:** `student_billing` guarda `plan`, `fee`, `notes`; `payments` guarda `amount`, `paid_at`, `method`, `concept`. No hay `period_start`, `period_end`, `status`, `voided_at`, `receipt_no`, `balance` ni restricción de duplicados.
- **Problema:** el módulo registra pagos, pero no responde a las preguntas operativas: ¿está al corriente?, ¿este pago cubre qué periodo?, ¿es duplicado?, ¿cómo se anula?, ¿cuánto debe?
- **Escenario:** un tutor paga la mensualidad dos veces; el staff registra ambos; el resumen suma el doble; no hay forma de anular sin borrar la fila (y el borrado no está expuesto). Otro tutor pregunta su saldo y no hay dato.
- **Impacto:** errores de cobro, desconfianza, imposibilidad de rendir cuentas, riesgo de pérdida de ingresos.
- **Recomendación:**
  1. Añadir `period_start`, `period_end`, `status` (`paid`, `voided`, `partial`), `voided_at`, `void_reason`, `receipt_no`, `idempotency_key`.
  2. Calcular saldo por alumno y periodo con una vista o RPC.
  3. Detectar duplicados por `(student_id, amount, period_start, period_end)`.
  4. Implementar anulación con motivo y auditoría, sin borrar.
  5. Mostrar al tutor “al corriente / pendiente / vencido” y el desglose.
  6. Añadir un recibo descargable (PDF o texto).
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-03 · La activación parcial de una unidad se hereda a alumnos nuevos

- **Severidad:** Medio
- **Categoría:** Funcionalidad / control de acceso pedagógico
- **Ubicación:** `app/frontend/src/ui/app.js:4880-4925`; `0001_schema.sql:194-211`; `0009` (agravante)
- **Evidencia:**

```js
// app.js:4900-4915
const excluded = active.students.filter((student) => !student.selected);
if (excluded.length) {
  const rows = excluded.map((student) => ({
    assignment_id: assignmentId,
    student_id: student.id,
    status: 'closed',
    ...
  }));
  await supabase.from('student_unit_overrides').upsert(rows, ...);
}
```

La asignación se crea a nivel de grupo; los excluidos se marcan con override `closed`. Un alumno que se agregue al grupo después no tiene override, así que `coalesce(o.status, a.status)` devuelve `active`.
- **Problema:** el profesor cree que activó la unidad “para 5 alumnos”, pero el grupo completo tiene la asignación y los futuros alumnos entran sin decisión explícita.
- **Escenario:** el profesor activa una unidad para 5 de 20 alumnos; al día siguiente inscribe a un alumno nuevo; ese alumno ve la unidad sin que nadie la haya activado para él.
- **Impacto:** control pedagógico difuso, posible exposición de contenido a quien no corresponde, confusión.
- **Recomendación:** modelar la audiencia explícitamente:
  - Opción A: crear una asignación por alumno (más filas, más control).
  - Opción B: añadir `audience` (`group`/`students`) y una tabla `unit_assignment_students`; RLS exige pertenencia.
  - Opción C: mantener el modelo actual pero crear un override `closed` por defecto para todo alumno nuevo del grupo.
  Añadir una prueba: alumno nuevo no ve la unidad hasta que el profesor lo incluya.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-04 · Reintentos de quiz ilimitados y sin política de intentos

- **Severidad:** Medio
- **Categoría:** Funcionalidad / integridad académica
- **Ubicación:** `app/supabase/migrations/0022_quiz_retry.sql`; `app.js` (botón “Reintentar”)
- **Evidencia:** `app_submit_quiz_answer` devuelve `attempt_no`, pero no hay límite, penalización ni bloqueo. La UI permite reintentar indefinidamente.
- **Problema:** el alumno puede probar todas las opciones hasta acertar; la precisión final no refleja su conocimiento.
- **Escenario:** un quiz de 4 opciones se resuelve por fuerza bruta en 4 intentos; `best_accuracy` queda en 100 %.
- **Impacto:** evaluaciones sin valor, datos engañosos, comparaciones injustas.
- **Recomendación:** definir una política por unidad: máximo de intentos, puntaje decreciente, bloqueo tras acierto, o registrar el primer intento como el válido. Mostrar la política al alumno antes de empezar.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-05 · “Completar unidad” no valida ni advierte

- **Severidad:** Medio
- **Categoría:** Funcionalidad / integridad
- **Ubicación:** `app.js:4610-4635`; `0004:398-465`
- **Evidencia:** el botón llama `app_complete_unit` sin comprobar ejercicios, quiz ni precisión. La RPC marca `completed` sin requisitos.
- **Problema:** el alumno puede completar una unidad vacía; el profesor ve avance que no existió.
- **Escenario:** el alumno abre la unidad, no responde nada y pulsa “Completar”. La unidad aparece completada.
- **Impacto:** métricas de avance falsas, reportes incorrectos.
- **Recomendación:** validar en servidor (ver `DB-04`) y en la UI: mostrar “Te faltan X ejercicios” y deshabilitar el botón hasta cumplir. Distinguir “completado” de “dominado”.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-06 · No hay recuperación de contraseña para alumnos

- **Severidad:** Medio
- **Categoría:** Funcionalidad / autenticación
- **Ubicación:** `app.js:572`; `functions/admin-reset-student-password/index.ts`
- **Evidencia:** el login dice “Si olvidaste tu contraseña, pide una temporal a tu profesor”. No hay `resetPasswordForEmail` ni formulario de recuperación.
- **Problema:** el alumno depende del staff para volver a entrar; el profesor comparte contraseñas temporales, lo que agrava `SEC-03`.
- **Escenario:** un alumno olvida su contraseña un domingo; no puede estudiar hasta el lunes.
- **Impacto:** fricción, pérdida de uso, contraseñas compartidas.
- **Recomendación:** añadir “Olvidé mi contraseña” con `resetPasswordForEmail`, rate limit, correo sintético o mecanismo alterno (código entregado por el profesor), y forzar cambio al primer ingreso.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-07 · El login del alumno depende de un dominio sintético fijo

- **Severidad:** Bajo
- **Categoría:** Funcionalidad / autenticación
- **Ubicación:** `frontend/src/lib/supabase.js:5,19-26`; `app.js:684-687`
- **Evidencia:** `toStudentEmail` agrega `@${studentEmailDomain}`. Si el alumno escribe un correo, se respeta; si no, se usa el dominio configurado.
- **Problema:** si el dominio cambia, si el alumno fue creado con otro dominio o si escribe mal su usuario, el login falla con un mensaje genérico.
- **Escenario:** se migra de `alumnos.ecoems.mx` a `alumnos.ecoems.edu.mx`; los alumnos antiguos no pueden entrar hasta que se actualicen sus cuentas.
- **Impacto:** soporte, bloqueo de acceso.
- **Recomendación:** mostrar el dominio en el formulario (“tu usuario@alumnos.ecoems.mx”), permitir correo completo, validar en el alta y documentar la migración.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-08 · El dashboard admin carga todo en el navegador

- **Severidad:** Bajo
- **Categoría:** Funcionalidad / rendimiento
- **Ubicación:** `app.js:813-860`
- **Evidencia:** 21 consultas en paralelo, incluyendo `student_profiles.select('*')`, todos los alumnos, todas las versiones, todas las asignaciones y todos los pagos.
- **Problema:** el admin recibe datos que no necesita para la pestaña actual; el tiempo de carga y la memoria crecen con el piloto.
- **Escenario:** con 600 alumnos y 400 versiones, el dashboard tarda y el navegador consume memoria; en móvil puede fallar.
- **Impacto:** mala experiencia, exposición innecesaria de datos en el cliente.
- **Recomendación:** cargar por pestaña, paginar, seleccionar solo columnas necesarias y mover agregados a RPCs.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-09 · Listados truncados por `.limit()` sin paginación

- **Severidad:** Medio
- **Categoría:** Funcionalidad / datos
- **Ubicación:** `app.js:855` (`.limit(600)`), `1067` (`.limit(400)`), `1337` (`.limit(120)`), `6044` (`.limit(12)`)
- **Evidencia:** las consultas usan límites fijos sin `range`, sin total y sin “cargar más”.
- **Problema:** si hay más filas que el límite, se pierden silenciosamente. Los conteos y reportes quedan incompletos.
- **Escenario:** el piloto crece a 700 alumnos; el dashboard muestra 600 y el admin no lo sabe.
- **Impacto:** decisiones con datos incompletos, alumnos “desaparecidos”.
- **Recomendación:** implementar paginación con `range` y un contador total; o usar RPCs con `limit/offset`; mostrar “mostrando X de Y”.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-10 · No hay auditoría visible de cambios

- **Severidad:** Medio
- **Categoría:** Funcionalidad / trazabilidad
- **Ubicación:** `app.js:813-860` (no consulta `audit_log`); `0001_schema.sql` (`audit_log`)
- **Evidencia:** la tabla `audit_log` existe y las Edge Functions escriben en ella, pero el dashboard no la muestra y no hay pantalla de consulta.
- **Problema:** no se puede saber quién cambió una calificación, un pago, un permiso o una vinculación.
- **Escenario:** un tutor reclama un pago; el admin no puede ver quién lo registró ni cuándo.
- **Impacto:** falta de rendición de cuentas, dificultad para investigar incidentes.
- **Recomendación:** añadir una pestaña “Auditoría” con filtros por actor, entidad, fecha y acción; registrar también los cambios hechos por RPC (no solo Edge Functions).
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### FUN-11 · El modo de login no persiste

- **Severidad:** Bajo
- **Categoría:** Funcionalidad / UX
- **Ubicación:** `app.js:7036`
- **Evidencia:** `signOut` hace `state.mode = 'student'`; no se guarda en `localStorage`.
- **Problema:** un tutor o profesor que recarga la página vuelve a la pestaña “Alumno” y debe cambiar de modo.
- **Escenario:** el profesor cierra sesión y vuelve a entrar; tiene que seleccionar “Profesor” otra vez.
- **Impacto:** fricción menor.
- **Recomendación:** persistir el último modo o inferirlo del perfil; recordar el usuario (no la contraseña).
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

## 12. Matriz de flujos y riesgo

| Flujo | Estado | Riesgo principal |
|---|---|---|
| Login alumno | Funciona | `SEC-03`, `FUN-06`, `FUN-07` |
| Login profesor | Funciona | — |
| Login tutor | Funciona | `SEC-06` |
| Alta alumno (Edge) | Funciona | Contraseña temporal, sin cambio obligatorio |
| Alta alumno (RPC) | Funciona | `SEC-02` |
| Alta profesor | Funciona | — |
| Invitar tutor | Funciona | `SEC-06` |
| Activar unidad | Funciona | `FUN-03`, `DB-01` |
| Estudiar | Funciona | `SEC-01` |
| Ejercicios | Funciona | — |
| Quiz | Funciona | `FUN-04` |
| Completar unidad | Funciona | `FUN-05`, `DB-04` |
| Tests | Funciona | `PRIV-03` |
| Ficha | Funciona | `PRIV-02` |
| Pagos | Parcial | `FUN-02` |
| Panel tutor | Parcial | `FUN-01` |
| Consentimiento | Parcial | `PRIV-01` |
| Auditoría | Inexistente en UI | `FUN-10` |
| Desactivar usuario | Parcial | `SEC-04` |

---

## 13. Recomendaciones funcionales

1. **Completar el panel del tutor** con avance, calificaciones, asistencia y observaciones familiares, en solo lectura.
2. **Rediseñar pagos** con periodo, saldo, estado, anulación y recibo.
3. **Cerrar la activación parcial** con audiencia explícita o overrides por defecto.
4. **Definir política de intentos** y mostrarla al alumno.
5. **Exigir requisitos mínimos** para completar una unidad.
6. **Añadir recuperación de contraseña** sin depender del profesor.
7. **Paginar** los listados y mostrar totales.
8. **Añadir una pantalla de auditoría** para el admin.
9. **Persistir el modo de login** y recordar el usuario.
10. **Probar los casos límite** de `12_PRUEBAS_PENDIENTES.md` en staging.

---

## 14. Conclusión

La funcionalidad del alumno y del profesor está **completa para un piloto**: se puede dar de alta, activar, estudiar, evaluar y ver avance. El tutor, en cambio, está **a medio construir**: tiene acceso y consentimiento, pero no ve lo que necesita para acompañar. Los pagos son un registro, no una herramienta financiera.

Ninguna de estas brechas requiere reescribir la plataforma. Todas se resuelven **completando vistas, endureciendo reglas y cerrando casos límite**. La prioridad es que el tutor vea lo que ya está permitido y que el dinero tenga trazabilidad.
