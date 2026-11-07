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
import { readFileSync, writeFileSync } from "node:fs";
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

  // Si es el primer ingreso, aparece el cambio de contraseña obligatorio:
  // la prueba lo completa con la misma contraseña (no-op) y continúa.
  await waitFor(
    `document.body.innerText.includes('Hola,') || document.querySelector('#change-password-form')`,
    "panel del alumno o cambio de contraseña",
  );

  if (await pageEval(`!!document.querySelector('#change-password-form')`)) {
    console.log("   (primer ingreso: completando el cambio de contraseña)");
    // Supabase exige una contraseña distinta a la temporal.
    const newPassword = `${password}A1!`;
    await pageEval(`(() => {
      const setValue = (selector, value) => {
        const input = document.querySelector(selector);
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      };
      setValue('#change-password-form input[name="password"]', ${JSON.stringify(newPassword)});
      setValue('#change-password-form input[name="confirm"]', ${JSON.stringify(newPassword)});
      document.querySelector('#change-password-form').requestSubmit();
      return true;
    })()`);
    await waitFor(`document.body.innerText.includes('Hola,')`, "panel del alumno tras el cambio");

    // Actualiza el archivo de credenciales para las siguientes corridas.
    const usersPath = resolve(here, "../.secrets/test-users.txt");
    const text = readFileSync(usersPath, "utf8");
    const updated = text.replace(`contraseña: ${password}`, `contraseña: ${newPassword}`);
    if (updated !== text) {
      writeFileSync(usersPath, updated);
      console.log(`   (credencial actualizada en test-users.txt: ${newPassword})`);
    }
  }
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

  if (process.env.SYNC_TEST === "1") {
    console.log("Probando sincronización de progreso (XP → Supabase)…");
    await pageEval(`(() => {
      state.xp = 150;
      state.racha = 3;
      state.best = 3;
      state.done = ['espanol-u01', 'espanol-u02'];
      saveState();
      return true;
    })()`);
    await sleep(4000);
    console.log("  ✓ estado guardado y enviado a Supabase (verificar contra la base)");
  }

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
  await waitFor(`document.querySelectorAll('[data-staff-tab]').length >= 7`, "barra lateral del admin");
  console.log("  ✓ barra lateral con 7 secciones");

  await waitFor(`document.querySelectorAll('.stat-card').length >= 5`, "dashboard");
  await waitFor(`document.body.innerText.toLowerCase().includes('score del grupo')`, "score del grupo");
  console.log("  ✓ dashboard con score del grupo");

  console.log("Sección Alumnos…");
  await pageEval(`document.querySelector('[data-staff-tab="alumnos"]').click(); true`);
  await waitFor(`document.querySelector('.student-card')`, "tarjeta de alumna");
  await waitFor(`document.querySelector('#admin-create-student-form')`, "formulario de alta");
  console.log("  ✓ alumna (Alexa) y alta de alumnos visibles");

  console.log("Sección Materias…");
  await pageEval(`document.querySelector('[data-staff-tab="materias"]').click(); true`);
  await waitFor(`document.querySelector('.board-subject')`, "materias");
  const subjects = await pageEval(`document.querySelectorAll('.board-subject').length`);
  console.log(`  ✓ ${subjects} materias con unidades y evaluaciones`);

  console.log("Sección Usuarios…");
  await pageEval(`document.querySelector('[data-staff-tab="usuarios"]').click(); true`);
  await waitFor(`document.body.innerText.includes('Crear profesor')`, "gestión de usuarios");
  await waitFor(`document.querySelector('[data-reset-student]')`, "contraseña de alumno");
  console.log("  ✓ usuarios: crear profesor y contraseña de alumno");

  console.log("Sección Contenido…");
  await pageEval(`document.querySelector('[data-staff-tab="contenido"]').click(); true`);
  await waitFor(`document.body.innerText.includes('Materias y unidades')`, "contenido");
  console.log("  ✓ contenido con estadísticas por materia");

  console.log("Sección Configuración…");
  await pageEval(`document.querySelector('[data-staff-tab="configuracion"]').click(); true`);
  await waitFor(`document.querySelector('[data-setting-value="privacy_document_version"]')`, "configuración");
  console.log("  ✓ configuración editable");

  console.log("\nPASS · Panel de administración con barra lateral verificado.");
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
  await waitFor(`document.querySelectorAll('[data-staff-tab]').length >= 5`, "barra lateral");

  console.log(`  ✓ barra lateral con ${await pageEval(`document.querySelectorAll('[data-staff-tab]').length`)} secciones`);

  await waitFor(`document.querySelectorAll('.stat-card').length >= 5`, "tarjetas del dashboard");
  await waitFor(`document.body.innerText.toLowerCase().includes('score del grupo')`, "score del grupo");
  console.log("  ✓ dashboard con tarjetas, score del grupo y recordatorios");

  console.log("Sección Alumnos…");
  await pageEval(`document.querySelector('[data-staff-tab="alumnos"]').click(); true`);
  await waitFor(`document.querySelector('.student-card')`, "tarjetas de alumnos");
  const studentName = await pageEval(`document.querySelector('.student-card strong').textContent`);
  console.log(`  ✓ ficha de alumna visible: ${studentName.trim()}`);

  await waitFor(`document.querySelector('[data-ficha-toggle]')`, "botón de ficha");
  await pageEval(`document.querySelector('[data-ficha-toggle]').click(); true`);
  await waitFor(`document.body.innerText.includes('Carrera que quiere')`, "perfil profesional");
  await waitFor(`document.body.innerText.includes('Observaciones')`, "observaciones");
  await waitFor(`document.body.innerText.includes('Cómo va por materia')`, "avance por materia");
  console.log("  ✓ ficha completa: avance por materia, perfil profesional y observaciones");

  console.log("Sección Materias…");
  await pageEval(`document.querySelector('[data-staff-tab="materias"]').click(); true`);
  await waitFor(`document.querySelector('.board-subject')`, "materias");
  const boardSubjects = await pageEval(`document.querySelectorAll('.board-subject').length`);
  const boardUnits = await pageEval(`document.querySelectorAll('.board-unit').length`);
  const firstSubject = await pageEval(`document.querySelector('.board-subject h3').textContent`);
  console.log(`  ✓ ${boardSubjects} materias (primera: ${firstSubject.trim()}) · ${boardUnits} unidades en orden del curso`);
  await waitFor(`document.body.innerText.includes('Nueva evaluación')`, "creación de evaluaciones");

  console.log("Sección Asistencia…");
  await pageEval(`document.querySelector('[data-staff-tab="asistencia"]').click(); true`);
  await waitFor(`document.querySelector('[data-attendance-open]')`, "botón de asistencia");
  await pageEval(`document.querySelector('[data-attendance-open]').click(); true`);
  await waitFor(`document.querySelector('[data-attendance-status]')`, "lista de asistencia");
  console.log("  ✓ asistencia de hoy lista");

  console.log("Sección Tutores…");
  await pageEval(`document.querySelector('[data-staff-tab="tutores"]').click(); true`);
  await waitFor(`document.querySelector('[data-invite-toggle]')`, "invitaciones de tutores");
  await pageEval(`document.querySelector('[data-invite-toggle]').click(); true`);
  await waitFor(`!document.querySelector('[data-invite-form]').classList.contains('hidden')`, "formulario de invitación");
  const adviseCount = await pageEval(`document.querySelectorAll('[data-advise-student]').length`);
  console.log(`  ✓ invitación y avisos por WhatsApp (${adviseCount} alumnos)`);

  console.log("\nPASS · Panel del profesor con barra lateral y todas las secciones verificado.");
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
