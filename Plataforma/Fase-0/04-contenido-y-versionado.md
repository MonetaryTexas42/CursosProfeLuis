# 04 · Contenido y versionado

## Objetivo

Migrar el contenido actual sin romper el curso, definir un formato estable y separar “publicar” de “activar”.

## Situación actual

- `curso/js/data.js` es un archivo minificado con `const DATA`.
- Hay 11 materias; 4 tienen contenido.
- 60 unidades y 540 ejercicios en total.
- Las unidades usan `tipo` y `reto`.
- Los ejercicios usan `q`, `a`, `p`, `v`, `pasos`, `fig`.
- No existe un arreglo `quiz`.
- Las 7 materias restantes están vacías.

## Modelo

```text
subjects
  └── units
        └── unit_versions (contenido JSON inmutable al publicar)
              └── unit_assignments (grupo + versión + fechas)
                    └── unit_progress (alumno)
```

Una unidad puede tener varias versiones. Una asignación siempre apunta a una versión exacta.

## Esquema JSON propuesto

```json
{
  "schemaVersion": 1,
  "unit": {
    "key": "espanol-u01",
    "subjectKey": "espanol",
    "num": 1,
    "title": "La comunicación",
    "objective": "Reconocer los elementos del proceso comunicativo.",
    "estimatedMinutes": 35
  },
  "sections": [
    {
      "key": "concepto-01",
      "type": "lesson",
      "title": "¿Qué es comunicar?",
      "body": "Texto en Markdown."
    },
    {
      "key": "ejemplo-01",
      "type": "example",
      "title": "Ejemplo",
      "body": "Texto en Markdown.",
      "figure": null
    },
    {
      "key": "ejercicio-01",
      "type": "exercise",
      "prompt": "¿Cuál es el emisor?",
      "options": ["Ana", "El mensaje", "El canal", "El ruido"],
      "correctIndex": 0,
      "explanation": "Ana produce el mensaje.",
      "difficulty": 1,
      "skills": ["comunicacion"],
      "steps": [],
      "figure": null
    }
  ],
  "quiz": [
    {
      "key": "reto-01",
      "part": "tipo",
      "prompt": "Pregunta de práctica.",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 1,
      "explanation": "Justificación.",
      "skills": ["comunicacion"]
    }
  ],
  "reto": {
    "key": "reto-principal",
    "title": "Reto de la unidad",
    "prompt": "Resuelve el caso.",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 2,
    "explanation": "Justificación."
  },
  "resources": []
}
```

## Reglas de claves

- `subjectKey`: texto estable, por ejemplo `espanol`, `matematicas`.
- `unit.key`: texto único por materia, por ejemplo `espanol-u01`. No cambia al editar.
- `section.key` y `question.key`: únicos dentro de la versión. No se renumeran después de publicar.
- `exercise_key` en intentos usa la misma clave de la sección.
- Si se elimina una pregunta, la clave no se reutiliza en la misma versión.
- Si se crea una versión nueva, puede cambiar el contenido, pero las claves deben conservarse cuando la pregunta sea equivalente.

## Estados

| Entidad | Estados | Regla |
|---|---|---|
| `units` | `draft`, `published`, `archived` | Solo publicadas se pueden asignar. |
| `unit_versions` | borrador o publicada | Publicada es inmutable. |
| `unit_assignments` | `draft`, `active`, `closed` | Solo activa es visible al alumno. |

## Flujo de publicación

1. El profesor/admin crea o edita un borrador.
2. El sistema valida el JSON contra el esquema.
3. Se calcula un checksum SHA-256 del JSON canónico.
4. Al publicar:
   - se crea una `unit_version` con número incremental,
   - se guarda `published_at` y `published_by`,
   - la versión queda inmutable,
   - la unidad pasa a `published` si es la primera versión.
5. Publicar no asigna. La unidad sigue sin aparecer al alumno.

## Flujo de activación

1. El profesor elige grupo, unidad, versión, fecha de apertura y cierre.
2. Se crea `unit_assignments` con `status = active`.
3. Los alumnos del grupo ven la unidad en su panel.
4. Si se cierra, deja de ser visible, pero el progreso se conserva.
5. Si se necesita reabrir, se crea una nueva asignación o se cambia el estado con auditoría.

## Validaciones

- El JSON debe tener `schemaVersion`, `unit.key`, `sections` y al menos una pregunta.
- `correctIndex` debe estar dentro del rango de `options`.
- No puede haber claves duplicadas.
- Las preguntas deben tener al menos dos opciones.
- `estimatedMinutes` debe ser mayor que cero.
- La suma de pesos de evaluación, si existe, debe ser coherente.
- El checksum debe coincidir con el contenido guardado.

## Migración desde `data.js`

No se migra el archivo minificado directamente a producción. Se sigue este proceso:

1. Extraer `DATA` con Node en un entorno controlado.
2. Normalizar materias, unidades y ejercicios a un JSON legible.
3. Mapear:
   - `q` → `prompt`
   - `a` → `options`
   - `p` → respuesta correcta (validar semántica antes de convertir)
   - `v` → explicación o variante (validar semántica antes de convertir)
   - `pasos` → `steps`
   - `fig` → `figure`
   - `tipo` y `reto` → `quiz` y `reto`
4. Validar conteos: 60 unidades y 540 ejercicios.
5. Generar claves estables.
6. Revisar una muestra por materia con el profesor.
7. Publicar versión 1 de las 4 materias listas.
8. Dejar las 7 materias vacías en `draft` y desactivadas.

Los datos de demostración no se migran. El contenido real se carga limpio.

## Compatibilidad con el curso actual

Durante la transición:

- El curso actual sigue funcionando con `data.js`.
- La nueva app lee de Supabase.
- No se editan ambos a la vez.
- Cuando la nueva app esté validada, `data.js` queda como respaldo congelado.
- Las herramientas de lectura y matemáticas se integran por `postMessage` y guardan en Supabase mediante RPC.

## Contrato con las herramientas

Las herramientas actuales usan `localStorage`. Para integrarlas:

```js
// La app padre envía contexto
iframe.contentWindow.postMessage({
  type: 'ecoems:context',
  studentId,
  assignmentId,
  gameId
}, origin);

// La herramienta devuelve el resultado
window.parent.postMessage({
  type: 'ecoems:game-result',
  gameId,
  score,
  maxScore,
  accuracy,
  durationSeconds,
  metadata
}, parentOrigin);
```

La app valida el origen y guarda con RPC. El `localStorage` se conserva solo como respaldo temporal.

## Criterios de aceptación

- Una unidad publicada pero no asignada no es visible al alumno.
- Una unidad asignada y activa sí es visible.
- Al cerrar la asignación, la unidad desaparece del panel del alumno.
- El progreso previo sigue disponible para el profesor.
- Una versión publicada no se puede editar.
- Una versión nueva no altera asignaciones anteriores.
- Los conteos migrados coinciden con el contenido actual.
- Las claves de pregunta no cambian entre intentos de la misma versión.
