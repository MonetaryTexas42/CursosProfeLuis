// Guardas de entorno para las pruebas E2E.
//
// Las pruebas que escriben datos (TEST_WRITE=1) solo pueden ejecutarse
// contra staging. Este módulo se niega a continuar si la URL apunta al
// proyecto de producción o si falta APP_ENV=staging, y falla *antes* de
// que el script abra sesión o escriba nada.

import { readFileSync } from "node:fs";

export const PRODUCTION_REF = "ioikcrdxneuydylyhvwi";
export const PRODUCTION_HOSTS = ["monetarytexas42.github.io"];

/** Devuelve el ref de un proyecto Supabase a partir de su URL. */
export function projectRef(url) {
  const match = String(url || "").match(
    /^https?:\/\/([a-z0-9-]+)\.supabase\.(?:co|in)\/?$/i,
  );
  return match ? match[1] : null;
}

/** ¿La URL de Supabase apunta al proyecto de producción? */
export function isProductionSupabase(url) {
  const text = String(url || "");
  if (!text) return false;
  if (text.includes(PRODUCTION_REF)) return true;
  return projectRef(text) === PRODUCTION_REF;
}

/** ¿La URL de la app es el sitio publicado de producción? */
export function isProductionApp(url) {
  const text = String(url || "");
  if (!text) return false;
  try {
    const host = new URL(text).hostname.toLowerCase();
    return PRODUCTION_HOSTS.some(
      (blocked) => host === blocked || host.endsWith(`.${blocked}`),
    );
  } catch {
    return false;
  }
}

/** Lee un archivo .env sin dependencias: KEY=VALUE, ignora comentarios. */
export function readEnvFile(path) {
  const values = {};
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return values;
  }
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 0) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function fail(message) {
  console.error(`\nBLOQUEADO · ${message}`);
  console.error("No se ejecutó ninguna escritura. Revisa la configuración del entorno.\n");
  process.exit(2);
}

/**
 * Comprueba que el entorno sea seguro para la prueba.
 *
 * - Siempre rechaza el proyecto de producción para pruebas que escriben.
 * - Con `write: true` exige además APP_ENV=staging.
 * - Las pruebas de solo lectura contra producción solo muestran un aviso.
 *
 * @param {object} options
 * @param {string} options.supabaseUrl URL del proyecto Supabase.
 * @param {string} [options.appUrl] URL del frontend (para detectar el sitio publicado).
 * @param {boolean} [options.write] Si la prueba escribe datos.
 * @param {string} [options.appEnv] Valor de APP_ENV.
 * @param {string} [options.label] Nombre de la prueba para los mensajes.
 */
export function assertSafeTestEnvironment({
  supabaseUrl,
  appUrl = "",
  write = false,
  appEnv = process.env.APP_ENV,
  label = "prueba E2E",
}) {
  if (!supabaseUrl) {
    fail(`${label}: falta VITE_SUPABASE_URL (revisa frontend/.env).`);
  }

  const production = isProductionSupabase(supabaseUrl);
  const productionApp = isProductionApp(appUrl);

  if (write) {
    if (production || productionApp) {
      fail(
        `${label}: esta prueba escribe datos y está prohibida contra producción ` +
          `(${projectRef(supabaseUrl) || supabaseUrl}).`,
      );
    }
    if (appEnv !== "staging") {
      fail(
        `${label}: la prueba escribe datos y exige APP_ENV=staging ` +
          `(valor actual: ${appEnv || "sin definir"}).`,
      );
    }
    if (!projectRef(supabaseUrl)) {
      fail(
        `${label}: no se pudo reconocer el proyecto Supabase en ${supabaseUrl}.`,
      );
    }
    return { production: false, projectRef: projectRef(supabaseUrl) };
  }

  if (production || productionApp) {
    console.warn(
      `\nAVISO · ${label}: estás usando el proyecto de producción. ` +
        "Esta ejecución es de solo lectura; TEST_WRITE=1 sería bloqueado.\n",
    );
  }

  return { production, projectRef: projectRef(supabaseUrl) };
}
