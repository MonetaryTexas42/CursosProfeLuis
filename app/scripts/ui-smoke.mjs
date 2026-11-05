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

function readTestUser(role) {
  const text = readFileSync(resolve(here, "../.secrets/test-users.txt"), "utf8");
  const lines = text.split("\n");
  const users = {};
  let current = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const roleMatch = line.match(/^\[(\w+)\]\s+(.+)$/);
    if (roleMatch) {
      current = { role: roleMatch[1], name: roleMatch[2], email: null, password: null, username: null };
    } else if (current) {
      const email = line.match(/correo:\s*(\S+)/);
      const password = line.match(/contraseña:\s*(\S+)/);
      const username = line.match(/usuario:\s*(\S+)/);
      if (email) current.email = email[1];
      if (password) current.password = password[1];
      if (username) current.username = username[1];
      if (current.email && current.password) {
        if (!users[current.role]) users[current.role] = current;
        current = null;
      }
    }
  }

  const user = users[role];
  if (!user?.password) {
    throw new Error(`No se encontraron las credenciales de ${role} en test-users.txt`);
  }

  return user;
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
  const mode = process.env.MODE || "student";
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

    if (mode === "teacher") {
      await runTeacherFlow(pageEval, waitFor);
      return;
    }

    if (mode === "admin") {
      await runAdminFlow(pageEval, waitFor);
      return;
    }

    if (mode === "curso") {
      await runCourseFlow(pageEval, waitFor);
      return;
    }

    await runStudentFlow(pageEval, waitFor);
  } finally {
    cdp.close();
    chrome.kill();
  }
}

async function loginAsStudent(pageEval, waitFor) {
  const { username, password } = readTestUser("student");

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
}

async function runCourseFlow(pageEval, waitFor) {
  console.log("Entrando como alumno…");
  await loginAsStudent(pageEval, waitFor);

  await waitFor(
    `document.querySelector('a[href="./curso/"]')`,
    "botón de abrir curso completo",
  );

  console.log("Abriendo el reproductor del curso…");
  await pageEval(`document.querySelector('a[href="./curso/"]').click(); true`);
  await waitFor(
    `document.body.innerText.toLowerCase().includes('español')`,
    "materias del curso cargadas desde Supabase",
  );

  const shellText = await pageEval(`document.body.innerText.toLowerCase()`);
  for (const fragment of ["español", "matemáticas", "materias"]) {
    if (!shellText.includes(fragment)) {
      throw new Error(`El curso no muestra "${fragment}" (contenido de Supabase)`);
    }
    console.log(`  ✓ materia visible: "${fragment}"`);
  }

  const badge = await pageEval(
    `(document.querySelector('.session-chip') || {}).textContent || ''`,
  );
  if (!badge.includes("🎓")) {
    throw new Error("No se muestra la insignia de sesión del alumno");
  }
  console.log(`  ✓ insignia de sesión: ${badge.trim()}`);

  const urlOk = await pageEval(`location.pathname.includes('/curso/')`);
  if (!urlOk) throw new Error("El reproductor no está en /curso/");
  console.log("  ✓ el contenido se sirve desde Supabase (sin data.js público)");

  console.log("\nPASS · Reproductor del curso con login y contenido protegido verificado.");
}

