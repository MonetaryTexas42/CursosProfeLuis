/* =====================================================================
   Material vocacional extraído del sistema legacy.
   Procedencia: app/frontend/public/curso/js/sistema2.js (legacy · 1704 líneas).
   Texto en español conservado literalmente. Módulo de datos puro: sin imports.
   ===================================================================== */

/* ---------------- Catálogos · Taller vocacional ---------------- */

/* legacy: INTERESES_SUGERIDOS */
export const INTERESTS = [
  "Ciencia y tecnología", "Computación y programación", "Matemáticas", "Salud y medicina",
  "Biología y naturaleza", "Química", "Física", "Arte y diseño", "Música", "Danza y teatro",
  "Lectura y escritura", "Idiomas", "Historia y cultura", "Ciencias sociales", "Derecho",
  "Negocios y economía", "Liderazgo y política", "Deportes", "Cocina y gastronomía",
  "Moda y belleza", "Construcción y mecánica", "Electrónica", "Videojuegos",
  "Medio ambiente", "Ayudar a las personas", "Educación y docencia", "Turismo y viajes"
];

/* legacy: APTITUDES_SUGERIDAS */
export const APTITUDES = [
  "Razonamiento lógico-matemático", "Comprensión lectora", "Expresión escrita", "Memoria",
  "Creatividad", "Trabajo en equipo", "Liderazgo", "Comunicación oral", "Organización",
  "Concentración", "Manualidad / habilidad técnica", "Resolución de problemas",
  "Imaginación espacial", "Cálculo mental", "Dibujo y trazo"
];

/* legacy: TIPOS_ESCUELA */
export const SCHOOL_TYPES = ["Bachillerato general", "Bachillerato técnico", "Carrera técnica", "Preparatoria", "Opción de trabajo", "Otro"];

/* legacy: INSTITUCIONES */
export const INSTITUTIONS = ["UNAM", "IPN", "Colegio de Bachilleres", "CONALEP", "DGETI (CBTIS)", "DGETA (CBTA)", "CECyTE", "UAEMéx", "UAM", "Privadas", "Otra"];

/* legacy: ESCUELAS · referencias de aciertos aproximadas (COMIPEMS, máx. 128) */
/* Referencias de aciertos aproximadas (COMIPEMS, máx. 128). Verificar corte oficial del año. */
export const SCHOOL_SCORE_REFERENCES = {
  "UNAM": [
    { n: "ENP 1 Gabino Barreda", r: "100–108" },
    { n: "ENP 2 Erasmo Castellanos Quinto", r: "96–104" },
    { n: "ENP 3 Justo Sierra", r: "94–101" },
    { n: "ENP 4 Vidal Castañeda y Nájera", r: "93–100" },
    { n: "ENP 5 José Vasconcelos", r: "95–102" },
    { n: "ENP 6 Antonio Caso", r: "94–101" },
    { n: "ENP 7 Ezequiel A. Chávez", r: "92–99" },
    { n: "ENP 8 Miguel E. Schulz", r: "91–98" },
    { n: "ENP 9 Pedro de Alba", r: "108–115" },
    { n: "CCH Azcapotzalco", r: "86–93" },
    { n: "CCH Naucalpan", r: "88–95" },
    { n: "CCH Oriente", r: "80–87" },
    { n: "CCH Sur", r: "90–97" },
    { n: "CCH Vallejo", r: "88–95" }
  ],
  "IPN": [
    { n: "CECyT 1 Gonzalo Vázquez Vela", r: "95–102" },
    { n: "CECyT 2 Miguel Bernard", r: "80–88" },
    { n: "CECyT 3 Estanislao Ramírez Ruiz", r: "99–106" },
    { n: "CECyT 4 Lázaro Cárdenas", r: "88–95" },
    { n: "CECyT 5 Benito Juárez", r: "89–96" },
    { n: "CECyT 6 Miguel Othón de Mendizábal", r: "85–92" },
    { n: "CECyT 7 Cuauhtémoc", r: "90–97" },
    { n: "CECyT 8 Narciso Bassols", r: "87–94" },
    { n: "CECyT 9 Juan de Dios Bátiz", r: "101–109" },
    { n: "CECyT 10 Carlos Vallejo Márquez", r: "88–95" },
    { n: "CECyT 11 Wilfrido Massieu", r: "91–99" },
    { n: "CECyT 12 José María Morelos", r: "90–97" },
    { n: "CECyT 13 Ricardo Flores Magón", r: "82–90" },
    { n: "CECyT 14 Luis Enrique Erro", r: "80–88" },
    { n: "CECyT 15 Diódoro Antúnez Echegaray", r: "80–87" }
  ],
  "Colegio de Bachilleres": [
    { n: "Plantel 1 El Rosario", r: "74–82" },
    { n: "Plantel 2 Cien Metros", r: "72–80" },
    { n: "Plantel 3 Iztacalco", r: "70–78" },
    { n: "Plantel 4 Lázaro Cárdenas", r: "68–76" },
    { n: "Plantel 5 Satélite", r: "72–80" },
    { n: "Plantel 8 Tepepan", r: "76–84" },
    { n: "Plantel 9 Aragón", r: "70–78" },
    { n: "Plantel 13 Xochimilco", r: "74–82" }
  ],
  "CONALEP": [
    { n: "Plantel 1 (CDMX)", r: "66–74" },
    { n: "Plantel 2 (CDMX)", r: "64–72" },
    { n: "Plantel 3 (CDMX)", r: "62–70" },
    { n: "Plantel Estado de México", r: "60–68" }
  ],
  "DGETI (CBTIS)": [
    { n: "CBTIS 1", r: "72–80" },
    { n: "CBTIS 3", r: "70–78" },
    { n: "CBTIS 4", r: "68–76" },
    { n: "CBTIS 7", r: "68–76" },
    { n: "CBTIS 55", r: "66–74" }
  ],
  "DGETA (CBTA)": [
    { n: "CBTA 1", r: "64–72" },
    { n: "CBTA 2", r: "62–70" }
  ],
  "CECyTE": [
    { n: "CECyTE 1", r: "62–70" },
    { n: "CECyTE 2", r: "60–68" }
  ],
  "UAEMéx": [
    { n: "Prepa 1 San Mateo", r: "74–82" },
    { n: "Prepa 2 Texcoco", r: "70–78" },
    { n: "Prepa 3 Toluca", r: "68–76" }
  ],
  "UAM": [],
  "Otra": []
};

