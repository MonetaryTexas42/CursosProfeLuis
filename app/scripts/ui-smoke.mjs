// Prueba UI del flujo del alumno con una unidad real.
// Usa Chrome headless con el protocolo DevTools (sin dependencias externas).
//
// Requisitos:
//   1. La app servida en APP_URL (por defecto http://localhost:5173).
//   2. Una asignación activa para el grupo del alumno alumno1.
//   3. El archivo .secrets/test-users.txt con las credenciales ficticias.
//
// Uso (desde app/):
//   node scripts/ui-smoke.mjs
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const APP_URL = process.env.APP_URL || "http://localhost:5173";
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DEBUG_PORT = 9333;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readStudentCredentials() {
  const text = readFileSync(resolve(here, "../.secrets/test-users.txt"), "utf8");
  const lines = text.split("\n");
  let username = null;
  let password = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.includes("usuario:")) {
      username = line.split("usuario:")[1].trim();
    }
    if (username && lines[index + 1]?.includes("contraseña:")) {
      password = lines[index + 1].split("contraseña:")[1].trim();
      break;
    }
  }

  if (!username || !password) {
    throw new Error("No se encontraron las credenciales de alumno en test-users.txt");
  }

  return { username, password };
}

async function launchChrome() {
  const profile = `/tmp/ecoems-ui-test-${Date.now()}`;
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const res = await fetch(`http://localhost:${DEBUG_PORT}/json`);
      const targets = await res.json();
      const page = targets.find((target) => target.type === "page");
      if (page?.webSocketDebuggerUrl) return { chrome, wsUrl: page.webSocketDebuggerUrl };
    } catch {
      // Chrome aún no responde; reintentar.
    }
    await sleep(250);
  }

  chrome.kill();
  throw new Error("No se pudo iniciar Chrome con depuración remota");
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.nextId = 0;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = () => reject(new Error("No se pudo abrir el WebSocket de Chrome"));
    });

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.nextId;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  const { username, password } = readStudentCredentials();
  const { chrome, wsUrl } = await launchChrome();
  const cdp = new Cdp(wsUrl);
  await cdp.open();

  const pageEval = async (expression) => {
    const result = await cdp.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });

    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description || "Error evaluando en la página",
      );
    }

    return result.result?.value;
  };

  const waitFor = async (expression, label, timeoutMs = 25000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        if (await pageEval(`!!(${expression})`)) return;
      } catch {
        // La página aún cambia; reintentar.
      }
      await sleep(300);
    }
    throw new Error(`Timeout esperando: ${label}`);
  };

  try {
    console.log(`Navegando a ${APP_URL}…`);
    await cdp.send("Page.navigate", { url: APP_URL });
    await waitFor(`document.querySelector('#login-form')`, "formulario de login");

    console.log(`Entrando como ${username}…`);
    await pageEval(`(() => {
      const setValue = (selector, value) => {
        const input = document.querySelector(selector);
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      };
      setValue('input[name="username"]', ${JSON.stringify(username)});
      setValue('input[name="password"]', ${JSON.stringify(password)});
      document.querySelector('#login-form').requestSubmit();
      return true;
    })()`);

    await waitFor(`document.body.innerText.includes('Hola,')`, "panel del alumno");
    await waitFor(
      `document.querySelectorAll('[data-open-unit]').length > 0 || document.body.innerText.includes('Tus unidades aparecerán aquí')`,
      "datos del panel del alumno",
    );

    const unitLinkCount = await pageEval(
      `document.querySelectorAll('[data-open-unit]').length`,
    );
    console.log(`Unidades visibles para el alumno: ${unitLinkCount}`);

    if (unitLinkCount < 1) {
      throw new Error("El alumno no ve ninguna unidad activa");
    }

    console.log("Abriendo la unidad real…");
    await pageEval(`document.querySelector('[data-open-unit]').click(); true`);
    await waitFor(
      `document.body.innerText.includes('Ver respuesta')`,
      "contenido real de la unidad",
    );

    const bodyText = await pageEval(`document.body.innerText.toLowerCase()`);
    const expected = [
      "funciones de la lengua",
      "ver respuesta",
      "concepto",
      "error común",
      "capítulo",
    ];
    for (const fragment of expected) {
      if (!bodyText.includes(fragment)) {
        throw new Error(`El contenido no incluye "${fragment}"`);
      }
      console.log(`  ✓ contenido incluye "${fragment}"`);
    }

    console.log("Probando flashcard: revelar respuesta…");
    await pageEval(`document.querySelector('[data-reveal]').click(); true`);
    await waitFor(
      `!document.querySelector('[data-flashcard-answer]').classList.contains('hidden')`,
      "panel de respuesta visible",
    );

    const revealed = await pageEval(
      `document.querySelector('[data-flashcard-answer]').innerText`,
    );
    if (!revealed.includes("Respuesta:")) {
      throw new Error("La respuesta de la flashcard no se reveló correctamente");
    }
    console.log("  ✓ respuesta revelada");

    console.log("Registrando intento correcto…");
    await pageEval(`document.querySelector('[data-answer-kind="flashcard"]').click(); true`);
    await waitFor(
      `document.body.innerText.includes('Correcto')`,
      "resultado del intento",
    );
    console.log("  ✓ intento calificado como correcto");

    console.log("\nPASS · Flujo UI del alumno con contenido real verificado.");
  } finally {
    cdp.close();
    chrome.kill();
  }
}

main().catch((error) => {
  console.error("\nFAIL:", error.message);
  process.exit(1);
});
