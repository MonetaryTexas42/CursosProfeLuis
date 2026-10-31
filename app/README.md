# Plataforma ECOEMS · App

Base local de Fase 1. Todavía no hay datos reales ni despliegue.

## Estructura

```text
app/
  frontend/          Vite + JS, login y shell por rol
  supabase/          Migraciones y documentación de base de datos
  docs/              Enlaces a la especificación de Fase 0
```

## Estado

- [x] Estructura del repositorio.
- [x] Vite + módulos JS.
- [x] Cliente Supabase con variables de entorno.
- [x] Login de alumno, profesor y tutor.
- [x] Carga de perfil y redirección por rol.
- [x] Migración inicial con 34 tablas.
- [x] RLS activo en todas las tablas.
- [x] Políticas RLS y 17 pruebas de acceso.
- [x] Migraciones aplicadas al proyecto `ioikcrdxneuydylyhvwi`.
- [x] Primer admin creado y login real verificado.
- [x] `.env` del frontend configurado con la anon key.
- [x] Usuarios ficticios persistentes por rol.
- [x] Ciclo escolar, trimestres y grupo piloto con alumnos y tutores.
- [x] Panel por rol con grupo, alumnos, hijos y unidades activas.
- [x] RPC de inicio, intentos, quiz/reto y completar unidad.
- [x] Pantalla de unidad del alumno y activación de unidades por el profesor.
- [x] Pruebas SQL de RPC y prueba UI del flujo completo.
- [ ] RPC de juegos y lectura.
- [ ] Carga de contenido y unidades reales.
- [ ] Edge Functions de altas, reset, invitación y consentimiento.
- [ ] Proyecto staging.
- [ ] Despliegue.

## Arranque local

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Sin las variables de entorno, la app muestra una pantalla de configuración; no falla.

## Reglas

- No se usa `service_role` en el frontend.
- No se suben `.env` ni datos reales.
- La cadena directa de Postgres vive en `.secrets/database-url` (ignorada por git) y solo se usa para migraciones.
- La seguridad real se implementa con RLS en Supabase.
- El curso actual no se modifica.

## Siguiente paso

Cargar contenido y probar unidades reales. Las RPC de progreso, intentos, quiz/reto y completar unidad ya están aplicadas (`0004` y `0005`), y el flujo de activación + respuesta + completado se verificó en Chrome headless con una unidad demo que se eliminó después. Faltan las RPC de juegos y lectura, las Edge Functions de altas/reset/consentimiento y el staging separado. El ciclo `2026-2027`, el grupo `Piloto A` y los usuarios ficticios por rol ya están creados; sus contraseñas viven solo en `.secrets/test-users.txt` y no se versionan.
