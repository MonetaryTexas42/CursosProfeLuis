/* ECOEMS · Puerta de acceso para herramientas embebidas
   Exige sesión activa (alumno o staff). Sin sesión, la herramienta
   no carga su contenido y redirige al portal. */
(function () {
  "use strict";

  var SUPABASE_URL = window.ECOEMS_SUPABASE_URL || "";
  var SUPABASE_ANON_KEY = window.ECOEMS_SUPABASE_ANON_KEY || "";
  var SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

  function blocked() {
    if (window.top !== window.self) {
      document.body.innerHTML =
        '<div style="font-family:system-ui;display:grid;place-items:center;height:100vh;color:#334155;text-align:center">' +
        '<div><h2 style="margin:0 0 8px">Acceso no autorizado</h2>' +
        '<p style="margin:0">Inicia sesión en la plataforma para usar esta herramienta.</p></div></div>';
    } else {
      location.replace("./");
    }
  }

  function run() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      document.body.innerHTML =
        '<div style="font-family:system-ui;display:grid;place-items:center;min-height:100vh;padding:24px;color:#334155;text-align:center">' +
        '<div><h2 style="margin:0 0 8px">Herramienta sin configurar</h2>' +
        '<p style="margin:0">Este build no tiene la URL ni la clave pública de Supabase.</p></div></div>';
      return;
    }

    import(SUPABASE_CDN)
      .then(function (mod) {
        var supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true, autoRefreshToken: true }
        });
        window.ECOEMS_SUPABASE = supabase;

        supabase.auth.getSession()
          .then(function (res) {
            var session = res.data && res.data.session;
            if (!session) { blocked(); return; }

            supabase
              .from("profiles")
              .select("id,role,active")
              .eq("id", session.user.id)
              .maybeSingle()
              .then(function (p) {
                var profile = p.data;
                if (
                  p.error || !profile || !profile.active ||
                  profile.role === "guardian"
                ) { blocked(); return; }

                window.ECOEMS_TOOL_USER = profile;
                document.dispatchEvent(new CustomEvent("ecoems:tool-ready", { detail: profile }));
              })
              .catch(blocked);
          })
          .catch(blocked);
      })
      .catch(blocked);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