/* legacy: INSTITUCION_INFO */
export const SCHOOL_INFO = {
  "UNAM": {
    desc: "Preparatorias de la UNAM (ENP y CCH). Formación general, humanista y científica; es la vía 'tradicional' para entrar a licenciaturas UNAM.",
    pase: "Pase de bachillerato: al pasar todas las materias obtienes tu certificado y, si tienes buen promedio, aseguras un lugar por el 'pase directo' a licenciatura UNAM (según cupo y carrera).",
    uni: "Sí. Pase directo a cualquier licenciatura de la UNAM por promedio; también puedes ir a otras universidades."
  },
  "IPN": {
    desc: "Vocacionales del IPN (CECyT). Bachillerato tecnológico bivalente: estudias temas de bachillerato y una tecnicatura (carrera técnica).",
    pase: "Pase de bachillerato y TecNM: al acreditar la tecnicatura obtienes un título técnico y puedes continuar a licenciatura del IPN (pase directo, según cupo).",
    uni: "Sí. Las carreras del IPN dan pase directo a ingeniería/licenciatura del IPN; el título técnico te permite trabajar al terminar."
  },
  "Colegio de Bachilleres": {
    desc: "Preparatorias públicas de la CDMX. Bachillerato general, con opción a 'pase' a la UNAM u otras universidades.",
    pase: "No tiene pase directo garantizado; se ingresa por examen.",
    uni: "Sí, pero por examen de admisión (UNAM, IPN, etc.)."
  },
  "CONALEP": {
    desc: "Educación media superior técnica (profesional técnico bachiller). Te vuelves técnico en una carrera (mecánica, informática, alimentos, etc.).",
    pase: "No hay pase directo a universidad; te certifica como Profesional Técnico Bachiller.",
    uni: "Sí, por examen. El título técnico te ayuda a incorporarte al trabajo antes de la universidad."
  },
  "DGETI (CBTIS)": {
    desc: "Bachillerato tecnológico bivalente (federal). Combina preparatoria con una carrera técnica (CBTIS).",
    pase: "No hay pase directo automático; certificado de bachillerato + técnico.",
    uni: "Sí, por examen (IPN, UNAM, tecnológicos)."
  },
  "DGETA (CBTA)": {
    desc: "Bachillerato técnico agropecuario (CBTA). Enfocado a producción y campo.",
    pase: "No hay pase directo; certificado de bachillerato técnico agropecuario.",
    uni: "Sí, por examen (universidades agropecuarias y afines)."
  },
  "CECyTE": {
    desc: "Colegio de Estudios Científicos y Tecnológicos del Estado de México. Bachillerato tecnológico estatal.",
    pase: "No hay pase directo; bachillerato + técnico.",
    uni: "Sí, por examen (UAEMéx, tecnológicos)."
  },
  "UAEMéx": {
    desc: "Preparatorias de la Universidad Autónoma del Estado de México. Cerca de Cuautitlán y con pase al nivel superior de la propia universidad.",
    pase: "Pase (interno) a las licenciaturas de la UAEMéx al concluir con buen promedio.",
    uni: "Sí. La UAEMéx ofrece pase interno a sus licenciaturas; también puedes aplicar a otras."
  },
  "UAM": {
    desc: "Universidad Autónoma Metropolitana. No tiene bachillerato propio; se entra a licenciatura por examen.",
    pase: "—",
    uni: "Es universidad; se ingresa a licenciatura por examen."
  },
  "Privadas": {
    desc: "Escuelas particulares (preparatorias privadas). Suele haber opción bilingüe, grupos pequeños y acompañamiento; el costo es alto. Verifica su RVOE o incorporación (UNAM/IPN/UAEMéx) para saber qué certificado otorgan.",
    pase: "No hay 'pase' automático a universidad pública; muchas están incorporadas y puedes presentar examen de admisión como cualquier egresado.",
    uni: "Sí, por examen (o por pase a la universidad privada del mismo grupo). Revisa si está incorporada a UNAM/IPN/UAEMéx."
  },
  "Otra": { desc: "Otras instituciones.", pase: "—", uni: "—" }
};

/* Alias legados / alternativos */
export const INSTITUTION_INFO = SCHOOL_INFO;
export const SCHOOLS_BY_INSTITUTION = SCHOOL_SCORE_REFERENCES;

/* legacy: CAT_FIELDS / CAT_ROWS / CATALOGO · datos aproximados (verificar) */
export const CATALOG_FIELDS = ["inst", "nombre", "tipo", "zona", "km", "tiempo", "aciertos", "pase", "fuerte", "orienta", "carreras", "uni", "tags"];

