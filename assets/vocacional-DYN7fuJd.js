import{o as e,t}from"./vocational-ChlEof2e.js";var n=`/CursosProfeLuis/`,r=document.querySelector(`#app`);function i(e){r.innerHTML=`
    <div class="shell">
      <header class="top">
        <a class="brand" href="${n}" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
      </header>
      <main id="main-content" tabindex="-1" class="dashboard">
        <article class="card wide">
          <span class="card-label">Acceso</span>
          <h1>Taller vocacional</h1>
          <p class="muted">${e}</p>
          <div class="row">
            <a class="btn primary" href="${n}">Ir al acceso →</a>
          </div>
        </article>
      </main>
    </div>
  `}e?e.auth.getSession().then(({data:e})=>{e.session?t(r,{standalone:!0,onClose:()=>window.location.assign(n)}):window.location.replace(n)}):i(`La plataforma no está conectada a la base de datos.`);