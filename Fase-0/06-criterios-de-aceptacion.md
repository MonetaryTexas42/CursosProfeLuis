# 06 · Criterios de aceptación

## Definition of Done general

Una tarea termina cuando:

1. Cumple el criterio funcional.
2. Tiene prueba manual o automatizada.
3. Pasa RLS con usuarios de cada rol.
4. No expone secretos ni `service_role` en el frontend.
5. Funciona en Chrome y Safari actuales.
6. Es usable en laptop y tableta.
7. Tiene estados vacíos, de error y de carga.
8. Está documentada si cambia el modelo o los permisos.
9. Se probó con datos del piloto, no solo con datos de demo.
10. El profesor puede completar el flujo sin ayuda técnica.

## Fase 0 · Especificación

- [ ] ERD y diccionario aprobados.
- [ ] Matriz RLS aprobada.
- [ ] Flujos de login aprobados.
- [ ] Esquema de contenido aprobado.
- [ ] Aviso de privacidad y consentimiento en revisión legal.
- [ ] Plantilla del piloto validada.
- [ ] Criterios de aceptación aprobados.
- [ ] Plan de ambientes y respaldos aprobado.
- [ ] Backlog de Fase 1 priorizado.
- [ ] Wireframes revisados por el profesor.

**Salida:** documentos aprobados; cero cambios en producción.

## Fase 1 · Base técnica

- [ ] Repositorio con frontend Vite y estructura de carpetas.
- [ ] Supabase staging creado.
- [ ] Esquema SQL aplicado en staging.
- [ ] RLS activo en todas las tablas.
- [ ] Login de staff funciona.
- [ ] Login de alumno con usuario/contraseña funciona.
- [ ] Un usuario de cada rol ve solo lo que le corresponde.
- [ ] Despliegue automático a Cloudflare Pages.
- [ ] Variables de entorno documentadas.
- [ ] Respaldo manual probado y restauración verificada.
- [ ] Smoke test de login y cierre de sesión.

**Salida:** staging accesible; ningún dato real todavía.

## Fase 2 · Contenido y activación

- [ ] Las 4 materias listas migradas y validadas.
- [ ] Conteos: 60 unidades y 540 ejercicios.
- [ ] Una unidad publicada pero no asignada no aparece al alumno.
- [ ] Una unidad activa sí aparece.
- [ ] Al cerrar, desaparece del panel del alumno.
- [ ] El progreso se conserva al cerrar.
- [ ] El profesor puede previsualizar antes de activar.
- [ ] El alumno no puede leer una unidad de otro grupo.
- [ ] El editor valida JSON y muestra errores claros.
- [ ] Una versión publicada no se puede editar.

**Salida:** el profesor puede publicar y activar; el alumno puede estudiar.

## Fase 3 · Juegos y métricas

- [ ] Juegos actuales integrados por `postMessage`.
- [ ] Resultados se guardan en Supabase, no solo en localStorage.
- [ ] Lectura guarda WPM, comprensión y errores.
- [ ] Matemáticas guarda puntaje, precisión y duración.
- [ ] XP se registra en `xp_events`.
- [ ] Insignias se otorgan por reglas.
- [ ] Ranking personal y de grupo funciona.
- [ ] El profesor puede ocultar el ranking.
- [ ] Un alumno no ve el detalle de otro.
- [ ] Los datos sobreviven a recarga y cambio de dispositivo.

**Salida:** gamificación conectada y métricas confiables.

## Fase 4 · Panel del profesor

- [ ] Lista de grupos y alumnos.
- [ ] Activación por grupo y por alumno.
- [ ] Asistencia por sesión.
- [ ] Calificaciones por evaluación y periodo.
- [ ] Concentrado de tareas físicas.
- [ ] Observaciones internas y familiares.
- [ ] Filtros y búsqueda.
- [ ] Exportación CSV de asistencia y calificaciones.
- [ ] El profesor solo ve sus grupos.
- [ ] Acciones administrativas quedan en auditoría.