export const CATALOG_ROWS = [
  ["UNAM", "ENP 1 Gabino Barreda", "Bachillerato general", "Coyoacán, CDMX", "40", "1 h 25", "100–108", "Pase directo UNAM (por promedio)", "Formación general y humanista de alto nivel", "Ciencias, humanidades y salud", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Humanidades", "Salud"]],
  ["UNAM", "ENP 2 Erasmo Castellanos Quinto", "Bachillerato general", "Churubusco/Iztapalapa, CDMX", "42", "1 h 20", "96–104", "Pase directo UNAM (por promedio)", "Equilibrio ciencias/humanidades", "Ciencias y humanidades", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Humanidades"]],
  ["UNAM", "ENP 3 Justo Sierra", "Bachillerato general", "Centro, CDMX", "37", "1 h 10", "94–101", "Pase directo UNAM (por promedio)", "Humanidades y ciencias sociales", "Humanidades, sociales y artes", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Humanidades", "Sociales", "Arte"]],
  ["UNAM", "ENP 4 Vidal Castañeda y Nájera", "Bachillerato general", "Azcapotzalco, CDMX", "24", "50 min", "93–100", "Pase directo UNAM (por promedio)", "Ciencias exactas y experimentales", "Ciencias y tecnología", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Tecnología"]],
  ["UNAM", "ENP 5 José Vasconcelos", "Bachillerato general", "Texcoco/Aragón, Edomex", "32", "1 h 05", "95–102", "Pase directo UNAM (por promedio)", "Ciencias biológicas y de la salud", "Salud y ciencias experimentales", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Salud", "Ciencias"]],
  ["UNAM", "ENP 6 Antonio Caso", "Bachillerato general", "Santa María la Ribera, CDMX", "33", "1 h 05", "94–101", "Pase directo UNAM (por promedio)", "Ciencias y humanidades", "Ciencias y humanidades", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Humanidades"]],
  ["UNAM", "ENP 8 Miguel E. Schulz", "Bachillerato general", "Centro, CDMX", "37", "1 h 10", "91–98", "Pase directo UNAM (por promedio)", "Formación general", "Ciencias y humanidades", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Humanidades"]],
  ["UNAM", "ENP 9 Pedro de Alba", "Bachillerato general", "Lindavista, CDMX", "22", "50 min", "108–115", "Pase directo UNAM (por promedio)", "Alta exigencia académica; muy solicitada", "Ciencias, salud y humanidades", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Salud", "Humanidades"]],
  ["UNAM", "CCH Azcapotzalco", "Bachillerato general", "Azcapotzalco, CDMX", "22", "45 min", "86–93", "Pase directo UNAM (por promedio)", "Modelo CCH: científico-humanístico", "Ciencias y humanidades", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Humanidades"]],
  ["UNAM", "CCH Naucalpan", "Bachillerato general", "Naucalpan, Edomex", "20", "40 min", "88–95", "Pase directo UNAM (por promedio)", "CCH con enfoque científico-humanístico", "Ciencias y humanidades", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Humanidades"]],
  ["UNAM", "CCH Vallejo", "Bachillerato general", "GAM, CDMX", "20", "40 min", "88–95", "Pase directo UNAM (por promedio)", "CCH con talleres y laboratorios", "Ciencias, salud y técnicas", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Ciencias", "Salud", "Tecnología"]],
  ["UNAM", "CCH Sur", "Bachillerato general", "Coyoacán, CDMX", "43", "1 h 25", "90–97", "Pase directo UNAM (por promedio)", "CCH con orientación a ciencias y salud", "Salud y ciencias experimentales", "No ofrece carrera técnica", "Pase directo a licenciaturas UNAM", ["Salud", "Ciencias"]],
  ["IPN", "CECyT 1 Gonzalo Vázquez Vela", "Bachillerato tecnológico", "Zacatenco, GAM, CDMX", "27", "55 min", "95–102", "Pase directo IPN (por promedio)", "Ingeniería y ciencias físico-matemáticas", "Tecnología e ingeniería", "Tecnicatura (varias)", "Pase a ingenierías del IPN; título técnico", ["Tecnología", "Ciencias"]],
  ["IPN", "CECyT 3 Estanislao Ramírez Ruiz", "Bachillerato tecnológico", "Zacatenco, GAM, CDMX", "27", "55 min", "99–106", "Pase directo IPN (por promedio)", "Ingeniería de alto nivel; muy solicitada", "Ingeniería y tecnología", "Tecnicatura (varias)", "Pase a ingenierías del IPN; título técnico", ["Tecnología", "Ciencias"]],
  ["IPN", "CECyT 6 Miguel Othón de Mendizábal", "Bachillerato tecnológico", "Casco de Santo Tomás, CDMX", "30", "1 h", "85–92", "Pase directo IPN (por promedio)", "Ciencias de la salud y biológicas", "Salud y ciencias biológicas", "Tecnicatura (salud)", "Pase a licenciaturas IPN (salud); título técnico", ["Salud", "Ciencias"]],
  ["IPN", "CECyT 9 Juan de Dios Bátiz", "Bachillerato tecnológico", "Zacatenco, GAM, CDMX", "27", "55 min", "101–109", "Pase directo IPN (por promedio)", "Informática, computación e ingeniería", "Tecnología, computación e ingeniería", "Tecnicatura (informática)", "Pase a ingenierías del IPN; título técnico", ["Tecnología", "Ciencias"]],
  ["IPN", "CECyT 11 Wilfrido Massieu", "Bachillerato tecnológico", "Zacatenco, GAM, CDMX", "28", "1 h", "91–99", "Pase directo IPN (por promedio)", "Ciencias sociales y administrativas", "Sociales, negocios y turismo", "Tecnicatura (sociales/admin.)", "Pase a licenciaturas IPN; título técnico", ["Sociales", "Negocios"]],
  ["IPN", "CECyT 12 José María Morelos", "Bachillerato tecnológico", "Casco de Santo Tomás, CDMX", "30", "1 h", "90–97", "Pase directo IPN (por promedio)", "Ciencias médico-biológicas", "Salud y ciencias biológicas", "Tecnicatura (salud)", "Pase a licenciaturas IPN; título técnico", ["Salud", "Ciencias"]],
  ["IPN", "CECyT 13 Ricardo Flores Magón", "Bachillerato tecnológico", "Azcapotzalco, CDMX", "22", "50 min", "82–90", "Pase directo IPN (por promedio)", "Construcción, mecánica y procesos", "Ingeniería y oficios técnicos", "Tecnicatura (industrial)", "Pase a licenciaturas IPN; título técnico", ["Tecnología", "Técnico"]],
  ["IPN", "CECyT 15 Diódoro Antúnez Echegaray", "Bachillerato tecnológico", "GAM, CDMX", "24", "50 min", "80–87", "Pase directo IPN (por promedio)", "Técnico industrial y servicios", "Tecnología y oficios", "Tecnicatura (industrial)", "Pase a licenciaturas IPN; título técnico", ["Tecnología", "Técnico"]],
  ["Colegio de Bachilleres", "Plantel 1 El Rosario", "Bachillerato general", "Azcapotzalco, CDMX", "22", "50 min", "74–82", "No (ingreso por examen)", "Bachillerato general amplio", "General, ciencias y sociales", "No ofrece carrera técnica", "Ingreso a universidad por examen", ["General", "Sociales"]],
  ["Colegio de Bachilleres", "Plantel 2 Cien Metros", "Bachillerato general", "GAM, CDMX", "26", "55 min", "72–80", "No (ingreso por examen)", "Bachillerato general", "General y ciencias", "No ofrece carrera técnica", "Ingreso a universidad por examen", ["General", "Ciencias"]],
  ["Colegio de Bachilleres", "Plantel 3 Iztacalco", "Bachillerato general", "Iztacalco, CDMX", "35", "1 h 15", "70–78", "No (ingreso por examen)", "Bachillerato general", "General y sociales", "No ofrece carrera técnica", "Ingreso a universidad por examen", ["General", "Sociales"]],
  ["Colegio de Bachilleres", "Plantel 5 Satélite", "Bachillerato general", "Naucalpan, Edomex", "22", "45 min", "72–80", "No (ingreso por examen)", "Bachillerato general", "General y ciencias", "No ofrece carrera técnica", "Ingreso a universidad por examen", ["General", "Ciencias"]],
  ["Colegio de Bachilleres", "Plantel 8 Tepepan", "Bachillerato general", "Xochimilco, CDMX", "48", "1 h 35", "76–84", "No (ingreso por examen)", "Bachillerato general con orientación", "General, artes y sociales", "No ofrece carrera técnica", "Ingreso a universidad por examen", ["General", "Arte", "Sociales"]],
  ["Colegio de Bachilleres", "Plantel 9 Aragón", "Bachillerato general", "GAM, CDMX", "30", "1 h", "70–78", "No (ingreso por examen)", "Bachillerato general", "General y ciencias", "No ofrece carrera técnica", "Ingreso a universidad por examen", ["General", "Ciencias"]],
  ["Colegio de Bachilleres", "Plantel 13 Xochimilco", "Bachillerato general", "Xochimilco, CDMX", "50", "1 h 40", "74–82", "No (ingreso por examen)", "Bachillerato general", "General y sociales", "No ofrece carrera técnica", "Ingreso a universidad por examen", ["General", "Sociales"]],
  ["CONALEP", "Plantel 1 (CDMX)", "Profesional técnico bachiller", "GAM/Benito Juárez", "28", "1 h", "66–74", "No (ingreso por examen)", "Formación técnica práctica", "Oficios técnicos e industrial", "Sí: numerosas carreras técnicas", "Título de Profesional Técnico Bachiller; trabajo o universidad", ["Técnico", "Tecnología"]],
  ["CONALEP", "Plantel 2 (CDMX)", "Profesional técnico bachiller", "CDMX", "30", "1 h 05", "64–72", "No (ingreso por examen)", "Formación técnica práctica", "Técnico e industrial", "Sí: carreras técnicas", "Título de Profesional Técnico Bachiller", ["Técnico", "Tecnología"]],
  ["CONALEP", "Plantel Estado de México", "Profesional técnico bachiller", "Estado de México", "18", "35 min", "62–70", "No (ingreso por examen)", "Cercanía y formación técnica", "Técnico y servicios", "Sí: carreras técnicas", "Título de Profesional Técnico Bachiller", ["Técnico", "Tecnología"]],
  ["DGETI (CBTIS)", "CBTIS 1", "Bachillerato tecnológico", "Azcapotzalco/GAM, CDMX", "24", "50 min", "72–80", "No (ingreso por examen)", "Bachillerato técnico bivalente", "Tecnología y oficios", "Carrera técnica (varias)", "Certificado + técnico; ingreso a universidad por examen", ["Técnico", "Tecnología"]],
  ["DGETI (CBTIS)", "CBTIS 4", "Bachillerato tecnológico", "CDMX", "30", "1 h", "68–76", "No (ingreso por examen)", "Bachillerato técnico bivalente", "Tecnología y servicios", "Carrera técnica (varias)", "Certificado + técnico; ingreso a universidad", ["Técnico", "Tecnología"]],
  ["DGETI (CBTIS)", "CBTIS 55", "Bachillerato tecnológico", "Estado de México", "20", "40 min", "66–74", "No (ingreso por examen)", "Técnico con cercanía", "Tecnología y servicios", "Carrera técnica (varias)", "Certificado + técnico; ingreso a universidad", ["Técnico", "Tecnología"]],
  ["DGETA (CBTA)", "CBTA 1", "Bachillerato técnico agropecuario", "Estado de México", "35", "1 h", "64–72", "No (ingreso por examen)", "Agropecuario y medio ambiente", "Ciencias naturales y agro", "Carrera técnica agropecuaria", "Ingreso a universidades agropecuarias/afines", ["Ciencias", "Técnico"]],
  ["CECyTE", "CECyTE 1", "Bachillerato tecnológico", "Estado de México", "25", "50 min", "62–70", "No (ingreso por examen)", "Tecnológico estatal cercano", "Tecnología e informática", "Carrera técnica (varias)", "Ingreso a universidad por examen", ["Técnico", "Tecnología"]],
  ["UAEMéx", "Prepa 1 San Mateo", "Bachillerato general", "Naucalpan, Edomex", "20", "40 min", "74–82", "Pase interno UAEMéx", "Cercanía y pase a UAEMéx", "General, ciencias y sociales", "No ofrece carrera técnica", "Pase interno a licenciaturas UAEMéx", ["General", "Ciencias"]],
  ["UAEMéx", "Prepa 2 Texcoco", "Bachillerato general", "Texcoco, Edomex", "35", "1 h", "70–78", "Pase interno UAEMéx", "Bachillerato general", "General y agro", "No ofrece carrera técnica", "Pase interno a licenciaturas UAEMéx", ["General", "Ciencias"]],
  ["UAEMéx", "Prepa Cuautitlán", "Bachillerato general", "Cuautitlán, Edomex", "5", "12 min", "66–74", "Pase interno UAEMéx", "Máxima cercanía a Cuautitlán", "General y ciencias", "No ofrece carrera técnica", "Pase interno a licenciaturas UAEMéx", ["General", "Ciencias"]],
  ["Privadas", "Greengate School", "Bachillerato bilingüe", "Cuautitlán Izcalli, Edomex", "6", "15 min", "N/A (privada)", "No aplica (ingreso propio)", "Bilingüe (inglés) y alta exigencia académica", "General, universidades nacionales y extranjeras", "No ofrece carrera técnica", "Preparación para examen de universidad; asesoría vocacional", ["General", "Humanidades", "Ciencias"]],
  ["Privadas", "Colegio Fray Pedro de Gante", "Bachillerato general", "Cuautitlán, Edomex", "5", "12 min", "N/A (privada)", "No aplica (ingreso propio)", "Cercanía y acompañamiento", "General, refuerzo para examen de universidad", "No ofrece carrera técnica", "Ingreso a universidad por examen (verifica incorporación)", ["General", "Ciencias"]],
  ["Privadas", "Prepa UNITEC (Atizapán)", "Bachillerato general", "Atizapán, Edomex", "26", "45 min", "N/A (privada)", "No aplica (ingreso propio)", "Enfoque profesionalizante y tecnológico", "Negocios, tecnología y salud", "No ofrece carrera técnica", "Pase a licenciaturas UNITEC; también puedes aplicar a públicas", ["Negocios", "Tecnología", "Salud"]],
  ["Privadas", "Prepa Tec de Monterrey (Campus Edo. Méx.)", "Bachillerato bilingüe", "Atizapán/Zona Esmeralda, Edomex", "30", "50 min", "N/A (privada)", "No aplica (ingreso propio)", "Tecnología, emprendimiento y bilingüismo", "Ingeniería, negocios y tecnología", "No ofrece carrera técnica", "Pase a licenciaturas del Tec; también a universidades públicas", ["Tecnología", "Negocios", "Ciencias"]],
  ["Privadas", "Colegio Alemán Alexander von Humboldt (Lomas Verdes)", "Bachillerato bilingüe", "Lomas Verdes, Naucalpan, Edomex", "30", "50 min", "N/A (privada)", "No aplica (ingreso propio)", "Bilingüe (alemán) y muy alta exigencia", "Ciencias, ingeniería y humanidades", "No ofrece carrera técnica", "Preparación para universidades en México y Alemania", ["Ciencias", "Humanidades", "Tecnología"]],
  ["Privadas", "Bachillerato Anáhuac (Lomas Verdes)", "Bachillerato general", "Lomas Verdes, Naucalpan, Edomex", "28", "45 min", "N/A (privada)", "No aplica (ingreso propio)", "Formación integral (académica y valores)", "General, negocios y salud", "No ofrece carrera técnica", "Pase a universidades Anáhuac; también a públicas", ["General", "Negocios", "Salud"]]
];

/* legacy: CATALOGO (44 escuelas), con _i = índice original */
export const SCHOOLS = CATALOG_ROWS.map((r, i) => {
  const o = {};
  CATALOG_FIELDS.forEach((f, j) => { o[f] = r[j]; });
  o._i = i;
  return o;
});

/* legacy: CAT_TAGS */
export const CATALOG_TAGS = ["General", "Ciencias", "Humanidades", "Sociales", "Arte", "Salud", "Tecnología", "Técnico", "Negocios"];

/* legacy: distOpts del catálogo */
export const CATALOG_DISTANCE_FILTERS = [["todas", "Todas"], ["<20", "Menos de 20 km"], ["20-30", "20–30 km"], ["30-45", "30–45 km"], [">45", "Más de 45 km"]];

/* Textos del catálogo (legacy) */
export const CATALOG_INTRO = "Qué se estudia, qué tan lejos queda de Cuautitlán, aciertos, pase directo, en qué es fuerte, a qué orienta y cómo sirve para la universidad.";
export const CATALOG_DISCLAIMER = "📌 Distancias, aciertos y pase son <b>referencias aproximadas</b> desde Cuautitlán, Edo. Méx. <b>Verifica</b> el corte y las fechas oficiales del año.";
export const SCORE_REFERENCE_NOTE = "Referencias de aciertos aproximadas (COMIPEMS, máx. 128). Verificar corte oficial del año.";

/* legacy: FORTALEZAS_SUGERIDAS / DEBILIDADES_SUGERIDAS / EXTRAS_SUGERIDAS */
export const STRENGTHS = [
  "Responsable", "Buen compañero(a)", "Trabajador(a)", "Se organiza bien",
  "Buen retentiva", "Creador(a)", "Se expresa bien", "Liderazgo natural",
  "Se concentra bien", "Aprendo rápido", "Preciso(a) en detalles", "Puntual"
];
export const WEAKNESSES = [
  "Se distrae fácil", "Deja tareas pendientes", "Le cuesta matemáticas",
  "Le cuesta leer en voz alta", "Caligrafía difícil de leer", "Le cuesta organizarse",
  "Pierde materiales", "Falta de concentración", "Se pone nervioso(a) en exámenes",
  "Rinde menos por la mañana", "Trabajos tarde", "Mucha mano de obra, poco repaso"
];
export const EXTRAS = [
  "Delegado(a) de grupo", "Participó en concurso", "Ganó competencia escolar",
  "Equipo deportivo", "Beca", "Club o taller", "Trabajo voluntario", "Proyecto personal"
];

/* legacy: PLANTILLAS (llenado rápido del taller) */
export const PROFILE_TEMPLATES = [
  { id: "salud", nombre: "Salud / Medicina", icon: "🩺",
    intereses: ["Salud y medicina", "Biología y naturaleza", "Química", "Ayudar a las personas"],
    aptitudes: ["Memoria", "Concentración", "Comprensión lectora"],
    escuelas: [{ inst: "UNAM", esc: "CCH Sur" }, { inst: "IPN", esc: "CECyT 9 Juan de Dios Bátiz" }, { inst: "UNAM", esc: "ENP 6 Antonio Caso" }] },
  { id: "ingenieria", nombre: "Ingeniería / Tecnología", icon: "⚙️",
    intereses: ["Ciencia y tecnología", "Matemáticas", "Computación y programación", "Electrónica"],
    aptitudes: ["Razonamiento lógico-matemático", "Resolución de problemas", "Cálculo mental"],
    escuelas: [{ inst: "IPN", esc: "CECyT 1 Gonzalo Vázquez Vela" }, { inst: "UNAM", esc: "CCH Azcapotzalco" }, { inst: "IPN", esc: "CECyT 9 Juan de Dios Bátiz" }] },
  { id: "artes", nombre: "Artes / Humanidades", icon: "🎨",
    intereses: ["Arte y diseño", "Lectura y escritura", "Música", "Historia y cultura"],
    aptitudes: ["Creatividad", "Expresión escrita", "Comunicación oral"],
    escuelas: [{ inst: "UNAM", esc: "CCH Sur" }, { inst: "UNAM", esc: "ENP 3 Justo Sierra" }, { inst: "Colegio de Bachilleres", esc: "Plantel 8 Tepepan" }] },
  { id: "sociales", nombre: "Negocios / Sociales", icon: "⚖️",
    intereses: ["Negocios y economía", "Ciencias sociales", "Derecho", "Liderazgo y política"],
    aptitudes: ["Liderazgo", "Trabajo en equipo", "Organización"],
    escuelas: [{ inst: "UNAM", esc: "ENP 9 Pedro de Alba" }, { inst: "IPN", esc: "CECyT 11 Wilfrido Massieu" }, { inst: "UAEMéx", esc: "Prepa 1 San Mateo" }] },
  { id: "tecnico", nombre: "Técnico / Industrial", icon: "🔧",
    intereses: ["Construcción y mecánica", "Electrónica", "Computación y programación", "Deportes"],
    aptitudes: ["Manualidad / habilidad técnica", "Razonamiento lógico-matemático", "Concentración"],
    escuelas: [{ inst: "CONALEP", esc: "Plantel 1 (CDMX)" }, { inst: "DGETI (CBTIS)", esc: "CBTIS 1" }, { inst: "IPN", esc: "CECyT 6 Miguel Othón de Mendizábal" }] },
  { id: "ambiente", nombre: "Naturaleza / Ambiente", icon: "🌱",
    intereses: ["Medio ambiente", "Biología y naturaleza", "Química", "Ciencia y tecnología"],
    aptitudes: ["Organización", "Resolución de problemas", "Trabajo en equipo"],
    escuelas: [{ inst: "UNAM", esc: "CCH Naucalpan" }, { inst: "DGETA (CBTA)", esc: "CBTA 1" }, { inst: "UAEMéx", esc: "Prepa 2 Texcoco" }] }
];

/* ================================================================
   Test vocacional · modelo RIASEC (legacy)
   ================================================================ */

/* legacy: RIASEC */
export const RIASEC_TYPES = [
  { id: "R", nombre: "Realista", icon: "🔧", color: "#0369A1",
    desc: "Te gusta lo práctico, manual, técnico y de campo.",
    intereses: ["Construcción y mecánica", "Deportes", "Electrónica", "Medio ambiente"],
    plantilla: "tecnico", tags: ["Técnico", "Tecnología"] },
  { id: "I", nombre: "Investigador", icon: "🔬", color: "#4338CA",
    desc: "Te gusta analizar, investigar y resolver problemas.",
    intereses: ["Ciencia y tecnología", "Matemáticas", "Biología y naturaleza", "Computación y programación"],
    plantilla: "ingenieria", tags: ["Ciencias", "Tecnología"] },
  { id: "A", nombre: "Artístico", icon: "🎨", color: "#BE185D",
    desc: "Te gusta crear, imaginar y expresarte.",
    intereses: ["Arte y diseño", "Música", "Lectura y escritura", "Danza y teatro"],
    plantilla: "artes", tags: ["Arte", "Humanidades"] },
  { id: "S", nombre: "Social", icon: "🤝", color: "#0F766E",
    desc: "Te gusta ayudar, enseñar y trabajar con personas.",
    intereses: ["Ayudar a las personas", "Educación y docencia", "Salud y medicina", "Ciencias sociales"],
    plantilla: "salud", tags: ["Salud", "Sociales"] },
  { id: "E", nombre: "Emprendedor", icon: "📈", color: "#B45309",
    desc: "Te gusta liderar, convencer y emprender.",
    intereses: ["Negocios y economía", "Liderazgo y política", "Derecho", "Turismo y viajes"],
    plantilla: "sociales", tags: ["Negocios", "Sociales"] },
  { id: "C", nombre: "Convencional", icon: "🗂️", color: "#475569",
    desc: "Te gustan el orden, los datos y la precisión.",
    intereses: ["Matemáticas", "Computación y programación", "Idiomas", "Ciencias sociales"],
    plantilla: "sociales", tags: ["General", "Tecnología"] }
];

/* legacy: TEST_ESCALA · escala de las 30 afirmaciones */
export const RIASEC_SCALE = ["Nada", "Poco", "Algo", "Bastante", "Mucho"];

/* legacy: RIASEC_PREGUNTAS · 30 afirmaciones (t = texto, d = dimensión) */
export const RIASEC_QUESTIONS = [
  { t: "Armar, reparar o desarmar aparatos y máquinas", d: "R" },
  { t: "Trabajar al aire libre con plantas, animales o en el campo", d: "R" },
  { t: "Usar herramientas o material para construir cosas", d: "R" },
  { t: "Hacer deporte o actividad física intensa", d: "R" },
  { t: "Manejar equipos, máquinas o vehículos", d: "R" },
  { t: "Hacer experimentos para descubrir cómo funcionan las cosas", d: "I" },
  { t: "Resolver problemas de matemáticas o de lógica", d: "I" },
  { t: "Investigar y leer sobre temas de ciencia", d: "I" },
  { t: "Analizar datos para encontrar patrones o causas", d: "I" },
  { t: "Preguntarme el por qué de las cosas y buscar respuestas", d: "I" },
  { t: "Dibujar, pintar, diseñar o hacer manualidades creativas", d: "A" },
  { t: "Tocar un instrumento, cantar o bailar", d: "A" },
  { t: "Escribir historias, poemas, canciones o guiones", d: "A" },
  { t: "Crear videos, fotografías, animaciones o páginas bonitas", d: "A" },
  { t: "Imaginar ideas originales y expresarlas a los demás", d: "A" },
  { t: "Ayudar a personas que tienen problemas o necesitan apoyo", d: "S" },
  { t: "Explicar o enseñar algo que otros no entienden", d: "S" },
  { t: "Cuidar a niños, adultos mayores o personas enfermas", d: "S" },
  { t: "Escuchar y dar consejos a mis compañeros", d: "S" },
  { t: "Trabajar en equipo para mejorar mi comunidad o escuela", d: "S" },
  { t: "Liderar un equipo o coordinar un proyecto", d: "E" },
  { t: "Convencer a otros de mis ideas o propuestas", d: "E" },
  { t: "Vender, promocionar o imaginar un negocio", d: "E" },
  { t: "Tomar decisiones y asumir el mando cuando hace falta", d: "E" },
  { t: "Ser quien organiza las actividades del grupo", d: "E" },
  { t: "Ordenar y clasificar información o materiales", d: "C" },
  { t: "Llevar registros, cuentas o listas con cuidado", d: "C" },
  { t: "Seguir reglas y pasos bien definidos para hacer las cosas", d: "C" },
  { t: "Revisar que todo esté correcto, completo y en orden", d: "C" },
  { t: "Organizar mi tiempo con horarios y metas claras", d: "C" }
];

/* legacy: TEST_MAX_POR_DIM = 5 (5 preguntas por dimensión) */
export const RIASEC_MAX_PER_TYPE = 5;

/* Mapas derivados directamente de los datos legacy */
export const RIASEC_BY_ID = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t]));
export const RIASEC_INTERESTS_BY_TYPE = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t.intereses]));
export const RIASEC_TEMPLATE_BY_TYPE = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t.plantilla]));
export const RIASEC_TAGS_BY_TYPE = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t.tags]));
export const TEMPLATES_BY_ID = Object.fromEntries(PROFILE_TEMPLATES.map(t => [t.id, t]));

