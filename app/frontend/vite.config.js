import { defineConfig, loadEnv } from "vite";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

// El reproductor del curso y las herramientas viven en public/ y se copian
// tal cual, así que no pasan por el reemplazo de import.meta.env de Vite.
// Este plugin genera public/env.js con la configuración del modo activo
// (por ejemplo `vite build --mode staging`) y evita URLs de producción
// incrustadas en el código.
function publicEnvPlugin(env) {
  return {
    name: "ecoems-public-env",
    buildStart() {
      const content =
        `window.ECOEMS_SUPABASE_URL = ${JSON.stringify(env.VITE_SUPABASE_URL || "")};\n` +
        `window.ECOEMS_SUPABASE_ANON_KEY = ${JSON.stringify(env.VITE_SUPABASE_ANON_KEY || "")};\n` +
        `window.ECOEMS_APP_ENV = ${JSON.stringify(env.VITE_APP_ENV || "local")};\n`;
      writeFileSync(resolve(process.cwd(), "public/env.js"), content);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Un build de staging jamás debe caer en producción. Si falta
  // .env.staging, Vite cargaría .env y usaría la URL de producción.
  if (mode === "staging") {
    const url = env.VITE_SUPABASE_URL || "";
    if (env.VITE_APP_ENV !== "staging" || url.includes("ioikcrdxneuydylyhvwi")) {
      throw new Error(
        "Build staging bloqueado: revisa .env.staging (VITE_APP_ENV=staging y " +
          "una URL que no sea producción).",
      );
    }
  }

  return {
    plugins: [publicEnvPlugin(env)],
  };
});
