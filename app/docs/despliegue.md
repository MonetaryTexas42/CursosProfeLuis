# Despliegue y reversión (OPS-04)

El despliegue del frontend ya no se hace con `git push -f` desde una copia
local. Lo hace el workflow `.github/workflows/ci.yml` cuando hay un push a
`main`.

## Qué ejecuta el workflow

1. `npm ci` en `app/frontend` y `app/scripts`.
2. `node scripts/privacy-doc.mjs --check`: falla si el aviso publicado y su
   manifiesto no coinciden.
3. `npm run build -- --base=/CursosProfeLuis/` con los secretos de producción.
4. Suite de RLS contra staging, si existe el secreto `STAGING_DATABASE_URL`.
   Un fallo bloquea el despliegue.
5. Publicación del contenido de `app/frontend/dist` en la rama `gh-pages`
   con `peaceiris/actions-gh-pages` (sin `--force`).
6. Etiqueta `deploy-<sha corto>` en el commit desplegado.
7. Health check: portal y `privacidad.html` con la versión vigente.

## Secretos necesarios

| Secreto | Uso | Obligatorio |
|---|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto de producción | Sí, para desplegar |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (`anon`) | Sí, para desplegar |
| `STAGING_DATABASE_URL` | Conexión directa a staging para RLS | Recomendado |

Nunca se guarda `service_role` ni la cadena `postgresql://...` en el
repositorio.

## Reversión en menos de 15 minutos

### Opción A · Revertir el commit (recomendada)

```bash
git revert <sha-del-commit-malo>
git push origin main
```

El workflow reconstruye y publica el estado anterior. No se usa `push -f`.

### Opción B · Volver a una etiqueta

```bash
git checkout deploy-<sha-bueno>
git switch -c rollback/<fecha>
git push origin rollback/<fecha>
```

Abre un PR a `main`; al fusionarlo, CI publica esa versión.

### Opción C · Re-ejecutar un workflow anterior

En GitHub → Actions → el workflow del commit bueno → **Re-run all jobs**. El
health check confirma que Pages sirvió la versión esperada.

## Comprobaciones posteriores

- `https://monetarytexas42.github.io/CursosProfeLuis/` responde 200.
- `https://monetarytexas42.github.io/CursosProfeLuis/privacidad.html` muestra
  la versión vigente (`v3-2026`).
- El panel de cada rol carga sin errores de configuración.
- La suite de RLS termina con 0 FAIL (cuando staging esté disponible).

## Notas

- El repositorio es público (requisito de Pages en plan gratuito). No se
  publican secretos ni PII.
- `frontend/public/env.js` se genera en cada build y está ignorado.
- Si el health check falla, el despliegue queda marcado como fallido y se
  aplica la reversión.