/* ================================================================
   Guía técnica (legacy: guiaTecnicaHTML) · texto literal
   ================================================================ */
export const CAREER_GUIDE = {
  title: "¿Carrera técnica o bachillerato general?",
  general: {
    heading: "<b>Bachillerato general</b> (UNAM, Bachilleres, UAEMéx, privadas)",
    items: [
      "Más flexibles: te preparan para <b>cualquier licenciatura</b>.",
      "La UNAM y UAEMéx dan <b>pase directo</b> por promedio.",
      "Ideales si <b>aún no decides</b> o vas a artes/humanidades/salud."
    ]
  },
  tecnico: {
    heading: "<b>Bachillerato técnico</b> (IPN, CONALEP, CBTIS, CECyT, CBTA) - <b>sí trae carrera</b>",
    items: [
      "Sales con un <b>título técnico</b>: puedes <b>trabajar</b> al terminar.",
      "El IPN da <b>pase a sus licenciaturas</b> afines (ingenierías).",
      "Más materias y práctica: ideal si te gusta lo <b>práctico</b> o quieres ingresar antes al trabajo."
    ]
  },
  decision: "<b>¿Cuál conviene?</b> Si tu meta es una ingeniería o quieres trabajar pronto, la <b>técnica</b> suma. Si buscas abrir opciones (medicina, derecho, artes, humanidades) o no estás seguro, el <b>general</b> es más flexible. <b>En ambos</b> puedes presentar el examen de la universidad; lo importante es llevar buen promedio y prepararte para el examen (COMIPEMS/universidad).",
  examPreparation: "<b>Sobre prepararte para el examen:</b> el general refuerza más las materias del examen; la técnica da ventaja laboral y práctica. Si eliges técnica, complementa con <b>repaso de admisión</b> (matemáticas, lectura, ciencias)."
};

