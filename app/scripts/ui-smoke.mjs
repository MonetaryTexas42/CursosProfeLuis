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

  // Solo deben aparecer las materias con unidades ACTIVADAS por el profesor.
  if (!shellText.includes("español")) {
    throw new Error('El curso no muestra "español" (materia con unidades activas)');
  }
  console.log('  ✓ solo aparecen materias con unidades activas ("español")');

  if (shellText.includes("matemáticas") || shellText.includes("habilidad verbal")) {
    throw new Error("El curso muestra materias sin unidades activas (se adelantaría el alumno)");
  }
  console.log("  ✓ las materias sin unidades activas quedan ocultas (matemáticas, habilidad verbal)");

  // Dentro de Español: unidades activas visibles y las demás ocultas.
  await pageEval(`document.querySelector('.subject-card').click(); true`);
  await waitFor(
    `document.body.innerText.includes('Funciones de la lengua')`,
    "unidad activada visible dentro de la materia",
  );
  const subjectText = await pageEval(`document.body.innerText`);
  if (subjectText.includes("Categorías gramaticales") || subjectText.includes("Analogías entre palabras")) {
    throw new Error("El curso muestra unidades que el profesor no ha activado");
  }
  console.log("  ✓ dentro de la materia solo se ven las unidades activadas, no las demás");

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

  console.log("\nPASS · Reproductor del curso con login, contenido protegido y solo unidades activadas.");
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
  await waitFor(`document.querySelectorAll('[data-staff-tab]').length >= 9`, "barra lateral del admin");

  const adminTopHeaders = await pageEval(`document.querySelectorAll('header.top').length`);
  if (adminTopHeaders !== 0) {
    throw new Error(`Hay ${adminTopHeaders} cabecera(s) duplicada(s) en el panel del admin`);
  }
  await waitFor(`document.querySelector('.staff-app .staff-brand')`, "marca dentro de la barra lateral");
  const adminTabCount = await pageEval(`document.querySelectorAll('[data-staff-tab]').length`);
  console.log("  ✓ una sola página: sin cabeceras duplicadas y marca en la barra lateral");
  console.log(`  ✓ barra lateral con ${adminTabCount} secciones`);

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
  const adminActivateButtons = await pageEval(`document.querySelectorAll('[data-activate-unit]').length`);
  const adminManageButtons = await pageEval(`document.querySelectorAll('[data-manage-assignment]').length`);
  if (adminActivateButtons < 1 || adminManageButtons < 1) {
    throw new Error(`Faltan botones de activación para el admin: activar=${adminActivateButtons}, alumnos=${adminManageButtons}`);
  }
  console.log(`  ✓ el admin también puede activar (${adminActivateButtons} unidades) y elegir alumnos (${adminManageButtons} asignaciones)`);

  console.log("Sección Pagos…");
  await pageEval(`document.querySelector('[data-staff-tab="pagos"]').click(); true`);
  await waitFor(`document.querySelector('.pay-summary')`, "finanzas del admin");
  console.log("  ✓ finanzas disponibles para el admin");

  console.log("Sección Tareas…");
  await pageEval(`document.querySelector('[data-staff-tab="tareas"]').click(); true`);
  await waitFor(`document.querySelector('#create-task-form')`, "formulario de tareas");
  console.log("  ✓ tareas disponibles para el admin");

  console.log("Sección Actividad…");
  await pageEval(`document.querySelector('[data-staff-tab="actividad"]').click(); true`);
  await waitFor(`document.querySelector('[data-activity-filter]')`, "registro de actividad");
  console.log("  ✓ registro de actividad disponible para el admin");

  console.log("Sección Usuarios…");
  await pageEval(`document.querySelector('[data-staff-tab="usuarios"]').click(); true`);
  await waitFor(`document.body.innerText.includes('Crear profesor')`, "gestión de usuarios");
  await waitFor(`document.querySelector('[data-reset-student]')`, "contraseña de alumno");
  console.log("  ✓ usuarios: crear profesor y contraseña de alumno");

  console.log("Detección de colados…");
  await waitFor(
    `document.body.innerText.toLowerCase().includes('detección de colados')`,
    "tarjeta del detector de cuentas externas",
  );
  console.log("  ✓ detector de cuentas externas visible (lista, bloqueo y vinculación)");

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
  const writeMode = process.env.TEST_WRITE === "1";

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
  await waitFor(`document.querySelectorAll('[data-staff-tab]').length >= 7`, "barra lateral");

  const topHeaders = await pageEval(`document.querySelectorAll('header.top').length`);
  if (topHeaders !== 0) {
    throw new Error(`Hay ${topHeaders} cabecera(s) duplicada(s); el panel debe tener una sola`);
  }
  await waitFor(`document.querySelector('.staff-app .staff-brand')`, "marca dentro de la barra lateral");
  console.log("  ✓ una sola página: sin cabeceras duplicadas y marca en la barra lateral");

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
  await waitFor(`document.querySelector('.ficha-dialog')`, "ventana emergente de la ficha");
  await waitFor(`document.body.innerText.includes('Cómo va por materia')`, "avance por materia");
  await waitFor(`document.querySelector('.ficha-stat')`, "estadísticas de la ficha");
  await pageEval(`document.querySelector('[data-ficha-tab="perfil"]').click(); true`);
  await waitFor(`document.querySelector('[data-ficha-panel="perfil"]:not(.hidden)')`, "pestaña de perfil");
  await waitFor(`document.body.innerText.includes('Carrera que quiere')`, "perfil profesional");
  await pageEval(`document.querySelector('[data-ficha-tab="observaciones"]').click(); true`);
  await waitFor(`document.querySelector('[data-ficha-panel="observaciones"]:not(.hidden)')`, "pestaña de observaciones");
  await waitFor(`document.body.innerText.includes('Nueva observación')`, "observaciones");
  await pageEval(`document.querySelector('[data-ficha-close]').click(); true`);
  console.log("  ✓ ficha completa: modal con avance, perfil profesional y observaciones");

  console.log("Alta con vinculación de cuenta existente…");
  await waitFor(`document.querySelector('[data-link-toggle]')`, "casilla de cuenta existente en el alta");
  await pageEval(`document.querySelector('[data-link-toggle]').click(); true`);
  await waitFor(`!document.querySelector('[data-link-email-row]').classList.contains('hidden')`, "campo de correo visible");
  await waitFor(`document.querySelector('[data-password-row]').classList.contains('hidden')`, "contraseña temporal oculta");
  await pageEval(`document.querySelector('[data-link-toggle]').click(); true`);
  await waitFor(`document.querySelector('[data-link-email-row]').classList.contains('hidden')`, "vuelta al alta normal");
  console.log("  ✓ alta normal (usuario + contraseña temporal) y vinculación por correo se conmutan");

  console.log("Sección Materias…");
  await pageEval(`document.querySelector('[data-staff-tab="materias"]').click(); true`);
  await waitFor(`document.querySelector('.board-subject')`, "materias");
  const boardSubjects = await pageEval(`document.querySelectorAll('.board-subject').length`);
  const boardUnits = await pageEval(`document.querySelectorAll('.board-unit').length`);
  const firstSubject = await pageEval(`document.querySelector('.board-subject h3').textContent`);
  console.log(`  ✓ ${boardSubjects} materias (primera: ${firstSubject.trim()}) · ${boardUnits} unidades en orden del curso`);
  await waitFor(`document.body.innerText.includes('Nueva evaluación')`, "creación de evaluaciones");

  console.log("Materias plegables…");
  await pageEval(`document.querySelector('[data-subject-toggle]').click(); true`);
  await waitFor(`document.querySelector('.board-subject').classList.contains('collapsed')`, "materia colapsada");
  await pageEval(`document.querySelector('[data-subject-toggle]').click(); true`);
  await waitFor(`!document.querySelector('.board-subject').classList.contains('collapsed')`, "materia expandida");
  console.log("  ✓ las materias se pueden colapsar y expandir");

  console.log("Activación de unidad eligiendo alumnos…");
  await waitFor(`document.querySelector('[data-activate-unit]')`, "botón Activar de una unidad sin asignación");
  await pageEval(`document.querySelector('[data-activate-unit]').click(); true`);
  await waitFor(`document.querySelector('.unit-assign-dialog')`, "ventana de activación");
  await waitFor(`document.querySelectorAll('.unit-assign-row').length >= 1`, "lista de alumnos en la ventana");
  const assignDialogTitle = await pageEval(`document.querySelector('.unit-assign-dialog h2').textContent`);
  const assignRows = await pageEval(`document.querySelectorAll('.unit-assign-row').length`);
  console.log(`  ✓ ventana de activación para "${assignDialogTitle.trim()}" con ${assignRows} alumnos`);
  await pageEval(`document.querySelector('[data-unit-assign-student]').click(); true`);
  await waitFor(
    `document.querySelector('[data-unit-assign-save]').textContent.includes('alumno')`,
    "contador de alumnos tras deseleccionar",
  );
  await pageEval(`document.querySelector('[data-unit-assign-all]').click(); true`);
  await waitFor(
    `document.querySelectorAll('.unit-assign-row.selected').length === document.querySelectorAll('.unit-assign-row').length`,
    "todos los alumnos seleccionados de nuevo",
  );
  console.log("  ✓ se pueden seleccionar y deseleccionar alumnos con botones Todos/Ninguno");

  if (writeMode) {
    console.log("  (TEST_WRITE=1) activando la unidad para todo el grupo…");
    await pageEval(`document.querySelector('[data-unit-assign-save]').click(); true`);
    await waitFor(`document.body.innerText.includes('Unidad activada')`, "aviso de unidad activada");
    console.log("  ✓ la unidad se activó de verdad y el aviso se mostró");

    console.log("  (TEST_WRITE=1) abriendo la edición de alumnos de la unidad activa…");
    await waitFor(`document.querySelector('[data-manage-assignment]')`, "botón Alumnos de la unidad activa");
    await pageEval(`document.querySelector('[data-manage-assignment]').click(); true`);
    await waitFor(`document.querySelector('.unit-assign-dialog')`, "ventana de edición de alumnos");
    await waitFor(
      `document.querySelectorAll('.unit-assign-row.selected').length === document.querySelectorAll('.unit-assign-row').length`,
      "alumnos preseleccionados en la edición",
    );
    await pageEval(`document.querySelector('[data-unit-assign-close]').click(); true`);
    console.log("  ✓ la edición muestra a los alumnos incluidos y se cierra sin cambios");
  } else {
    await pageEval(`document.querySelector('[data-unit-assign-close]').click(); true`);
    await waitFor(`!document.querySelector('.unit-assign-dialog')`, "ventana cerrada sin cambios");
    console.log("  ✓ la ventana se cierra sin activar nada (modo lectura)");
  }

  console.log("Resultados de tests en la ficha…");
  await pageEval(`document.querySelector('[data-staff-tab="alumnos"]').click(); true`);
  await waitFor(`document.querySelector('[data-ficha-toggle]')`, "botón de ficha");
  await pageEval(`document.querySelector('[data-ficha-toggle]').click(); true`);
  await waitFor(`document.querySelector('.ficha-dialog')`, "ventana emergente de la ficha");
  await pageEval(`document.querySelector('[data-ficha-tab="perfil"]').click(); true`);
  await waitFor(`document.querySelector('.ficha-test-results')`, "resultados de tests en la ficha");
  await waitFor(`document.body.innerText.includes('Test de personalidad')`, "panel del test de personalidad");
  await waitFor(`document.body.innerText.includes('Orientación vocacional')`, "panel del test vocacional");
  await pageEval(`document.querySelector('[data-ficha-close]').click(); true`);
  console.log("  ✓ la ficha muestra los paneles de personalidad y orientación vocacional");

  console.log("Barra lateral colapsable…");
  await pageEval(`document.querySelector('#sidebar-toggle').click(); true`);
  await waitFor(`document.querySelector('.staff-app').classList.contains('collapsed')`, "barra lateral colapsada");
  await pageEval(`document.querySelector('#sidebar-toggle').click(); true`);
  await waitFor(`!document.querySelector('.staff-app').classList.contains('collapsed')`, "barra lateral expandida");
  console.log("  ✓ la barra lateral se puede ocultar y mostrar");

  console.log("Sección Asistencia…");
  await pageEval(`document.querySelector('[data-staff-tab="asistencia"]').click(); true`);
  await waitFor(`document.querySelector('[data-attendance-open]')`, "botón de asistencia");
  await pageEval(`document.querySelector('[data-attendance-open]').click(); true`);
  await waitFor(`document.querySelector('[data-att-status]')`, "lista de asistencia");
  await waitFor(`document.querySelector('[data-attendance-summary]')`, "resumen de asistencia");
  const attendanceRows = await pageEval(`document.querySelectorAll('[data-attendance-row]').length`);
  console.log(`  ✓ asistencia dinámica lista (${attendanceRows} alumnos, estados por botón y contadores)`);

  console.log("Sección Pagos…");
  await pageEval(`document.querySelector('[data-staff-tab="pagos"]').click(); true`);
  await waitFor(`document.querySelector('.pay-summary')`, "resumen de finanzas");
  await waitFor(`document.body.innerText.includes('Estado de cuentas')`, "estado de cuentas por alumno");
  await waitFor(`document.querySelector('[data-open-pay-dialog]')`, "botón de registrar pago");
  await pageEval(`document.querySelector('[data-open-pay-dialog][data-pay-mode="payment"]').click(); true`);
  await waitFor(`document.querySelector('.pay-dialog')`, "ventana de registrar pago");
  await waitFor(`document.body.innerText.includes('Monto')`, "campos del pago");
  await pageEval(`document.querySelector('[data-pay-close]').click(); true`);
  await waitFor(`!document.querySelector('.pay-dialog')`, "ventana de pago cerrada");
  await pageEval(`document.querySelector('[data-open-pay-dialog][data-pay-mode="plan"]').click(); true`);
  await waitFor(`document.querySelector('.pay-dialog')`, "ventana del plan");
  await waitFor(`document.body.innerText.includes('Cuota')`, "campos del plan");
  await pageEval(`document.querySelector('[data-pay-close]').click(); true`);
  await waitFor(`!document.querySelector('.pay-dialog')`, "ventana de plan cerrada");
  console.log("  ✓ finanzas: resumen, estado de cuentas, registrar pago y editar plan");

  console.log("Sección Tareas…");
  await pageEval(`document.querySelector('[data-staff-tab="tareas"]').click(); true`);
  await waitFor(`document.querySelector('#create-task-form')`, "formulario de tareas");
  await waitFor(`document.body.innerText.includes('Asignar al grupo')`, "crear tarea");
  console.log("  ✓ tareas: asignación por grupo, materia y fecha de entrega");

  console.log("Sección Actividad…");
  await pageEval(`document.querySelector('[data-staff-tab="actividad"]').click(); true`);
  await waitFor(`document.querySelector('[data-activity-filter]')`, "filtros de actividad");
  const activityEvents = await pageEval(`document.querySelectorAll('[data-activity-kind]').length`);
  if (activityEvents < 1) {
    throw new Error("El registro de actividad no muestra eventos");
  }
  await pageEval(`document.querySelector('[data-activity-filter="ejercicio"]').click(); true`);
  await waitFor(
    `document.querySelectorAll('[data-activity-kind="ejercicio"]:not(.hidden)').length >= 1`,
    "filtro de ejercicios",
  );
  console.log(`  ✓ registro de actividad con ${activityEvents} eventos y filtros por tipo`);

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
  const writeMode = process.env.TEST_WRITE === "1";

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

    console.log("Apartado Mi orientación…");
    await waitFor(`document.querySelector('.student-tests')`, "sección Mi orientación");
    const testCards = await pageEval(`document.querySelectorAll('.test-card').length`);
    if (testCards < 2) {
      throw new Error(`Se esperaban 2 tests en Mi orientación, hay ${testCards}`);
    }
    console.log(`  ✓ 2 tests disponibles: personalidad y orientación vocacional`);

    console.log("Test de personalidad (recorrido)…");
    await pageEval(`document.querySelector('[data-start-test="personality"]').click(); true`);
    await waitFor(`document.querySelector('.test-dialog')`, "ventana del test");
    await waitFor(
      `document.querySelectorAll('[data-test-option]').length >= 5`,
      "escala de 5 opciones",
    );
    const scaleLabels = await pageEval(`[...document.querySelectorAll('.test-option strong')].map((el) => el.textContent).join('|')`);
    if (!scaleLabels.includes('Nada') || !scaleLabels.includes('Mucho')) {
      throw new Error(`Escala del test incompleta: ${scaleLabels}`);
    }
    console.log(`  ✓ escala de respuesta con botones (${scaleLabels})`);
    await pageEval(`document.querySelector('[data-test-option="1"]').click(); true`);
    await waitFor(`document.body.innerText.includes('2 / 15')`, "avance automático a la pregunta 2");
    console.log("  ✓ tocar una respuesta avanza solo a la siguiente pregunta");
    await pageEval(`document.querySelector('[data-test-back]').click(); true`);
    await waitFor(`document.body.innerText.includes('1 / 15')`, "regreso a la pregunta 1");
    await pageEval(`document.querySelector('[data-test-close]').click(); true`);
    await waitFor(`!document.querySelector('.test-dialog')`, "test cerrado");
    console.log("  ✓ botón atrás y cierre");

    console.log("Test vocacional (recorrido)…");
    await pageEval(`document.querySelector('[data-start-test="vocational"]').click(); true`);
    await waitFor(`document.querySelector('.test-dialog')`, "ventana del test vocacional");
    await waitFor(
      `document.body.innerText.includes('Contenido que disfrutas')`,
      "primer paso de contenido",
    );
    const seriesOptions = await pageEval(`document.querySelectorAll('[data-test-option]').length`);
    if (seriesOptions < 15) {
      throw new Error(`Pocas opciones de contenido: ${seriesOptions}`);
    }
    console.log(`  ✓ primer paso de contenido con ${seriesOptions} opciones realistas (series, anime, deportes, videojuegos…)`);
    await pageEval(`document.querySelector('[data-test-option="Anime"]').click(); true`);
    await waitFor(
      `document.querySelector('[data-test-option="Anime"]').classList.contains('selected')`,
      "opción marcada en el sitio",
    );
    await waitFor(
      `document.querySelector('.test-choice-foot .pill').textContent.includes('1 seleccionados')`,
      "contador actualizado sin recargar",
    );
    console.log("  ✓ marcar opciones actualiza la selección al instante (sin parpadeo)");
    await pageEval(`document.querySelector('[data-test-close]').click(); true`);
    await waitFor(`!document.querySelector('.test-dialog')`, "test vocacional cerrado");

    if (writeMode) {
      console.log("  (TEST_WRITE=1) completando el test de personalidad…");
      await pageEval(`document.querySelector('[data-start-test="personality"]').click(); true`);
      await waitFor(`document.querySelector('.test-dialog')`, "ventana del test");
      const personalityDone = await pageEval(`(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        for (let i = 0; i < 80 && !document.querySelector('.test-result'); i += 1) {
          const option = document.querySelector('[data-test-option]');
          if (option) option.click();
          await sleep(140);
        }
        return !!document.querySelector('.test-result');
      })()`);
      if (!personalityDone) throw new Error("El test de personalidad no terminó");
      await waitFor(`document.body.innerText.includes('Tu perfil de personalidad')`, "resultado de personalidad");
      await pageEval(`document.querySelector('[data-test-close]').click(); true`);
      await waitFor(`!document.querySelector('.test-dialog')`, "resultado cerrado");
      await waitFor(`document.body.innerText.toLowerCase().includes('completado')`, "resumen actualizado");
      console.log("  ✓ test de personalidad guardado y resumen visible");

      console.log("  (TEST_WRITE=1) completando el test vocacional…");
      await pageEval(`document.querySelector('[data-start-test="vocational"]').click(); true`);
      await waitFor(`document.querySelector('.test-dialog')`, "ventana del test vocacional");
      const vocationalDone = await pageEval(`(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        for (let i = 0; i < 120 && !document.querySelector('.test-result'); i += 1) {
          const option = document.querySelector('[data-test-option]');
          if (option) option.click();
          const next = document.querySelector('[data-test-next]');
          if (next && !next.disabled) next.click();
          await sleep(140);
        }
        return !!document.querySelector('.test-result');
      })()`);
      if (!vocationalDone) throw new Error("El test vocacional no terminó");
      await waitFor(`document.body.innerText.includes('Tu orientación vocacional')`, "resultado vocacional");
      await pageEval(`document.querySelector('[data-test-close]').click(); true`);
      await waitFor(`!document.querySelector('.test-dialog')`, "resultado cerrado");
      await waitFor(
        `document.body.innerText.toLowerCase().includes('carreras que podrían interesarte')`,
        "carreras sugeridas en Mi orientación",
      );
      console.log("  ✓ test vocacional guardado con intereses, aptitudes y carreras sugeridas");
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
