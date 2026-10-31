# Supabase

## Migraciones

```text
migrations/
  0001_schema.sql              34 tablas, enums, índices y triggers de updated_at
  0002_enable_rls.sql          RLS activo en todas las tablas
  0003_rls.sql                 funciones auxiliares y 77 políticas
  0004_progress_rpcs.sql       inicio, intentos, quiz/reto y completar unidad
  0005_fix_quiz_accuracy.sql   corrige el cálculo de precisión del quiz
tests/
  0004_progress_rpcs.sql       prueba SQL transaccional de las RPC
```

Las cinco migraciones se aplicaron al proyecto `ioikcrdxneuydylyhvwi` el 30 de octubre de 2026. La base tiene 34 tablas, 34 tablas con RLS y 77 políticas.

## Pruebas ejecutadas

Se corrieron 17 pruebas de RLS con usuarios ficticios dentro de una transacción con `rollback`; no quedaron datos de prueba. Pasaron todos los casos, incluidos:

- Alumno A no lee a alumno B ni una unidad sin asignación activa.
- Alumno A sí lee la unidad y versión asignadas y no inserta progreso directamente.
- Profesor A no lee ni califica al grupo B, pero sí activa una asignación de su grupo.
- Tutor A no lee al alumno B ni observaciones `internal`; sí lee las `family`.
- Admin lee todas las filas; anónimo recibe `permission denied`.

También se ejecutó `tests/0004_progress_rpcs.sql` en una transacción con `rollback`: inicio de unidad, intentos incorrecto/correcto, quiz/reto, precisión, completado, tutor bloqueado y asignación cerrada bloqueada. El flujo completo de activación docente → abrir unidad → responder → completar se verificó en Chrome headless con una unidad demo, que se eliminó al terminar.

## Importante

- El esquema asume que existe `auth.users`, provisto por Supabase.
- Los alumnos **no** escriben tablas directamente; usan RPC para inicio, intentos, quiz/reto y completar unidad. Faltan las RPC de juegos y lectura.
- No se deben cargar datos reales hasta revisar privacidad y completar el consentimiento.
- No se usa `service_role` en el frontend.
- Los correos de alumnos son sintéticos: `usuario@alumnos.ecoems.mx`.

## Crear el primer admin

1. En Supabase Dashboard, Authentication → Users → Add user: correo real y contraseña.
2. Copia el UUID del usuario y ejecuta:

```sql
insert into public.profiles (id, role, full_name, email)
values ('UUID_DEL_USUARIO', 'admin', 'Nombre del admin', 'correo@dominio.mx')
on conflict (id) do update
set role = 'admin', active = true;
```

El primer admin del piloto ya fue creado y su login real está verificado.

## Datos ficticios de staging

Ya existen el ciclo `2026-2027` con sus tres trimestres, el grupo `Piloto A`, tres alumnos, dos profesores y dos tutores vinculados. Los logins de profesor, alumno y tutor se probaron contra la API real y el panel por rol se verificó en Chrome headless.

Las contraseñas están solo en `app/.secrets/test-users.txt`, que está ignorado por git. No se versionan ni se usan en producción.

Las altas directas en `auth.users` requieren `instance_id='00000000-0000-0000-0000-000000000000'` y tokens no nulos (`confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new` en `''`). `confirmed_at` es generado y no se actualiza. El correo en `auth.users` tiene un índice único parcial, así que no se use `on conflict (email)`.

## Flujo de migraciones

```bash
# desde la raíz Plataforma/
cd app
npx supabase db push --db-url "$(cat .secrets/database-url)" \
  --workdir "$(pwd)" --yes
```

La cadena directa vive en `.secrets/database-url`, que está ignorado por git, y solo se usa en administración local. No debe ir al frontend ni a un repositorio. No se ejecuta en producción sin respaldo y ventana de mantenimiento.

Para probar las RPC en una transacción revertida:

```bash
cd app
DATABASE_URL="$(cat .secrets/database-url)" \
  node /ruta/al/runner.js supabase/tests/0004_progress_rpcs.sql
```