/* HTML exacto de la guía técnica del legacy */
export const CAREER_GUIDE_HTML =
  '<div class="card cat-info"><div class="block-title"><span>🧭</span> ' + CAREER_GUIDE.title + '</div>' +
    '<div class="guide-2col">' +
      '<div>' + CAREER_GUIDE.general.heading +
        '<ul><li>' + CAREER_GUIDE.general.items[0] + '</li>' +
        '<li>' + CAREER_GUIDE.general.items[1] + '</li>' +
        '<li>' + CAREER_GUIDE.general.items[2] + '</li></ul></div>' +
      '<div>' + CAREER_GUIDE.tecnico.heading +
        '<ul><li>' + CAREER_GUIDE.tecnico.items[0] + '</li>' +
        '<li>' + CAREER_GUIDE.tecnico.items[1] + '</li>' +
        '<li>' + CAREER_GUIDE.tecnico.items[2] + '</li></ul></div>' +
    '</div>' +
    '<p>' + CAREER_GUIDE.decision + '</p>' +
    '<p>' + CAREER_GUIDE.examPreparation + '</p></div>';

/* ================================================================
   Planes de estudio (tiras de materias) y carreras técnicas
   Aproximados · verificar en cada institución
   ================================================================ */
export const STUDY_PLANS = {
  UNAM_ENP: { nombre: "Bachillerato UNAM · ENP (6 semestres)", tecnico: false, semestres: [
    { n: 1, materias: ["Matemáticas I", "Física I", "Química I", "Biología I", "Historia Universal I", "Taller de Lectura y Redacción", "Lengua Extranjera (Inglés) I", "Geografía", "Educación Física"] },
    { n: 2, materias: ["Matemáticas II", "Física II", "Química II", "Biología II", "Historia Universal II", "Historia de México I", "Inglés II", "Educación Estética", "Orientación Educativa"] },
    { n: 3, materias: ["Matemáticas III", "Física III", "Química III", "Biología III", "Historia de México II", "Literatura", "Inglés III", "Filosofía I", "Geografía"] },
    { n: 4, materias: ["Matemáticas IV", "Física IV", "Química IV", "Biología IV", "Historia de México III", "Inglés IV", "Filosofía II", "Educación Física", "Optativa I"] },
    { n: 5, materias: ["Matemáticas V", "Física V", "Química V", "Biología V", "Inglés V", "Optativa II", "Optativa III", "Asignatura de Humanidades"] },
    { n: 6, materias: ["Matemáticas VI", "Física VI", "Química VI", "Biología VI", "Inglés VI", "Optativa IV", "Optativa V", "Asignatura de Ciencias"] }
  ] },
  UNAM_CCH: { nombre: "Bachillerato UNAM · CCH (6 semestres)", tecnico: false, semestres: [
    { n: 1, materias: ["Matemáticas I", "Historia de México I", "Taller de Lectura y Redacción", "Inglés I", "Química I", "Biología I", "Física I", "Historia Universal I"] },
    { n: 2, materias: ["Matemáticas II", "Historia de México II", "Taller de Redacción e Investigación", "Inglés II", "Química II", "Biología II", "Física II", "Historia Universal II"] },
    { n: 3, materias: ["Matemáticas III", "Física III", "Química III", "Biología III", "Historia de México III", "Literatura", "Inglés III", "Filosofía I"] },
    { n: 4, materias: ["Matemáticas IV", "Física IV", "Química IV", "Biología IV", "Historia Universal III", "Inglés IV", "Filosofía II", "Estadística"] },
    { n: 5, materias: ["Matemáticas V", "Ciencias de la Salud I", "Optativa (Ciencias/Humanidades)", "Inglés V", "Talleres de Lenguaje y Comunicación", "Optativa", "Optativa", "Optativa"] },
    { n: 6, materias: ["Matemáticas VI", "Ciencias de la Salud II", "Optativa (Ciencias/Humanidades)", "Inglés VI", "Talleres de Lenguaje y Comunicación", "Optativa", "Optativa", "Optativa"] }
  ] },
  BACHILLERES: { nombre: "Colegio de Bachilleres (6 semestres)", tecnico: false, semestres: [
    { n: 1, materias: ["Matemáticas I", "Taller de Lectura y Redacción I", "Lengua Adicional al Español (Inglés) I", "Química I", "Física I", "Historia de México I", "Geografía", "Educación Física I"] },
    { n: 2, materias: ["Matemáticas II", "Taller de Lectura y Redacción II", "Inglés II", "Química II", "Física II", "Historia de México II", "Biología I", "Educación Física II"] },
    { n: 3, materias: ["Matemáticas III", "Literatura I", "Inglés III", "Biología II", "Historia Universal I", "Filosofía I", "Informática I", "Orientación Educativa"] },
    { n: 4, materias: ["Matemáticas IV", "Literatura II", "Inglés IV", "Historia Universal II", "Filosofía II", "Informática II", "Ciencias de la Salud I", "Optativa"] },
    { n: 5, materias: ["Matemáticas V", "Métodos de Investigación I", "Inglés V", "Área propedéutica I", "Área propedéutica II", "Optativa", "Optativa", "Optativa"] },
    { n: 6, materias: ["Matemáticas VI", "Métodos de Investigación II", "Inglés VI", "Área propedéutica III", "Área propedéutica IV", "Optativa", "Optativa", "Optativa"] }
  ] },
  UAEMEX: { nombre: "Preparatoria UAEMéx (6 semestres)", tecnico: false, semestres: [
    { n: 1, materias: ["Álgebra", "Geometría y Trigonometría", "Biología I", "Química I", "Historia de México", "Comprensión Lectora", "Lengua Extranjera I", "Orientación Vocacional"] },
    { n: 2, materias: ["Geometría Analítica", "Física I", "Biología II", "Química II", "Historia Universal", "Expresión Oral y Escrita", "Lengua Extranjera II", "Ética"] },
    { n: 3, materias: ["Cálculo Diferencial", "Física II", "Biología III", "Química III", "Historia de la Cultura", "Literatura", "Lengua Extranjera III", "Informática"] },
    { n: 4, materias: ["Cálculo Integral", "Física III", "Biología IV", "Química IV", "Filosofía", "Literatura Mexicana", "Lengua Extranjera IV", "Estadística"] },
    { n: 5, materias: ["Probabilidad y Estadística", "Física IV", "Biología V", "Química V", "Metodología de la Investigación", "Orientación Profesiográfica", "Optativa I", "Optativa II"] },
    { n: 6, materias: ["Matemáticas Aplicadas", "Física V", "Biología VI", "Química VI", "Seminario de Investigación", "Optativa III", "Optativa IV", "Optativa V"] }
  ] },
  IPN: { nombre: "Bachillerato tecnológico IPN (tronco común · 6 semestres)", tecnico: true, semestres: [
    { n: 1, materias: ["Álgebra", "Geometría y Trigonometría", "Física I", "Química I", "Biología I", "Taller de Redacción", "Inglés I", "Historia de México", "Orientación Juvenil"] },
    { n: 2, materias: ["Geometría Analítica", "Cálculo Diferencial", "Física II", "Química II", "Biología II", "Taller de Lectura", "Inglés II", "Historia Universal", "Módulo de la tecnicatura I"] },
    { n: 3, materias: ["Cálculo Integral", "Física III", "Química III", "Biología III", "Literatura", "Inglés III", "Módulo de la tecnicatura II", "Módulo de la tecnicatura III"] },
    { n: 4, materias: ["Probabilidad y Estadística", "Física IV", "Química IV", "Biología IV", "Filosofía", "Inglés IV", "Módulo de la tecnicatura IV", "Módulo de la tecnicatura V"] },
    { n: 5, materias: ["Matemáticas Aplicadas", "Física V", "Ciencias Sociales", "Inglés V", "Módulo de la tecnicatura VI", "Módulo de la tecnicatura VII", "Optativa"] },
    { n: 6, materias: ["Metodología de la Investigación", "Economía", "Inglés VI", "Módulo de la tecnicatura VIII", "Módulo de la tecnicatura IX", "Optativa"] }
  ] },
  CONALEP: { nombre: "Profesional Técnico Bachiller CONALEP (6 semestres)", tecnico: true, semestres: [
    { n: 1, materias: ["Álgebra", "Química", "Biología", "Lectura y Redacción", "Inglés I", "Historia", "Formación Técnica I", "Educación Física"] },
    { n: 2, materias: ["Geometría y Trigonometría", "Física", "Comunicación", "Inglés II", "Historia de México", "Formación Técnica II", "Informática"] },
    { n: 3, materias: ["Geometría Analítica", "Cálculo Diferencial", "Ciencias Sociales", "Inglés III", "Formación Técnica III", "Módulo de la carrera I", "Ética"] },
    { n: 4, materias: ["Cálculo Integral", "Estadística", "Metodología de la Investigación", "Inglés IV", "Módulo de la carrera II", "Módulo de la carrera III"] },
    { n: 5, materias: ["Ciencias de la Salud/Aplicadas", "Orientación Profesional", "Módulo de la carrera IV", "Módulo de la carrera V", "Optativa"] },
    { n: 6, materias: ["Proyecto Integrador", "Módulo de la carrera VI", "Módulo de la carrera VII", "Estadía profesional en empresa"] }
  ] },
  DGETI: { nombre: "Bachillerato tecnológico DGETI/CBTIS (6 semestres)", tecnico: true, semestres: [
    { n: 1, materias: ["Álgebra", "Química I", "Lectura y Redacción I", "Inglés I", "Historia de México I", "Módulo técnico I", "Educación Física"] },
    { n: 2, materias: ["Geometría y Trigonometría", "Química II", "Física I", "Lectura y Redacción II", "Inglés II", "Historia de México II", "Módulo técnico II"] },
    { n: 3, materias: ["Geometría Analítica", "Física II", "Biología", "Inglés III", "Historia Universal", "Módulo técnico III", "Ética"] },
    { n: 4, materias: ["Cálculo Diferencial", "Ciencias Sociales", "Inglés IV", "Módulo técnico IV", "Módulo técnico V", "Optativa"] },
    { n: 5, materias: ["Cálculo Integral", "Probabilidad y Estadística", "Inglés V", "Módulo técnico VI", "Módulo técnico VII", "Optativa"] },
    { n: 6, materias: ["Metodología de la Investigación", "Inglés VI", "Módulo técnico VIII", "Módulo técnico IX", "Prácticas/estadía"] }
  ] },
  DGETA: { nombre: "Bachillerato técnico agropecuario DGETA/CBTA (6 semestres)", tecnico: true, semestres: [
    { n: 1, materias: ["Álgebra", "Química", "Biología", "Lectura y Redacción", "Inglés I", "Módulo agropecuario I", "Educación Física"] },
    { n: 2, materias: ["Geometría y Trigonometría", "Física", "Lectura y Redacción II", "Inglés II", "Historia de México", "Módulo agropecuario II"] },
    { n: 3, materias: ["Geometría Analítica", "Ciencias Naturales", "Inglés III", "Historia Universal", "Módulo agropecuario III", "Ética"] },
    { n: 4, materias: ["Cálculo Diferencial", "Ciencias Sociales", "Inglés IV", "Módulo agropecuario IV", "Módulo agropecuario V"] },
    { n: 5, materias: ["Probabilidad y Estadística", "Inglés V", "Módulo agropecuario VI", "Módulo agropecuario VII", "Optativa"] },
    { n: 6, materias: ["Metodología de la Investigación", "Inglés VI", "Módulo agropecuario VIII", "Prácticas/estadía en campo"] }
  ] },
  CECYTE: { nombre: "Bachillerato tecnológico CECyTE (6 semestres)", tecnico: true, semestres: [
    { n: 1, materias: ["Álgebra", "Química", "Lectura y Redacción", "Inglés I", "Historia", "Módulo técnico I", "Educación Física"] },
    { n: 2, materias: ["Geometría y Trigonometría", "Física", "Biología", "Inglés II", "Historia de México", "Módulo técnico II"] },
    { n: 3, materias: ["Geometría Analítica", "Cálculo Diferencial", "Inglés III", "Ciencias Sociales", "Módulo técnico III", "Módulo técnico IV"] },
    { n: 4, materias: ["Cálculo Integral", "Estadística", "Inglés IV", "Módulo técnico V", "Módulo técnico VI", "Optativa"] },
    { n: 5, materias: ["Metodología de la Investigación", "Inglés V", "Módulo técnico VII", "Módulo técnico VIII", "Optativa"] },
    { n: 6, materias: ["Proyecto Integrador", "Módulo técnico IX", "Prácticas/estadía"] }
  ] },
  PRIVADA: { nombre: "Bachillerato privado (plan habitual · 6 semestres)", tecnico: false, semestres: [
    { n: 1, materias: ["Matemáticas I", "Taller de Lectura y Redacción I", "Inglés I", "Química I", "Física I", "Historia I", "Artes", "Educación Física"] },
    { n: 2, materias: ["Matemáticas II", "Taller de Lectura y Redacción II", "Inglés II", "Química II", "Física II", "Historia II", "Biología I", "Filosofía I"] },
    { n: 3, materias: ["Matemáticas III", "Literatura I", "Inglés III", "Biología II", "Historia III", "Filosofía II", "Informática", "Optativa"] },
    { n: 4, materias: ["Matemáticas IV", "Literatura II", "Inglés IV", "Ciencias Sociales", "Metodología de la Investigación", "Optativa", "Optativa"] },
    { n: 5, materias: ["Matemáticas V", "Inglés V", "Área propedéutica I", "Área propedéutica II", "Optativa", "Optativa"] },
    { n: 6, materias: ["Matemáticas VI", "Inglés VI", "Área propedéutica III", "Área propedéutica IV", "Optativa", "Optativa"] }
  ] },
  GENERAL: { nombre: "Bachillerato general (6 semestres)", tecnico: false, semestres: [
    { n: 1, materias: ["Matemáticas I", "Taller de Lectura y Redacción", "Inglés I", "Ciencias Naturales", "Ciencias Sociales", "Informática", "Orientación Educativa"] },
    { n: 2, materias: ["Matemáticas II", "Literatura", "Inglés II", "Biología", "Historia", "Optativa", "Educación Física"] },
    { n: 3, materias: ["Matemáticas III", "Inglés III", "Física", "Historia de México", "Filosofía I", "Optativa", "Optativa"] },
    { n: 4, materias: ["Matemáticas IV", "Inglés IV", "Química", "Historia Universal", "Filosofía II", "Optativa", "Optativa"] },
    { n: 5, materias: ["Matemáticas V", "Inglés V", "Metodología de la Investigación", "Área propedéutica I", "Optativa", "Optativa"] },
    { n: 6, materias: ["Matemáticas VI", "Inglés VI", "Área propedéutica II", "Optativa", "Optativa", "Optativa"] }
  ] }
};

