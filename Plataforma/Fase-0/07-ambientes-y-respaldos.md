# 07 · Ambientes, despliegue y respaldos

## Ambientes

| Ambiente | Frontend | Supabase | Datos | Quién accede |
|---|---|---|---|---|
| Local | `http://localhost:5173` | Proyecto local o staging | Semilla ficticia | Desarrollo |
| Staging | `https://staging.app.ecoems.mx` | Proyecto staging | Ficticios o copia anonimizada | Equipo y profesor piloto |
| Producción | `https://app.ecoems.mx` | Proyecto producción | Alumnos reales | Profesor, alumnos, tutores |

Los dominios están elegidos. Falta registrarlos y configurar el DNS antes de Fase 1.

Reglas:

- Nunca se prueba con datos reales en staging sin anonimizar.
- Producción no se usa para experimentos.
- Cada ambiente tiene su propio proyecto de Supabase.
- Las llaves y contraseñas son distintas por ambiente.

## Dominios y correo

| Uso | Valor elegido |
|---|---|
| App | `app.ecoems.mx` |
| Staging | `staging.app.ecoems.mx` |
| Correo de alumnos | `alumnos.ecoems.mx` |
| Envío de correo | `notificaciones.ecoems.mx` |
| Privacidad | `privacidad@ecoems.mx` |
| Soporte | `soporte@ecoems.mx` |

Configurar en Cloudflare:

- DNS de la app.
- Registros SPF, DKIM y DMARC del proveedor de correo.
- HTTPS obligatorio.
- Redirección de `www` si aplica.

El dominio sintético de alumnos no recibe correo. Solo se usa como identificador de Auth.

## Variables de entorno

Frontend (públicas):

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STUDENT_EMAIL_DOMAIN
VITE_APP_ENV
VITE_SENTRY_DSN (opcional)
```

Edge Functions (secretas):

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_URL
RESEND_API_KEY o SENDGRID_API_KEY
EMAIL_FROM
APP_BASE_URL
PDF_SIGNING_SECRET
```

Reglas:

- La `anon key` puede estar en el frontend; la seguridad depende de RLS.
- La `service_role` nunca se expone al navegador.
- Los secretos se guardan en Supabase y en el gestor de secretos del equipo.
- No se suben `.env` al repositorio.
- Se rota cualquier llave que se haya expuesto.

## Repositorio y migraciones

```text
plataforma/
  frontend/
  supabase/
    migrations/
      0001_extensions.sql
      0002_enums.sql
      0003_tables.sql
      0004_functions.sql
      0005_rls.sql
    seed.sql
    functions/
      admin-create-student/
      admin-reset-student-password/
      invite-guardian/
      send-guardian-message/
      generate-report-pdf/
  docs/
```

Reglas:

- Los cambios de esquema se hacen con migraciones versionadas.
- No se edita el esquema de producción a mano.
- Cada migración se prueba en staging.
- `seed.sql` solo crea catálogos y datos ficticios.
- Los datos reales se cargan con un script controlado, no con `seed.sql`.

## Flujo de despliegue

1. Desarrollo en rama `feature/...`.
2. Pull request a `develop`.
3. CI: lint, typecheck, pruebas y build.
4. Despliegue automático de frontend a staging.
5. Migraciones a staging.
6. Pruebas de humo y RLS.
7. Aprobación.
8. Merge a `main`.
9. Despliegue a producción.
10. Migraciones a producción con respaldo previo.
11. Verificación posterior.

## Rollback

- **Frontend:** volver al despliegue anterior en Cloudflare Pages.
- **Migración:** restaurar respaldo o aplicar migración inversa probada.
- **Contenido:** volver a la versión anterior; nunca borrar versiones publicadas.
- **Cuentas:** desactivar, no borrar, salvo solicitud legal.

Toda migración debe tener:

- Respaldo previo.
- Script de reversión o plan de restauración.
- Responsable y ventana de ejecución.
- Verificación posterior.

## Respaldos

| Tipo | Frecuencia | Retención | Dónde |
|---|---|---|---|
| Automático de Supabase | Diario | Según plan | Supabase |
| PITR | Continuo, si el plan lo permite | 7 días o más | Supabase |
| Export lógico | Semanal | 8 semanas | Almacenamiento cifrado |
| Export mensual | Mensual | 6 meses | Almacenamiento cifrado |
| Antes de migración | Manual | Hasta validar | Almacenamiento cifrado |

Objetivos para el piloto:

- **RPO:** 24 horas máximo.
- **RTO:** 4 horas máximo.
- **Prueba de restauración:** antes del piloto y después cada mes.

## Procedimiento de restauración

1. Confirmar el incidente y el alcance.
2. Congelar escrituras si es necesario.
3. Elegir el respaldo o punto en el tiempo.
4. Restaurar en un proyecto de staging.
5. Validar conteos, usuarios, contenido y RLS.
6. Restaurar producción o promover staging.
7. Verificar login, progreso, asistencia y calificaciones.
8. Documentar el incidente y la causa.

## Monitoreo

- Errores de frontend (Sentry o equivalente).
- Logs de Edge Functions.
- Latencia y errores de Supabase.
- Estado del despliegue de Cloudflare.
- Rebotes y quejas de correo.
- Alertas de respaldo fallido.
- Revisión semanal de `audit_log`.

## Seguridad operativa

- MFA en Supabase, Cloudflare y correo.
- Acceso mínimo al proyecto.
- Sin cuentas compartidas.
- Rotación de llaves al salir un colaborador.
- Revisión de dependencias antes de cada fase.
- Bloqueo de `service_role` fuera de Edge Functions.
- Registro de quién ejecutó migraciones.

## Costos iniciales estimados

| Servicio | Estimado mensual |
|---|---|
| Supabase (plan inicial) | USD 0–25 |
| Cloudflare Pages | USD 0 |
| Correo transaccional | USD 0–20 |
| Dominio | USD 10–20 al año |
| PDF/monitoreo | USD 0–20 |

Los costos crecen con almacenamiento, correos y uso. Se revisan antes del piloto.

## Checklist de salida

- [ ] Tres ambientes separados.
- [ ] Dominio y subdominios configurados.
- [ ] Correo con SPF, DKIM y DMARC.
- [ ] Variables de entorno documentadas.
- [ ] Migraciones versionadas.
- [ ] CI/CD funcionando.
- [ ] Respaldo automático activo.
- [ ] Restauración probada.
- [ ] Monitoreo activo.
- [ ] Responsable de incidentes definido.
