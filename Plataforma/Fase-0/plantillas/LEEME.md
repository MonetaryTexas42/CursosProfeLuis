# Plantilla del piloto

Archivo: `piloto.csv`
Codificación: UTF-8.
Separador: coma.
Una fila por alumno y tutor principal. Para un segundo tutor, duplicar la fila del alumno con los datos del otro tutor.

## Columnas

| Columna | Obligatoria | Regla |
|---|---|---|
| `student_code` | Sí | Único por ciclo. Texto. |
| `student_name` | Sí | Nombre completo. |
| `birth_date` | Sí | `AAAA-MM-DD`. |
| `group_name` | Sí | Debe existir o crearse antes de importar. |
| `username` | Sí | Minúsculas, sin espacios; único; 3–32 caracteres. |
| `temp_password` | No | Se deja vacío; el sistema genera una temporal. |
| `guardian_name` | Sí | Nombre completo del tutor. |
| `guardian_relationship` | Sí | madre, padre, tutor, abuela, abuelo, tía, tío, otro. |
| `guardian_email` | Sí | Correo válido y único por tutor. |
| `guardian_phone` | No | 10 dígitos; puede incluir lada. |
| `is_primary` | Sí | `si` o `no`. Solo un principal por alumno. |
| `consent_status` | Sí | `pendiente`, `aceptado` o `rechazado`. |
| `notes` | No | Texto libre; no incluir datos sensibles innecesarios. |

## Reglas de importación

1. Validar encabezados y tipos antes de crear cuentas.
2. Rechazar usuarios y correos duplicados.
3. No crear cuentas si el tutor no tiene correo válido.
4. Generar contraseñas temporales aleatorias; no importarlas del CSV.
5. Entregar credenciales de alumno en papel o en un archivo seguro; nunca por WhatsApp.
6. Enviar invitación al tutor y registrar consentimiento.
7. Si un tutor ya existe, reutilizar su cuenta y agregar el vínculo.
8. Importar primero en staging con datos ficticios.
9. No usar datos reales en staging.
10. Guardar el CSV real fuera del repositorio y eliminarlo después de la carga.

## Ejemplo de validación

- `P003` y `P004` comparten el mismo correo de tutor. Es válido: el sistema debe crear un solo usuario de tutor y dos vínculos.
- `temp_password` vacío es correcto: la contraseña se genera en el sistema.
- `consent_status` inicia en `pendiente` hasta que el tutor acepte.