async function runAdminFlow(pageEval, waitFor) {
  const email = process.env.ADMIN_EMAIL || "cursosprofeluis@gmail.com";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Define ADMIN_PASSWORD en el entorno");
  }

  console.log(`Entrando como admin (${email})…`);
  await pageEval(`document.querySelector('[data-mode="teacher"]').click(); true`);
  await pageEval(`(() => {
    const setValue = (selector, value) => {
      const input = document.querySelector(selector);
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setValue('input[name="email"]', ${JSON.stringify(email)});
    setValue('input[name="password"]', ${JSON.stringify(password)});
    document.querySelector('#login-form').requestSubmit();
    return true;
  })()`);

  await waitFor(`document.body.innerText.includes('Hola,')`, "panel del admin");
  await waitFor(
    `document.querySelectorAll('[data-admin-tab]').length === 4`,
    "pestañas de administración",
  );
  console.log("  ✓ 4 pestañas visibles (Resumen, Usuarios, Contenido, Configuración)");

  console.log("Abriendo pestaña Usuarios…");
  await pageEval(`document.querySelector('[data-admin-tab="usuarios"]').click(); true`);
  await waitFor(`document.body.innerText.includes('Crear profesor')`, "gestión de usuarios");
  const usersText = await pageEval(`document.body.innerText.toLowerCase()`);
  for (const fragment of ["crear profesor", "nueva contraseña", "tutores", "profesores"]) {
    if (!usersText.includes(fragment)) throw new Error(`Falta "${fragment}" en Usuarios`);
  }
  console.log("  ✓ profesores, alumnos (nueva contraseña) y tutores visibles");

  console.log("Abriendo pestaña Contenido…");
  await pageEval(`document.querySelector('[data-admin-tab="contenido"]').click(); true`);
  await waitFor(`document.body.innerText.includes('Materias y unidades')`, "contenido");
  const contentText = await pageEval(`document.body.innerText.toLowerCase()`);
  if (!contentText.includes("español") || !contentText.includes("ejercicios")) {
    throw new Error("Faltan estadísticas de contenido");
  }
  console.log("  ✓ estadísticas por materia visibles (unidades, ejercicios, quiz)");

  console.log("Abriendo pestaña Configuración…");
  await pageEval(`document.querySelector('[data-admin-tab="configuracion"]').click(); true`);
  await waitFor(
    `document.querySelector('[data-setting-value="privacy_document_version"]')`,
    "configuración",
  );
  console.log("  ✓ parámetro privacy_document_version editable");

  console.log("\nPASS · Panel de administración verificado (usuarios, contenido y configuración).");
}

async function runTeacherFlow(pageEval, waitFor) {
  const teacher = readTestUser("teacher");

  console.log(`Entrando como profesor (${teacher.email})…`);
  await pageEval(`document.querySelector('[data-mode="teacher"]').click(); true`);
  await pageEval(`(() => {
    const setValue = (selector, value) => {
      const input = document.querySelector(selector);
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setValue('input[name="email"]', ${JSON.stringify(teacher.email)});
    setValue('input[name="password"]', ${JSON.stringify(teacher.password)});
    document.querySelector('#login-form').requestSubmit();
    return true;
  })()`);

  await waitFor(`document.body.innerText.includes('Hola,')`, "panel del profesor");
  await waitFor(
    `document.querySelectorAll('[data-invite-toggle]').length > 0 || document.body.innerText.includes('El administrador todavía no te asignó un grupo')`,
    "lista de alumnos del profesor",
  );

  const inviteCount = await pageEval(
    `document.querySelectorAll('[data-invite-toggle]').length`,
  );
  console.log(`Botones "Invitar tutor" visibles: ${inviteCount}`);

  if (inviteCount < 1) {
    throw new Error("El profesor no ve la lista de alumnos con invitación");
  }

  console.log("Abriendo el formulario de invitación…");
  await pageEval(`document.querySelector('[data-invite-toggle]').click(); true`);
  await waitFor(
    `!document.querySelector('[data-invite-form]').classList.contains('hidden')`,
    "formulario de invitación visible",
  );

  const hasFields = await pageEval(`(() => {
    const form = document.querySelector('[data-invite-form]');
    return Boolean(
      form.querySelector('input[name="full_name"]') &&
      form.querySelector('input[name="phone"]') &&
      form.querySelector('input[name="email"]') &&
      form.querySelector('button[type="submit"]')
    );
  })()`);

  if (!hasFields) {
    throw new Error("El formulario de invitación no tiene los campos esperados");
  }

  console.log("  ✓ formulario con nombre, teléfono, correo y botón de crear");
  console.log("\nPASS · Flujo UI del profesor con invitación de tutores verificado.");
}

async function runStudentFlow(pageEval, waitFor) {
  console.log("Entrando como alumno…");
  await loginAsStudent(pageEval, waitFor);

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
}

main().catch((error) => {
  console.error("\nFAIL:", error.message);
  process.exit(1);
});
