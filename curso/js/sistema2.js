/* =====================================================================
   SISTEMA · Extensión
   Planificación · Taller de orientación vocacional · Perfil del alumno ·
   Concentrado de tareas.  Todo persiste en localStorage.
   Se carga ANTES de app.js y usa sus utilidades ($, esc, fmtMX, uid,
   hoyISO, openModal, closeModal, route, leerValor, alumnos, sistemaUI...).
   ===================================================================== */

var PLAN_KEY = "curso_ecoems_plan_v1";
var PERF_KEY = "curso_ecoems_perfiles_v1";
var ENTREGA_KEY = "curso_ecoems_entregas_v1";

var planData = [];
var perfiles = {};
var entregas = {};

var PLAN_TIPOS = [
  { id: "teoria",        nombre: "Teoría",        color: "#7C3AED" },
  { id: "ejercicios",    nombre: "Ejercicios",    color: "#2563EB" },
  { id: "tarea",         nombre: "Tarea",         color: "#0891B2" },
  { id: "tarea-extra",   nombre: "Tarea extra",   color: "#EA580C" },
  { id: "investigacion", nombre: "Investigación", color: "#DB2777" },
  { id: "lectura",       nombre: "Lectura",       color: "#0D9488" },
  { id: "simulacro",     nombre: "Simulacro",     color: "#B45309" }
];
var PLAN_ESTADOS = [
  { id: "pendiente",  nombre: "Pendiente",  color: "#64748B" },
  { id: "en-curso",   nombre: "En curso",   color: "#2563EB" },
  { id: "completada", nombre: "Completada", color: "#16A34A" }
];
var ENTREGA_ESTADOS = [
  { id: "pendiente", nombre: "Pendiente", short: "·", color: "#94A3B8" },
  { id: "entregado", nombre: "Entregado", short: "✓", color: "#16A34A" },
  { id: "tarde",     nombre: "Entregado tarde", short: "T", color: "#D97706" }
];

/* ---------------- Utilidades ---------------- */
function planDow(fecha) {
  const d = new Date(fecha + "T12:00:00");
  if (isNaN(d.getTime())) return "";
  return ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"][d.getDay()];
}
function planDias(fecha) {
  return Math.round((new Date(fecha + "T12:00:00") - new Date(hoyISO() + "T12:00:00")) / 86400000);
}
function planItems(s) { return s && Array.isArray(s.items) ? s.items : []; }
function planSesion(n) { return planData.find(s => String(s.n) === String(n)) || null; }
function planItem(n, id) { const s = planSesion(n); return s ? planItems(s).find(i => i.id === id) : null; }
function planEstado(s) { return (s && s.estado) || "pendiente"; }
function planEstadoObj(id) { return PLAN_ESTADOS.find(e => e.id === id) || PLAN_ESTADOS[0]; }
function planTipoObj(id) { return PLAN_TIPOS.find(t => t.id === id) || PLAN_TIPOS[0]; }
function planAvance(s) {
  const it = planItems(s);
  return it.length ? Math.round(it.filter(i => i.hecho).length / it.length * 100) : 0;
}
function planEsSimulacro(s) { return /simulacro/i.test(s.area || "") || /simulacro/i.test(s.enfoque || ""); }
function planEsRepaso(s) { return /repaso/i.test(s.area || "") || /repaso/i.test(s.enfoque || ""); }
function planAreaColor(area) { return planAreaInfo(area).color; }
function planAreaOpciones() {
  const base = (typeof DATA !== "undefined" && DATA.subjects) ? DATA.subjects.filter(s => s.ready).map(s => s.name) : [];
  return base.concat(["Repaso", "Simulacro", "Otro"]);
}

