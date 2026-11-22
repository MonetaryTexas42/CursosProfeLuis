// Página propia del taller vocacional.
//
// No forma parte del panel del alumno: se abre en /vocacional.html y comparte
// el mismo taller y el mismo almacenamiento local. El test oficial sigue en la
// ficha del alumno del panel del profesorado.

import './styles.css';
import { supabase } from './lib/supabase.js';
import { openVocationalWorkshop } from './ui/vocational.js';

const APP_BASE = import.meta.env.BASE_URL || '/';
const root = document.querySelector('#app');

function gate(message) {
  root.innerHTML = `
    <div class="shell">
      <header class="top">
        <a class="brand" href="${APP_BASE}" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
      </header>
      <main id="main-content" tabindex="-1" class="dashboard">
        <article class="card wide">
          <span class="card-label">Acceso</span>
          <h1>Taller vocacional</h1>
          <p class="muted">${message}</p>
          <div class="row">
            <a class="btn primary" href="${APP_BASE}">Ir al acceso →</a>
          </div>
        </article>
      </main>
    </div>
  `;
}

if (!supabase) {
  gate('La plataforma no está conectada a la base de datos.');
} else {
  supabase.auth.getSession().then(({ data }) => {
    if (!data.session) {
      window.location.replace(APP_BASE);
      return;
    }
    openVocationalWorkshop(root, {
      standalone: true,
      onClose: () => window.location.assign(APP_BASE)
    });
  });
}
