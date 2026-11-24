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
export const INSTITUTIONS = ["UNAM", "IPN", "Colegio de Bachilleres", "CONALEP", "DGETI (CBTIS)", "DGETA (CBTA)", "CECyTE", "UAEMéx", "UAM", "Privadas", "Militares", "Otra"];

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
  "Militares": [],
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
  "Militares": {
    desc: "Instituciones del Sistema Educativo Militar (SEDENA). Importante: el Heroico Colegio Militar y la Universidad del Ejército y Fuerza Aérea son de nivel LICENCIATURA: piden bachillerato terminado y no son preparatorias. Los bachilleratos militarizados estatales no pertenecen al Sistema Educativo Militar federal: verifica cada caso.",
    pase: "No aplica: se ingresa por convocatoria y proceso de selección de la SEDENA, no por COMIPEMS ni por pase directo.",
    uni: "Es educación superior militar. Si aún cursas la prepa, primero termina el bachillerato y prepara tu decisión con las expos profesiográficas."
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
  ["Privadas", "Bachillerato Anáhuac (Lomas Verdes)", "Bachillerato general", "Lomas Verdes, Naucalpan, Edomex", "28", "45 min", "N/A (privada)", "No aplica (ingreso propio)", "Formación integral (académica y valores)", "General, negocios y salud", "No ofrece carrera técnica", "Pase a universidades Anáhuac; también a públicas", ["General", "Negocios", "Salud"]],
  ["Militares", "Heroico Colegio Militar", "Licenciatura militar (internado)", "Tlalpan, CDMX", "42", "1 h 25", "Por confirmar (convocatoria SEDENA)", "No aplica; requiere bachillerato terminado", "Disciplina, liderazgo y formación de oficiales", "Seguridad, administración militar y servicio", "Lic. en Administración Militar · Lic. en Seguridad Pública", "Licenciatura de 4 años en modalidad interna. Requiere mexicano por nacimiento, bachillerato con RVOE y promedio mínimo 7.0, 18 años al 1 sep, máximo 20 años 11 meses 30 días al 31 dic, estatura 1.56 m mujeres / 1.63 m hombres e IMC 18–25. Consulta la convocatoria vigente.", ["Militar", "Licenciatura", "Internado", "Liderazgo", "Sociales", "Negocios", "Beca"]],
  ["Militares", "Universidad del Ejército y Fuerza Aérea", "Licenciatura militar", "CDMX e interior de la República", "42", "1 h 25", "Por confirmar (convocatoria SEDENA)", "No aplica; requiere bachillerato terminado", "Formación profesional militar en varias disciplinas", "Ingeniería, salud, administración y seguridad", "Licenciaturas del Sistema Educativo Militar (según convocatoria)", "Educación superior de la SEDENA. Requisitos, carreras y sedes: por confirmar en https://www.gob.mx/defensa", ["Militar", "Licenciatura", "Ciencias", "Tecnología", "Salud", "Beca"]],
  ["Militares", "Escuela Militar de Ingeniería", "Licenciatura militar", "CDMX", "38", "1 h 15", "Por confirmar (convocatoria SEDENA)", "No aplica; requiere bachillerato terminado", "Ingeniería aplicada y disciplina", "Ingeniería, tecnología y construcción", "Licenciaturas en ingeniería (según convocatoria)", "Requiere bachillerato terminado. Consulta la convocatoria vigente en https://www.gob.mx/defensa", ["Militar", "Licenciatura", "Tecnología", "Ciencias", "Técnico", "Beca"]]
];

/* legacy: CATALOGO (44 escuelas), con _i = índice original */
export const SCHOOLS = CATALOG_ROWS.map((r, i) => {
  const o = {};
  CATALOG_FIELDS.forEach((f, j) => { o[f] = r[j]; });
  o._i = i;
  return o;
});

/* legacy: CAT_TAGS */
export const CATALOG_TAGS = ["General", "Ciencias", "Humanidades", "Sociales", "Arte", "Salud", "Tecnología", "Técnico", "Negocios", "Militar", "Licenciatura", "Privada", "Pública", "Beca", "Internado", "Liderazgo"];

/* legacy: distOpts del catálogo */
export const CATALOG_DISTANCE_FILTERS = [["todas", "Todas"], ["<20", "Menos de 20 km"], ["20-30", "20–30 km"], ["30-45", "30–45 km"], [">45", "Más de 45 km"]];

/* Filtros nuevos del catálogo ampliado */
export const CATALOG_SECTOR_FILTERS = [["", "Todos"], ["Pública", "Pública"], ["Privada", "Privada"], ["Militar", "Militar"]];
export const CATALOG_COST_FILTERS = [["", "Cualquiera"], ["gratis", "Sin colegiatura"], ["medio", "Hasta $5,000 / mes"], ["alto", "Más de $5,000 / mes"], ["confirmar", "Por confirmar"]];

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
  { t: "Organizar mi tiempo con horarios y metas claras", d: "C" },

  /* Ampliación v2: 5 preguntas adicionales por dimensión (10 en total).
     Las 30 primeras conservan su índice para migrar respuestas guardadas en v1. */
  { t: "Reparar la bicicleta, los muebles o algo que se rompió en casa", d: "R" },
  { t: "Trabajar con herramientas, equipo pesado o maquinaria", d: "R" },
  { t: "Cultivar plantas, cuidar animales o trabajar en el campo", d: "R" },
  { t: "Participar en actividades de rescate, patrullaje o seguridad", d: "R" },
  { t: "Medir, cortar y armar piezas con las manos", d: "R" },
  { t: "Leer artículos o ver documentales para entender un tema a fondo", d: "I" },
  { t: "Hacer cálculos o resolver acertijos y retos de lógica", d: "I" },
  { t: "Observar y clasificar seres vivos, materiales o fenómenos", d: "I" },
  { t: "Programar una computadora o resolver un problema técnico", d: "I" },
  { t: "Plantear una hipótesis y comprobarla con datos", d: "I" },
  { t: "Inventar historias, personajes o un guion para video", d: "A" },
  { t: "Diseñar ropa, espacios, logos o ilustraciones", d: "A" },
  { t: "Actuar, cantar, bailar o participar en una obra", d: "A" },
  { t: "Tomar fotografías o editar videos con mi propio estilo", d: "A" },
  { t: "Expresar mis ideas con dibujo, color o movimiento", d: "A" },
  { t: "Acompañar a alguien que está pasando por un problema", d: "S" },
  { t: "Enseñar a otros una actividad o explicar una materia", d: "S" },
  { t: "Participar en un grupo que ayuda a la comunidad", d: "S" },
  { t: "Escuchar a mis compañeros y ayudarlos a decidir", d: "S" },
  { t: "Trabajar en un equipo donde todos aportan", d: "S" },
  { t: "Organizar un evento, un club o una actividad escolar", d: "E" },
  { t: "Convencer a otras personas de un proyecto o idea", d: "E" },
  { t: "Calcular ganancias y pensar en un negocio", d: "E" },
  { t: "Tomar el mando cuando el grupo no sabe qué hacer", d: "E" },
  { t: "Negociar para llegar a un acuerdo con otras personas", d: "E" },
  { t: "Revisar listas, tablas o documentos para que no falte nada", d: "C" },
  { t: "Seguir un procedimiento paso a paso y cumplirlo", d: "C" },
  { t: "Llevar un registro de gastos, horas o materiales", d: "C" },
  { t: "Clasificar archivos, datos o información por categorías", d: "C" },
  { t: "Planear mi semana con un horario y cumplirlo", d: "C" }
];

/* v2: 10 preguntas por dimensión · escala 0–4 */
export const RIASEC_MAX_PER_TYPE = 10;

/* Mapas derivados directamente de los datos legacy */
export const RIASEC_BY_ID = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t]));
export const RIASEC_INTERESTS_BY_TYPE = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t.intereses]));
export const RIASEC_TEMPLATE_BY_TYPE = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t.plantilla]));
export const RIASEC_TAGS_BY_TYPE = Object.fromEntries(RIASEC_TYPES.map(t => [t.id, t.tags]));
export const TEMPLATES_BY_ID = Object.fromEntries(PROFILE_TEMPLATES.map(t => [t.id, t]));

/* ================================================================
   v2 · Contexto de la decisión (8 preguntas)
   Las respuestas se guardan solo en este navegador (localStorage).
   ================================================================ */