**Salida:** el profesor opera el piloto sin hojas de cálculo externas.

## Fase 5 · Expediente y padres

- [ ] Expediente del alumno con avance, métricas, asistencia y calificaciones.
- [ ] Perfil de intereses y aptitudes.
- [ ] Portal del tutor con enlace mágico.
- [ ] El tutor ve solo a sus hijos.
- [ ] Observaciones internas no son visibles para el tutor.
- [ ] Mensajes al tutor por portal y correo.
- [ ] PDF de reporte con permisos verificados.
- [ ] Consentimiento registrado con versión del aviso.
- [ ] Reenvío de invitación funciona.
- [ ] El tutor puede actualizar su correo/teléfono.

**Salida:** familia informada; expediente completo.

## Fase 6 · Diagnóstico y alertas

- [ ] Diagnóstico de 128 reactivos integrado.
- [ ] Resultado por materia y tema.
- [ ] Línea base por alumno.
- [ ] Alertas por inactividad, bajo desempeño y riesgo.
- [ ] El profesor ve alertas de su grupo.
- [ ] El alumno ve recomendaciones, no etiquetas estigmatizantes.
- [ ] Se puede exportar el diagnóstico.
- [ ] No se usan los resultados para ranking público.

**Salida:** el profesor detecta riesgos a tiempo.

## Fase 7 · Piloto

- [ ] Grupo de menos de 20 alumnos cargado.
- [ ] Tutores invitados y consentimiento aceptado.
- [ ] Capacitación de 30 minutos al profesor.
- [ ] Manual de uso de una página.
- [ ] Soporte por canal definido.
- [ ] Monitoreo de errores activo.
- [ ] Respaldo diario.
- [ ] Encuesta de satisfacción aplicada.
- [ ] Métricas del piloto medidas.
- [ ] Retroalimentación priorizada para la siguiente iteración.

**Salida:** piloto operando y evaluado.

## Pruebas transversales

### Seguridad

- [ ] `service_role` no aparece en el bundle.
- [ ] Un alumno no puede leer a otro.
- [ ] Un profesor no puede leer otro grupo.
- [ ] Un tutor no puede leer otro alumno.
- [ ] Un anónimo no puede leer tablas protegidas.
- [ ] No se pueden insertar intentos en asignaciones ajenas.
- [ ] Los tokens no se registran en logs.

### Datos

- [ ] No hay calificaciones duplicadas.
- [ ] No hay asistencia duplicada.
- [ ] No hay progreso duplicado por asignación.
- [ ] Los promedios cuadran con las calificaciones.
- [ ] Los conteos de contenido cuadran.
- [ ] Los respaldos restauran sin pérdida.

### Experiencia

- [ ] Carga inicial menor a 3 segundos en red escolar.
- [ ] Funciona en pantalla de 768 px.
- [ ] Mensajes de error en español, sin códigos técnicos.
- [ ] El alumno entiende qué sigue sin leer un manual.
- [ ] El profesor completa asistencia de 20 alumnos en menos de 3 minutos.
- [ ] El tutor encuentra el reporte de su hijo en menos de 2 clics.

### Operación

- [ ] Variables de entorno separadas por ambiente.
- [ ] Migraciones versionadas.
- [ ] Rollback documentado.
- [ ] Monitoreo y alertas configurados.
- [ ] Responsable de soporte definido.

## Escenario de demostración para cerrar cada fase

1. El profesor entra.
2. Crea o selecciona un grupo.
3. Activa una unidad.
4. El alumno entra, estudia y completa un ejercicio.
5. El progreso aparece en el panel del profesor.
6. El profesor registra asistencia y una observación familiar.
7. El tutor entra y ve el reporte, sin ver la observación interna.
8. El admin revisa la auditoría.

Si este recorrido falla, la fase no está terminada.