/* legacy: TECNICATURAS · 40 carreras técnicas con sus módulos */
export const TECHNICIAN_PROGRAMS = {
  "IPN": { nota: "En el IPN cursas el tronco común (6 semestres) + una tecnicatura con módulos de especialidad. Al titular como técnico puedes pasar a licenciaturas del IPN.", carreras: [
    { n: "Técnico en Informática", modulos: ["Fundamentos de programación", "Bases de datos", "Desarrollo web", "Redes de computadoras", "Sistemas operativos", "Desarrollo de aplicaciones móviles"] },
    { n: "Técnico en Computación", modulos: ["Hardware y mantenimiento", "Redes", "Ofimática avanzada", "Programación básica", "Sistemas operativos"] },
    { n: "Técnico en Contabilidad", modulos: ["Contabilidad general", "Contabilidad de costos", "Impuestos", "Nómina", "Finanzas básicas"] },
    { n: "Técnico en Administración", modulos: ["Principios de administración", "Recursos humanos", "Mercadotecnia", "Finanzas", "Contabilidad"] },
    { n: "Técnico en Mecánica Industrial", modulos: ["Metrología", "Máquinas y herramientas", "Soldadura", "Procesos de manufactura", "Mantenimiento"] },
    { n: "Técnico en Electricidad", modulos: ["Circuitos eléctricos", "Instalaciones eléctricas", "Máquinas eléctricas", "Automatización", "Seguridad"] },
    { n: "Técnico en Electrónica", modulos: ["Electrónica analógica", "Electrónica digital", "Microcontroladores", "Sistemas de control", "Robótica"] },
    { n: "Técnico en Sistemas Automotrices", modulos: ["Motor a combustión", "Inyección electrónica", "Frenos y suspensión", "Transmisión", "Diagnóstico automotriz"] },
    { n: "Técnico en Enfermería", modulos: ["Anatomía y fisiología", "Cuidados básicos", "Farmacología", "Salud pública", "Prácticas clínicas"] },
    { n: "Técnico en Alimentos", modulos: ["Tecnología de alimentos", "Conservación", "Control de calidad", "Nutrición", "Higiene"] },
    { n: "Técnico en Construcción", modulos: ["Dibujo de construcción", "Estructuras", "Instalaciones", "Costos de obra", "Supervisión"] },
    { n: "Técnico en Diseño Gráfico", modulos: ["Dibujo", "Diseño digital", "Software de diseño", "Comunicación visual", "Ilustración"] }
  ] },
  "CONALEP": { nota: "Ofrece carreras de Profesional Técnico Bachiller (PTB). Al terminar puedes trabajar o seguir a universidad por examen.", carreras: [
    { n: "Profesional Técnico en Informática", modulos: ["Programación", "Bases de datos", "Redes", "Desarrollo de software", "Soporte técnico"] },
    { n: "Profesional Técnico en Contabilidad", modulos: ["Contabilidad", "Costos", "Impuestos", "Nómina", "Auditoría básica"] },
    { n: "Profesional Técnico en Administración", modulos: ["Administración", "Recursos humanos", "Mercadotecnia", "Finanzas"] },
    { n: "Profesional Técnico en Electrónica", modulos: ["Electrónica analógica", "Electrónica digital", "Microcontroladores", "Automatización"] },
    { n: "Profesional Técnico en Mecánica Automotriz", modulos: ["Motor", "Inyección electrónica", "Transmisión", "Frenos", "Diagnóstico"] },
    { n: "Profesional Técnico en Electricidad", modulos: ["Circuitos", "Instalaciones", "Máquinas eléctricas", "Automatización"] },
    { n: "Profesional Técnico en Alimentos y Bebidas", modulos: ["Preparación de alimentos", "Servicio", "Higiene", "Nutrición", "Cocina"] },
    { n: "Profesional Técnico en Enfermería", modulos: ["Anatomía", "Cuidados básicos", "Farmacología", "Prácticas clínicas"] },
    { n: "Profesional Técnico en Construcción", modulos: ["Dibujo", "Obra", "Instalaciones", "Costos"] },
    { n: "Profesional Técnico en Turismo", modulos: ["Hospitalidad", "Agencia de viajes", "Patrimonio", "Servicio al cliente"] }
  ] },
  "DGETI (CBTIS)": { nota: "Bachillerato tecnológico bivalente: certificado de bachillerato + título de técnico.", carreras: [
    { n: "Técnico en Informática", modulos: ["Programación", "Bases de datos", "Redes", "Desarrollo web"] },
    { n: "Técnico en Programación", modulos: ["Programación estructurada", "POO", "Bases de datos", "Apps"] },
    { n: "Técnico en Contabilidad", modulos: ["Contabilidad", "Costos", "Impuestos", "Nómina"] },
    { n: "Técnico en Administración", modulos: ["Administración", "Mercadotecnia", "Recursos humanos"] },
    { n: "Técnico en Electrónica", modulos: ["Electrónica analógica/digital", "Microcontroladores", "Control"] },
    { n: "Técnico en Mecánica Industrial", modulos: ["Metrología", "Procesos", "Soldadura", "Mantenimiento"] },
    { n: "Técnico en Laboratorista Químico", modulos: ["Química analítica", "Análisis instrumental", "Seguridad", "Prácticas de laboratorio"] },
    { n: "Técnico en Diseño Gráfico Digital", modulos: ["Diseño", "Software", "Comunicación visual"] },
    { n: "Técnico en Logística", modulos: ["Almacén", "Distribución", "Inventarios", "Transporte"] },
    { n: "Técnico en Electricidad", modulos: ["Circuitos", "Instalaciones", "Máquinas eléctricas"] }
  ] },
  "DGETA (CBTA)": { nota: "Bachillerato técnico agropecuario; orientado al campo, producción y medio ambiente.", carreras: [
    { n: "Técnico Agropecuario", modulos: ["Producción agrícola", "Producción pecuaria", "Suelos", "Riégos", "Sanidad vegetal/animal"] },
    { n: "Técnico en Agroindustria", modulos: ["Transformación de alimentos", "Control de calidad", "Conservación"] },
    { n: "Técnico en Desarrollo Comunitario", modulos: ["Gestión social", "Proyectos productivos", "Extensión"] }
  ] },
  "CECyTE": { nota: "Bachillerato tecnológico estatal; combina bachillerato con una carrera técnica.", carreras: [
    { n: "Técnico en Informática", modulos: ["Programación", "Bases de datos", "Redes", "Soporte"] },
    { n: "Técnico en Contabilidad", modulos: ["Contabilidad", "Costos", "Impuestos"] },
    { n: "Técnico en Administración", modulos: ["Administración", "Mercadotecnia", "Recursos humanos"] },
    { n: "Técnico en Electrónica", modulos: ["Electrónica", "Microcontroladores", "Automatización"] },
    { n: "Técnico en Producción Industrial", modulos: ["Procesos", "Metrología", "Calidad", "Mantenimiento"] }
  ] }
};

