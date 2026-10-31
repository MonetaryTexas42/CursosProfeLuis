# 08 · Backlog Fase 1

## Objetivo de la fase

Tener un entorno staging funcional con esquema, RLS, autenticación por rol, shell del frontend y despliegue automático. Sin datos reales y sin contenido migrado todavía.

**Duración objetivo:** 2 semanas.
**Equipo supuesto:** 1 desarrollador full-stack con apoyo del profesor para validar.
**Estimación:** días ideales; agregar 20 % de buffer.

## Historias

### Épica A · Fundación

| ID | Tarea | Días | Depende de | Criterio de aceptación |
|---|---|---:|---|---|
| F1-01 | Crear repositorio y estructura `frontend/`, `supabase/`, `docs/` | 0.5 | — | `npm install` y `npm run dev` funcionan. |
| F1-02 | Configurar Vite + módulos JS, lint y formato | 0.5 | F1-01 | Build de producción sin errores. |
| F1-03 | Crear proyectos Supabase staging y producción | 0.5 | — | Dos proyectos separados; llaves guardadas. |
| F1-04 | Configurar Supabase CLI y migraciones | 0.5 | F1-03 | `supabase db push` funciona en staging. |
| F1-05 | Migración de extensiones y enums | 0.5 | F1-04 | `citext`, `pgcrypto` y enums creados. |
| F1-06 | Migración de tablas e índices | 1.5 | F1-05 | Esquema aplicado; claves y restricciones correctas. |
| F1-07 | Funciones auxiliares de rol y acceso | 1.0 | F1-06 | `app_current_role()`, `app_can_access_student()` responden bien. |
| F1-08 | Políticas RLS iniciales | 1.5 | F1-07 | Matriz de permisos implementada. |
| F1-09 | Seed de catálogos y usuarios ficticios | 0.5 | F1-06 | Staging tiene 1 admin, 2 profesores, 3 alumnos, 2 tutores. |

### Épica B · Autenticación

| ID | Tarea | Días | Depende de | Criterio de aceptación |
|---|---|---:|---|---|
| F1-10 | Cliente Supabase y manejo de sesión | 0.5 | F1-02, F1-03 | Sesión persiste al recargar. |
| F1-11 | Pantalla de login unificada | 1.0 | F1-10 | Alumno entra con usuario; staff con correo. |
| F1-12 | Guards y redirección por rol | 0.5 | F1-11 | Cada rol llega a su panel. |
| F1-13 | Cierre de sesión y limpieza local | 0.25 | F1-11 | No quedan datos sensibles en storage. |
| F1-14 | Edge Function `admin-create-student` | 1.0 | F1-08 | Admin crea alumno; profesor solo en su grupo. |
| F1-15 | Edge Function `admin-reset-student-password` | 0.5 | F1-14 | Devuelve temporal una vez y audita. |
| F1-16 | Edge Function `invite-guardian` | 1.0 | F1-08 | Tutor recibe enlace y acepta aviso. |
| F1-17 | Registro de consentimiento | 0.5 | F1-16 | Se guarda versión, fecha y vínculo. |

### Épica C · Shell del frontend

| ID | Tarea | Días | Depende de | Criterio de aceptación |
|---|---|---:|---|---|
| F1-18 | Layout base y navegación por rol | 1.0 | F1-12 | Sidebar/topbar responsive. |
| F1-19 | Pantalla “Mi grupo” del profesor | 1.0 | F1-08, F1-18 | Lista alumnos de sus grupos. |
| F1-20 | Pantalla de inicio del alumno | 1.0 | F1-08, F1-18 | Muestra nombre, grupo y estado vacío. |
| F1-21 | Pantalla de inicio del tutor | 1.0 | F1-16, F1-18 | Lista solo sus hijos. |
| F1-22 | Estados de carga, vacío y error | 0.5 | F1-18 | Todos los paneles tienen estados claros. |

### Épica D · Operación

| ID | Tarea | Días | Depende de | Criterio de aceptación |
|---|---|---:|---|---|
| F1-23 | Variables de entorno y documentación | 0.5 | F1-03 | `.env.example` completo; secretos fuera del repo. |
| F1-24 | Despliegue a Cloudflare Pages | 0.5 | F1-02 | Staging accesible por HTTPS. |
| F1-25 | Configurar correo transaccional | 1.0 | F1-16 | Invitación llega; SPF/DKIM/DMARC configurados. |
| F1-26 | Auditoría básica | 0.5 | F1-08 | Altas, resets e invitaciones quedan registrados. |
| F1-27 | Respaldo y restauración en staging | 1.0 | F1-06 | Restauración verificada. |
| F1-28 | Pruebas RLS con usuarios reales de prueba | 1.0 | F1-08 | 12 casos de la matriz pasan. |
| F1-29 | Smoke test y documentación de arranque | 0.5 | F1-24 | Otro desarrollador levanta el proyecto en menos de 30 min. |

## Orden de ejecución

1. **Días 1–2:** F1-01 a F1-05.
2. **Días 3–5:** F1-06 a F1-09.
3. **Días 5–7:** F1-10 a F1-13.
4. **Días 7–9:** F1-14 a F1-17.
5. **Días 9–10:** F1-18 a F1-22.
6. **Días 10–12:** F1-23 a F1-29.

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| RLS mal configurado | Crítico | Probar con cada rol; revisión cruzada. |
| Correo cae en spam | Alto | SPF, DKIM, DMARC; probar con Gmail/Outlook. |
| Migración de contenido rompe claves | Alto | Validar muestras y conteos antes de publicar. |
| Contraseñas temporales inseguras | Alto | Generación aleatoria; entrega una vez; cambio obligatorio. |
| Falta de tiempo para 2 semanas | Medio | Reducir alcance a login + RLS + shell; mover correo a Fase 2. |
| Datos reales en staging | Alto | Semilla ficticia; checklist de privacidad. |

## Fuera de alcance de Fase 1

- Migrar las 60 unidades.
- Juegos y ranking.
- Asistencia y calificaciones.
- Portal de padres completo.
- Diagnóstico.
- Pagos.

## Criterio de salida

- Staging accesible.
- Admin, profesor, alumno y tutor pueden iniciar sesión.
- Cada rol ve solo lo permitido.
- RLS probado.
- Respaldo restaurado.
- Sin datos reales.
- Demo de 5 minutos aprobada por el profesor.
