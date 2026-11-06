/* ECOEMS · Puerta de acceso para herramientas embebidas
   Exige sesión activa (alumno o staff). Sin sesión, la herramienta
   no carga su contenido y redirige al portal. */
(function () {
  "use strict";

  var SUPABASE_URL = "https://ioikcrdxneuydylyhvwi.supabase.co";
  var SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaWtjcmR4bmV1eWR5bHlodndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNzc4NTIsImV4cCI6MjEwODk1Mzg1Mn0.dQTvZ6YjjD3SthqvgZjoj7NmHNI1bNk-pSILYmS1N4M";
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
