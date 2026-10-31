# 03 · Autenticación y cuentas

## Decisiones

- **Alumnos:** usuario y contraseña. No necesitan correo.
- **Profesores y admin:** correo real y contraseña.
- **Padres:** enlace mágico por correo.
- **Sin autorregistro.** Las cuentas las crea el admin o el profesor autorizado.
- **Supabase Auth** administra sesiones y contraseñas. La app nunca guarda contraseñas.

## Usuarios y perfiles

Cada persona tiene un registro en `auth.users` y un perfil en `profiles`.

| Rol | `profiles.role` | Método de acceso | Quién crea |
|---|---|---|---|
| Admin | `admin` | Correo + contraseña | Configuración inicial |
| Profesor | `teacher` | Correo + contraseña | Admin |
| Alumno | `student` | Usuario + contraseña | Admin/profesor |
| Padre/tutor | `guardian` | Enlace mágico | Invitación del admin/profesor |

## Login de alumnos

Supabase Auth usa correo. Para que el alumno no necesite uno, se crea un correo sintético:

```text
<usuario>@alumnos.ecoems.mx
```

Ejemplo:

```text
ana.martinez@alumnos.ecoems.mx
```

Reglas del usuario:

- Minúsculas, sin espacios.
- Solo letras, números, punto, guion y guion bajo.
- Único en `profiles.username`.
- Entre 3 y 32 caracteres.
- No se permiten nombres reservados (`admin`, `profesor`, `soporte`, etc.).

Flujo:

1. El profesor captura nombre, usuario, contraseña temporal y grupo.
2. La Edge Function `admin-create-student` verifica que quien llama sea admin o profesor del grupo.
3. Crea el usuario en Auth con el correo sintético y `email_confirm = true`.
4. Inserta `profiles` con rol `student`.
5. Inserta `students` y lo liga al grupo.
6. Devuelve el usuario creado una sola vez. No se guarda la contraseña en texto plano.
7. El alumno entra con usuario y contraseña. La app construye el correo sintético con la variable `VITE_STUDENT_EMAIL_DOMAIN`.

Notas:

- No se envía correo de confirmación al alumno.
- No se usa “olvidé mi contraseña” por correo. El profesor genera una temporal.
- Se aplica rate limit de Supabase Auth. Si se requiere, se añade bloqueo por intentos en una Edge Function.
- La contraseña temporal debe cambiarse en el primer ingreso (recomendado, configurable).

## Login de profesores y admin

Flujo estándar:

1. Correo y contraseña.
2. Supabase Auth devuelve sesión.
3. La app carga `profiles.role`.
4. Redirige a `/profe` o `/admin`.
5. Si el perfil está inactivo, se cierra la sesión.

Seguridad:

- Contraseña mínima de 10 caracteres para staff.
- MFA opcional para admin en una fase posterior.
- Recuperación por correo con enlace de Supabase.
- Un profesor no puede cambiar su rol.

## Padres y tutores

Flujo de invitación:

1. El profesor/admin registra al tutor con nombre, correo, teléfono y parentesco.
2. La Edge Function `invite-guardian` crea o reutiliza el usuario de Auth.
3. Envía un enlace mágico al correo.
4. El tutor entra, acepta el aviso de privacidad y consiente el tratamiento de datos del menor.
5. Se crea/actualiza `profiles` con rol `guardian` y se liga con `student_guardians`.

Reglas:

- Un correo puede estar ligado a varios alumnos.
- Si el correo ya existe, se reutiliza la cuenta y se agrega el nuevo vínculo.
- El tutor no puede ver datos de alumnos que no estén ligados.
- El enlace mágico caduca; se puede reenviar.
- El tutor puede entrar al portal sin contraseña; si se habilita contraseña, es opcional.

## Creación de cuentas: Edge Functions

| Función | Quién llama | Qué hace |
|---|---|---|
| `admin-create-student` | Admin o profesor del grupo | Crea Auth + perfil + ficha + vínculo con grupo. |
| `admin-reset-student-password` | Admin o profesor del grupo | Genera contraseña temporal y la devuelve una vez. |
| `admin-create-teacher` | Admin | Crea cuenta de profesor. |
| `invite-guardian` | Admin o profesor del grupo | Crea/reutiliza cuenta y envía enlace mágico. |
| `resend-guardian-invite` | Admin o profesor del grupo | Reenvía invitación. |
| `send-guardian-message` | Admin o profesor del grupo | Encola y envía correo de una observación/mensaje. |
| `generate-report-pdf` | Admin, profesor o tutor | Genera PDF con permisos verificados. |
| `deactivate-user` | Admin | Desactiva perfil y sesiones. |

Todas las funciones deben:

1. Verificar el JWT del llamador.
2. Consultar su rol en `profiles`.
3. Verificar que el recurso objetivo esté dentro de su alcance.
4. Registrar la acción en `audit_log`.
5. No devolver datos sensibles innecesarios.

## Ciclo de vida de la cuenta

| Evento | Acción |
|---|---|
| Alta | Crear Auth, perfil y ficha; asignar grupo. |
| Cambio de grupo | Actualizar `students.group_id`; conservar historial. |
| Baja temporal | `profiles.active = false`; cerrar sesiones. |
| Egreso | `students.status = 'graduated'`; conservar expediente según retención. |
| Olvido de contraseña (alumno) | Profesor genera temporal. |
| Olvido de contraseña (staff) | Enlace de recuperación por correo. |
| Tutor sin correo | Se puede crear con correo provisional y actualizar después; o entregar invitación impresa con código de un solo uso. |

## Sesión y rutas

- La sesión se guarda con Supabase JS.
- Al cargar la app se obtiene la sesión y el perfil.
- Si no hay sesión, redirige a `/login`.
- Si el rol no corresponde a la ruta, redirige a su inicio.
- Los guards del frontend son comodidad; la seguridad real es RLS.
- Al cerrar sesión se limpian datos locales sensibles.

Rutas propuestas:

```text
/login
/aviso-privacidad
/alumno
/alumno/materia/:subjectId
/alumno/unidad/:assignmentId
/alumno/juegos
/alumno/progreso
/alumno/perfil
/profe
/profe/grupos
/profe/activacion
/profe/asistencia
/profe/calificaciones
/profe/expediente/:studentId
/profe/mensajes
/familia
/familia/hijo/:studentId
/familia/mensajes
/admin
/admin/usuarios
/admin/contenido
/admin/configuracion
```

## Reglas de contraseña

- Alumno: mínimo 8 caracteres; sin datos personales obvios.
- Staff: mínimo 10 caracteres.
- No se almacenan contraseñas en la base.
- No se comparten por WhatsApp en texto plano; se entregan en un papel o se muestran una vez.
- El primer ingreso puede obligar cambio de contraseña.
- Los resets se registran en `audit_log`.

## Casos límite

- **Usuario repetido:** la Edge Function rechaza y sugiere variante.
- **Correo de tutor repetido:** se reutiliza la cuenta y se agrega el vínculo.
- **Alumno sin correo:** no es problema; usa usuario.
- **Padre sin correo:** se puede crear un correo provisional o usar invitación impresa; definir en Fase 1.
- **Profesor con dos grupos:** `groups.teacher_id` permite varios grupos por profesor.
- **Alumno que cambia de grupo:** el historial se conserva; el acceso nuevo se rige por el grupo actual.
- **Cuenta inactiva:** no puede iniciar sesión; si ya tenía sesión, se invalida.