/* legacy: planDeEscuela(e) · selector de plan por institución (UNAM depende del nombre) */
export const STUDY_PLAN_SELECTORS = [
  { inst: "UNAM", match: /CCH/, plan: "UNAM_CCH", fallback: "UNAM_ENP" },
  { inst: "IPN", plan: "IPN" },
  { inst: "Colegio de Bachilleres", plan: "BACHILLERES" },
  { inst: "UAEMéx", plan: "UAEMEX" },
  { inst: "CONALEP", plan: "CONALEP" },
  { inst: "DGETI (CBTIS)", plan: "DGETI" },
  { inst: "DGETA (CBTA)", plan: "DGETA" },
  { inst: "CECyTE", plan: "CECYTE" },
  { inst: "Privadas", plan: "PRIVADA" },
  { inst: "*", plan: "GENERAL" }
];

/* =====================================================================
   Agrupación única para consumo desde la app nueva.
   Procedencia: sistema2.js (legacy).
   ===================================================================== */
export const VOCATIONAL_CATALOG = {
  interests: INTERESTS,
  aptitudes: APTITUDES,
  schoolTypes: SCHOOL_TYPES,
  institutions: INSTITUTIONS,
  institutionInfo: SCHOOL_INFO,
  schoolInfo: SCHOOL_INFO,
  schoolScoreReferences: SCHOOL_SCORE_REFERENCES,
  schoolsByInstitution: SCHOOLS_BY_INSTITUTION,
  catalogFields: CATALOG_FIELDS,
  catalogRows: CATALOG_ROWS,
  schools: SCHOOLS,
  catalogTags: CATALOG_TAGS,
  catalogDistanceFilters: CATALOG_DISTANCE_FILTERS,
  catalogIntro: CATALOG_INTRO,
  catalogDisclaimer: CATALOG_DISCLAIMER,
  scoreReferenceNote: SCORE_REFERENCE_NOTE,
  strengths: STRENGTHS,
  weaknesses: WEAKNESSES,
  extras: EXTRAS,
  templates: PROFILE_TEMPLATES,
  templatesById: TEMPLATES_BY_ID,
  riasecTypes: RIASEC_TYPES,
  riasecQuestions: RIASEC_QUESTIONS,
  riasecScale: RIASEC_SCALE,
  riasecMaxPerType: RIASEC_MAX_PER_TYPE,
  riasecById: RIASEC_BY_ID,
  riasecInterestsByType: RIASEC_INTERESTS_BY_TYPE,
  riasecTemplateByType: RIASEC_TEMPLATE_BY_TYPE,
  riasecTagsByType: RIASEC_TAGS_BY_TYPE,
  careerGuide: CAREER_GUIDE,
  careerGuideHtml: CAREER_GUIDE_HTML,
  studyPlans: STUDY_PLANS,
  studyPlanSelectors: STUDY_PLAN_SELECTORS,
  technicianPrograms: TECHNICIAN_PROGRAMS
};
