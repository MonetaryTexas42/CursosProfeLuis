# 05 · Privacidad y consentimiento

> **Borrador operativo.** No sustituye una revisión legal. Antes del piloto, un abogado debe validar el aviso, la carta de consentimiento y los plazos de conservación conforme a la legislación aplicable en México.

## Datos que se recaban

### Del alumno

- Nombre completo, fecha de nacimiento, grupo, matrícula.
- Usuario, contraseña (solo Supabase la almacena cifrada), correo sintético.
- Progreso, respuestas, intentos, puntajes, tiempo de uso.
- Resultados de lectura: palabras por minuto, comprensión, errores.
- Resultados de juegos y retos.
- Asistencia, calificaciones, tareas físicas y observaciones.
- Intereses, aptitudes y notas de orientación vocacional.
- Consentimiento del tutor.

### Del tutor

- Nombre, correo, teléfono, parentesco.
- Vínculo con el alumno.
- Mensajes leídos y consentimiento aceptado.

### Técnicos

- Fecha y hora de acceso, IP, navegador y registros de auditoría.
- No se usan cookies publicitarias ni rastreadores de terceros.

## Finalidades

1. Operar la plataforma educativa.
2. Registrar avance y personalizar recomendaciones.
3. Informar al tutor sobre asistencia, calificaciones y observaciones.
4. Generar reportes y métricas del grupo.
5. Mantener seguridad, respaldos y auditoría.
6. Cumplir obligaciones escolares y legales.

No se usan los datos para publicidad ni se venden a terceros.

## Base legal y consentimiento

- El tutor del alumno menor de edad debe aceptar el aviso de privacidad y otorgar consentimiento para el tratamiento de datos personales del menor.
- El consentimiento se registra con fecha, versión del aviso, identificador del tutor y del alumno.
- El alumno mayor de edad puede consentir por sí mismo.
- La negativa del tutor impide el uso de la plataforma por el alumno, salvo los datos estrictamente necesarios para la relación escolar.
- El consentimiento es revocable, sin efectos retroactivos, sujeto a obligaciones de conservación.

## Aviso de privacidad simplificado

```text
AVISO DE PRIVACIDAD

[NOMBRE DE LA INSTITUCIÓN], con domicilio en [DOMICILIO], es responsable de los datos personales que recaba a través de la plataforma ECOEMS.

Datos que recaba: nombre, fecha de nacimiento, matrícula, usuario, avance académico, respuestas, calificaciones, asistencia, resultados de lectura y juegos, observaciones del profesor y datos de contacto del tutor.

Finalidades: operar la plataforma, dar seguimiento académico, informar al tutor, generar reportes y mantener la seguridad del servicio. No se usan para publicidad ni se venden a terceros.

El tutor del alumno menor de edad debe aceptar este aviso y otorgar su consentimiento. Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición escribiendo a [CORREO DE PRIVACIDAD].

Consulte el aviso integral en [URL DEL AVISO].

Última actualización: [FECHA].
Versión: [VERSIÓN].
```

## Aviso de privacidad integral: esqueleto

1. Identidad y domicilio del responsable.
2. Datos personales recabados, distinguiendo datos de menores.
3. Datos sensibles, si los hubiera. En este proyecto no se prevén datos sensibles; si se agregan, requieren consentimiento expreso.
4. Finalidades primarias y secundarias. Si no hay secundarias, declararlo.
5. Fundamentos legales y, en su caso, consentimiento.
6. Transferencias y remisiones. Indicar proveedores de nube, correo y PDF.
7. Mecanismos para ejercer derechos ARCO.
8. Medios para revocar el consentimiento.
9. Medidas de seguridad.
10. Plazos de conservación.
11. Uso de cookies y tecnologías de rastreo.
12. Cambios al aviso.
13. Contacto del responsable y, si aplica, del oficial de privacidad.
14. Autoridad competente.

## Carta de consentimiento para tutores

```text
CARTA DE CONSENTIMIENTO

[NOMBRE DE LA INSTITUCIÓN]
[CICLO ESCOLAR]

Yo, [NOMBRE COMPLETO DEL TUTOR], con parentesco de [PARENTESCO] de [NOMBRE COMPLETO DEL ALUMNO], con fecha de nacimiento [FECHA], declaro que:

1. He leído y entiendo el Aviso de Privacidad versión [VERSIÓN], disponible en [URL].
2. Autorizo el tratamiento de los datos personales del alumno para las finalidades educativas descritas.
3. Autorizo el uso de su avance, calificaciones, asistencia y resultados de lectura/juegos para dar seguimiento y generar reportes.
4. Autorizo que el profesor y la institución me contacten por correo electrónico y portal para informarme sobre el alumno.
5. Entiendo que puedo solicitar acceso, rectificación, cancelación u oposición, y revocar este consentimiento, mediante [MEDIO].
6. Entiendo que la negativa o revocación puede impedir el uso de la plataforma.

Datos de contacto:
Correo: [CORREO]
Teléfono: [TELÉFONO]

Firma: ______________________________
Nombre: _____________________________
Fecha: ______________________________

Para uso de la institución:
Consentimiento registrado por: ____________________
Fecha y hora: ____________________
Versión del aviso: ____________________
Identificador: ____________________
```

## Registro de consentimiento

`privacy_consents` guarda:

- `student_id`
- `guardian_id`
- `document_version`
- `accepted_at`
- `ip`
- `user_agent`
- `metadata` con el texto exacto o su hash

No se reutiliza un consentimiento para una versión nueva del aviso. Si cambia el aviso, se solicita nueva aceptación.

## Conservación

Propuesta sujeta a revisión legal:

| Dato | Conservación |
|---|---|
| Expediente académico | Mientras dure la relación escolar y el plazo legal aplicable. |
| Progreso e intentos | Mientras dure la cuenta; se pueden anonimizar al egreso. |
| Asistencia y calificaciones | Plazo escolar y legal aplicable. |
| Mensajes y observaciones | Hasta 1 año después del egreso, salvo obligación mayor. |
| Logs de auditoría | 1 año. |
| Respaldos | 30 días rotativos; el respaldo mensual, 6 meses. |
| Consentimientos | Mientras dure el tratamiento y el plazo legal. |

Al vencer, se eliminan o anonimizan de forma segura.

## Medidas de seguridad

- RLS en todas las tablas.
- Principio de mínimo privilegio.
- `service_role` solo en Edge Functions; nunca en el frontend.
- HTTPS obligatorio.
- Contraseñas gestionadas por Supabase Auth.
- Sesiones con expiración.
- Registro de auditoría para accesos administrativos.
- Respaldos cifrados y pruebas de restauración.
- Acceso al panel de Supabase limitado y con MFA.
- Revisión de dependencias y secretos.
- No se registran contraseñas ni tokens en logs.

## Derechos de los titulares

Canales:

- Correo: `[CORREO DE PRIVACIDAD]`
- Portal: formulario para tutor.
- Presencial: `[DOMICILIO]`

Proceso:

1. Recepción y registro.
2. Verificación de identidad.
3. Respuesta en el plazo legal.
4. Ejecución y registro.

## Checklist antes del piloto

- [ ] Aviso integral revisado por abogado.
- [ ] Aviso simplificado publicado en la app.
- [ ] Carta de consentimiento aprobada.
- [ ] Correo de privacidad activo.
- [ ] Versión del aviso registrada en `settings`.
- [ ] Flujo de aceptación probado con un tutor real.
- [ ] Política de retención aprobada.
- [ ] Responsable de privacidad designado.
- [ ] Procedimiento ARCO documentado.
- [ ] Proveedores de nube/correo identificados en el aviso.
