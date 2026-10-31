# Fase 0 · Especificación de la plataforma ECOEMS

Esta carpeta contiene el plano completo antes de construir. No se ejecutó nada en Supabase ni se modificó el curso actual.

**Índice visual:** abre [FASE-0.html](FASE-0.html) para revisar el estado, los enlaces y el checklist interactivo.

## Decisión de arquitectura

- **Base de datos:** Supabase (Postgres, Auth, RLS, Storage, Edge Functions).
- **Frontend:** se conserva el diseño y se migra a Vite + módulos JS.
- **Piloto:** 1 grupo, menos de 20 alumnos.
- **Alumnos:** usuario y contraseña creados por el profesor.
- **Padres:** portal con enlace mágico + correo/PDF.
- **Ranking:** personal + grupo, ocultable por el profesor.
- **Pagos:** fuera del MVP.

## Entregables

| # | Documento | Qué resuelve |
|---|---|---|
| 01 | [ERD y diccionario de datos](01-erd-y-diccionario.md) | Entidades, relaciones, campos y reglas. |
| 02 | [Permisos RLS](02-permisos-rls.md) | Quién ve y escribe qué; pruebas de seguridad. |
| 03 | [Autenticación y cuentas](03-autenticacion.md) | Login de alumno, profesor y padre; invitaciones y resets. |
| 04 | [Contenido y versionado](04-contenido-y-versionado.md) | Esquema JSON, claves estables, activación y migración. |
| 05 | [Privacidad y consentimiento](05-privacidad-y-consentimiento.md) | Borrador de aviso y carta para tutores. |
| 06 | [Criterios de aceptación](06-criterios-de-aceptacion.md) | Definition of Done por fase y pruebas mínimas. |
| 07 | [Ambientes y respaldos](07-ambientes-y-respaldos.md) | Local, staging, producción, dominio y restauración. |
| 08 | [Backlog Fase 1](08-backlog-fase-1.md) | Tareas, dependencias y estimación del primer sprint. |
| 09 | [Wireframes](WIREFRAMES.html) | Pantallas base de alumno, profesor, padre y admin. |
| 10 | [Esquema SQL propuesto](sql/001_schema.sql) | Borrador de tablas, enums e índices. No ejecutado. |
| 11 | [Plantilla del piloto](plantillas/piloto.csv) | CSV para cargar alumnos y tutores. |

## Supuestos confirmados y pendientes

| Tema | Supuesto para Fase 0 | Estado |
|---|---|---|
| Escala de calificación | 0–10, mínimo aprobatorio 6 | Confirmado |
| Periodos | Tres trimestres | Confirmado |
| Dominio del alumno | `alumnos.ecoems.mx` como dominio sintético | Confirmado; falta configurar |
| Dominio de la app | `app.ecoems.mx` | Confirmado; falta registrar |
| Aviso de privacidad | Borrador incluido; requiere revisión legal | Revisar |
| Correos de tutores | Se recogerán en la plantilla del piloto | Pendiente |
| Fecha del piloto | Por definir | Pendiente |
| Contenido inicial | 4 materias listas | Confirmado |

## Criterio de salida de Fase 0

La fase termina cuando estén aprobados:

1. El ERD y el diccionario de datos.
2. La matriz de permisos y sus pruebas.
3. Los flujos de login y recuperación.
4. El esquema de contenido y versionado.
5. El aviso de privacidad y la carta de consentimiento.
6. La plantilla del grupo piloto.
7. Los criterios de aceptación.
8. El plan de ambientes, respaldos y dominio.
9. El backlog de Fase 1.

## Qué no se hace todavía

- No se crea el proyecto de Supabase.
- No se ejecuta el SQL.
- No se migran datos reales.
- No se modifican `app.js`, `data.js` ni las herramientas.
- No se toca el curso que ya funciona.

## Siguiente paso

Revisar estos documentos y confirmar los supuestos. Después se implementa Fase 1: repositorio, Supabase staging, esquema, RLS, login y despliegue.