export const CONTEXT_QUESTIONS = [
  {
    id: 'meta', t: 'Al terminar la preparatoria, ¿qué te gustaría hacer?',
    hint: 'No es para siempre: solo ayuda a orientar la búsqueda.',
    options: [
      { v: 'trabajo', label: 'Trabajar pronto', tags: ['Técnico', 'Tecnología'], note: 'Te convienen opciones con carrera técnica.' },
      { v: 'universidad', label: 'Continuar a la universidad', tags: ['General', 'Ciencias', 'Humanidades', 'Salud'], note: 'Busca pase directo o buena preparación para el examen.' },
      { v: 'ambas', label: 'Las dos cosas', tags: ['Técnico', 'General'], note: 'Un bachillerato técnico bivalente puede ayudarte.' },
      { v: 'nose', label: 'Aún no lo sé', tags: ['General'], note: 'Las opciones generales te dejan más caminos abiertos.' }
    ]
  },
  {
    id: 'modalidad', t: '¿Qué tipo de bachillerato prefieres?',
    options: [
      { v: 'general', label: 'General (más flexible)', tags: ['General', 'Ciencias', 'Humanidades', 'Sociales'] },
      { v: 'tecnico', label: 'Técnico (trae carrera)', tags: ['Técnico', 'Tecnología'] },
      { v: 'indiferente', label: 'Me da igual; quiero saber más', tags: ['General', 'Técnico'] },
      { v: 'nose', label: 'No entiendo la diferencia', tags: ['General'], note: 'Mira la guía «¿Carrera técnica o bachillerato general?» en Decide tu futuro.' }
    ]
  },
  {
    id: 'militar', t: '¿Te interesa la opción militar?',
    options: [
      { v: 'si', label: 'Sí, quiero saber cómo entrar', tags: ['Militar', 'Beca', 'Liderazgo'], note: 'El Heroico Colegio Militar es licenciatura: requiere bachillerato terminado.' },
      { v: 'informarme', label: 'Quiero informarme primero', tags: ['Militar'], note: 'Ve a «Expos y fechas» y consulta la convocatoria oficial.' },
      { v: 'no', label: 'No me interesa', tags: [] },
      { v: 'nose', label: 'Aún no lo sé', tags: ['Militar'], note: 'Puedes comparar sin compromiso.' }
    ]
  },
  {
    id: 'distancia', t: '¿Qué tan lejos de Cuautitlán podrías viajar?',
    options: [
      { v: 'corta', label: 'Menos de 20 km', maxKm: 20, tags: [] },
      { v: 'media', label: 'Hasta 40 km', maxKm: 40, tags: [] },
      { v: 'larga', label: 'Hasta 60 km', maxKm: 60, tags: [] },
      { v: 'any', label: 'No me importa la distancia', maxKm: null, tags: [] }
    ]
  },
  {
    id: 'presupuesto', t: '¿Aproximadamente cuánto podría pagar tu familia al mes?',
    hint: 'Es orientativo y privado: no se guarda en la base de datos ni se comparte.',
    options: [
      { v: 'gratis', label: 'Necesito sin colegiatura o con beca', costMax: 0, tags: ['Beca'] },
      { v: 'bajo', label: 'Hasta $2,000', costMax: 1, tags: ['Beca'] },
      { v: 'medio', label: '$2,000 a $5,000', costMax: 2, tags: [] },
      { v: 'alto', label: 'Más de $5,000', costMax: 3, tags: [] },
      { v: 'nose', label: 'Prefiero no decirlo', costMax: null, tags: [] }
    ]
  },
  {
    id: 'idioma', t: '¿Qué idioma te gustaría reforzar?',
    options: [
      { v: 'ingles', label: 'Inglés', tags: ['General', 'Tecnología'] },
      { v: 'otro', label: 'Otro idioma', tags: ['Humanidades', 'General'] },
      { v: 'ninguno', label: 'Ninguno por ahora', tags: [] },
      { v: 'nose', label: 'Aún no lo sé', tags: ['General'] }
    ]
  },
  {
    id: 'apoyo', multiple: true, t: '¿Con quién te gustaría hablar antes de decidir?',
    hint: 'Puedes elegir varias opciones.',
    options: [
      { v: 'familia', label: 'Mi familia', note: 'Lleva tres opciones y sus costos a la conversación.' },
      { v: 'profesor', label: 'Mi profesor o consejero', note: 'Pide que contraste tu resultado con el test oficial de tu ficha.' },
      { v: 'visita', label: 'Visitar las escuelas', note: 'Pregunta por plan de estudios, cortes y fechas.' },
      { v: 'feria', label: 'Ir a una expo profesiográfica', note: 'Prepara tres preguntas antes de ir.' }
    ]
  },
  {
    id: 'certeza', t: '¿Qué tan claro tienes lo que quieres estudiar?',
    options: [
      { v: 'claro', label: 'Tengo algo claro', tags: [], note: 'Profundiza en planes de estudio y requisitos.' },
      { v: 'dudas', label: 'Tengo dudas entre varias opciones', tags: ['General'], note: 'Compara al menos tres escuelas y dos carreras.' },
      { v: 'muchas', label: 'No tengo idea', tags: ['General', 'Técnico'], note: 'Las expos profesiográficas son un buen primer paso.' },
      { v: 'nose', label: 'Prefiero explorar', tags: ['General'], note: 'Empieza por el catálogo y las ferias.' }
    ]
  }
];

/* ================================================================
   v2 · Expos profesiográficas y fechas
   Fuentes públicas consultadas en noviembre de 2026. Cuando no hay
   convocatoria confirmada se escribe «Por confirmar» y se enlaza el
   sitio oficial. No se inventan fechas ni montos.
   ================================================================ */
export const EXPO_EVENTS = [
  {
    id: 'ipn-2026',
    nombre: 'Expo Profesiográfica IPN 2026',
    nivel: 'Preparatoria y universidad',
    fechas: 'Media Superior: 22 ene – 1 feb 2026 · Superior: 5 – 15 feb 2026',
    estado: 'Edición 2026 concluida · próxima edición por confirmar',
    lugar: 'Av. IPN s/n, Zacatenco, CDMX',
    costo: 'Consulta la convocatoria',
    paraQue: 'Compara las carreras técnicas del IPN con las licenciaturas: sirve tanto para elegir bachillerato como para pensar en la universidad.',
    fuente: { label: 'Expo Profesiográfica IPN (sitio oficial)', url: 'https://expoprofesiografica.ipn.mx/', consulta: '2026-11-22' }
  },
  {
    id: 'sedena-feria-2026',
    nombre: 'Feria Profesiográfica de las Fuerzas Armadas',
    nivel: 'Universidad y opción militar',
    fechas: 'Edición 2026: 7 de febrero, 9:00–16:00 h · próxima edición: por confirmar',
    estado: 'Por confirmar',
    lugar: 'Ex Colegio Militar de Popotla, CDMX',
    costo: 'Gratuita en la edición 2026 (confirma en la fuente oficial)',
    paraQue: 'Explica qué se estudia en las universidades del Ejército, Fuerza Aérea y Guardia Nacional y cómo es el proceso de ingreso.',
    fuente: {
      label: 'SEDENA · Gob.mx (sitio oficial — confirma aquí la convocatoria)',
      url: 'https://www.gob.mx/defensa', consulta: '2026-11-22',
      secundaria: 'https://heraldodemexico.com.mx/nacional/2026/1/24/quieres-estar-en-las-fuerzas-armadas-asi-puedes-entrar-las-universidades-del-ejercito-fuerza-aerea-guardia-nacional-761101.html'
    }
  },
  {
    id: 'sedena-convocatoria',
    nombre: 'Convocatoria de ingreso a universidades militares (SEDENA)',
    nivel: 'Licenciatura militar',
    fechas: 'Ciclo 2026 concluido · convocatoria 2027: por confirmar',
    estado: 'Por confirmar',
    lugar: 'Centros de examen de la SEDENA (CDMX e interior de la República)',
    costo: 'Sin colegiatura; beca militar según convocatoria',
    paraQue: 'El Heroico Colegio Militar ofrece las licenciaturas en Administración Militar y Seguridad Pública. Requiere bachillerato terminado: NO es una preparatoria.',
    etapas: [
      ['Temarios', '19 nov 2025'],
      ['Registro en línea', '15 dic 2025 – 18 feb 2026'],
      ['Somatometría', '16 dic 2025 – 5 mar 2026'],
      ['Prueba física', '17 dic 2025 – 6 mar 2026'],
      ['Resultado físico', '23 mar – 3 abr 2026'],
      ['Cultural / inglés / psicológico', '6–9, 13–16, 20–23 y 27–29 abr 2026'],
      ['Resultados', '18 – 27 may 2026'],
      ['Examen médico', '30–31 may y 1–10 jun 2026'],
      ['Resultados finales', '6 – 24 jul 2026'],
      ['Documentos', '25 jul – 21 ago 2026'],
      ['Ingreso', '1 sep 2026']
    ],
    notaEtapas: 'Fechas del ciclo 2026 como referencia histórica. No son la convocatoria 2027.',
    fuente: { label: 'Gob.mx / SEDENA (sitio oficial)', url: 'https://www.gob.mx/defensa', consulta: '2026-11-14' }
  },
  {
    id: 'unam',
    nombre: 'Orientación vocacional y oferta de carreras UNAM',
    nivel: 'Universidad',
    fechas: 'Convocatoria 2027: por confirmar · referencia 2026: registro 23 ene – 3 feb, examen 23 may – 10 jun, resultados 17 jul',
    estado: 'Por confirmar',
    lugar: 'CASE UNAM / DGAE, CDMX',
    costo: 'Colegiatura pública; consulta derechos en la convocatoria',
    paraQue: 'La guía de carreras explica qué es, qué hace y dónde trabaja cada profesionista: ayuda a pasar de «no sé qué estudiar» a opciones concretas.',
    fuente: { label: 'CASE UNAM · Ingreso (sitio oficial)', url: 'https://case.unam.mx/ingreso', consulta: '2026-11-22' }
  },
  {
    id: 'uaemex',
    nombre: 'Oferta académica y orientación UAEMéx',
    nivel: 'Preparatoria y universidad',
    fechas: 'Ferias profesiográficas: por confirmar',
    estado: 'Por confirmar',
    lugar: 'Toluca y planteles del Estado de México',
    costo: 'Colegiatura pública; consulta en la convocatoria',
    paraQue: 'Útil para comparar el pase interno de la preparatoria UAEMéx con otras opciones del Estado de México.',
    fuente: { label: 'UAEMéx (sitio oficial)', url: 'https://www.uaemex.mx/', consulta: '2026-11-22' }
  }
];

