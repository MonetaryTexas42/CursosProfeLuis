# Frontend

Vite + JavaScript, sin framework. La autenticación usa Supabase.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Variables

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STUDENT_EMAIL_DOMAIN
VITE_APP_ENV
```

Copia `.env.example` a `.env`. No subas `.env`.

El frontend nunca usa la cadena `postgresql://...` ni `service_role`. Solo la URL del proyecto y la `anon public key`. La conexión directa a Postgres es para migraciones administrativas.

## Flujo actual

1. Alumno: usuario + contraseña. El usuario se convierte en `usuario@alumnos.ecoems.mx`.
2. Profesor/admin: correo + contraseña.
3. Tutor: enlace mágico por correo.
4. Al iniciar sesión, se lee `profiles` y se muestra el panel según el rol.
5. El panel consulta datos reales bajo RLS: admin ve ciclo, conteos y grupos; profesor ve sus grupos, alumnos y unidades publicadas; alumno ve su grupo y unidades activas; tutor ve sus alumnos vinculados.
6. El profesor activa una versión publicada en su grupo desde el panel; la asignación queda `active` y visible.
7. El alumno abre la unidad, registra intentos de ejercicio y quiz/reto mediante RPC y puede marcarla como completada. No escribe tablas directamente.
8. Si no hay conexión configurada, se muestra una pantalla de instrucciones.

## Pendiente

- RPC de juegos y lectura; progreso e intentos ya están implementados.
- Carga de contenido y unidades reales; sin unidades publicadas, activación y visor muestran estados vacíos.
- Edición de perfil, expediente y observaciones en UI.
- Manejo de refresh de sesión y errores de red más fino.
- Edge Functions de altas, reset, invitación y consentimiento.
- Proyecto staging y despliegue en Cloudflare Pages.