/* ---------------- Catálogos · Taller vocacional ---------------- */
var INTERESES_SUGERIDOS = [
  "Ciencia y tecnología", "Computación y programación", "Matemáticas", "Salud y medicina",
  "Biología y naturaleza", "Química", "Física", "Arte y diseño", "Música", "Danza y teatro",
  "Lectura y escritura", "Idiomas", "Historia y cultura", "Ciencias sociales", "Derecho",
  "Negocios y economía", "Liderazgo y política", "Deportes", "Cocina y gastronomía",
  "Moda y belleza", "Construcción y mecánica", "Electrónica", "Videojuegos",
  "Medio ambiente", "Ayudar a las personas", "Educación y docencia", "Turismo y viajes"
];
var APTITUDES_SUGERIDAS = [
  "Razonamiento lógico-matemático", "Comprensión lectora", "Expresión escrita", "Memoria",
  "Creatividad", "Trabajo en equipo", "Liderazgo", "Comunicación oral", "Organización",
  "Concentración", "Manualidad / habilidad técnica", "Resolución de problemas",
  "Imaginación espacial", "Cálculo mental", "Dibujo y trazo"
];
var TIPOS_ESCUELA = ["Bachillerato general", "Bachillerato técnico", "Carrera técnica", "Preparatoria", "Opción de trabajo", "Otro"];
var INSTITUCIONES = ["UNAM", "IPN", "Colegio de Bachilleres", "CONALEP", "DGETI (CBTIS)", "DGETA (CBTA)", "CECyTE", "UAEMéx", "UAM", "Privadas", "Otra"];
/* Referencias de aciertos aproximadas (COMIPEMS, máx. 128). Verificar corte oficial del año. */
var ESCUELAS = {
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
/* ---------------- Catálogo de escuelas · datos aproximados (verificar) ---------------- */
var INSTITUCION_INFO = {
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
var CAT_FIELDS = ["inst", "nombre", "tipo", "zona", "km", "tiempo", "aciertos", "pase", "fuerte", "orienta", "carreras", "uni", "tags"];
var CAT_ROWS = [
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
var CATALOGO = CAT_ROWS.map(r => { const o = {}; CAT_FIELDS.forEach((f, i) => { o[f] = r[i]; }); return o; });
CATALOGO.forEach((e, i) => { e._i = i; });
var CAT_TAGS = ["General", "Ciencias", "Humanidades", "Sociales", "Arte", "Salud", "Tecnología", "Técnico", "Negocios"];
function catDistancia(km) { return Number(km) || 0; }

function planEscuelasDe(inst) { return (ESCUELAS[inst] || []); }
function planRefEscuela(inst, nombre) {
  const e = planEscuelasDe(inst).find(x => x.n === nombre);
  return e ? e.r : "";
}
var FORTALEZAS_SUGERIDAS = [
  "Responsable", "Buen compañero(a)", "Trabajador(a)", "Se organiza bien",
  "Buen retentiva", "Creador(a)", "Se expresa bien", "Liderazgo natural",
  "Se concentra bien", "Aprendo rápido", "Preciso(a) en detalles", "Puntual"
];
var DEBILIDADES_SUGERIDAS = [
  "Se distrae fácil", "Deja tareas pendientes", "Le cuesta matemáticas",
  "Le cuesta leer en voz alta", "Caligrafía difícil de leer", "Le cuesta organizarse",
  "Pierde materiales", "Falta de concentración", "Se pone nervioso(a) en exámenes",
  "Rinde menos por la mañana", "Trabajos tarde", "Mucha mano de obra, poco repaso"
];
var EXTRAS_SUGERIDAS = [
  "Delegado(a) de grupo", "Participó en concurso", "Ganó competencia escolar",
  "Equipo deportivo", "Beca", "Club o taller", "Trabajo voluntario", "Proyecto personal"
];
var PLANTILLAS = [
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
function alumnoNombre(id) { const a = alumnos.find(x => x.id === id); return a ? a.nombre : "(alumno eliminado)"; }
function csvList(v) { return String(v || "").split(",").map(s => s.trim()).filter(Boolean); }

/* ---------------- Persistencia ---------------- */
function loadPlan() {
  try { const raw = localStorage.getItem(PLAN_KEY); planData = raw ? JSON.parse(raw) : []; if (!Array.isArray(planData)) planData = []; }
  catch (e) { planData = []; }
}
function savePlan() { try { localStorage.setItem(PLAN_KEY, JSON.stringify(planData)); } catch (e) { /* ignorar */ } }
function loadPerfiles() {
  try { const raw = localStorage.getItem(PERF_KEY); perfiles = raw ? JSON.parse(raw) : {}; if (!perfiles || typeof perfiles !== "object") perfiles = {}; }
  catch (e) { perfiles = {}; }
}
function savePerfiles() { try { localStorage.setItem(PERF_KEY, JSON.stringify(perfiles)); } catch (e) { /* ignorar */ } }
function loadEntregas() {
  try { const raw = localStorage.getItem(ENTREGA_KEY); entregas = raw ? JSON.parse(raw) : {}; if (!entregas || typeof entregas !== "object") entregas = {}; }
  catch (e) { entregas = {}; }
}
function saveEntregas() { try { localStorage.setItem(ENTREGA_KEY, JSON.stringify(entregas)); } catch (e) { /* ignorar */ } }

/* ---------------- Seed del plan (editable) ----------------
   Estructura base de 27 sábados. Solo materias LISTAS (ready) de DATA.
   Cada entrada: { fecha, id (materia o REPASO/SIMULACRO), u:[unidades] }. */
var PLAN_ESTRUCTURA = [
  { fecha: "2026-10-17", id: "espanol", u: [1, 2, 3] },
  { fecha: "2026-10-24", id: "espanol", u: [4, 5, 6] },
  { fecha: "2026-10-31", id: "espanol", u: [7, 8, 9] },
  { fecha: "2026-11-07", id: "espanol", u: [10, 11] },
  { fecha: "2026-11-14", id: "espanol", u: [12, 13] },
  { fecha: "2026-11-21", id: "habilidad-verbal", u: [1, 2] },
  { fecha: "2026-11-28", id: "habilidad-verbal", u: [3, 4] },
  { fecha: "2026-12-05", id: "matematicas", u: [1, 2, 3] },
  { fecha: "2026-12-12", id: "matematicas", u: [4, 5, 6] },
  { fecha: "2026-12-19", id: "matematicas", u: [7, 8, 9] },
  { fecha: "2027-01-09", id: "matematicas", u: [10, 11, 12] },
  { fecha: "2027-01-16", id: "matematicas", u: [13, 14, 15] },
  { fecha: "2027-01-23", id: "matematicas", u: [16, 17, 18] },
  { fecha: "2027-01-30", id: "matematicas", u: [19, 20, 21] },
  { fecha: "2027-02-06", id: "matematicas", u: [22, 23, 24] },
  { fecha: "2027-02-13", id: "matematicas", u: [25, 26, 27] },
  { fecha: "2027-02-20", id: "matematicas", u: [28, 29, 30] },
  { fecha: "2027-02-27", id: "matematicas", u: [31, 32, 33] },
  { fecha: "2027-03-06", id: "matematicas", u: [34, 35, 36] },
  { fecha: "2027-03-13", id: "habilidad-matematica", u: [1, 2, 3] },
  { fecha: "2027-03-20", id: "habilidad-matematica", u: [4, 5] },
  { fecha: "2027-03-27", id: "habilidad-matematica", u: [6, 7] },
  { fecha: "2027-04-03", id: "REPASO", u: [], enfoque: "Español y Habilidad Verbal" },
  { fecha: "2027-04-10", id: "REPASO", u: [], enfoque: "Matemáticas" },
  { fecha: "2027-04-17", id: "REPASO", u: [], enfoque: "Habilidad Matemática" },
  { fecha: "2027-04-24", id: "SIMULACRO", u: [], enfoque: "Simulacro completo tipo examen" },
  { fecha: "2027-05-01", id: "SIMULACRO", u: [], enfoque: "Cierre · repaso de errores y retroalimentación" }
];

function planMateriaDe(id) {
  return (typeof DATA !== "undefined" && DATA.subjects) ? (DATA.subjects.find(s => s.id === id) || null) : null;
}
function planUnidadesDeArea(area, nums) {
  const sub = (typeof DATA !== "undefined" && DATA.subjects) ? DATA.subjects.find(x => x.name === area) : null;
  if (!sub || !Array.isArray(sub.units)) return [];
  return (nums || []).map(n => sub.units.find(u => u.num === n)).filter(Boolean);
}
function planEnfoqueUnidades(nums) {
  if (!nums || !nums.length) return "";
  if (nums.length === 1) return "Unidad " + nums[0];
  const cont = nums.every((n, i) => i === 0 || n === nums[i - 1] + 1);
  return cont ? ("Unidades " + nums[0] + "–" + nums[nums.length - 1]) : ("Unidades " + nums.join(", "));
}
function planConstruirSeed() {
  return PLAN_ESTRUCTURA.map((e, i) => {
    const n = i + 1;
    if (e.id === "REPASO") return { n: n, fecha: e.fecha, area: "Repaso", enfoque: e.enfoque || "Repaso general", unidades: [] };
    if (e.id === "SIMULACRO") return { n: n, fecha: e.fecha, area: "Simulacro", enfoque: e.enfoque || "Simulacro", unidades: [] };
    const sub = planMateriaDe(e.id);
    return { n: n, fecha: e.fecha, area: sub ? sub.name : e.id, enfoque: planEnfoqueUnidades(e.u), unidades: e.u || [] };
  });
}
var PLAN_SEED = planConstruirSeed();

function planSeedItems(s) {
  const unidades = planUnidadesDeArea(s.area, s.unidades);
  if (unidades.length) {
    const items = [];
    unidades.forEach(u => {
      items.push({ texto: u.name, tipo: "teoria" });
      items.push({ texto: "Ejercicios · " + u.name, tipo: "ejercicios" });
    });
    items.push({ texto: "Tarea · " + s.area + " (" + (s.enfoque || "") + ")", tipo: "tarea" });
    return items.map(i => ({ id: uid(), texto: i.texto, tipo: i.tipo, hecho: false }));
  }
  const items = planEsSimulacro(s) ? [
    { texto: "Aplicar simulacro completo en tiempo real", tipo: "simulacro" },
    { texto: "Revisión de respuestas y análisis de errores", tipo: "teoria" },
    { texto: "Tarea: cuaderno de errores del simulacro", tipo: "tarea" }
  ] : planEsRepaso(s) ? [
    { texto: (s.enfoque || "Repaso") + " · repaso guiado", tipo: "teoria" },
    { texto: "Ejercicios mixtos de repaso", tipo: "ejercicios" },
    { texto: "Tarea: banco de ejercicios de repaso", tipo: "tarea" }
  ] : [
    { texto: s.area + " · " + (s.enfoque || "contenido") + " (teoría)", tipo: "teoria" },
    { texto: "Ejercicios guiados de " + s.area, tipo: "ejercicios" },
    { texto: "Tarea de " + s.area + " (" + (s.enfoque || "") + ")", tipo: "tarea" }
  ];
  return items.map(i => ({ id: uid(), texto: i.texto, tipo: i.tipo, hecho: false }));
}
function planPlanVacio() {
  return { institucion: "", escuela: "", tipo: "", distancia: "", corte: "", notas: "" };
}
function planPerfilVacio() {
  return {
    intereses: [], aptitudes: [], fortalezas: [], debilidades: [], extras: [],
    ppm: [], planas: { meta: 0, hechas: 0 }, notas: "",
    planes: [planPlanVacio(), planPlanVacio(), planPlanVacio()]
  };
}
function perfilDe(id) {
  if (!perfiles[id]) perfiles[id] = planPerfilVacio();
  const p = perfiles[id];
  ["intereses", "aptitudes", "fortalezas", "debilidades", "extras"].forEach(k => { if (!Array.isArray(p[k])) p[k] = []; });
  if (!Array.isArray(p.ppm)) p.ppm = [];
  if (!p.planas) p.planas = { meta: 0, hechas: 0 };
  if (!Array.isArray(p.planes)) {
    p.planes = [];
    ["A", "B", "C"].forEach(L => {
      const o = p["plan" + L];
      if (o && (o.escuela || o.tipo || o.corte || o.distancia || o.notas)) p.planes.push({ institucion: "", escuela: o.escuela || "", tipo: o.tipo || "", distancia: o.distancia || "", corte: o.corte || "", notas: o.notas || "" });
    });
    ["planA", "planB", "planC"].forEach(k => { delete p[k]; });
  }
  while (p.planes.length < 3) p.planes.push(planPlanVacio());
  p.planes.forEach(o => { ["institucion", "escuela", "tipo", "distancia", "corte", "notas"].forEach(k => { if (typeof o[k] !== "string") o[k] = ""; }); });
  if (typeof p.notas !== "string") p.notas = "";
  return p;
}

function initPlanData() {
  loadPlan(); loadPerfiles(); loadEntregas();
  if (!planData.length) {
    planData = PLAN_SEED.map(s => ({
      n: s.n, fecha: s.fecha, area: s.area, enfoque: s.enfoque,
      estado: "pendiente", notas: "", items: planSeedItems(s)
    }));
    savePlan();
  }
  let cambio = false;
  planData.forEach(s => {
    if (!s.estado) { s.estado = "pendiente"; cambio = true; }
    if (!Array.isArray(s.items)) { s.items = []; cambio = true; }
    s.items.forEach(i => {
      if (!i.id) { i.id = uid(); cambio = true; }
      if (typeof i.hecho !== "boolean") { i.hecho = false; cambio = true; }
      if (!i.tipo) { i.tipo = "tarea"; cambio = true; }
    });
  });
  if (cambio) savePlan();
  alumnos.forEach(a => { if (!perfiles[a.id]) perfiles[a.id] = planPerfilVacio(); });
  savePerfiles(); saveEntregas();
  if (sistemaUI.sesionAbierta == null) sistemaUI.sesionAbierta = null;
  if (!sistemaUI.tallerId) sistemaUI.tallerId = alumnos[0] ? alumnos[0].id : null;
  if (!sistemaUI.perfilId) sistemaUI.perfilId = alumnos[0] ? alumnos[0].id : null;
}

/* ---------------- Motor de recomendaciones (reglas, sin IA) ---------------- */
function planRecomendaciones() {
  const hoy = hoyISO();
  const ses = planData.slice().sort((a, b) => a.n - b.n);
  const recs = [];
  const atrasadas = ses.filter(s => s.fecha < hoy && planEstado(s) !== "completada");
  const futuras = ses.filter(s => s.fecha >= hoy && planEstado(s) !== "completada");

  if (atrasadas.length >= 3) {
    recs.push({ id: "atraso-critico", nivel: "critico", titulo: atrasadas.length + " sesiones atrasadas",
      detalle: "Reprograma o marca como completadas: " + atrasadas.slice(0, 5).map(s => "S" + s.n).join(", ") + (atrasadas.length > 5 ? "…" : ""),
      accion: { label: "Ver atrasadas", action: "plan-filtrar-atrasadas" } });
  } else if (atrasadas.length) {
    recs.push({ id: "atraso", nivel: atrasadas.length >= 2 ? "medio" : "leve", titulo: "Sesión(es) atrasada(s)",
      detalle: "Pendientes de cerrar: " + atrasadas.map(s => "S" + s.n + " (" + s.fecha + ")").join(", "),
      accion: { label: "Ver atrasadas", action: "plan-filtrar-atrasadas" } });
  }
  const prox = futuras[0];
  if (prox) {
    const dias = planDias(prox.fecha);
    if (dias >= 0 && dias <= 7) {
      const hechos = planItems(prox).filter(i => i.hecho).length;
      recs.push({ id: "prep-prox", nivel: hechos ? "leve" : "medio",
        titulo: "Preparar S" + prox.n + " · " + planDow(prox.fecha) + " " + prox.fecha,
        detalle: "En " + dias + " día(s) · " + prox.area + " · " + planItems(prox).length + " actividad(es), " + hechos + " lista(s).",
        accion: { label: "Abrir sesión", action: "plan-open", n: prox.n } });
    }
  }
  planData.forEach(s => planItems(s).forEach(it => {
    if (it.tipo === "investigacion" && !it.hecho) {
      recs.push({ id: "inv-" + it.id, nivel: "leve", titulo: "Investigación sin cerrar en S" + s.n,
        detalle: it.texto, accion: { label: "Convertir en tarea extra", action: "plan-item-to-tarea", n: s.n, id: it.id } });
    }
  }));
  const sinItems = ses.filter(s => s.fecha >= hoy && !planItems(s).length);
  if (sinItems.length) {
    recs.push({ id: "sin-items", nivel: "medio", titulo: sinItems.length + " sesión(es) sin actividades",
      detalle: "Agrega teoría, ejercicios o tareas: " + sinItems.map(s => "S" + s.n).join(", "), accion: null });
  }
  if (!recs.length) recs.push({ id: "ok", nivel: "ok", titulo: "Sin pendientes urgentes", detalle: "El plan está al día.", accion: null });
  return recs;
}
function planFiltrarAtrasadas() { sistemaUI.planFiltroEstado = "atrasadas"; route(); }

/* ---------------- Render · Planificación ---------------- */
function planRecCard(r) {
  const col = { ok: "#16A34A", leve: "#0891B2", medio: "#D97706", critico: "#DC2626" }[r.nivel] || "#64748B";
  const icon = { ok: "✅", leve: "💡", medio: "⚠️", critico: "🚨" }[r.nivel] || "ℹ️";
  const acc = r.accion ? '<button class="st-btn st-btn-soft" data-action="plan-rec" data-rec="' + esc(r.accion.action) + '" data-n="' + esc(r.accion.n == null ? "" : r.accion.n) + '" data-id="' + esc(r.accion.id || "") + '">' + esc(r.accion.label) + "</button>" : "";
  return '<div class="rec-card" style="border-left-color:' + col + '"><div class="rec-main">' +
    '<div class="rec-title">' + esc(r.titulo) + '</div><div class="rec-detail">' + esc(r.detalle) + "</div></div>" + acc + "</div>";
}
function planItemRow(s, it) {
  const tp = planTipoObj(it.tipo);
  return '<div class="plan-item' + (it.hecho ? " done" : "") + '">' +
    '<label class="plan-check"><input type="checkbox" data-action="plan-item-check" data-n="' + s.n + '" data-id="' + it.id + '"' + (it.hecho ? " checked" : "") + "></label>" +
    '<span class="plan-item-txt">' + esc(it.texto) + "</span>" +
    '<span class="plan-type" style="background:' + tp.color + '1f;color:' + tp.color + '">' + esc(tp.nombre) + "</span>" +
    '<span class="plan-item-acc">' +
      '<button class="st-mini" data-action="plan-edit-item" data-n="' + s.n + '" data-id="' + it.id + '">Editar</button>' +
      '<button class="st-mini st-mini-del" data-action="plan-del-item" data-n="' + s.n + '" data-id="' + it.id + '">×</button>' +
    "</span></div>";
}
function renderPlanificacion() {
  breadcrumbs([{ label: "Sistema", href: "#/sistema/asistencia" }, { label: "Planificación" }]);
  const hoy = hoyISO();
  const ses = planData.slice().sort((a, b) => a.fecha.localeCompare(b.fecha) || a.n - b.n);
  const completadas = ses.filter(s => planEstado(s) === "completada").length;
  const enCurso = ses.filter(s => planEstado(s) === "en-curso").length;
  const atrasadas = ses.filter(s => s.fecha < hoy && planEstado(s) !== "completada").length;
  const pct = ses.length ? Math.round(completadas / ses.length * 100) : 0;

  const recs = planRecomendaciones().map(planRecCard).join("");

  const filtro = sistemaUI.planFiltroEstado || "todas";
  const q = (sistemaUI.planBusqueda || "").toLowerCase();
  const lista = ses.filter(s => {
    const est = planEstado(s);
    if (filtro === "atrasadas" && !(s.fecha < hoy && est !== "completada")) return false;
    if (filtro === "pendiente" && est !== "pendiente") return false;
    if (filtro === "en-curso" && est !== "en-curso") return false;
    if (filtro === "completada" && est !== "completada") return false;
    if (q && !((s.area + " " + s.enfoque).toLowerCase().includes(q))) return false;
    return true;
  });

  const cards = lista.length ? lista.map(s => {
    const est = planEstadoObj(planEstado(s));
    const abierta = String(sistemaUI.sesionAbierta) === String(s.n);
    const av = planAvance(s);
    const atras = s.fecha < hoy && planEstado(s) !== "completada";
    const items = planItems(s).map(it => planItemRow(s, it)).join("") || '<div class="st-note-sm">Sin actividades. Agrega la primera abajo.</div>';
    return '<div class="card plan-card' + (abierta ? " open" : "") + (atras ? " late" : "") + '" style="border-left:4px solid ' + planAreaColor(s.area) + '">' +
      '<div class="plan-head" data-action="plan-toggle" data-n="' + s.n + '">' +
        '<span class="plan-num" style="background:' + planAreaColor(s.area) + '">S' + s.n + "</span>" +
        '<div class="plan-head-main"><div class="plan-title">' + esc(s.area) + " · " + esc(s.enfoque || "—") + "</div>" +
          '<div class="plan-meta">' + planDow(s.fecha) + " " + esc(s.fecha) + " · " + planItems(s).length + " actividad(es) · " + av + "%" +
          (atras ? ' · <b style="color:var(--bad)">atrasada</b>' : "") + "</div></div>" +
        '<span class="plan-estado" style="background:' + est.color + '1f;color:' + est.color + '">' + esc(est.nombre) + "</span>" +
        '<span class="plan-caret">' + (abierta ? "▾" : "▸") + "</span>" +
      "</div>" +
      '<div class="st-bar" style="margin:8px 0 0"><i style="width:' + av + '%"></i></div>' +
      (abierta ? '<div class="plan-body">' +
          '<div class="plan-items">' + items + "</div>" +
          '<div class="plan-add">' +
            '<input class="st-input" id="plan-itxt-' + s.n + '" placeholder="Nueva actividad...">' +
            '<select class="st-input" id="plan-itipo-' + s.n + '">' + PLAN_TIPOS.map(t => '<option value="' + t.id + '">' + esc(t.nombre) + "</option>").join("") + "</select>" +
            '<button class="st-btn st-btn-soft" data-action="plan-add-item" data-n="' + s.n + '">+ Agregar</button>' +
          "</div>" +
          '<label class="st-note-lbl">Notas de la sesión</label>' +
          '<textarea class="st-input st-textarea" data-plan="notas" data-n="' + s.n + '">' + esc(s.notas || "") + "</textarea>" +
          '<div class="plan-actions">' +
            '<button class="st-mini" data-action="plan-edit" data-n="' + s.n + '">Editar sesión</button>' +
            '<button class="st-mini" data-action="plan-set-status" data-n="' + s.n + '" data-estado="en-curso">Marcar en curso</button>' +
            '<button class="st-mini st-mini-ok" data-action="plan-set-status" data-n="' + s.n + '" data-estado="completada">Completar</button>' +
            '<button class="st-mini" data-action="plan-set-status" data-n="' + s.n + '" data-estado="pendiente">Reabrir</button>' +
            '<button class="st-mini st-mini-del" data-action="plan-del-sesion" data-n="' + s.n + '">Eliminar sesión</button>' +
          "</div>" +
        "</div>" : "") +
    "</div>";
  }).join("") : '<div class="card"><div class="st-empty">No hay sesiones que coincidan con el filtro.</div></div>';

  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,#4F46E5 0%,#3730A3 100%)">' +
      '<span class="sh-icon" style="background:#3730A3">🗓️</span>' +
      "<div><h1>Planificación del curso</h1><p>Administra las 27 sesiones: fechas, contenido, actividades y avance. Las recomendaciones se calculan con reglas del plan (sin IA).</p></div>" +
    "</section>" +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="st-kpi-lbl">SESIONES</div><div class="st-kpi">' + ses.length + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">COMPLETADAS</div><div class="st-kpi" style="color:var(--ok)">' + completadas + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">EN CURSO</div><div class="st-kpi" style="color:#2563EB">' + enCurso + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">ATRASADAS</div><div class="st-kpi" style="color:var(--bad)">' + atrasadas + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">AVANCE</div><div class="st-kpi">' + pct + "%</div></div>" +
    "</div>" +
    '<div class="card" style="margin-bottom:16px"><div class="block-title"><span>🧠</span> Recomendaciones del plan</div>' + recs + "</div>" +
    '<div class="card st-toolbar">' +
      '<label>Filtro <select class="st-input" data-plan="filtro">' +
        ["todas", "pendiente", "en-curso", "completada", "atrasadas"].map(f => '<option value="' + f + '"' + (filtro === f ? " selected" : "") + ">" + (f === "en-curso" ? "En curso" : f.charAt(0).toUpperCase() + f.slice(1)) + "</option>").join("") +
      "</select></label>" +
      '<label>Buscar <input class="st-input" data-plan="busqueda" placeholder="Área o contenido" value="' + esc(sistemaUI.planBusqueda || "") + '"></label>' +
      '<div class="st-spacer"></div>' +
      '<button class="st-btn" data-action="plan-new">+ Nueva sesión</button>' +
      '<button class="st-btn st-btn-soft" data-action="plan-restaurar">Restaurar plan base</button>' +
    "</div>" +
    '<div class="plan-list">' + cards + "</div>";
}

/* ---------------- Modales · Planificación ---------------- */
function formSesion(n) {
  const s = n ? planSesion(n) : null;
  const opts = areaOpcionesLista().map(a => '<option value="' + esc(a) + '"' + (s && s.area === a ? " selected" : "") + ">" + esc(a) + "</option>").join("");
  const estOpts = PLAN_ESTADOS.map(e => '<option value="' + e.id + '"' + (s && planEstado(s) === e.id ? " selected" : "") + ">" + e.nombre + "</option>").join("");
  const nextN = planData.length ? Math.max.apply(null, planData.map(x => Number(x.n) || 0)) + 1 : 1;
  openModal(s ? "Editar sesión S" + s.n : "Nueva sesión",
    '<div class="st-form">' +
      (s ? "" : '<label>Número <input type="number" class="st-input" id="p-n" value="' + nextN + '"></label>') +
      '<label>Fecha <input type="date" class="st-input" id="p-fecha" value="' + (s ? s.fecha : hoyISO()) + '"></label>' +
      '<label>Área / materia <select class="st-input" id="p-area">' + opts + "</select></label>" +
      '<label>Enfoque / contenido <input class="st-input" id="p-enfoque" value="' + (s ? esc(s.enfoque || "") : "") + '" placeholder="Ej. Bloque 1, repaso..."></label>' +
      '<label>Estado <select class="st-input" id="p-estado">' + estOpts + "</select></label>" +
      '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' +
      '<button class="st-btn" data-action="plan-save-sesion" data-n="' + (s ? s.n : "") + '">Guardar</button></div>' +
    "</div>");
}
function areaOpcionesLista() {
  const base = (typeof DATA !== "undefined" && DATA.subjects) ? DATA.subjects.filter(s => s.ready).map(s => s.name) : [];
  return base.concat(["Repaso", "Simulacro", "Otro"]);
}
function formItem(n, id) {
  const s = planSesion(n);
  const it = id ? planItems(s).find(x => x.id === id) : null;
  openModal(it ? "Editar actividad" : "Nueva actividad · S" + n,
    '<div class="st-form">' +
      '<label>Descripción <input class="st-input" id="p-itxt" value="' + (it ? esc(it.texto) : "") + '" placeholder="Qué se hace"></label>' +
      '<label>Tipo <select class="st-input" id="p-itipo">' + PLAN_TIPOS.map(t => '<option value="' + t.id + '"' + (it && it.tipo === t.id ? " selected" : "") + ">" + esc(t.nombre) + "</option>").join("") + "</select></label>" +
      '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' +
      '<button class="st-btn" data-action="plan-save-item" data-n="' + n + '" data-id="' + (it ? it.id : "") + '">Guardar</button></div>' +
    "</div>");
}

/* ---------------- Taller / Perfil · helpers ---------------- */
function planTags(list) {
  if (!list || !list.length) return '<span class="st-note-sm">Sin registrar</span>';
  return list.map(t => '<span class="tag">' + esc(t) + "</span>").join("");
}
function perfilTags(list, kind, id) {
  if (!list || !list.length) return '<span class="st-note-sm">Sin registrar</span>';
  return list.map((t, i) => '<span class="tag tag-del">' + esc(t) +
    '<button type="button" class="tag-x" title="Quitar" data-action="perfil-del-tag" data-id="' + esc(id) + '" data-kind="' + esc(kind) + '" data-idx="' + i + '">×</button></span>').join("");
}
function planLetra(i) { return String.fromCharCode(65 + (i % 26)); }
function planCardPlan(L, obj) {
  if (!obj) obj = planPlanVacio();
  const row = (lbl, val) => '<div class="plan-opt-row"><span>' + lbl + "</span><b>" + (val ? esc(val) : "—") + "</b></div>";
  return '<div class="plan-opt"><div class="plan-opt-h"><span class="plan-opt-l">' + L + "</span><b>Plan " + L + "</b></div>" +
    row("Institución", obj.institucion) + row("Escuela", obj.escuela) + row("Tipo", obj.tipo) + row("Distancia", obj.distancia) + row("Aciertos/corte", obj.corte) +
    (obj.notas ? '<div class="plan-opt-note">' + esc(obj.notas) + "</div>" : "") + "</div>";
}
function alumnoSelect(attr, id) {
  return '<label>Alumno <select class="st-input" data-' + attr + '="alumno">' +
    (alumnos.length ? alumnos.map(a => '<option value="' + a.id + '"' + (a.id === id ? " selected" : "") + ">" + esc(a.nombre) + "</option>").join("") : '<option value="">Sin alumnos</option>') +
    "</select></label>";
}
function alumnoVacio(heroTitulo, heroSub, icon, grad, msg) {
  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,' + grad + ')">' +
      '<span class="sh-icon">' + icon + '</span><div><h1>' + heroTitulo + "</h1><p>" + heroSub + "</p></div></section>" +
    '<div class="card"><div class="st-empty">' + msg + "</div></div>";
}

/* ---------------- Render · Taller vocacional ---------------- */
function renderTaller() {
  breadcrumbs([{ label: "Sistema", href: "#/sistema/asistencia" }, { label: "Taller vocacional" }]);
  const id = sistemaUI.tallerId && alumnos.some(a => a.id === sistemaUI.tallerId) ? sistemaUI.tallerId : (alumnos[0] ? alumnos[0].id : null);
  sistemaUI.tallerId = id;
  if (!id) {
    $("#view").innerHTML =
      '<section class="subject-hero" style="background:linear-gradient(135deg,#0F766E 0%,#115E59 100%)">' +
        '<span class="sh-icon" style="background:#115E59">🧭</span>' +
        "<div><h1>Taller de orientación vocacional</h1><p>Define intereses, aptitudes y planes A/B/C para elegir bachillerato.</p></div>" +
      "</section>" +
      '<div class="card"><div class="st-empty">Agrega un alumno en la sección Asistencia para usar el taller.</div></div>';
    return;
  }
  const p = perfilDe(id);
  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,#0F766E 0%,#115E59 100%)">' +
      '<span class="sh-icon" style="background:#115E59">🧭</span>' +
      "<div><h1>Taller de orientación vocacional</h1><p>Intereses, aptitudes y tus planes de bachillerato (A, B, C…).</p></div>" +
    "</section>" +
    '<div class="card st-toolbar">' + alumnoSelect("taller", id) +
      '<div class="st-spacer"></div>' +
      '<button class="st-btn st-btn-soft" data-action="test-open" data-id="' + id + '">🧪 Test vocacional</button>' +
      '<a class="st-btn st-btn-soft" href="#/sistema/catalogo">🏫 Ver catálogo de escuelas</a>' +
      '<button class="st-btn" data-action="taller-edit" data-id="' + id + '">Editar intereses y planes</button>' +
    "</div>" +
    testResumenHTML(p) +
    (p.test ? "" : '<div class="st-note-sm" style="margin-bottom:16px">¿El alumno no sabe qué rumbo tomar? Aplica el <b>🧪 Test vocacional</b> y te sugerirá áreas y escuelas.</div>') +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="st-kpi-lbl">INTERESES</div><div class="tag-list">' + planTags(p.intereses) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">APTITUDES</div><div class="tag-list">' + planTags(p.aptitudes) + "</div></div>" +
    "</div>" +
    '<div class="grid grid-plans">' + p.planes.map((o, i) => planCardPlan(planLetra(i), o)).join("") + "</div>" +
    '<div class="card" style="margin-top:16px"><div class="block-title"><span>📝</span> Notas del taller</div>' +
      '<label class="st-note-lbl">Observaciones de la orientación</label>' +
      '<textarea class="st-input st-textarea" data-taller="notas" data-id="' + id + '">' + esc(p.notas || "") + "</textarea>" +
    "</div>";
}

/* ---------------- Render · Perfil del alumno ---------------- */
function renderPerfil() {
  breadcrumbs([{ label: "Sistema", href: "#/sistema/asistencia" }, { label: "Perfil del alumno" }]);
  const id = sistemaUI.perfilId && alumnos.some(a => a.id === sistemaUI.perfilId) ? sistemaUI.perfilId : (alumnos[0] ? alumnos[0].id : null);
  sistemaUI.perfilId = id;
  if (!id) {
    $("#view").innerHTML =
      '<section class="subject-hero" style="background:linear-gradient(135deg,#BE123C 0%,#881337 100%)">' +
        '<span class="sh-icon" style="background:#881337">👤</span>' +
        "<div><h1>Perfil del alumno</h1><p>Fortalezas, debilidades, velocidad lectora, planas y tareas.</p></div>" +
      "</section>" +
      '<div class="card"><div class="st-empty">Agrega un alumno en la sección Asistencia para crear su perfil.</div></div>';
    return;
  }
  const p = perfilDe(id);
  const a = alumnos.find(x => x.id === id);
  const ultPpm = p.ppm.length ? p.ppm[p.ppm.length - 1].valor : null;
  const mejorPpm = p.ppm.length ? Math.max.apply(null, p.ppm.map(x => Number(x.valor) || 0)) : null;
  const promPpm = p.ppm.length ? Math.round(p.ppm.reduce((s, x) => s + (Number(x.valor) || 0), 0) / p.ppm.length) : null;

  const ppmRows = p.ppm.length ? p.ppm.map((x, i) => i).reverse().map(i => {
    const x = p.ppm[i];
    return '<div class="ppm-row"><span>' + esc(x.fecha) + "</span>" +
      '<div class="st-bar"><i style="width:' + Math.min(100, Math.round((Number(x.valor) || 0) / 4)) + '%"></i></div>' +
      "<b>" + esc(x.valor) + " ppm</b>" +
      '<button class="st-mini st-mini-del" data-action="perfil-del-ppm" data-id="' + id + '" data-idx="' + i + '">×</button></div>';
  }).join("") : '<div class="st-note-sm">Sin mediciones. Registra la primera prueba de velocidad lectora.</div>';

  const meta = Number(p.planas.meta || 0), hechas = Number(p.planas.hechas || 0);
  const planasPct = meta > 0 ? Math.min(100, Math.round(hechas / meta * 100)) : 0;
  const res = resumenTareasAlumno(id, planTareasIndice());

  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,#BE123C 0%,#881337 100%)">' +
      '<span class="sh-icon" style="background:#881337">👤</span>' +
      "<div><h1>Perfil de " + esc(a ? a.nombre : "") + "</h1><p>Fortalezas, áreas de mejora, velocidad lectora, planas y tareas entregadas.</p></div>" +
    "</section>" +
    '<div class="card st-toolbar">' + alumnoSelect("perfil", id) +
      '<div class="st-spacer"></div>' +
      '<button class="st-btn" data-action="perfil-edit" data-id="' + id + '">Editar fortalezas y debilidades</button>' +
    "</div>" +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="st-kpi-lbl">FORTALEZAS</div><div class="tag-list">' + perfilTags(p.fortalezas, "fortalezas", id) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">A MEJORAR</div><div class="tag-list">' + perfilTags(p.debilidades, "debilidades", id) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">EXTRA (logros/datos)</div><div class="tag-list">' + perfilTags(p.extras, "extras", id) + "</div></div>" +
    "</div>" +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="st-kpi-lbl">PPM ACTUAL</div><div class="st-kpi">' + (ultPpm == null ? "—" : ultPpm) + '</div><div class="st-sub">Mejor: ' + (mejorPpm == null ? "—" : mejorPpm) + " · Promedio: " + (promPpm == null ? "—" : promPpm) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">PLANAS</div><div class="st-kpi">' + hechas + " / " + meta + '</div><div class="st-bar" style="margin-top:8px"><i style="width:' + planasPct + '%"></i></div></div>' +
      '<div class="card"><div class="st-kpi-lbl">TAREAS ENTREGADAS</div><div class="st-kpi" style="color:var(--ok)">' + res.entregado + " / " + res.total + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">TAREAS TARDE</div><div class="st-kpi" style="color:var(--warn)">' + res.tarde + "</div></div>" +
    "</div>" +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="block-title"><span>🏃</span> Velocidad lectora (palabras por minuto)</div>' +
        '<div class="ppm-add"><input type="number" class="st-input" id="ppm-val" placeholder="ppm"><input type="date" class="st-input" id="ppm-fecha" value="' + hoyISO() + '"><button class="st-btn st-btn-soft" data-action="perfil-add-ppm" data-id="' + id + '">+ Registrar</button></div>' +
        '<div class="ppm-list">' + ppmRows + "</div></div>" +
      '<div class="card"><div class="block-title"><span>✍️</span> Planas (caligrafía / redacción)</div>' +
        '<label class="st-note-lbl">Meta de planas</label>' +
        '<input type="number" class="st-input" data-perfil="meta" data-id="' + id + '" value="' + meta + '">' +
        '<div class="planas-actions"><span class="st-note-sm">' + hechas + " de " + meta + " realizadas</b></span>" +
          '<div class="st-spacer"></div>' +
          '<button class="st-mini" data-action="perfil-del-plana" data-id="' + id + '">−1</button>' +
          '<button class="st-mini st-mini-ok" data-action="perfil-add-plana" data-id="' + id + '">+1 plana</button>' +
        "</div>" +
      "</div>" +
    "</div>" +
    '<div class="card"><div class="block-title"><span>📋</span> Tareas y planas</div>' +
      '<div class="st-note-sm">Entregadas: <b>' + res.entregado + "</b> · Tarde: <b>" + res.tarde + "</b> · Pendientes: <b>" + res.pendiente + "</b> de " + res.total + " tarea(s) del plan.</div>" +
      '<label class="st-note-lbl">Notas del perfil</label>' +
      '<textarea class="st-input st-textarea" data-perfil="notas" data-id="' + id + '">' + esc(p.notas || "") + "</textarea>" +
    "</div>";
}

/* ---------------- Concentrado de tareas ---------------- */
function planAreaInfo(area) {
  var subs = (typeof DATA !== "undefined" && DATA.subjects) ? DATA.subjects : [];
  var s = subs.find(x => x.name === area);
  if (s) return { name: s.name, color: s.color, icon: s.icon, short: s.short };
  if (area === "Repaso") return { name: "Repaso", color: "#64748B", icon: "🔁", short: "REP" };
  if (area === "Simulacro") return { name: "Simulacro", color: "#B45309", icon: "📝", short: "SIM" };
  return { name: area || "General", color: "#64748B", icon: "📘", short: "GEN" };
}
function planEsTarea(tipo) { return tipo === "tarea" || tipo === "tarea-extra" || tipo === "investigacion"; }
function planTareasIndice(modo) {
  modo = modo || "tareas";
  const out = [];
  planData.slice().sort((a, b) => a.n - b.n).forEach(s => {
    planItems(s).forEach(it => {
      const tipo = it.tipo || "tarea", esTarea = planEsTarea(tipo);
      if (modo === "tareas" && !esTarea) return;
      out.push({ tareaId: it.id, sesion: s.n, area: s.area, texto: it.texto, tipo: tipo, esTarea: esTarea });
    });
  });
  return out;
}
function entregaStatus(alumnoId, tareaId) {
  const m = entregas[alumnoId];
  return (m && m[tareaId]) || "pendiente";
}
function setEntrega(alumnoId, tareaId, val) {
  if (!entregas[alumnoId]) entregas[alumnoId] = {};
  if (val === "pendiente") delete entregas[alumnoId][tareaId];
  else entregas[alumnoId][tareaId] = val;
}
function resumenTareasAlumno(alumnoId, tareas) {
  const r = { total: tareas.length, entregado: 0, tarde: 0, pendiente: 0 };
  tareas.forEach(t => {
    const st = entregaStatus(alumnoId, t.tareaId);
    if (st === "entregado") r.entregado++;
    else if (st === "tarde") r.tarde++;
    else r.pendiente++;
  });
  return r;
}
function renderConcentrado() {
  breadcrumbs([{ label: "Sistema", href: "#/sistema/asistencia" }, { label: "Concentrado de tareas" }]);
  const modo = sistemaUI.concModo === "todo" ? "todo" : "tareas";
  const todas = planTareasIndice(modo);
  const areas = Array.from(new Set(planTareasIndice("todo").map(t => t.area))).sort();
  const area = areas.indexOf(sistemaUI.concArea) >= 0 ? sistemaUI.concArea : "";
  const tareas = area ? todas.filter(t => t.area === area) : todas;

  // Agrupar columnas por área para una fila de encabezado por materia
  const grupos = [];
  tareas.forEach(t => {
    const last = grupos[grupos.length - 1];
    if (last && last.area === t.area) last.n++;
    else grupos.push({ area: t.area, n: 1 });
  });

  const areaRow = '<tr><th class="conc-name" rowspan="2">Alumno</th>' +
    grupos.map(g => {
      const ai = planAreaInfo(g.area);
      return '<th class="conc-areah" colspan="' + g.n + '" style="border-top:3px solid ' + ai.color + ";background:" + ai.color + '16;color:' + ai.color + '">' + ai.icon + " " + esc(g.area) + "</th>";
    }).join("") +
    '<th class="conc-total" rowspan="2">Entregadas</th></tr>';
  const head = areaRow + "<tr>" +
    tareas.map(t => {
      const ai = planAreaInfo(t.area), ti = planTipoObj(t.tipo);
      return '<th class="conc-task" style="border-top:3px solid ' + ai.color + ";background:" + ai.color + '0f" title="' + esc(t.texto) + '">' +
        '<span class="conc-s">S' + t.sesion + "</span>" +
        '<span class="conc-tipo" style="color:' + ti.color + '">' + (t.esTarea ? "📌 " : "📘 ") + esc(ti.nombre) + "</span></th>";
    }).join("") + "</tr>";

  const filas = (alumnos.length && tareas.length) ? alumnos.map(a => {
    const res = resumenTareasAlumno(a.id, tareas);
    const celdas = tareas.map(t => {
      const st = entregaStatus(a.id, t.tareaId);
      const obj = ENTREGA_ESTADOS.find(x => x.id === st) || ENTREGA_ESTADOS[0];
      const ai = planAreaInfo(t.area);
      return '<td class="conc-cell" style="background:' + ai.color + '0a"><button class="conc-dot st-' + st + '" data-action="conc-set" data-alumno="' + a.id + '" data-tarea="' + t.tareaId + '" title="' + obj.nombre + " · " + esc(t.texto) + '">' + obj.short + "</button></td>";
    }).join("");
    return '<tr><td class="st-name conc-name"><b>' + esc(a.nombre) + "</b><span>Grupo " + esc(a.grupo || "-") + "</span></td>" + celdas +
      '<td class="st-num"><b>' + res.entregado + "</b>/" + res.total + (res.tarde ? '<span class="st-sub">' + res.tarde + " tarde</span>" : "") + "</td></tr>";
  }).join("") : '<tr><td class="st-empty" colspan="' + (tareas.length + 2) + '">' +
      (alumnos.length ? ("No hay " + (modo === "todo" ? "actividades" : "tareas") + ". Agrega actividades en Planificación.") : "Sin alumnos registrados.") + "</td></tr>";

  const totalPosibles = alumnos.length * tareas.length;
  const totalEntregas = alumnos.reduce((s, a) => s + resumenTareasAlumno(a.id, tareas).entregado, 0);
  const pct = totalPosibles ? Math.round(totalEntregas / totalPosibles * 100) : 0;

  // Leyenda de materias con su color
  const leyenda = areas.map(x => {
    const ai = planAreaInfo(x);
    return '<span class="conc-leg" style="border-color:' + ai.color + ";color:" + ai.color + '">' + ai.icon + " " + esc(x) + "</span>";
  }).join("");

  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,#B45309 0%,#92400E 100%)">' +
      '<span class="sh-icon" style="background:#92400E">📊</span>' +
      "<div><h1>Concentrado de tareas</h1><p>Cruza alumnos con las actividades del plan, <b>organizadas por materia</b>. Toca cada celda para alternar: pendiente → entregado → tarde.</p></div>" +
    "</section>" +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="st-kpi-lbl">ALUMNOS</div><div class="st-kpi">' + alumnos.length + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">' + (modo === "todo" ? "ACTIVIDADES" : "TAREAS") + " EN EL PLAN</div><div class=\"st-kpi\">" + tareas.length + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">ENTREGAS</div><div class="st-kpi" style="color:var(--ok)">' + totalEntregas + " / " + totalPosibles + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">CUMPLIMIENTO</div><div class="st-kpi">' + pct + "%</div></div>" +
    "</div>" +
    '<div class="card st-toolbar">' +
      '<div class="conc-modes">' +
        '<button class="st-btn' + (modo === "tareas" ? "" : " st-btn-soft") + '" data-action="conc-mode" data-modo="tareas">📌 Solo tareas</button>' +
        '<button class="st-btn' + (modo === "todo" ? "" : " st-btn-soft") + '" data-action="conc-mode" data-modo="todo">📚 Todo (clase + tareas)</button>' +
      "</div>" +
      '<label>Materia <select class="st-input" data-conc="area"><option value="">Todas las materias</option>' +
        areas.map(x => '<option value="' + esc(x) + '"' + (area === x ? " selected" : "") + ">" + esc(x) + "</option>").join("") +
      "</select></label>" +
      '<div class="st-spacer"></div><span class="st-note-sm">📌 tarea · 📘 clase · · pendiente · ✓ entregado · T tarde</span>' +
    "</div>" +
    (leyenda ? '<div class="conc-legend">' + leyenda + "</div>" : "") +
    '<div class="card"><div class="st-scroll"><table class="st-table conc-table"><thead>' + head + "</thead><tbody>" + filas + "</tbody></table></div></div>";
}

/* ---------------- Modales · Taller / Perfil ---------------- */
var tallerDraft = null;

function tallerChipsHTML(kind, sugeridos) {
  const sel = tallerDraft[kind] || [];
  const chip = v => '<button type="button" class="chipsel' + (sel.indexOf(v) >= 0 ? " on" : "") + (sugeridos.indexOf(v) < 0 ? " custom" : "") +
    '" data-action="taller-chip" data-kind="' + kind + '" data-val="' + esc(v) + '">' + esc(v) + "</button>";
  const custom = sel.filter(v => sugeridos.indexOf(v) < 0);
  return '<div class="chip-grid">' + sugeridos.map(chip).join("") + custom.map(chip).join("") + "</div>" +
    '<div class="chip-add"><input class="st-input" id="chip-input-' + kind + '" placeholder="Otro… (escribe y Enter)">' +
    '<button type="button" class="st-btn st-btn-soft" data-action="taller-chip-add" data-kind="' + kind + '">Agregar</button></div>';
}
function tallerPlanEditHTML(i) {
  const o = tallerDraft.planes[i], L = planLetra(i);
  const instOpts = ['<option value="">— Institución —</option>'].concat(INSTITUCIONES.map(x => '<option value="' + esc(x) + '"' + (x === o.institucion ? " selected" : "") + ">" + esc(x) + "</option>")).join("");
  const lista = planEscuelasDe(o.institucion);
  const escOpts = ['<option value="">— Escuela —</option>'].concat(lista.map(x => '<option value="' + esc(x.n) + '"' + (x.n === o.escuela ? " selected" : "") + ">" + esc(x.n) + "</option>")).join("");
  const ref = planRefEscuela(o.institucion, o.escuela);
  const tipoOpts = ['<option value="">— Tipo —</option>'].concat(TIPOS_ESCUELA.map(x => '<option value="' + esc(x) + '"' + (x === o.tipo ? " selected" : "") + ">" + esc(x) + "</option>")).join("");
  const attrs = 'data-draft-plan="' + i + '"';
  return '<div class="plan-edit">' +
    '<div class="plan-edit-h"><span class="plan-opt-l">' + L + "</span><b>Plan " + L + "</b>" +
      (tallerDraft.planes.length > 1 ? '<button type="button" class="st-mini st-mini-del" data-action="taller-plan-del" data-idx="' + i + '">Quitar</button>' : "") + "</div>" +
    '<label>Institución <select class="st-input" ' + attr(i, "institucion") + ">" + instOpts + "</select></label>" +
    '<label>Escuela <select class="st-input" ' + attr(i, "escuela") + (planEscuelasDe(o.institucion).length ? "" : " disabled") + ">" + escOpts + "</select></label>" +
    (ref ? '<div class="plan-ref">Referencia: <b>' + esc(ref) + '</b> aciertos (aprox. · verifica)<button type="button" class="st-mini" data-action="taller-use-ref" data-idx="' + i + '">Usar</button></div>' : "") +
    '<label>Tipo <select class="st-input" ' + attr(i, "tipo") + ">" + tipoOpts + "</select></label>" +
    '<label>Distancia <input class="st-input" ' + attr(i, "distancia") + ' value="' + esc(o.distancia) + '" placeholder="Ej. 30 min"></label>' +
    '<label>Aciertos / corte <input class="st-input" ' + attr(i, "corte") + ' value="' + esc(o.corte) + '" placeholder="Ej. 92"></label>' +
    '<label>Notas <input class="st-input" ' + attr(i, "notas") + ' value="' + esc(o.notas) + '"></label>' +
  "</div>";
}
function attr(i, field) { return 'data-draft-plan="' + i + '" data-field="' + field + '"'; }
function tallerModalHTML() {
  if (tallerDraft && tallerDraft.vista === "perfil") {
    return '<div class="st-form">' +
      '<div class="form-section"><div class="block-title"><span>💪</span> Fortalezas</div>' + tallerChipsHTML("fortalezas", FORTALEZAS_SUGERIDAS) + "</div>" +
      '<div class="form-section"><div class="block-title"><span>📈</span> Áreas a mejorar</div>' + tallerChipsHTML("debilidades", DEBILIDADES_SUGERIDAS) + "</div>" +
      '<div class="form-section"><div class="block-title"><span>🏅</span> Extra / logros</div>' + tallerChipsHTML("extras", EXTRAS_SUGERIDAS) + "</div>" +
      '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' +
        '<button class="st-btn" data-action="taller-save" data-id="' + tallerDraft.id + '">Guardar</button></div>' +
    "</div>";
  }
  return '<div class="st-form">' +
    '<div class="quick-wrap"><div class="quick-title">⚡ Llenado rápido (toca una plantilla)</div>' +
      '<div class="quick-row">' + PLANTILLAS.map(q => '<button type="button" class="quick-btn" data-action="taller-quick" data-id="' + q.id + '"><span>' + q.icon + "</span>" + esc(q.nombre) + "</button>").join("") +
      '<button type="button" class="quick-btn quick-clear" data-action="taller-clear">🧹 Limpiar todo</button></div></div>' +
    '<div class="form-section"><div class="block-title"><span>💡</span> Intereses <span class="st-note-sm">(toca para marcar)</span></div>' + tallerChipsHTML("intereses", INTERESES_SUGERIDOS) + "</div>" +
    '<div class="form-section"><div class="block-title"><span>🎯</span> Aptitudes</div>' + tallerChipsHTML("aptitudes", APTITUDES_SUGERIDAS) + "</div>" +
    '<div class="form-section"><div class="block-title"><span>🏫</span> Planes <span class="st-note-sm">(A, B, C… por preferencia)</span></div>' +
      '<div class="grid grid-plans">' + tallerDraft.planes.map((_, i) => tallerPlanEditHTML(i)).join("") + "</div>" +
      '<button type="button" class="st-btn st-btn-soft" data-action="taller-plan-add">+ Agregar plan</button>' +
    "</div>" +
    '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' +
      '<button class="st-btn" data-action="taller-save" data-id="' + tallerDraft.id + '">Guardar</button></div>' +
  "</div>";
}
function renderTallerModal() {
  const b = document.querySelector("#sistema-modal #modal-body");
  if (b) b.innerHTML = tallerModalHTML();
}
function openTallerModal(title, html) {
  openModal(title, html);
  const c = document.querySelector("#sistema-modal .modal-card");
  if (c) c.classList.add("modal-wide");
}
function formTaller(id) {
  const p = perfilDe(id);
  tallerDraft = {
    id: id, vista: "taller",
    intereses: p.intereses.slice(),
    aptitudes: p.aptitudes.slice(),
    planes: p.planes.map(o => ({ institucion: o.institucion, escuela: o.escuela, tipo: o.tipo, distancia: o.distancia, corte: o.corte, notas: o.notas }))
  };
  openTallerModal("Taller vocacional · " + esc(alumnoNombre(id)), tallerModalHTML());
}
function formPerfil(id) {
  const p = perfilDe(id);
  tallerDraft = {
    id: id, vista: "perfil",
    fortalezas: p.fortalezas.slice(),
    debilidades: p.debilidades.slice(),
    extras: p.extras.slice()
  };
  openTallerModal("Perfil · " + esc(alumnoNombre(id)), tallerModalHTML());
}

/* ---------------- Manejadores ---------------- */
function handlePlanClick(ev) {
  const el = ev.target.closest("[data-action]");
  if (!el) return false;
  const act = el.dataset.action, n = el.dataset.n, id = el.dataset.id;

  if (act === "plan-new") { formSesion(null); return true; }
  if (act === "plan-edit") { formSesion(n); return true; }
  if (act === "plan-toggle") { sistemaUI.sesionAbierta = String(sistemaUI.sesionAbierta) === String(n) ? null : n; route(); return true; }
  if (act === "plan-save-sesion") {
    const fecha = leerValor("#p-fecha") || hoyISO();
    const area = leerValor("#p-area") || "Español";
    const enfoque = leerValor("#p-enfoque");
    const estado = leerValor("#p-estado") || "pendiente";
    if (n && planSesion(n)) { const s = planSesion(n); s.fecha = fecha; s.area = area; s.enfoque = enfoque; s.estado = estado; }
    else {
      const num = Number(leerValor("#p-n")) || (planData.length ? Math.max.apply(null, planData.map(x => Number(x.n) || 0)) + 1 : 1);
      const base = { n: num, fecha, area, enfoque, estado, notas: "", items: [] };
      base.items = planSeedItems(base);
      planData.push(base);
      sistemaUI.sesionAbierta = num;
    }
    savePlan(); closeModal(); route(); return true;
  }
  if (act === "plan-del-sesion") {
    const s = planSesion(n);
    if (s && confirm("¿Eliminar la sesión S" + s.n + " (" + s.area + ")?")) {
      planData = planData.filter(x => String(x.n) !== String(n)); savePlan(); route();
    }
    return true;
  }
  if (act === "plan-restaurar") {
    if (confirm("¿Restaurar el plan base de 27 sesiones? Se perderán los cambios del plan.")) {
      planData = PLAN_SEED.map(s => ({ n: s.n, fecha: s.fecha, area: s.area, enfoque: s.enfoque, estado: "pendiente", notas: "", items: planSeedItems(s) }));
      savePlan(); route();
    }
    return true;
  }
  if (act === "plan-add-item") {
    const s = planSesion(n); if (!s) return true;
    const txtEl = document.getElementById("plan-itxt-" + s.n);
    const tipoEl = document.getElementById("plan-itipo-" + s.n);
    const txt = txtEl ? txtEl.value.trim() : "";
    if (!txt) { alert("Escribe la actividad."); return true; }
    if (!Array.isArray(s.items)) s.items = [];
    s.items.push({ id: uid(), texto: txt, tipo: (tipoEl && tipoEl.value) || "tarea", hecho: false });
    savePlan(); route(); return true;
  }
  if (act === "plan-edit-item") { formItem(n, id); return true; }
  if (act === "plan-save-item") {
    const s = planSesion(n); if (!s) return true;
    const txt = leerValor("#p-itxt");
    if (!txt) { alert("Escribe la descripción."); return true; }
    const tipo = leerValor("#p-itipo") || "tarea";
    if (id) { const it = planItems(s).find(x => x.id === id); if (it) { it.texto = txt; it.tipo = tipo; } }
    else { s.items.push({ id: uid(), texto: txt, tipo, hecho: false }); }
    savePlan(); closeModal(); route(); return true;
  }
  if (act === "plan-del-item") {
    const s = planSesion(n); if (!s) return true;
    s.items = planItems(s).filter(x => x.id !== id); savePlan(); route(); return true;
  }
  if (act === "plan-item-check") {
    const s = planSesion(n); if (!s) return true;
    const it = planItems(s).find(x => x.id === id);
    if (it) it.hecho = !!el.checked;
    savePlan(); route(); return true;
  }
  if (act === "plan-set-status") {
    const s = planSesion(n); if (!s) return true;
    s.estado = el.dataset.estado;
    if (s.estado === "completada") planItems(s).forEach(i => { i.hecho = true; });
    savePlan(); route(); return true;
  }
  if (act === "plan-rec") {
    const rec = el.dataset.rec;
    if (rec === "plan-filtrar-atrasadas") { planFiltrarAtrasadas(); return true; }
    if (rec === "plan-open") { sistemaUI.sesionAbierta = el.dataset.n; sistemaUI.planFiltroEstado = "todas"; sistemaUI.planBusqueda = ""; route(); return true; }
    if (rec === "plan-item-to-tarea") { planItemToTarea(el.dataset.n, el.dataset.id); return true; }
    return true;
  }

  if (act === "taller-edit") { formTaller(id); return true; }
  if (act === "taller-chip") {
    if (!tallerDraft) return true;
    const kind = el.dataset.kind, val = el.dataset.val;
    const arr = tallerDraft[kind] || (tallerDraft[kind] = []);
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
    el.classList.toggle("on", idx < 0);
    return true;
  }
  if (act === "taller-chip-add") {
    if (!tallerDraft) return true;
    const kind = el.dataset.kind;
    const input = document.getElementById("chip-input-" + kind);
    const v = input ? input.value.trim() : "";
    if (!v) return true;
    const arr = tallerDraft[kind] || (tallerDraft[kind] = []);
    if (arr.indexOf(v) < 0) arr.push(v);
    renderTallerModal();
    const ni = document.getElementById("chip-input-" + kind); if (ni) ni.focus();
    return true;
  }
  if (act === "taller-plan-add") {
    if (!tallerDraft) return true;
    tallerDraft.planes.push(planPlanVacio());
    renderTallerModal(); return true;
  }
  if (act === "taller-plan-del") {
    if (!tallerDraft) return true;
    tallerDraft.planes.splice(Number(el.dataset.idx), 1);
    if (!tallerDraft.planes.length) tallerDraft.planes.push(planPlanVacio());
    renderTallerModal(); return true;
  }
  if (act === "taller-use-ref") {
    if (!tallerDraft) return true;
    const o = tallerDraft.planes[Number(el.dataset.idx)];
    if (o) { o.corte = planRefEscuela(o.institucion, o.escuela); renderTallerModal(); }
    return true;
  }
  if (act === "taller-quick") {
    if (!tallerDraft) return true;
    const q = PLANTILLAS.find(x => x.id === el.dataset.id);
    if (q) {
      q.intereses.forEach(v => { if (tallerDraft.intereses.indexOf(v) < 0) tallerDraft.intereses.push(v); });
      q.aptitudes.forEach(v => { if (tallerDraft.aptitudes.indexOf(v) < 0) tallerDraft.aptitudes.push(v); });
      tallerDraft.planes = q.escuelas.map(e => ({ institucion: e.inst, escuela: e.esc, tipo: "Bachillerato general", distancia: "", corte: planRefEscuela(e.inst, e.esc), notas: "" }));
      renderTallerModal();
    }
    return true;
  }
  if (act === "taller-clear") {
    if (!tallerDraft) return true;
    tallerDraft.intereses = []; tallerDraft.aptitudes = [];
    tallerDraft.planes = [planPlanVacio(), planPlanVacio(), planPlanVacio()];
    renderTallerModal(); return true;
  }
  if (act === "taller-save") {
    if (!tallerDraft) return true;
    const p = perfilDe(tallerDraft.id);
    if (tallerDraft.vista === "perfil") {
      p.fortalezas = (tallerDraft.fortalezas || []).slice();
      p.debilidades = (tallerDraft.debilidades || []).slice();
      p.extras = (tallerDraft.extras || []).slice();
    } else {
      p.intereses = tallerDraft.intereses.slice();
      p.aptitudes = tallerDraft.aptitudes.slice();
      p.planes = tallerDraft.planes.map(o => ({ institucion: o.institucion, escuela: o.escuela, tipo: o.tipo, distancia: o.distancia, corte: o.corte, notas: o.notas }));
    }
    savePerfiles(); tallerDraft = null; closeModal(); route(); return true;
  }

  if (act === "perfil-edit") { formPerfil(id); return true; }
  if (act === "perfil-del-tag") {
    const p = perfilDe(id), kind = el.dataset.kind, idx = Number(el.dataset.idx);
    if (Array.isArray(p[kind])) p[kind].splice(idx, 1);
    savePerfiles(); route(); return true;
  }
  if (act === "perfil-add-ppm") {
    const val = Number(leerValor("#ppm-val"));
    if (!val) { alert("Escribe las palabras por minuto."); return true; }
    perfilDe(id).ppm.push({ fecha: leerValor("#ppm-fecha") || hoyISO(), valor: val });
    savePerfiles(); route(); return true;
  }
  if (act === "perfil-del-ppm") { perfilDe(id).ppm.splice(Number(el.dataset.idx), 1); savePerfiles(); route(); return true; }
  if (act === "perfil-add-plana") { const p = perfilDe(id); p.planas.hechas = Number(p.planas.hechas || 0) + 1; savePerfiles(); route(); return true; }
  if (act === "perfil-del-plana") { const p = perfilDe(id); p.planas.hechas = Math.max(0, Number(p.planas.hechas || 0) - 1); savePerfiles(); route(); return true; }
  if (act === "conc-set") {
    const cur = entregaStatus(el.dataset.alumno, el.dataset.tarea);
    const next = cur === "pendiente" ? "entregado" : cur === "entregado" ? "tarde" : "pendiente";
    setEntrega(el.dataset.alumno, el.dataset.tarea, next); saveEntregas(); route(); return true;
  }
  if (act === "conc-mode") { sistemaUI.concModo = el.dataset.modo === "todo" ? "todo" : "tareas"; route(); return true; }

  if (act === "test-open") { formTest(id); return true; }
  if (act === "test-ans") {
    if (!testDraft) return true;
    const q = Number(el.dataset.q), v = Number(el.dataset.v);
    testDraft.respuestas[q] = v;
    const row = el.closest(".test-q");
    if (row) {
      const opts = row.querySelectorAll(".test-opt");
      for (let i = 0; i < opts.length; i++) opts[i].classList.toggle("on", Number(opts[i].dataset.v) === v);
    }
    const c = testContestadas(testDraft.respuestas), total = RIASEC_PREGUNTAS.length;
    const cnt = document.getElementById("test-count"); if (cnt) cnt.textContent = c;
    const footer = document.querySelector("#sistema-modal #modal-body .st-form-actions");
    if (footer) footer.innerHTML = '<button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' +
      (c >= total ? '<button class="st-btn" data-action="test-result" data-id="' + testDraft.id + '">Ver resultados</button>' : '<button class="st-btn" disabled>Ver resultados</button>');
    return true;
  }
  if (act === "test-result") {
    if (!testDraft) return true;
    testDraft.ranking = testRanking(testDraft.respuestas);
    const b = document.querySelector("#sistema-modal #modal-body");
    if (b) b.innerHTML = testResultHTML();
    return true;
  }
  if (act === "test-apply") {
    if (!testDraft || !testDraft.ranking) return true;
    applyTestToPerfil(testDraft.id, testDraft.ranking, testDraft.respuestas);
    savePerfiles(); testDraft = null; closeModal(); route(); return true;
  }
  if (act === "test-repeat") { formTest(id); return true; }
  if (act === "cat-plan") { formEscuela(Number(el.dataset.idx)); return true; }
  return false;
}
function planItemToTarea(n, id) {
  const it = planItem(n, id);
  if (!it) return;
  it.tipo = "tarea-extra";
  if (it.texto.indexOf("tarea extra") < 0) it.texto += " (tarea extra)";
  savePlan(); route();
}
function handlePlanInput(ev) {
  const el = ev.target;
  if (el.tagName === "INPUT" && el.dataset && el.dataset.draftPlan !== undefined && tallerDraft) {
    const o = tallerDraft.planes[Number(el.dataset.draftPlan)];
    if (o) o[el.dataset.field] = el.value;
    return true;
  }
  if (el.dataset && el.dataset.plan === "busqueda") {
    sistemaUI.planBusqueda = el.value;
    const pos = el.selectionStart;
    route();
    const inp = document.querySelector('[data-plan="busqueda"]');
    if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (e) { /* ignorar */ } }
    return true;
  }
  if (el.dataset && el.dataset.cat === "busqueda") {
    sistemaUI.catBusqueda = el.value;
    const pos = el.selectionStart;
    route();
    const inp = document.querySelector('[data-cat="busqueda"]');
    if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (e) { /* ignorar */ } }
    return true;
  }
  return false;
}
function handlePlanChange(ev) {
  const el = ev.target;
  if (!el || !el.dataset) return false;
  if (el.dataset.plan === "filtro") { sistemaUI.planFiltroEstado = el.value; route(); return true; }
  if (el.dataset.plan === "notas") { const s = planSesion(el.dataset.n); if (s) { s.notas = el.value; savePlan(); } return true; }
  if (el.dataset.taller === "alumno") { sistemaUI.tallerId = el.value; route(); return true; }
  if (el.dataset.taller === "notas") { perfilDe(el.dataset.id).notas = el.value; savePerfiles(); return true; }
  if (el.dataset.perfil === "alumno") { sistemaUI.perfilId = el.value; route(); return true; }
  if (el.dataset.perfil === "notas") { perfilDe(el.dataset.id).notas = el.value; savePerfiles(); return true; }
  if (el.dataset.perfil === "meta") { perfilDe(el.dataset.id).planas.meta = Number(el.value) || 0; savePerfiles(); route(); return true; }
  if (el.dataset.conc === "area") { sistemaUI.concArea = el.value; route(); return true; }
  if (el.dataset.cat === "inst") { sistemaUI.catInst = el.value; route(); return true; }
  if (el.dataset.cat === "tag") { sistemaUI.catTag = el.value; route(); return true; }
  if (el.dataset.cat === "dist") { sistemaUI.catDist = el.value; route(); return true; }
  if (el.dataset.draftPlan !== undefined && tallerDraft) {
    const o = tallerDraft.planes[Number(el.dataset.draftPlan)];
    if (o) {
      o[el.dataset.field] = el.value;
      if (el.dataset.field === "institucion") { o.escuela = ""; o.corte = ""; }
      if (el.dataset.field === "escuela") { const r = planRefEscuela(o.institucion, o.escuela); if (r) o.corte = r; }
      renderTallerModal();
    }
    return true;
  }
  return false;
}

/* ---------------- Teclado: agregar chip con Enter ---------------- */
if (typeof document !== "undefined") {
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" || !tallerDraft) return;
    const el = ev.target;
    if (el && el.id && el.id.indexOf("chip-input-") === 0) {
      ev.preventDefault();
      const kind = el.id.slice("chip-input-".length);
      const v = (el.value || "").trim();
      if (!v) return;
      const arr = tallerDraft[kind] || (tallerDraft[kind] = []);
      if (arr.indexOf(v) < 0) arr.push(v);
      renderTallerModal();
      const ni = document.getElementById("chip-input-" + kind); if (ni) ni.focus();
    }
  });
}