export const FAIR_QUESTIONS = {
  prepa: [
    '¿Qué materias y optativas se cursan en cada semestre?',
    '¿El certificado está incorporado y por quién? ¿Necesito examen para entrar a la universidad?',
    '¿Hay pase directo? ¿Con qué promedio y a qué carreras?',
    '¿Ofrecen carrera técnica y cuál es su duración y validez?',
    '¿Cuánto cuesta el año y qué becas hay?'
  ],
  uni: [
    '¿Qué se estudia en los primeros semestres y qué materias son las más difíciles?',
    '¿Cuáles son los requisitos de ingreso y los cortes de los últimos años?',
    '¿Qué porcentaje de egresados se titula y en cuánto tiempo?',
    '¿Cómo es el campo laboral cerca de casa?',
    '¿Qué simuladores o guías de estudio recomiendan?'
  ],
  militar: [
    '¿La opción es de bachillerato o de licenciatura? ¿Necesito ya terminar la prepa?',
    '¿Cuáles son los requisitos de edad, estatura, IMC y nacionalidad?',
    '¿Cuándo se publica la convocatoria y en qué sitio oficial?',
    '¿Cómo es el internado y la vida diaria?',
    '¿Qué carreras ofrecen y a qué servicio militar se compromete uno al egresar?'
  ]
};

/* ================================================================
   v2 · Colegiaturas y perfil de cada escuela
   band: gratis (0) · medio (2) · alto (3) · confirmar (sin banda)
   ================================================================ */
export const TUITION_NOTE = 'Montos y fechas consultados en fuentes públicas el 22 de noviembre de 2026. Son referencias para comparar, NO una cotización: confirma colegiatura vigente, becas y pagos adicionales en el sitio oficial. Las escuelas públicas no cobran colegiatura, pero pueden existir derechos u otros pagos.';

export const SCHOOL_EXTRAS = {
  'Greengate School': { sector: 'Privada', nivel: 'Bachillerato', colegiatura: 'Por confirmar · solicítala directamente a la escuela', band: 'confirmar' },
  'Colegio Fray Pedro de Gante': { sector: 'Privada', nivel: 'Bachillerato', colegiatura: 'Por confirmar · solicítala directamente a la escuela', band: 'confirmar' },
  'Prepa UNITEC (Atizapán)': {
    sector: 'Privada', nivel: 'Bachillerato',
    colegiatura: 'Desde $3,897 / mes en Atizapán; puede haber becas',
    band: 'medio',
    fuente: { label: 'El Universal · guía de preparatorias Edomex 2026', url: 'https://www.generacionuniversitaria.com.mx/oferta-academica/inscribete-2026-guia-de-secundarias-y-preparatorias-en-edomex', consulta: '2026-11-22' }
  },
  'Prepa Tec de Monterrey (Campus Edo. Méx.)': {
    sector: 'Privada', nivel: 'Bachillerato',
    colegiatura: 'Referencia 2026: Bicultural $103,845 / semestre; Internacional $153,590 / semestre (puede haber extras)',
    band: 'alto',
    fuente: { label: 'Expansión · comparativo de colegiaturas 2026', url: 'https://expansion.mx/carrera/2026/08/19/prepa-cuesta-mas-de-500-000-pesos-las-mas-caras-de-mexico', consulta: '2026-11-22', oficial: 'https://tec.mx/es/preparatoria/costos-de-colegiatura' }
  },
  'Colegio Alemán Alexander von Humboldt (Lomas Verdes)': { sector: 'Privada', nivel: 'Bachillerato', colegiatura: 'Por confirmar · solicítala directamente a la escuela', band: 'confirmar' },
  'Bachillerato Anáhuac (Lomas Verdes)': {
    sector: 'Privada', nivel: 'Bachillerato',
    colegiatura: 'Referencia 2026: inscripción $38,655 + 10 pagos de $26,147 ≈ $300,125 el primer año',
    band: 'alto',
    fuente: { label: 'Expansión · comparativo de colegiaturas 2026', url: 'https://expansion.mx/carrera/2026/08/19/prepa-cuesta-mas-de-500-000-pesos-las-mas-caras-de-mexico', consulta: '2026-11-22' }
  },
  'Heroico Colegio Militar': {
    sector: 'Militar', nivel: 'Licenciatura',
    colegiatura: 'Sin colegiatura; beca militar según convocatoria',
    band: 'gratis',
    fuente: { label: 'Gob.mx / SEDENA (sitio oficial)', url: 'https://www.gob.mx/defensa', consulta: '2026-11-14' }
  },
  'Universidad del Ejército y Fuerza Aérea': {
    sector: 'Militar', nivel: 'Licenciatura',
    colegiatura: 'Sin colegiatura; beca militar según convocatoria',
    band: 'gratis',
    fuente: { label: 'Gob.mx / SEDENA (sitio oficial)', url: 'https://www.gob.mx/defensa', consulta: '2026-11-14' }
  },
  'Escuela Militar de Ingeniería': {
    sector: 'Militar', nivel: 'Licenciatura',
    colegiatura: 'Sin colegiatura; beca militar según convocatoria',
    band: 'gratis',
    fuente: { label: 'Gob.mx / SEDENA (sitio oficial)', url: 'https://www.gob.mx/defensa', consulta: '2026-11-14' }
  }
};

/* ================================================================
   v2 · Cómo decidir: por ti, en familia y con tu profesor
   ================================================================ */
export const DECISION_GUIDE = {
  individual: {
    title: 'Por ti', icon: '🧭',
    items: [
      'Contrasta tus tipos RIASEC más fuertes con las materias que se te dan bien y con lo que disfrutas de verdad.',
      'Define si quieres un bachillerato general (más flexible) o técnico (trae carrera y permite trabajar antes).',
      'Piensa en tu presupuesto, el tiempo de traslado y si te interesa la opción militar. Escribe qué estás dispuesto a sacrificar.',
      'No elijas una carrera solo por el nombre: averigua qué se hace en la vida real y qué materias se cursan.',
      'Lleva tres opciones y una de respaldo. Si no entras a tu primera elección, ya tendrás un plan.'
    ]
  },
  family: {
    title: 'En familia', icon: '👨‍👩‍👧',
    items: [
      'Hablen de dinero con claridad: colegiatura mensual, pago anual, transporte, libros, exámenes y posibles becas.',
      'Consideren el tiempo de traslado, el horario y quién podría acompañarte en el proceso.',
      'Escuchen sin imponer: quien cursará los estudios y ejercerá la profesión eres tú. La familia acompaña, no sustituye tu decisión.',
      'Pregunten juntos en las expos profesiográficas. Lleven impresas las tres opciones y sus dudas.',
      'Acuerden cuándo revisarán la decisión: un plan se puede ajustar con nueva información.'
    ]
  },
  teacher: {
    title: 'Con tu profesor', icon: '🧑‍🏫',
    items: [
      'Compara este resultado exploratorio con el test oficial de orientación de tu ficha; no tienen por qué coincidir exactamente.',
      'Pide revisar juntos el plan de estudios semestre por semestre y tus materias más débiles.',
      'Pregunta por simuladores, guías de admisión y fechas de convocatorias vigentes.',
      'Si te interesa la opción militar, confirma en gob.mx/defensa los requisitos de la convocatoria vigente.'
    ]
  },
  questions: [
    '¿Qué materias se estudian y cuáles se me dificultan?',
    '¿Podré trabajar al terminar o necesito ir a la universidad?',
    '¿Cuánto cuesta el año y qué becas existen?',
    '¿Cuál fue el corte real de los últimos años y cómo va mi promedio?',
    '¿Qué pasa si no entro a mi primera opción?'
  ]
};

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
   SUPER CATÁLOGO DE CARRERAS
   Qué se estudia, cuánto dura, qué harás, qué bachillerato conviene y
   dónde puedes cursarla. Las instituciones enlazan a su catálogo oficial:
   la oferta vigente, sedes y fechas deben verificarse ahí.
   Fuentes consultadas el 23 de noviembre de 2026.
   ===================================================================== */
