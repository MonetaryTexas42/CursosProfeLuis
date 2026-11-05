/* =====================================================================
   ECOEMS · Puerta de acceso del curso
   ----------------------------------------------------------------
   1. Exige una sesión activa de ALUMNO en Supabase (si no, regresa
      al portal de acceso).
   2. Carga el contenido del curso desde Supabase (protegido por RLS:
      solo estudiantes con sesión pueden leerlo). El contenido ya no
      viaja en archivos públicos.
   3. Arranca el reproductor del curso (sistema2.js + app.js) con el
      mismo esquema de datos que antes usaba data.js.
   ===================================================================== */
(function () {
  "use strict";

  var SUPABASE_URL = "https://ioikcrdxneuydylyhvwi.supabase.co";
  // Llave pública (anon). Es la misma que usa el portal; no da poderes de escritura.
  var SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaWtjcmR4bmV1eWR5bHlodndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNzc4NTIsImV4cCI6MjEwODk1Mzg1Mn0.dQTvZ6YjjD3SthqvgZjoj7NmHNI1bNk-pSILYmS1N4M";
  var SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

  function redirectToPortal() {
    // /CursosProfeLuis/curso/ → /CursosProfeLuis/
    var target = location.pathname.replace(/\/curso\/?.*$/, "/");
    location.replace(target);
  }

  function buildData(subjects, units, versions) {
    var versionByUnit = {};
    versions.forEach(function (v) {
      if (v && v.unit_id) versionByUnit[v.unit_id] = v.content || {};
    });

    return {
      title: "Preparación para el Bachillerato",
      subtitle: "Tu preparación comienza aquí",
      subjects: subjects.map(function (s) {
        var subjectUnits = units
          .filter(function (u) { return u.subject_id === s.id; })
          .sort(function (a, b) { return a.num - b.num; })
          .map(function (u) {
            var c = versionByUnit[u.id] || {};
            var meta = c.unit || {};
            var tipo = (c.quiz || []).find(function (q) { return q.part === "tipo"; });

            return {
              num: u.num,
              name: u.title || meta.title || "",
              hook: meta.hook || "",
              objetivo: meta.objective || [],
              teoria: c.theory || [],
              truco: meta.truco || "",
              guia: c.guides || [],
              ejemplos: (c.examples || []).map(function (e) {
                return { enc: e.prompt || "", pasos: e.steps || [], res: e.result || "" };
              }),
              errores: (c.commonMistakes || []).map(function (e) {
                return { t: e.title || "", d: e.detail || "" };
              }),
              ejercicios: (c.exercises || []).map(function (e) {
                return {
                  q: e.prompt || "",
                  a: e.answer || "",
                  p: e.explanation || "",
                  v: e.acceptedAnswers || [],
                  pasos: e.steps || [],
                  fig: e.figure || null
                };
              }),
              tipo: tipo
                ? { enc: tipo.prompt, ops: tipo.options, correct: tipo.correctIndex, expl: tipo.explanation || "" }
                : { enc: "", ops: [], correct: 0, expl: "" },
              reto: c.reto && c.reto.prompt
                ? { enc: c.reto.prompt, ops: c.reto.options, correct: c.reto.correctIndex, expl: c.reto.explanation || "" }
                : { enc: "", ops: [], correct: 0, expl: "" },
              capitulo: c.chapter || null
            };
          });

        return {
          id: s.id,
          num: s.sort_order || 0,
          short: s.short || "",
          name: s.name || "",
          icon: s.icon || "",
          badge: s.badge || "",
          blurb: "",
          color: s.color || "#64748B",
          ready: subjectUnits.length > 0,
          unitsCount: subjectUnits.length,
          units: subjectUnits
        };
      })
    };
  }

  function paintSessionBadge(profile, supabase) {
    var topbar = document.querySelector(".topbar-stats");
    if (!topbar) return;

    var chip = document.createElement("span");
    chip.className = "stat-chip session-chip";
    chip.title = "Alumno con sesión · ECOEMS";
    chip.textContent = "🎓 " + (profile.full_name || "Alumno");

    var out = document.createElement("button");
    out.className = "stat-chip session-out";
    out.title = "Cerrar sesión y volver al portal";
    out.textContent = "Salir";
    out.addEventListener("click", function () {
      supabase.auth.signOut().then(function () {
        redirectToPortal();
      });
    });

    topbar.insertBefore(chip, topbar.firstChild);
    topbar.insertBefore(out, topbar.firstChild);
  }

  function startPlayer(profile, supabase) {
    paintSessionBadge(profile, supabase);

    // El reproductor ya no se auto-arranca: lo cargamos aquí y llamamos init().
    var sistema = document.createElement("script");
    sistema.src = "js/sistema2.js";
    sistema.onload = function () {
      var app = document.createElement("script");
      app.src = "js/app.js";
      app.onload = function () {
        if (typeof init === "function") init();
      };
      document.body.appendChild(app);
    };
    document.body.appendChild(sistema);
  }

  function fail() {
    redirectToPortal();
  }

  function run() {
    import(SUPABASE_CDN)
      .then(function (mod) {
        var supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true, autoRefreshToken: true }
        });
        window.ECOEMS_SUPABASE = supabase;

        supabase.auth.getSession().then(function (res) {
          var session = res.data && res.data.session;
          if (!session) { redirectToPortal(); return; }

          supabase
            .from("profiles")
            .select("id,role,full_name,active")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(function (p) {
              var profile = p.data;
              if (p.error || !profile || profile.role !== "student" || !profile.active) {
                redirectToPortal();
                return;
              }

              return Promise.all([
                supabase.from("subjects")
                  .select("id,name,short,color,icon,badge,sort_order")
                  .eq("active", true)
                  .order("sort_order"),
                supabase.from("units")
                  .select("id,subject_id,num,title,status")
                  .eq("status", "published")
                  .order("num"),
                supabase.from("unit_versions")
                  .select("unit_id,version,content")
                  .eq("version", 1)
                  .not("published_at", "is", null)
              ]).then(function (results) {
                window.DATA = buildData(
                  results[0].data || [],
                  results[1].data || [],
                  results[2].data || []
                );
                window.ECOEMS_STUDENT = { id: profile.id, name: profile.full_name };
                startPlayer(profile, supabase);
              });
            })
            .catch(fail);
        }).catch(fail);
      })
      .catch(fail);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
