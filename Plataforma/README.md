# Plataforma ECOEMS

Repositorio de trabajo de la nueva plataforma. El curso actual sigue intacto en `../curso/`.

## Carpetas

| Ruta | Contenido |
|---|---|
| `Fase-0/` | Especificación, ERD, RLS, auth, privacidad, criterios, wireframes y SQL propuesto. |
| `app/frontend/` | Vite + JS; login y shell por rol. |
| `app/supabase/` | Migraciones y notas de base de datos. |
| `app/docs/` | Enlaces a la especificación. |

## Estado

- Fase 0 cerrada y supuestos confirmados.
- Fase 1 iniciada en local.
- Pendiente: políticas RLS, usuarios ficticios, proyecto staging y despliegue.

## Abrir

- [Índice de Fase 0](Fase-0/FASE-0.html)
- [Wireframes](Fase-0/WIREFRAMES.html)
- [App](app/README.md)

## Arranque local

```bash
cd app/frontend
cp .env.example .env
npm install
npm run dev
```

Sin variables de Supabase, la app muestra la pantalla de configuración. No se cargan datos reales.

## Siguiente paso

Implementar `app/supabase/migrations/0003_rls.sql` y probar la matriz de permisos con usuarios ficticios.