export const CAREER_AREAS = [
  { id: "salud", nombre: "Salud y bienestar", icon: "🩺" },
  { id: "ingenieria", nombre: "Ingeniería y tecnología", icon: "⚙️" },
  { id: "ciencias", nombre: "Ciencias naturales y exactas", icon: "🔬" },
  { id: "educacion", nombre: "Educación y humanidades", icon: "📚" },
  { id: "sociales", nombre: "Ciencias sociales y derecho", icon: "⚖️" },
  { id: "negocios", nombre: "Negocios y administración", icon: "📊" },
  { id: "artes", nombre: "Artes, diseño y cultura", icon: "🎨" },
  { id: "agro", nombre: "Agro, agua y ambiente", icon: "🌱" },
  { id: "defensa", nombre: "Defensa y seguridad", icon: "🎖️" },
  { id: "tecnica", nombre: "Carreras técnicas", icon: "🛠️" }
];

export const CAREER_PROVIDERS = {
  UNAM: { nombre: "UNAM", url: "https://oferta.unam.mx/carreras.php", nota: "Catálogo oficial: 126 licenciaturas agrupadas por área." },
  IPN: { nombre: "IPN", url: "https://www.ipn.mx/oferta-educativa/educacion-superior/", nota: "Oferta oficial de nivel superior por escuela y unidad." },
  UAM: { nombre: "UAM", url: "https://www.uam.mx/licenciaturas/index.html", nota: "85 licenciaturas en 5 unidades; duración en trimestres." },
  UAEMEX: { nombre: "UAEMéx", url: "http://denms.uaemex.mx/exporientavirtual/?course_level=licenciatura", nota: "Exporienta Virtual: oferta por región y duración." },
  SEDENA: { nombre: "SEDENA / HCM", url: "https://www.gob.mx/defensa", nota: "Heroico Colegio Militar: licenciaturas que requieren bachillerato previo. Convocatoria por confirmar." },
  CONALEP: { nombre: "CONALEP", url: "https://www.conalep.edu.mx/", nota: "Carreras técnicas con bachillerato técnico; verifica plantel y duración." },
  CBTIS: { nombre: "DGETI (CBTIS)", url: "https://www.dgeti.mx/", nota: "Bachillerato técnico; verifica plantel y especialidad vigente." },
  PRIVADAS: { nombre: "Instituciones privadas", url: "https://www.gob.mx/sep", nota: "Compara RVOE, colegiatura y becas en el sitio de cada institución." }
};

export const CAREER_NOTE = 'Este catálogo es una <b>guía de exploración</b>, no una lista definitiva: cada institución actualiza su oferta, sedes y requisitos. Abre el catálogo oficial de cada casa de estudios antes de elegir. Las licenciaturas del Heroico Colegio Militar <b>requieren bachillerato terminado</b>: no son preparatorias.';

export const CAREER_FIELDS = ["id", "nombre", "area", "riasec", "duracion", "materias", "perfil", "salida", "prepa", "instituciones", "tags"];