/* ================================================================
   Test vocacional · modelo RIASEC
   ================================================================ */
var RIASEC = [
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
var TEST_ESCALA = ["Nada", "Poco", "Algo", "Bastante", "Mucho"];
var RIASEC_PREGUNTAS = [
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
var TEST_MAX_POR_DIM = 5; /* 5 preguntas por dimensión */

function testScore(resp) {
  const sc = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  RIASEC_PREGUNTAS.forEach((q, i) => { const v = resp[i]; if (typeof v === "number") sc[q.d] += v; });
  return sc;
}
function testRanking(resp) {
  const sc = testScore(resp);
  const max = TEST_MAX_POR_DIM * (TEST_ESCALA.length - 1);
  return RIASEC.map(d => ({ dim: d, val: sc[d.id], pct: max ? Math.round(sc[d.id] / max * 100) : 0 })).sort((a, b) => b.val - a.val);
}
function testContestadas(resp) {
  let c = 0; RIASEC_PREGUNTAS.forEach((_, i) => { if (typeof resp[i] === "number") c++; }); return c;
}

/* ================================================================
   Test vocacional · modal y resultados
   ================================================================ */
var testDraft = null;

function testModalHTML() {
  const resp = testDraft.respuestas;
  const hechas = testContestadas(resp);
  const total = RIASEC_PREGUNTAS.length;
  const rows = RIASEC_PREGUNTAS.map((q, i) => {
    const sel = resp[i];
    const opts = TEST_ESCALA.map((lbl, v) =>
      '<button type="button" class="test-opt' + (sel === v ? " on" : "") + '" data-action="test-ans" data-q="' + i + '" data-v="' + v + '">' + lbl + "</button>").join("");
    return '<div class="test-q" data-q="' + i + '"><div class="test-q-txt"><span class="test-q-n">' + (i + 1) + "</span>" + esc(q.t) + '</div><div class="test-opts">' + opts + "</div></div>";
  }).join("");
  const footer = hechas >= total
    ? '<button class="st-btn" data-action="test-result" data-id="' + testDraft.id + '">Ver resultados</button>'
    : '<button class="st-btn" disabled>Ver resultados</button>';
  return '<div class="st-form">' +
    '<div class="test-head"><div><b>¿Qué tanto te gusta o te identificas?</b>' +
      '<div class="st-note-sm">Responde con honestidad. No hay respuestas buenas ni malas. ' + total + ' preguntas.</div></div>' +
      '<div class="test-progress"><b id="test-count">' + hechas + "</b>/" + total + "</div></div>" +
    '<div class="test-list">' + rows + "</div>" +
    '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' + footer + "</div></div>";
}
function renderTestModal() {
  const b = document.querySelector("#sistema-modal #modal-body");
  if (b) b.innerHTML = testModalHTML();
}
function formTest(id) {
  const p = perfilDe(id);
  testDraft = { id: id, respuestas: (p.test && p.test.respuestas) ? Object.assign({}, p.test.respuestas) : {} };
  openTallerModal("Test vocacional · " + esc(alumnoNombre(id)), testModalHTML());
}
function testResultHTML() {
  const r = testDraft.ranking;
  const top = r.slice(0, 3);
  const bars = r.map(x => '<div class="test-bar-row"><div class="test-bar-lbl">' + x.dim.icon + " " + x.dim.nombre + '</div>' +
    '<div class="test-bar"><i style="width:' + x.pct + "%;background:" + x.dim.color + '"></i></div>' +
    '<div class="test-bar-pct">' + x.pct + "%</div></div>").join("");
  const tags = {}; top.forEach(x => x.dim.tags.forEach(t => { tags[t] = (tags[t] || 0) + 1; }));
  const tagList = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
  const escuelas = CATALOGO.filter(e => e.tags.some(t => tagList.indexOf(t) >= 0)).sort((a, b) => catDistancia(a.km) - catDistancia(b.km)).slice(0, 4);
  const intereses = []; top.forEach(x => x.dim.intereses.forEach(i => { if (intereses.indexOf(i) < 0) intereses.push(i); }));
  return '<div class="st-form">' +
    '<div class="st-note-sm">Este es tu perfil según tus respuestas. Las 3 primeras áreas son tu mejor rumbo.</div>' +
    '<div class="test-bars">' + bars + "</div>" +
    '<div class="form-section"><div class="block-title"><span>🧭</span> Perfil sugerido</div>' +
      top.map(x => '<div class="test-top"><b>' + x.dim.icon + " " + x.dim.nombre + "</b><span>" + esc(x.dim.desc) + "</span></div>").join("") +
      '<div class="tag-list">' + intereses.map(i => '<span class="tag">' + esc(i) + "</span>").join("") + "</div></div>" +
    '<div class="form-section"><div class="block-title"><span>🏫</span> Escuelas recomendadas (las más cercanas a Cuautitlán)</div>' +
      escuelas.map(e => '<div class="test-esc-row"><b>' + esc(e.nombre) + " · " + esc(e.inst) + "</b>" +
        '<span>' + esc(e.km) + " km (" + esc(e.tiempo) + ") · " + esc(e.aciertos) + " aciertos · " + esc(e.pase) + "</span></div>").join("") + "</div>" +
    '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Solo cerrar</button>' +
      '<button class="st-btn" data-action="test-apply" data-id="' + testDraft.id + '">Aplicar a intereses y planes</button></div>' +
  "</div>";
}
function applyTestToPerfil(id, ranking, resp) {
  const p = perfilDe(id);
  const top = ranking.slice(0, 3);
  top.forEach(x => x.dim.intereses.forEach(i => { if (p.intereses.indexOf(i) < 0) p.intereses.push(i); }));
  const tags = {}; top.forEach(x => x.dim.tags.forEach(t => { tags[t] = (tags[t] || 0) + 1; }));
  const tagList = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
  const escuelas = CATALOGO.filter(e => e.tags.some(t => tagList.indexOf(t) >= 0)).sort((a, b) => catDistancia(a.km) - catDistancia(b.km)).slice(0, 3);
  if (escuelas.length) {
    p.planes = escuelas.map(e => ({ institucion: e.inst, escuela: e.nombre, tipo: e.tipo, distancia: e.km + " km · " + e.tiempo, corte: planRefEscuela(e.inst, e.nombre) || e.aciertos, notas: e.fuerte }));
  }
  p.test = { fecha: hoyISO(), respuestas: resp, scores: testScore(resp), top: top.map(x => x.dim.id) };
  return p;
}
function testResumenHTML(p) {
  if (!p.test) return "";
  const top = (p.test.top || []).map(id => RIASEC.find(d => d.id === id)).filter(Boolean);
  return '<div class="card" style="margin-bottom:16px"><div class="st-kpi-lbl">TEST VOCACIONAL' +
    (p.test.fecha ? " · " + esc(p.test.fecha) : "") + '</div><div class="tag-list">' +
    top.map((d, i) => '<span class="tag" style="background:' + d.color + '1A;border-color:' + d.color + '55">' + (i + 1) + ". " + d.icon + " " + esc(d.nombre) + "</span>").join("") +
    '</div><div class="st-note-sm" style="margin-top:8px">' + top.map(d => esc(d.desc)).join(" ") + "</div></div>";
}

/* ================================================================
   Catálogo de escuelas · página
   ================================================================ */
function catCardRows(e) {
  const row = (lbl, val) => val ? '<div class="cat-row"><span>' + lbl + '</span><b>' + esc(val) + "</b></div>" : "";
  const tec = tecnicaturasDe(e);
  return row("📍 Distancia desde Cuautitlán", e.km + " km · " + e.tiempo) +
    row("🎯 Pase directo", e.pase) +
    row("💪 Fuerte", e.fuerte) +
    row("🧭 Orientación", e.orienta) +
    row("🎓 Carreras", tec ? tec.carreras.length + " carreras técnicas" : e.carreras) +
    row("🏛️ Para la universidad", e.uni) +
    '<div class="tag-list">' + e.tags.map(t => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>";
}
function catCard(e) {
  const plan = planDeEscuela(e);
  return '<div class="card cat-card">' +
    '<div class="cat-head"><div><div class="cat-name">' + esc(e.nombre) + '</div><div class="cat-inst">' + esc(e.inst) + " · " + esc(e.tipo) + "</div></div>" +
      '<span class="cat-ac" title="Aciertos de referencia (COMIPEMS)">' + esc(e.aciertos) + "</span></div>" +
    catCardRows(e) +
    '<button class="st-btn st-btn-soft cat-btn" data-action="cat-plan" data-idx="' + e._i + '">📚 Ver plan de estudios' + (plan.tecnico ? " y carreras" : "") + "</button>" +
  "</div>";
}
function guiaTecnicaHTML() {
  return '<div class="card cat-info"><div class="block-title"><span>🧭</span> ¿Carrera técnica o bachillerato general?</div>' +
    '<div class="guide-2col">' +
      '<div><b>Bachillerato general</b> (UNAM, Bachilleres, UAEMéx, privadas)' +
        '<ul><li>Más flexibles: te preparan para <b>cualquier licenciatura</b>.</li>' +
        '<li>La UNAM y UAEMéx dan <b>pase directo</b> por promedio.</li>' +
        '<li>Ideales si <b>aún no decides</b> o vas a artes/humanidades/salud.</li></ul></div>' +
      '<div><b>Bachillerato técnico</b> (IPN, CONALEP, CBTIS, CECyT, CBTA) - <b>sí trae carrera</b>' +
        '<ul><li>Sales con un <b>título técnico</b>: puedes <b>trabajar</b> al terminar.</li>' +
        '<li>El IPN da <b>pase a sus licenciaturas</b> afines (ingenierías).</li>' +
        '<li>Más materias y práctica: ideal si te gusta lo <b>práctico</b> o quieres ingresar antes al trabajo.</li></ul></div>' +
    '</div>' +
    '<p><b>¿Cuál conviene?</b> Si tu meta es una ingeniería o quieres trabajar pronto, la <b>técnica</b> suma. Si buscas abrir opciones (medicina, derecho, artes, humanidades) o no estás seguro, el <b>general</b> es más flexible. <b>En ambos</b> puedes presentar el examen de la universidad; lo importante es llevar buen promedio y prepararte para el examen (COMIPEMS/universidad).</p>' +
    '<p><b>Sobre prepararte para el examen:</b> el general refuerza más las materias del examen; la técnica da ventaja laboral y práctica. Si eliges técnica, complementa con <b>repaso de admisión</b> (matemáticas, lectura, ciencias).</p></div>';
}
function renderCatalogo() {
  breadcrumbs([{ label: "Sistema", href: "#/sistema/asistencia" }, { label: "Catálogo de escuelas" }]);
  const inst = sistemaUI.catInst || "todas";
  const tag = sistemaUI.catTag || "todas";
  const dist = sistemaUI.catDist || "todas";
  const q = (sistemaUI.catBusqueda || "").toLowerCase();
  let lista = CATALOGO.slice();
  if (inst !== "todas") lista = lista.filter(e => e.inst === inst);
  if (tag !== "todas") lista = lista.filter(e => e.tags.indexOf(tag) >= 0);
  if (dist !== "todas") lista = lista.filter(e => {
    const km = catDistancia(e.km);
    if (dist === "<20") return km < 20;
    if (dist === "20-30") return km >= 20 && km <= 30;
    if (dist === "30-45") return km > 30 && km <= 45;
    if (dist === ">45") return km > 45;
    return true;
  });
  if (q) lista = lista.filter(e => (e.nombre + " " + e.inst + " " + e.fuerte + " " + e.orienta + " " + e.carreras + " " + e.pase).toLowerCase().indexOf(q) >= 0);
  lista.sort((a, b) => catDistancia(a.km) - catDistancia(b.km));
  const info = inst !== "todas" ? INSTITUCION_INFO[inst] : null;
  const sel = (val, cur) => val === cur ? " selected" : "";
  const distOpts = [["todas", "Todas"], ["<20", "Menos de 20 km"], ["20-30", "20–30 km"], ["30-45", "30–45 km"], [">45", "Más de 45 km"]];
  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,#0891B2 0%,#0E7490 100%)">' +
      '<span class="sh-icon" style="background:#0E7490">🏫</span>' +
      "<div><h1>Catálogo de escuelas</h1><p>Qué se estudia, qué tan lejos queda de Cuautitlán, aciertos, pase directo, en qué es fuerte, a qué orienta y cómo sirve para la universidad.</p></div>" +
    "</section>" +
    '<div class="card st-toolbar">' +
      '<label>Institución <select class="st-input" data-cat="inst">' + ['<option value="todas">Todas</option>'].concat(INSTITUCIONES.map(i => '<option value="' + esc(i) + '"' + sel(i, inst) + ">" + esc(i) + "</option>")).join("") + "</select></label>" +
      '<label>Área <select class="st-input" data-cat="tag">' + ['<option value="todas">Todas</option>'].concat(CAT_TAGS.map(t => '<option value="' + esc(t) + '"' + sel(t, tag) + ">" + esc(t) + "</option>")).join("") + "</select></label>" +
      '<label>Distancia <select class="st-input" data-cat="dist">' + distOpts.map(o => '<option value="' + o[0] + '"' + sel(o[0], dist) + ">" + o[1] + "</option>").join("") + "</select></label>" +
      '<label>Buscar <input class="st-input" data-cat="busqueda" value="' + esc(sistemaUI.catBusqueda || "") + '" placeholder="Escuela o tema"></label>' +
    "</div>" +
    guiaTecnicaHTML() +
    (info ? '<div class="card cat-info"><div class="block-title"><span>ℹ️</span> ' + esc(inst) + "</div><p>" + esc(info.desc) + "</p><p><b>¿Pase directo?</b> " + esc(info.pase) + "</p><p><b>¿Sirve para la universidad?</b> " + esc(info.uni) + "</p></div>" : "") +
    '<div class="st-note-sm" style="margin:0 0 12px">📌 Distancias, aciertos y pase son <b>referencias aproximadas</b> desde Cuautitlán, Edo. Méx. <b>Verifica</b> el corte y las fechas oficiales del año.</div>' +
    '<div class="grid cat-grid">' + (lista.length ? lista.map(catCard).join("") : '<div class="card"><div class="st-empty">Sin resultados con esos filtros.</div></div>') + "</div>";
}

/* ================================================================
   Planes de estudio (tiras de materias) y carreras técnicas
   Aproximados · verificar en cada institución
   ================================================================ */
var PLANES_ESTUDIO = {
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
var TECNICATURAS = {
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
function planDeEscuela(e) {
  if (e.inst === "UNAM") return /CCH/.test(e.nombre) ? PLANES_ESTUDIO.UNAM_CCH : PLANES_ESTUDIO.UNAM_ENP;
  if (e.inst === "IPN") return PLANES_ESTUDIO.IPN;
  if (e.inst === "Colegio de Bachilleres") return PLANES_ESTUDIO.BACHILLERES;
  if (e.inst === "UAEMéx") return PLANES_ESTUDIO.UAEMEX;
  if (e.inst === "CONALEP") return PLANES_ESTUDIO.CONALEP;
  if (e.inst === "DGETI (CBTIS)") return PLANES_ESTUDIO.DGETI;
  if (e.inst === "DGETA (CBTA)") return PLANES_ESTUDIO.DGETA;
  if (e.inst === "CECyTE") return PLANES_ESTUDIO.CECYTE;
  if (e.inst === "Privadas") return PLANES_ESTUDIO.PRIVADA;
  return PLANES_ESTUDIO.GENERAL;
}
function tecnicaturasDe(e) { return TECNICATURAS[e.inst] || null; }

/* ================================================================
   Ficha de escuela · detalle con plan de estudios
   ================================================================ */
function planSemestresHTML(plan) {
  return plan.semestres.map(s =>
    '<div class="plan-sem"><div class="plan-sem-h">Semestre ' + s.n + '</div><div class="plan-sem-mat">' +
      s.materias.map(m => '<span class="plan-mat' + (/^Módulo/.test(m) ? " mod" : "") + '">' + esc(m) + "</span>").join("") +
    "</div></div>").join("");
}
function formEscuela(idx) {
  const e = CATALOGO[idx];
  if (!e) return;
  const plan = planDeEscuela(e);
  const tec = tecnicaturasDe(e);
  const tecHtml = tec ? '<div class="form-section"><div class="block-title"><span>🛠️</span> Carreras técnicas que ofrece (' + tec.carreras.length + ')</div>' +
      '<div class="st-note-sm">' + esc(tec.nota) + '</div>' +
      tec.carreras.map(c => '<div class="tec-card"><div class="tec-name">' + esc(c.n) + '</div><div class="tag-list">' +
        c.modulos.map(m => '<span class="tag">' + esc(m) + "</span>").join("") + "</div></div>").join("") + "</div>" : "";
  openTallerModal("🏫 " + esc(e.nombre),
    '<div class="st-form">' +
      '<div class="st-note-sm">' + esc(e.inst) + " · " + esc(e.tipo) + " · 📍 " + esc(e.km) + " km desde Cuautitlán (" + esc(e.tiempo) + ") · 🎯 " + esc(e.aciertos) + " aciertos de referencia</div>" +
      '<div class="card" style="box-shadow:none;border:1px solid var(--line)">' + catCardRows(e) + "</div>" +
      '<div class="form-section"><div class="block-title"><span>📚</span> ' + esc(plan.nombre) + '</div>' +
        (plan.tecnico ? '<div class="st-note-sm">Tronco común de bachillerato + módulos de tu carrera técnica (los módulos varían por carrera).</div>' : "") +
        '<div class="plan-sems">' + planSemestresHTML(plan) + "</div></div>" +
      tecHtml +
      '<div class="st-note-sm">📌 Información <b>aproximada de referencia</b>; el plan y las carreras pueden cambiar. <b>Verifica</b> en la escuela o en la convocatoria oficial.</div>' +
      '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Cerrar</button></div>' +
    "</div>");
}
