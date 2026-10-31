# Plataforma ECOEMS · CursosProfeLuis

Repositorio de trabajo de la nueva plataforma de aprendizaje del Prof. Luis. El curso actual sigue intacto en la carpeta local `../curso/`.

## Carpetas

| Ruta | Contenido |
|---|---|
| `Fase-0/` | Especificación, ERD, RLS, auth, privacidad, criterios, wireframes y SQL propuesto. |
| `app/frontend/` | Vite + JS; login y shell por rol. |
| `app/supabase/` | Migraciones y notas de base de datos. |
| `app/docs/` | Enlaces a la especificación. |

## Estado

- Fase 0 cerrada y supuestos confirmados.
- Fase 1 en curso.

## Arranque local

```bash
cd app/frontend
cp .env.example .env
npm install
npm run dev
```

Sin variables de Supabase, la app muestra la pantalla de configuración. No se cargan datos reales.
