// Restaura los resultados reales de los tests de Alexa que fueron
// sobrescritos por las pruebas automáticas (smoke con TEST_WRITE).
// Los datos se capturaron el 14-nov-2026 antes de las pruebas.
import pg from "pg";
import { readFileSync } from "node:fs";

const databaseUrl = readFileSync("../.secrets/database-url", "utf8").trim();

// --- Extrae careerCatalog de src/ui/app.js y lo evalúa ---
const appSource = readFileSync("../frontend/src/ui/app.js", "utf8");
const start = appSource.indexOf("const careerCatalog = [");
const end = appSource.indexOf("];", start) + 1;
const raw = appSource.slice(start, end).replace("const careerCatalog = ", "");
const js = raw
  .replace(/([{,]\s*)([a-zA-Z_]+)\s*:/g, '$1"$2":') // claves sin comillas
  .replace(/'/g, '"'); // comillas simples → dobles
const careerCatalog = JSON.parse(js);

// --- Recalcula las carreras sugeridas con la misma fórmula del test ---
const tags = [
  "personas","emociones","ciencia","tecnología","creatividad","deporte","equipo","salud",
  "justicia","música","arte","diseño","experimentos","naturaleza","cálculo","lógica",
  "manualidades","construcción","ayudar","empatía","animales","liderazgo","autonomía",
  "sociedad","estabilidad","cultura","idiomas","actualidad"
];
const tagSet = new Set(tags);

const tagFrequency = {};
for (const career of careerCatalog) {
  for (const tag of career.tags) tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
}

const scored = careerCatalog
  .map((career) => {
    const matches = career.tags.filter((tag) => tagSet.has(tag));
    const weight = matches.reduce((sum, tag) => sum + 1 / tagFrequency[tag], 0);
    return { name: career.name, matches, weight };
  })
  .filter((career) => career.matches.length > 0)
  .sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

const top = scored.slice(0, 8);
const maxWeight = top[0]?.weight || 1;
const careerSuggestions = top.map((career) => ({
  name: career.name,
  score: Math.round((career.weight / maxWeight) * 100),
  matches: career.matches
}));

const personality = {
  top: ["amabilidad", "apertura"],
  scores: {
    apertura: 67,
    amabilidad: 75,
    estabilidad: 50,
    extraversion: 33,
    responsabilidad: 50
  },
  answers: {
    p1: 2, p2: 4, p3: 2, p4: 2, p5: 2, p6: 2, p7: 1, p8: 2,
    p9: 3, p10: 4, p11: 2, p12: 3, p13: 2, p14: 2, p15: 2
  },
  version: 1,
  completed_at: "2026-11-14T23:30:48.241Z"
};

const aptitude = {
  tags,
  future: ["Ayudando a mi comunidad","Siendo reconocido en mi profesión","En un hospital o laboratorio","Viajando por mi trabajo","Con estabilidad económica"],
  values: ["Creatividad","Estabilidad económica","Aprender siempre"],
  version: 1,
  workdays: ["Crear diseños o contenido","Investigar y experimentar","Construir o reparar cosas","Cuidar animales","Cuidar la salud de personas","Entrenar o competir"],
  aptitudes: ["Cálculo mental","Creatividad","Manualidades","Dibujo o arte","Liderazgo"],
  interests: ["Novelas y K-dramas","Ciencia ficción y fantasía","Deportes","Superhéroes","Música y conciertos","Moda y belleza","Física y Química","Biología","Matemáticas","Artes","Tecnología o taller","Resolver problemas matemáticos","Hacer experimentos","Dibujar o diseñar","Bailar","Ayudar a otras personas","Cuidar plantas o animales","Armar o reparar cosas"],
  environment: ["Solo/a","En laboratorio","Con animales","Ayudando a la comunidad","Creando cosas","En equipo"],
  completed_at: "2026-11-14T23:39:35.628Z",
  career_choice: "Aún no lo sé",
  career_suggestions: careerSuggestions
};

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

const interests = [...new Set([
  ...(aptitude.interests || [])
])];

await client.query(
  `update public.student_profiles
      set personality = $1::jsonb,
          aptitude = $2::jsonb,
          interests = $3::text[],
          aptitudes = $4::text[],
          career_suggestions = $5::jsonb,
          career_choice = $6,
          updated_at = now()
    where student_id = '25c1049a-2b7d-4713-ab6a-fd27944fbc65'`,
  [
    JSON.stringify(personality),
    JSON.stringify(aptitude),
    interests,
    aptitude.aptitudes,
    JSON.stringify(careerSuggestions),
    "Aún no lo sé"
  ]
);

const check = await client.query(
  `select personality->'scores' as scores, aptitude->'career_suggestions' as cs, interests, career_choice
     from public.student_profiles where student_id = '25c1049a-2b7d-4713-ab6a-fd27944fbc65'`
);
console.log("restaurado. scores:", JSON.stringify(check.rows[0].scores));
console.log("carreras:", JSON.stringify(check.rows[0].cs.map((c) => `${c.name}:${c.score}`)));
console.log("intereses:", check.rows[0].interests.length, "· career_choice:", check.rows[0].career_choice);
await client.end();