export const CAREER_ROWS = [
  /* Salud y bienestar */
  ["medico", "Médico cirujano", "salud", "IS", "6 años aprox.", "Anatomía · Fisiología · Bioquímica · Farmacología · Clínica", "Curiosidad científica, responsabilidad y resistencia al esfuerzo", "Consulta médica, hospitales, urgencias, investigación y salud pública", "Bachillerato general fuerte en biología y química", "UNAM|IPN|UAM|UAEMEX|PRIVADAS", "Salud,Ciencias,Beca"],
  ["enfermeria", "Enfermería", "salud", "SI", "4–5 años aprox.", "Cuidado general · Farmacología · Salud comunitaria · Práctica clínica", "Empatía, orden, trabajo en equipo y disposición para atender", "Hospitales, clínicas, consultorios, salud escolar y domiciliaria", "Bachillerato general o técnico en salud", "UNAM|IPN|UAM|UAEMEX|CONALEP|PRIVADAS", "Salud,Cuidado,Beca"],
  ["odontologia", "Odontología", "salud", "IR", "4–5 años aprox.", "Anatomía bucal · Materiales · Operatoria · Cirugía menor", "Precisión manual, paciencia y comunicación con pacientes", "Consultorio privado, clínicas dentales y salud bucal comunitaria", "Bachillerato general con biología y química", "UNAM|IPN|UAM|PRIVADAS", "Salud,Técnico"],
  ["psicologia", "Psicología", "salud", "SI", "4–5 años aprox.", "Psicología general · Desarrollo · Evaluación · Terapia · Investigación", "Escucha, curiosidad por las personas y criterio ético", "Consultoría psicológica, escuelas, empresas y salud mental", "Bachillerato general; útiles humanidades y biología", "UNAM|IPN|UAM|UAEMEX|PRIVADAS", "Salud,Sociales,Humanidades"],
  ["nutricion", "Nutrición", "salud", "IS", "4 años aprox.", "Bioquímica · Alimentos · Dietética · Salud pública · Antropología", "Interés por la ciencia y por acompañar hábitos de vida", "Consultoría nutricional, hospitales, escuelas e industria de alimentos", "Bachillerato general con ciencias naturales", "UNAM|IPN|UAM|PRIVADAS", "Salud,Ciencias"],
  ["farmacia", "Farmacia / Química farmacéutica", "salud", "IC", "4–5 años aprox.", "Química · Farmacología · Formulación · Control de calidad · Legislación", "Rigor, precisión y gusto por el laboratorio", "Industria farmacéutica, farmacia hospitalaria, análisis y ventas técnicas", "Bachillerato general; química y biología sólidas", "UNAM|IPN|UAEMEX|PRIVADAS", "Salud,Ciencias,Tecnología"],
  ["optometria", "Optometría", "salud", "IR", "4 años aprox.", "Óptica · Anatomía ocular · Refracción · Contactología · Baja visión", "Precisión, paciencia y atención al detalle", "Consultorios, ópticas, hospitales y salud visual escolar", "Bachillerato general con física y biología", "IPN|PRIVADAS", "Salud,Técnico"],
  ["fisioterapia", "Fisioterapia / Rehabilitación", "salud", "SR", "4 años aprox.", "Anatomía · Biomecánica · Terapia manual · Rehabilitación · Ejercicio", "Empatía, disposición física y trabajo con personas", "Rehabilitación hospitalaria, consultorios, deporte y tercera edad", "Bachillerato general; conviene biología y educación física", "UAEMEX|PRIVADAS", "Salud,Cuidado"],
  ["saludpublica", "Salud pública", "salud", "IS", "4–5 años aprox.", "Epidemiología · Estadística · Promoción de salud · Políticas · Ambiente", "Pensamiento analítico y compromiso social", "Secretarías de salud, organismos internacionales, vigilancia epidemiológica", "Bachillerato general; útiles matemáticas y ciencias", "UNAM|UAEMEX|PRIVADAS", "Salud,Sociales,Beca"],
  ["trabajosocial", "Trabajo social", "salud", "SE", "4–5 años aprox.", "Política social · Comunidad · Familia · Derechos · Investigación", "Empatía, organización y disposición para trabajar en campo", "Instituciones públicas, ONG, escuelas, hospitales y comunidades", "Bachillerato general o técnico en servicios sociales", "UNAM|IPN|UAM|UAEMEX|CONALEP", "Salud,Sociales,Beca"],

  /* Ingeniería y tecnología */
  ["civil", "Ingeniería civil", "ingenieria", "IR", "4–5 años aprox.", "Matemáticas · Mecánica · Materiales · Estructuras · Topografía", "Gusto por construir, análisis espacial y trabajo de campo", "Obras públicas y privadas, consultoría, supervisión y construcción", "Bachillerato general o técnico; matemáticas y física fuertes", "UNAM|IPN|UAM|UAEMEX|PRIVADAS", "Tecnología,Técnico,Beca"],
  ["industrial", "Ingeniería industrial", "ingenieria", "IRC", "4–5 años aprox.", "Estadística · Procesos · Logística · Economía · Calidad", "Orden, análisis de procesos y liderazgo", "Fábricas, logística, consultoría, operaciones y mejora continua", "Bachillerato general o técnico con matemáticas", "UNAM|IPN|UAM|UAEMEX|PRIVADAS", "Tecnología,Negocios,Beca"],
  ["mecanica", "Ingeniería mecánica", "ingenieria", "IR", "4–5 años aprox.", "Termodinámica · Mecánica · Materiales · Diseño · Manufactura", "Manualidad técnica, lógica y gusto por las máquinas", "Industria manufacturera, energía, transporte y mantenimiento", "Bachillerato técnico o general con física y matemáticas", "UNAM|IPN|UAM|PRIVADAS", "Tecnología,Técnico"],
  ["electrica", "Ingeniería eléctrica", "ingenieria", "IR", "4–5 años aprox.", "Circuitos · Electromagnetismo · Máquinas · Energía · Control", "Análisis, precisión y gusto por la electricidad", "Generación y distribución de energía, industria y redes", "Bachillerato general o técnico; física y matemáticas", "IPN|UAM|PRIVADAS", "Tecnología,Técnico,Beca"],
  ["electronica", "Ingeniería electrónica", "ingenieria", "IR", "4–5 años aprox.", "Circuitos · Señales · Microcontroladores · Comunicaciones · Digital", "Paciencia, precisión y curiosidad por la tecnología", "Diseño de dispositivos, telecomunicaciones, electrónica industrial", "Bachillerato técnico o general con física", "IPN|UAM|PRIVADAS", "Tecnología,Técnico"],
  ["computacion", "Ingeniería en computación / Informática", "ingenieria", "IC", "4–5 años aprox.", "Programación · Estructuras · Algoritmos · Bases de datos · Sistemas", "Lógica, abstracción y disposición a practicar código", "Desarrollo de software, sistemas, datos, ciberseguridad y startups", "Bachillerato general o técnico; matemáticas y lógica", "UNAM|IPN|UAM|UAEMEX|PRIVADAS", "Tecnología,Beca"],
  ["sistemas", "Ingeniería de sistemas computacionales", "ingenieria", "IC", "4–5 años aprox.", "Sistemas operativos · Redes · Arquitectura · Software · Base de datos", "Pensamiento sistémico, orden y resolución de problemas", "Infraestructura tecnológica, cloud, redes y desarrollo de sistemas", "Bachillerato general o técnico en informática", "IPN|UAM|PRIVADAS", "Tecnología,Beca"],
  ["ia", "Ingeniería en inteligencia artificial", "ingenieria", "IC", "4–5 años aprox.", "Estadística · Aprendizaje automático · Datos · Programación · Ética", "Matemáticas, curiosidad y responsabilidad con el uso de datos", "Modelos de IA, análisis de datos, automatización e investigación", "Bachillerato general con matemáticas y programación", "IPN|UAEMEX|PRIVADAS", "Tecnología,Ciencias,Beca"],
  ["datos", "Ciencia de datos", "ingenieria", "IC", "4 años aprox.", "Probabilidad · Estadística · Programación · Visualización · Modelos", "Gusto por números, código y preguntas bien planteadas", "Analítica, negocios, investigación, gobierno y tecnología", "Bachillerato general con matemáticas", "IPN|UAM|PRIVADAS", "Tecnología,Ciencias,Negocios"],
  ["mecatronica", "Ingeniería mecatrónica", "ingenieria", "IR", "4–5 años aprox.", "Mecánica · Electrónica · Control · Programación · Robótica", "Gusto por integrar partes, lógica y trabajo en laboratorio", "Automatización industrial, robótica, mantenimiento y diseño", "Bachillerato técnico o general con física y matemáticas", "IPN|UAM|PRIVADAS", "Tecnología,Técnico"],
  ["ambiental", "Ingeniería ambiental", "ingenieria", "IR", "4–5 años aprox.", "Química · Ecología · Tratamiento de aguas · Residuos · Normativa", "Conciencia ambiental, análisis y trabajo de campo", "Consultoría ambiental, tratamiento de agua, energía y cumplimiento normativo", "Bachillerato general con ciencias naturales", "IPN|UAM|PRIVADAS", "Tecnología,Medio ambiente,Beca"],
  ["quimica", "Ingeniería química", "ingenieria", "IC", "4–5 años aprox.", "Química · Termodinámica · Procesos · Reacciones · Plantas", "Rigor experimental, paciencia y seguridad en el laboratorio", "Industria química, alimentos, farmacéutica, energía y procesos", "Bachillerato general con química y matemáticas", "UNAM|IPN|UAM|UAEMEX|PRIVADAS", "Tecnología,Ciencias,Beca"],
  ["biomedica", "Ingeniería biomédica", "ingenieria", "IR", "4–5 años aprox.", "Biología · Electrónica · Señales · Materiales · Dispositivos", "Curiosidad mixta: ciencia, tecnología y salud", "Equipos médicos, imágenes, sensores, hospitales e investigación", "Bachillerato general con biología, física y matemáticas", "IPN|UAM|PRIVADAS", "Tecnología,Salud,Ciencias"],
  ["aeronautica", "Ingeniería aeronáutica", "ingenieria", "IR", "4–5 años aprox.", "Aerodinámica · Estructuras · Motores · Materiales · Vuelo", "Precisión, interés por la aviación y análisis", "Aviación comercial, mantenimiento, diseño y defensa", "Bachillerato general con física y matemáticas", "IPN|PRIVADAS", "Tecnología,Beca"],
  ["automotriz", "Ingeniería en sistemas automotrices", "ingenieria", "IR", "4 años aprox.", "Motores · Electrónica · Transmisiones · Diagnóstico · Manufactura", "Gusto por autos, manejo de herramientas y electricidad", "Ensamble, mantenimiento, diagnóstico y diseño automotriz", "Bachillerato técnico o general con física", "IPN|PRIVADAS", "Tecnología,Técnico"],
  ["telecom", "Ingeniería en comunicaciones y electrónica", "ingenieria", "IR", "4–5 años aprox.", "Señales · Redes · Antenas · Comunicaciones · Digital", "Análisis, precisión e interés por conectividad", "Redes, telecomunicaciones, broadcast e IoT", "Bachillerato general o técnico con física", "IPN|UAM|PRIVADAS", "Tecnología,Beca"],
  ["energia", "Ingeniería en energía", "ingenieria", "IR", "4–5 años aprox.", "Energía · Termodinámica · Redes · Renovables · Economía", "Interés por la infraestructura y los retos energéticos", "Generación, distribución, eficiencia y energías renovables", "Bachillerato general con física y matemáticas", "IPN|UAM|PRIVADAS", "Tecnología,Medio ambiente"],
  ["petroquimica", "Ingeniería petroquímica y petrolera", "ingenieria", "IR", "4–5 años aprox.", "Química · Yacimientos · Refinación · Procesos · Seguridad", "Rigor, gusto por la industria y disposición a rotar", "Petróleo, gas, refinación, petroquímica y energía", "Bachillerato general con química y matemáticas", "IPN|UAEMEX|PRIVADAS", "Tecnología,Beca"],

  /* Ciencias naturales y exactas */
  ["biologia", "Biología", "ciencias", "I", "4–5 años aprox.", "Genética · Ecología · Biología celular · Evolución · Laboratorio", "Curiosidad por lo vivo, observación y paciencia", "Investigación, educación, biotecnología, conservación y salud", "Bachillerato general con biología y química", "UNAM|IPN|UAM|PRIVADAS", "Ciencias,Beca"],
  ["fisica", "Física", "ciencias", "I", "4–5 años aprox.", "Mecánica · Electromagnetismo · Termodinámica · Cuántica · Laboratorio", "Gusto por explicar el mundo con modelos y matemáticas", "Investigación, docencia, tecnología, energía y meteorología", "Bachillerato general con física y matemáticas avanzadas", "UNAM|IPN|UAM|PRIVADAS", "Ciencias,Beca"],
  ["matematicas", "Matemáticas", "ciencias", "IC", "4–5 años aprox.", "Álgebra · Análisis · Geometría · Probabilidad · Lógica", "Abstracción, constancia y gusto por la demostración", "Investigación, docencia, actuaría, datos y tecnología", "Bachillerato general con matemáticas fuertes", "UNAM|IPN|UAM|PRIVADAS", "Ciencias,Beca"],
  ["estadistica", "Estadística", "ciencias", "IC", "4–5 años aprox.", "Probabilidad · Inferencia · Regresión · Muestreo · Cómputo", "Gusto por datos, lógica y comunicación de resultados", "Análisis en mercado, salud, gobierno, financiero e investigación", "Bachillerato general con matemáticas", "UNAM|PRIVADAS", "Ciencias,Negocios"],
  ["geologia", "Geología y geofísica", "ciencias", "IR", "4–5 años aprox.", "Mineralogía · Estratigrafía · Sismología · Geofísica · Campo", "Gusto por el terreno, observación y análisis", "Exploración, recursos naturales, riesgos geológicos e investigación", "Bachillerato general con química, física y geografía", "IPN|UAM|PRIVADAS", "Ciencias,Medio ambiente"],
  ["cienciasambientales", "Ciencias ambientales", "ciencias", "IR", "4–5 años aprox.", "Ecología · Clima · Suelos · Biodiversidad · Política ambiental", "Curiosidad por la naturaleza y compromiso social", "Conservación, consultoría, gestión ambiental y educación", "Bachillerato general con ciencias naturales", "UAM|UAEMEX|PRIVADAS", "Ciencias,Medio ambiente"],
  ["actuaria", "Actuaría", "ciencias", "IC", "4–5 años aprox.", "Probabilidad · Finanzas · Seguros · Modelos · Programación", "Matemáticas aplicadas, orden y visión de negocio", "Seguros, pensiones, banca, consultoría y gestión de riesgos", "Bachillerato general con matemáticas avanzadas", "UNAM|PRIVADAS", "Ciencias,Negocios,Beca"],
  ["astronomia", "Astronomía / Ciencias atmosféricas", "ciencias", "I", "4–5 años aprox.", "Física · Matemáticas · Observación · Atmósfera · Datos", "Paciencia, curiosidad y gusto por la observación", "Observatorios, meteorología, investigación y divulgación", "Bachillerato general con física y matemáticas", "UAM|PRIVADAS", "Ciencias,Beca"],

  /* Educación y humanidades */
  ["pedagogia", "Pedagogía / Educación", "educacion", "SI", "4 años aprox.", "Aprendizaje · Didáctica · Evaluación · Psicología educativa · Práctica", "Gusto por enseñar, paciencia y escucha", "Docencia, diseño de materiales, formación y gestión escolar", "Bachillerato general; útiles humanidades y comunicación", "UNAM|UAM|UAEMEX|PRIVADAS", "Sociales,Humanidades,Beca"],
  ["educacioninicial", "Educación inicial / preescolar", "educacion", "SI", "3–4 años aprox.", "Desarrollo infantil · Juego · Didáctica · Familia · Práctica", "Cariño, paciencia y disposición para trabajar con niños", "Preescolar, guarderías, escuelas primarias y orientación familiar", "Bachillerato general o técnico en educación", "UAM|UAEMEX|CONALEP|PRIVADAS", "Sociales,Humanidades,Cuidado"],
  ["letras", "Letras hispánicas / Literatura", "educacion", "AI", "4 años aprox.", "Literatura · Lingüística · Redacción · Crítica · Historia", "Gusto por leer, escribir y analizar textos", "Docencia, edición, corrector, guionista y comunicación", "Bachillerato general con humanidades y español fuerte", "UNAM|UAM|UAEMEX|PRIVADAS", "Humanidades,Arte,Beca"],
  ["historia", "Historia", "educacion", "AI", "4–5 años aprox.", "Historia de México · Universal · Fuentes · Metodología · Investigación", "Curiosidad por el pasado, lectura y análisis crítico", "Docencia, investigación, museos, patrimonio y divulgación", "Bachillerato general con humanidades", "UNAM|UAM|PRIVADAS", "Humanidades,Beca"],
  ["filosofia", "Filosofía", "educacion", "AI", "4–5 años aprox.", "Lógica · Ética · Ontología · Filosofía política · Historia de la filosofía", "Gusto por preguntas profundas, argumentación y lectura", "Docencia, investigación, ética, periodismo de ideas y función pública", "Bachillerato general con humanidades", "UNAM|UAM|PRIVADAS", "Humanidades,Beca"],
  ["linguistica", "Lingüística", "educacion", "AI", "4 años aprox.", "Fonología · Sintaxis · Semántica · Lenguas · Métodos", "Curiosidad por el lenguaje, precisión y análisis", "Enseñanza de idiomas, traducción, investigación y tecnología del lenguaje", "Bachillerato general con idiomas y humanidades", "UNAM|UAM|PRIVADAS", "Humanidades,Idiomas"],
  ["ingles", "Enseñanza de inglés / Lenguas", "educacion", "AI", "4 años aprox.", "Inglés · Pedagogía · Gramática · Pronunciación · Práctica docente", "Gusto por idiomas, comunicación y enseñar", "Docencia de idiomas, traducción, turismo y comunicación corporativa", "Bachillerato general; recomendable nivel de inglés previo", "UNAM|UAM|PRIVADAS", "Humanidades,Idiomas"],
  ["comunicacion", "Ciencias de la comunicación", "educacion", "AE", "4 años aprox.", "Teoría · Redacción · Medios · Producción · Cultura", "Gusto por contar historias, analizar medios y trabajar en equipo", "Medios, comunicación corporativa, contenido, producción y gestión cultural", "Bachillerato general con humanidades y redacción", "UNAM|UAM|UAEMEX|PRIVADAS", "Humanidades,Arte"],
  ["periodismo", "Periodismo", "educacion", "AE", "4 años aprox.", "Reporteo · Entrevista · Redacción · Ética · Verificación", "Curiosidad, rigor, redacción y resistencia a entregar a tiempo", "Redacciones, medios digitales, reportería y comunicación pública", "Bachillerato general con español y humanidades fuertes", "UNAM|PRIVADAS", "Humanidades,Arte"],
  ["humanidades", "Humanidades", "educacion", "AI", "4 años aprox.", "Cultura · Filosofía · Historia · Lenguaje · Interpretación", "Gusto por leer, discutir ideas y entender sociedades", "Docencia, investigación, gestión cultural y comunicación", "Bachillerato general con humanidades", "UAM|PRIVADAS", "Humanidades,Beca"],

  /* Ciencias sociales y derecho */
  ["derecho", "Derecho", "sociales", "E", "5 años aprox.", "Derecho civil · Penal · Constitucional · Procedimientos · Ética", "Argumentación, lectura constante y sentido de justicia", "Abogacía, juzgados, empresa, derecho público y consultoría", "Bachillerato general con humanidades y redacción", "UNAM|IPN|UAM|UAEMEX|PRIVADAS", "Sociales,Beca"],
  ["economia", "Economía", "sociales", "IC", "4–5 años aprox.", "Micro · Macro · Matemáticas · Estadística · Política pública", "Gusto por datos, contexto social y análisis", "Banca, consultoría, sector público, investigación y negocios", "Bachillerato general con matemáticas", "UNAM|IPN|UAM|PRIVADAS", "Sociales,Negocios,Beca"],
  ["sociologia", "Sociología", "sociales", "IS", "4 años aprox.", "Teoría social · Métodos · Encuestas · Cultura · Desigualdad", "Curiosidad por la sociedad, lectura y análisis", "Investigación, políticas públicas, educación y consultoría social", "Bachillerato general con humanidades y matemáticas básicas", "UNAM|UAM|PRIVADAS", "Sociales,Beca"],
  ["cienciapolitica", "Ciencia política", "sociales", "IE", "4 años aprox.", "Instituciones · Elecciones · Política comparada · Derecho · Métodos", "Interés por lo público, análisis y debate", "Gobierno, partidos, organismos internacionales, consultoría y análisis", "Bachillerato general con humanidades", "UNAM|IPN|UAM|PRIVADAS", "Sociales,Beca"],
  ["relaciones", "Relaciones internacionales", "sociales", "IE", "4–5 años aprox.", "Política internacional · Derecho · Economía · Idiomas · Negociación", "Gusto por el mundo, idiomas y diplomacia", "Diplomacia, organismos internacionales, comercio y análisis geopolítico", "Bachillerato general con idiomas y humanidades", "UNAM|PRIVADAS", "Sociales,Idiomas"],
  ["administracionpublica", "Administración pública", "sociales", "EC", "4 años aprox.", "Política pública · Gestión · Finanzas · Derecho · Evaluación", "Orden, interés por lo público y trabajo con equipos", "Gobierno, dependencias, gestión de proyectos y políticas", "Bachillerato general", "UNAM|UAEMEX|PRIVADAS", "Sociales,Beca"],
  ["criminologia", "Criminología / Seguridad ciudadana", "sociales", "IS", "4 años aprox.", "Criminología · Derecho · Psicología · Investigación · Políticas", "Análisis, interés por la justicia y trabajo en campo", "Prevención, investigación, sistema penitenciario y consultoría", "Bachillerato general con humanidades", "UAEMEX|PRIVADAS", "Sociales,Seguridad"],
  ["geografia", "Geografía humana", "sociales", "IS", "4 años aprox.", "Territorio · Población · Cartografía · Urbanismo · SIG", "Gusto por mapas, sociedad y ambiente", "Planeación urbana, investigación, SIG y gestión territorial", "Bachillerato general con geografía", "UAM|PRIVADAS", "Sociales,Medio ambiente"],
  ["archivonomia", "Archivonomía y biblioteconomía", "sociales", "IC", "4 años aprox.", "Archivos · Organización de información · Documentación · Bases de datos", "Orden, precisión y gusto por organizar información", "Archivos históricos, bibliotecas, transparencia y gestión documental", "Bachillerato general", "IPN|PRIVADAS", "Sociales,Cultura"],

  /* Negocios y administración */
  ["administracion", "Administración", "negocios", "EC", "4–5 años aprox.", "Contabilidad · Finanzas · Marketing · Operaciones · Recursos humanos", "Liderazgo, organización y gusto por los negocios", "Empresas, consultoría, emprendimiento y sector público", "Bachillerato general o técnico en administración", "UNAM|IPN|UAM|PRIVADAS", "Negocios,Beca"],
  ["contaduria", "Contaduría pública", "negocios", "IC", "4–5 años aprox.", "Contabilidad · Auditoría · Finanzas · Impuestos · Normativa", "Orden, precisión y responsabilidad con cifras", "Contabilidad, auditoría, fiscal, consultoría y empresa", "Bachillerato general o técnico en contabilidad", "UNAM|IPN|PRIVADAS", "Negocios,Beca"],
  ["finanzas", "Finanzas", "negocios", "IC", "4–5 años aprox.", "Mercados · Inversión · Riesgos · Valoración · Economía", "Disciplina, análisis numérico y visión de largo plazo", "Banca, inversión, seguros, tesorería y análisis financiero", "Bachillerato general con matemáticas", "UNAM|PRIVADAS", "Negocios"],
  ["mercadotecnia", "Mercadotecnia y mercadotecnia digital", "negocios", "EA", "4 años aprox.", "Investigación de mercado · Marca · Publicidad · Datos · Contenido", "Creatividad, análisis de audiencias y comunicación", "Marketing digital, agencias, e-commerce, marca y ventas", "Bachillerato general o técnico en marketing", "IPN|PRIVADAS", "Negocios,Arte"],
  ["negociosint", "Negocios internacionales y comercio", "negocios", "EC", "4–5 años aprox.", "Comercio exterior · Logística · Negociación · Idiomas · Normativa", "Gusto por otras culturas, idiomas y negociación", "Comercio exterior, exportación, logística y empresas globales", "Bachillerato general con inglés", "IPN|PRIVADAS", "Negocios,Idiomas"],
  ["comercioelectronico", "Negocios digitales y comercio electrónico", "negocios", "EC", "4 años aprox.", "Plataformas · Analítica · Pago digital · Logística · Marketing", "Gusto por tecnología y ventas, mentalidad de prueba", "Tiendas en línea, marketplaces, startups y consultoría digital", "Bachillerato general o técnico en informática", "IPN|PRIVADAS", "Negocios,Tecnología"],
  ["turismo", "Turismo y turismo sustentable", "negocios", "ES", "4 años aprox.", "Turismo · Hospitalidad · Cultura · Gestión · Sustentabilidad", "Gusto por viajar, atender personas y organizar experiencias", "Hotelería, agencias, destinos, eventos y turismo alternativo", "Bachillerato general o técnico en turismo", "IPN|UAEMEX|CONALEP|PRIVADAS", "Negocios,Sociales"],
  ["rh", "Gestión de recursos humanos", "negocios", "ES", "4 años aprox.", "Selección · Capacitación · Relaciones laborales · Derecho · Organización", "Empatía, orden y habilidad para trabajar con equipos", "Reclutamiento, capacitación, clima laboral y consultoría", "Bachillerato general o técnico en administración", "PRIVADAS", "Negocios,Sociales"],
  ["emprendimiento", "Emprendimiento e innovación", "negocios", "EA", "4 años aprox.", "Modelo de negocio · Finanzas · Marketing · Innovación · Liderazgo", "Iniciativa, tolerancia al riesgo y gusto por crear", "Creación de empresas, incubadoras, consultoría e intraemprendimiento", "Bachillerato general; útil cualquier técnica", "PRIVADAS", "Negocios,Liderazgo"],
  ["negociosenergeticos", "Negocios energéticos sustentables", "negocios", "EC", "4 años aprox.", "Energía · Economía · Regulación · Proyectos · Sustentabilidad", "Interés por energía, análisis y gestión de proyectos", "Empresas energéticas, consultoría y proyectos sustentables", "Bachillerato general con matemáticas", "IPN|PRIVADAS", "Negocios,Medio ambiente"],

  /* Artes, diseño y cultura */
  ["arquitectura", "Arquitectura", "artes", "AR", "5 años aprox.", "Diseño · Teoría · Estructuras · Urbanismo · Taller", "Creatividad, sensibilidad espacial y precisión técnica", "Estudio de arquitectura, construcción, urbanismo y diseño", "Bachillerato general o técnico en construcción; dibujo útil", "UNAM|IPN|UAM|PRIVADAS", "Arte,Técnico"],
  ["disenografico", "Diseño gráfico / de la comunicación", "artes", "AR", "4 años aprox.", "Tipografía · Composición · Color · Ilustración · Diseño digital", "Gusto por comunicar visualmente, ojo para el detalle", "Agencias, estudio de diseño, marcas, editorial y redes", "Bachillerato general o técnico en diseño", "UAM|PRIVADAS|CONALEP", "Arte,Tecnología"],
  ["disenoindustrial", "Diseño industrial", "artes", "AR", "4 años aprox.", "Forma · Materiales · Ergonomía · Producto · Producción", "Creatividad aplicada, observación y gusto por objetos", "Diseño de productos, manufactura, mueble, transporte y consultoría", "Bachillerato general o técnico; dibujo y tecnología", "UAM|PRIVADAS", "Arte,Técnico"],
  ["disenomoda", "Diseño de modas", "artes", "AR", "3–4 años aprox.", "Diseño de vestuario · Textiles · Costura · Tendencias · Producción", "Creatividad, paciencia manual y sentido estético", "Industria textil, marcas de moda, vestuario y emprendimiento", "Bachillerato general o técnico en costura o diseño", "PRIVADAS|CONALEP", "Arte,Técnico"],
  ["musica", "Música", "artes", "A", "4–5 años aprox.", "Instrumento · Teoría · Armonía · Composición · Ensamble", "Disciplina de práctica, oído y sensibilidad", "Interpretación, enseñanza, producción musical y dirección", "Bachillerato general; experiencia musical previa recomendable", "UNAM|UAEMEX|PRIVADAS", "Arte,Liderazgo"],
  ["danza", "Danza", "artes", "A", "4–5 años aprox.", "Técnica · Coreografía · Historia · Anatomía · Interpretación", "Disciplina corporal, constancia y expresión", "Compañías, enseñanza, coreografía y gestión cultural", "Bachillerato general; entrenamiento previo recomendable", "UNAM|UAEMEX|PRIVADAS", "Arte,Liderazgo"],
  ["teatro", "Teatro / Artes dramáticas", "artes", "A", "4 años aprox.", "Actuación · Dirección · Guion · Voz · Historia del teatro", "Expresión, trabajo en equipo y disposición a ensayar", "Teatro, televisión, cine, dirección y enseñanza", "Bachillerato general con humanidades", "UNAM|PRIVADAS", "Arte,Liderazgo"],
  ["cine", "Estudios cinematográficos y audiovisuales", "artes", "AR", "4 años aprox.", "Guion · Cámara · Edición · Sonido · Producción", "Gusto por contar historias, paciencia y trabajo en equipo", "Cine, televisión, publicidad, video y plataformas digitales", "Bachillerato general con humanidades", "UNAM|UAEMEX|PRIVADAS", "Arte,Tecnología"],
  ["artesplasticas", "Artes plásticas y visuales", "artes", "A", "4 años aprox.", "Dibujo · Pintura · Escultura · Historia del arte · Taller", "Sensibilidad, constancia y curiosidad estética", "Producción artística, museos, galerías y enseñanza", "Bachillerato general con humanidades", "UNAM|PRIVADAS", "Arte,Cultura"],

  /* Agro, agua y ambiente */
  ["agronomia", "Ingeniería agronómica", "agro", "IR", "4–5 años aprox.", "Suelos · Cultivos · Genética · Maquinaria · Producción", "Gusto por la naturaleza, campo y resolver problemas", "Producción agrícola, consultoría, agroindustria y desarrollo rural", "Bachillerato técnico agropecuario o general con biología", "UNAM|UAM|UAEMEX|PRIVADAS", "Medio ambiente,Técnico,Beca"],
  ["veterinaria", "Medicina veterinaria y zootecnia", "agro", "IS", "5 años aprox.", "Anatomía animal · Clínica · Nutrición · Reproducción · Zootecnia", "Empatía con los animales, rigor y trabajo de campo", "Clínica veterinaria, producción animal, salud pública e investigación", "Bachillerato general con biología y química", "UNAM|UAEMEX|PRIVADAS", "Salud,Medio ambiente"],
  ["hidrobiologia", "Hidrobiología / Ciencias del agua", "agro", "IR", "4–5 años aprox.", "Ecología acuática · Química · Limnología · Peces · Laboratorio", "Curiosidad por el agua, observación y trabajo de campo", "Gestión hídrica, consultoría, investigación y conservación", "Bachillerato general con biología y química", "UAM|PRIVADAS", "Ciencias,Medio ambiente"],
  ["agroindustrial", "Ingeniería agroindustrial y de alimentos", "agro", "IR", "4–5 años aprox.", "Alimentos · Procesos · Calidad · Microbiología · Maquinaria", "Gusto por la industria, la ciencia y el campo", "Procesamiento de alimentos, control de calidad e innovación", "Bachillerato técnico o general con ciencias", "IPN|UAM|UAEMEX|PRIVADAS", "Tecnología,Medio ambiente"],
  ["forestal", "Ingeniería forestal y silvicultura", "agro", "IR", "4 años aprox.", "Bosques · Suelos · Ecología · Manejo · Restauración", "Gusto por el campo, la conservación y el trabajo físico", "Gestión forestal, restauración, consultoría y parques", "Bachillerato técnico agropecuario o general", "UAEMEX|PRIVADAS", "Medio ambiente,Técnico"],
  ["clima", "Ciencias atmosféricas y meteorología", "agro", "I", "4–5 años aprox.", "Física · Atmósfera · Clima · Modelos · Datos", "Curiosidad científica, gusto por datos y observación", "Meteorología, pronósticos, cambio climático e investigación", "Bachillerato general con física y matemáticas", "IPN|UAM|PRIVADAS", "Ciencias,Medio ambiente"],

  /* Defensa y seguridad */
  ["admilitar", "Licenciatura en Administración Militar (HCM)", "defensa", "ER", "4 años, internado", "Administración · Logística · Derecho militar · Defensa · Liderazgo", "Disciplina, liderazgo, resistencia física y sentido del servicio", "Oficial del Ejército: logística, administración y mando", "Requiere bachillerato terminado con promedio mínimo 7.0; NO es preparatoria", "SEDENA", "Militar,Liderazgo,Beca"],
  ["seguridadpublica", "Licenciatura en Seguridad Pública (HCM)", "defensa", "ER", "4 años, internado", "Seguridad · Derecho · Inteligencia · Mando · Defensa", "Disciplina, responsabilidad, liderazgo y resistencia", "Oficial del Ejército en seguridad pública y protección ciudadana", "Requiere bachillerato terminado con promedio mínimo 7.0; NO es preparatoria", "SEDENA", "Militar,Liderazgo,Beca"],
  ["seguridadciudadana", "Seguridad ciudadana y prevención", "defensa", "ES", "4 años aprox.", "Prevención · Políticas · Comunidad · Derecho · Análisis", "Interés por la convivencia, análisis y trabajo social", "Policía municipal/estatal, prevención, gestiones de riesgo y consultoría", "Bachillerato general con humanidades", "UAEMEX|PRIVADAS", "Seguridad,Sociales"],
  ["inteligencia", "Análisis de inteligencia y ciberseguridad", "defensa", "IC", "4 años aprox.", "Datos · Redes · Criptografía · Análisis · Derecho", "Rigor, discreción, lógica y gusto por la tecnología", "Ciberseguridad, análisis de riesgos, defensa y sector financiero", "Bachillerato general con matemáticas y computación", "IPN|PRIVADAS", "Seguridad,Tecnología"],

  /* Carreras técnicas (puente rápido al trabajo) */
  ["tecprogramacion", "Técnico en programación", "tecnica", "IC", "3 años de prepa técnica", "Programación · Bases de datos · Páginas web · Soporte", "Lógica, práctica constante y gusto por resolver", "Desarrollo junior, soporte técnico, contenido web y continuidad a ingeniería", "Bachillerato técnico; después puedes continuar a licenciatura", "CBTIS|CONALEP|IPN", "Técnico,Tecnología,Beca"],
  ["tecelectronica", "Técnico en electrónica", "tecnica", "IR", "3 años de prepa técnica", "Circuitos · Soldadura · Electrónica digital · Mantenimiento", "Manualidad, precisión y paciencia", "Mantenimiento, instalaciones, reparación y continuidad a ingeniería", "Bachillerato técnico con física básica", "CBTIS|CONALEP", "Técnico,Tecnología"],
  ["tecenfermeria", "Técnico en enfermería", "tecnica", "SR", "3 años de prepa técnica", "Cuidado básico · Farmacología · Primeros auxilios · Práctica", "Empatía, responsabilidad y disposición para atender", "Hospitales, clínicas, consultorios y continuidad a enfermería", "Bachillerato técnico en salud", "CONALEP|CBTIS|PRIVADAS", "Técnico,Salud"],
  ["tecconta", "Técnico en contabilidad", "tecnica", "IC", "3 años de prepa técnica", "Contabilidad · Nómina · Impuestos · Excel · Facturación", "Orden, precisión y responsabilidad", "Despachos contables, área financiera y continuidad a contaduría", "Bachillerato técnico en administración", "CONALEP|CBTIS", "Técnico,Negocios"],
  ["tecturismo", "Técnico en turismo y hospitalidad", "tecnica", "ES", "3 años de prepa técnica", "Atención al cliente · Guianza · Reservaciones · Eventos", "Gusto por tratar con personas e idiomas", "Hoteles, agencias, eventos y guías turísticos", "Bachillerato técnico en turismo", "CONALEP|CBTIS", "Técnico,Negocios"],
  ["tecautomotriz", "Técnico en mantenimiento automotriz", "tecnica", "IR", "3 años de prepa técnica", "Motores · Frenos · Electricidad · Diagnóstico · Herramientas", "Manualidad, fuerza y gusto por resolver fallas", "Talleres, agencias, flotillas y continuidad a ingeniería automotriz", "Bachillerato técnico automotriz", "CONALEP|CBTIS", "Técnico,Tecnología"],
  ["teccocina", "Técnico en cocina y gastronomía", "tecnica", "R", "3 años de prepa técnica", "Cocina · Higiene · Repostería · Costos · Servicio", "Paciencia, precisión, trabajo en equipo y resistencia", "Restaurantes, hoteles, catering y emprendimiento gastronómico", "Bachillerato técnico en gastronomía", "CONALEP|PRIVADAS", "Técnico,Negocios"],
  ["tecdiseno", "Técnico en diseño digital y multimedia", "tecnica", "AR", "3 años de prepa técnica", "Diseño vectorial · Edición · Video · Redes · Portafolio", "Creatividad, ojo visual y disposición a aprender herramientas", "Agencias, redes sociales, impresión y continuidad a diseño", "Bachillerato técnico en diseño o comunicación", "CONALEP|CBTIS|PRIVADAS", "Técnico,Arte,Tecnología"]
];

export const CAREERS = CAREER_ROWS.map((row, index) => {
  const item = Object.fromEntries(CAREER_FIELDS.map((key, i) => [key, row[i] || ""]));
  item._i = index;
  item.riasecList = (item.riasec || "").split("").filter(Boolean);
  item.instList = (item.instituciones || "").split("|").filter(Boolean);
  item.tagList = (item.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
  return item;
});

export const CAREER_BY_ID = Object.fromEntries(CAREERS.map((career) => [career.id, career]));

export const CAREER_SORT = [
  ["afinidad", "Mejor afinidad con mi perfil"],
  ["az", "Alfabético"],
  ["duracion", "Duración (más corta primero)"],
  ["area", "Por área"]
];

/* Puente pedagógico: cada habilidad del curso se conecta con carreras reales. */
export const COURSE_BRIDGE_NOTE = 'El examen de Español no es solo un requisito: cada unidad fortalece competencias que usarás al estudiar una carrera, presentar un examen de admisión o defender un proyecto. Elige una habilidad y abre las carreras donde más te servirá.';

export const COURSE_BRIDGE = [
  { icon: '📖', skill: 'Comprensión lectora', use: 'Entender consignas, problemas y textos largos sin perder la idea central.', careers: ['derecho', 'periodismo', 'psicologia', 'cienciapolitica'] },
  { icon: '✍️', skill: 'Redacción y argumentación', use: 'Escribir ensayos, reportes, solicitudes y defender una postura con razones.', careers: ['letras', 'comunicacion', 'derecho', 'humanidades'] },
  { icon: '🔤', skill: 'Ortografía y gramática', use: 'Comunicarte con claridad en correos, informes, clases y entrevistas.', careers: ['ingles', 'pedagogia', 'administracion', 'periodismo'] },
  { icon: '🔎', skill: 'Análisis de información', use: 'Contrastar fuentes, detectar sesgos y sacar conclusiones de los datos.', careers: ['datos', 'economia', 'estadistica', 'sociologia'] },
  { icon: '🧠', skill: 'Vocabulario y lenguaje técnico', use: 'Leer manuales, fichas clínicas y documentos especializados.', careers: ['medico', 'civil', 'biomedica', 'tecprogramacion'] },
  { icon: '🗣️', skill: 'Expresión oral y debate', use: 'Explicar ideas, participar en entrevistas y presentar proyectos.', careers: ['administracion', 'relaciones', 'teatro', 'educacioninicial'] }
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
  catalogSectorFilters: CATALOG_SECTOR_FILTERS,
  catalogCostFilters: CATALOG_COST_FILTERS,
  contextQuestions: CONTEXT_QUESTIONS,
  expoEvents: EXPO_EVENTS,
  fairQuestions: FAIR_QUESTIONS,
  tuitionNote: TUITION_NOTE,
  schoolExtras: SCHOOL_EXTRAS,
  decisionGuide: DECISION_GUIDE,
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
  technicianPrograms: TECHNICIAN_PROGRAMS,
  careerAreas: CAREER_AREAS,
  careerProviders: CAREER_PROVIDERS,
  careerNote: CAREER_NOTE,
  careers: CAREERS,
  careerById: CAREER_BY_ID,
  careerSort: CAREER_SORT,
  courseBridge: COURSE_BRIDGE,
  courseBridgeNote: COURSE_BRIDGE_NOTE
};
