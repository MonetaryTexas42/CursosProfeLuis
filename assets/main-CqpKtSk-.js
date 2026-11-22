import{a as e,i as t,n,o as r,r as i,s as a}from"./vocational-kkg0TQ4K.js";var o=612,s=792,c=56;function l(e){return String(e??``).split(``).map(e=>e.codePointAt(0)<=255?e:`?`).join(``)}function u(e){return l(e).replace(/\\/g,`\\\\`).replace(/\(/g,`\\(`).replace(/\)/g,`\\)`).replace(/[\r\n]+/g,` `).trim()}function d(e){let t=0;for(let n=0;n<e.length;n++)t+=e.charCodeAt(n)<=255?1:2;return t}function f(e){let t=new Uint8Array(d(e)),n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<=255?t[n++]=i:(t[n++]=63,i>65535&&(t[n++]=63))}return t}function p(e,t,n,{size:r=11,bold:i=!1,x:a=c}={}){e.push(`BT /${i?`F2`:`F1`} ${r} Tf 1 0 0 1 ${a} ${n} Tm (${u(t)}) Tj ET`)}function m(e,t){e.push(`0.6 w ${c} ${t} m 556 ${t} l S`)}function h(e,t,n,r){p(e,t,r,{size:9,bold:!0}),p(e,n,r-15,{size:11})}function g(e){let t=e||{},n=t.status===`voided`,r=[];p(r,`ECOEMS`,722,{size:22,bold:!0}),p(r,`Recibo de pago`,696,{size:13}),n&&p(r,`PAGO ANULADO`,670,{size:14,bold:!0}),m(r,656),h(r,`FOLIO`,t.receipt_no||t.id||`SIN FOLIO`,628),h(r,`ALUMNO`,t.student_name||`—`,582),h(r,`CODIGO Y GRUPO`,`${t.student_code||`—`}${t.group_name?` · ${t.group_name}`:``}`,536),h(r,`FECHA DE PAGO`,t.paid_at||`—`,490),h(r,`METODO`,t.method||`—`,444),h(r,`PERIODO CUBIERTO`,t.period_start||t.period?`${t.period_start||t.period}${t.period_end?` — ${t.period_end}`:``}`:`No especificado`,398),h(r,`PLAN`,t.plan||`No especificado`,352),h(r,`ESTADO`,n?`Anulado`:`Pagado`,306),n&&t.void_reason&&h(r,`MOTIVO DE ANULACION`,t.void_reason,260),m(r,250),p(r,`Importe pagado`,226,{size:12,bold:!0}),p(r,l(t.amount||`—`),226,{size:16,bold:!0,x:420}),m(r,208),p(r,`Documento generado por la plataforma ECOEMS. Conserve este recibo para sus registros.`,176,{size:9}),p(r,`Folio: ${t.receipt_no||t.id||`SIN FOLIO`}`,158,{size:9});let i=r.join(`
`)+`
`,a=[`<< /Type /Catalog /Pages 2 0 R >>`,`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${o} ${s}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,`<< /Length ${d(i)} >>\nstream\n${i}endstream`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`],c=`%PDF-1.4
%âãÏÓ
`,u=[0];a.forEach((e,t)=>{u[t+1]=d(c),c+=`${t+1} 0 obj\n${e}\nendobj\n`});let g=d(c),_=a.length+1;c+=`xref\n0 ${_}\n0000000000 65535 f\r\n`;for(let e=1;e<_;e++)c+=`${String(u[e]).padStart(10,`0`)} 00000 n\r\n`;return c+=`trailer\n<< /Size ${_} /Root 1 0 R >>\nstartxref\n${g}\n%%EOF\n`,f(c)}function _(e){return`recibo-${String(e?.receipt_no||e?.id||`recibo`).replace(/[^A-Za-z0-9._-]+/g,`-`).replace(/^-+|-+$/g,``)||`ecoems`}.pdf`}function v(e){let t=new Blob([g(e)],{type:`application/pdf`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=_(e),document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}var y=`./guia-examen-espanol.html`,b=`/CursosProfeLuis/`,x=[`A`,`B`,`C`,`D`,`E`,`F`];function S(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function C(e){let t=Math.max(0,Math.round(Number(e||0)/1e3)),n=Math.floor(t/60),r=t%60;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function w(e){if(!e)return`—`;let t=new Date(e);return Number.isNaN(t.getTime())?`—`:t.toLocaleString(`es-MX`,{year:`numeric`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}async function T(){if(!r)return{available:!1,enabled:!1,last:null,status:null};try{let[e,t]=await Promise.all([r.rpc(`app_final_exam_status`),r.from(`final_exam_sessions`).select(`id,started_at,finished_at,status,score,correct_answers,total_questions`).order(`started_at`,{ascending:!1}).limit(1)]);if(e.error)throw e.error;if(t.error)throw t.error;return{available:!0,status:e.data,enabled:!!e.data?.enabled,last:t.data?.[0]||null}}catch{return{available:!1,enabled:!1,last:null,status:null}}}function E(e){if(!e?.available)return``;let t=!!e.enabled,n=e.last,r=n?.status===`completed`,i=t?`<span class="pill success">Activo</span>`:`<span class="pill pill-amber">Aún no activado</span>`,a=r?`<p class="exam-last-result">Último resultado: <strong>${Number(n.score).toFixed(2)}%</strong> · ${n.correct_answers}/${n.total_questions} aciertos <small>${S(w(n.finished_at))}</small></p>`:n?.status===`in_progress`?`<p class="exam-last-result">Tienes un examen en curso.</p>`:``;return`
    <article class="card wide exam-card">
      <div class="card-heading">
        <div>
          <span class="card-label">Evaluación</span>
          <h2>Examen final de Español</h2>
        </div>
        ${i}
      </div>
      <p class="muted">${t?`13 secciones con temas vistos en desorden. Tus respuestas, aciertos y tiempos quedan registrados.`:`El examen se abrirá cuando se active oficialmente. Mientras tanto, ya puedes estudiar con la guía.`}</p>
      ${a}
      <div class="row exam-card-actions">
        ${t?`<button class="btn primary" data-open-final-exam>Contestar examen →</button>`:``}
        <a class="btn ghost" href="${y}" target="_blank" rel="noopener">📖 Guía de examen (imprimir)</a>
      </div>
    </article>
  `}var D=null;function O(e,{onClose:t,preview:n=!1}={}){D={root:e,onClose:t,preview:n,view:`intro`,error:``,status:null,sessionId:null,sections:[],questions:[],index:0,answers:new Map,questionStart:0,result:null,startedAt:0},k(),ee()}async function ee(){if(!D||D.preview)return;let e=await T();D&&D.view===`intro`&&(D.status=e.status,e.enabled||(D.error=`El examen todavía no está activo. Puedes seguir estudiando con la guía.`),k())}function te(e){return`
    <div class="shell">
      <header class="top">
        <a class="brand" href="${b}" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
        <div class="top-actions">
          <button class="btn ghost" id="exam-back">← Volver al panel</button>
        </div>
      </header>
      <main id="main-content" tabindex="-1" class="dashboard exam-main">
        ${D.error?`<div class="alert error" role="alert">${S(D.error)}</div>`:``}
        ${e}
      </main>
    </div>
  `}function k(){if(!D)return;let e=D.view===`question`?j():D.view===`results`?le():A();D.root.innerHTML=te(e),D.root.querySelector(`#exam-back`)?.addEventListener(`click`,()=>{(D.preview||D.view!==`question`||window.confirm(`¿Salir del examen? Tu sesión quedará abierta y podrías perder el tiempo medido.`))&&D.onClose?.()}),D.root.querySelectorAll(`[data-exam-action]`).forEach(e=>{e.addEventListener(`click`,()=>M(e.dataset.examAction,e.dataset))})}function A(){let e=D.status,t=!!e?.enabled,n=e?.sections??13,r=e?.questions??136,i=D.preview;return`
    <article class="card wide exam-intro">
      <span class="card-label">${i?`Vista previa del profesorado`:`Evaluación final`}</span>
      <h1>Examen final de Español${i?` · vista previa`:``}</h1>
      <p class="muted">${i?`El banco real que contestan los alumnos, sin crear sesión ni registrar respuestas.`:`Una evaluación completa de todos los temas vistos en la materia.`}</p>
      <div class="exam-facts">
        <div><strong>${n}</strong><small>secciones (temas vistos)</small></div>
        <div><strong>${r}</strong><small>preguntas del banco</small></div>
        <div><strong>${i?`✓`:`∞`}</strong><small>${i?`clave visible al terminar`:`tiempo libre por respuesta`}</small></div>
      </div>
      ${i?`
        <ul class="exam-rules">
          <li>Ves las mismas preguntas y el mismo orden aleatorio por sección que usa el alumno.</li>
          <li>Al terminar se muestran aciertos, respuestas correctas y explicaciones.</li>
          <li>Esta revisión <strong>no crea sesión, no guarda respuestas y no aparece en resultados</strong>.</li>
        </ul>
      `:`
        <ul class="exam-rules">
          <li>Las secciones aparecen en <strong>orden distinto</strong> al que se vieron en clase; cada una corresponde a un tema.</li>
          <li>Se mide el tiempo de <strong>cada pregunta</strong> y de <strong>cada sección</strong>.</li>
          <li>No verás si acertaste hasta terminar: el puntaje se calcula en el servidor.</li>
          <li>Responde en una sola sesión y revisa antes de terminar.</li>
        </ul>
      `}
      <div class="row exam-intro-actions">
        ${i||t?`<button class="btn primary" data-exam-action="start">${i?`Ver el examen →`:`Comenzar examen →`}</button>`:`<button class="btn primary" disabled>Examen pendiente de activación</button>`}
        <a class="btn ghost" href="${y}" target="_blank" rel="noopener">📖 Estudiar con la guía</a>
      </div>
      ${i||t?``:`<p class="muted"><small>Cuando se active, regresa aquí y podrás contestarlo en la plataforma. La guía ya está lista para estudiar en casa.</small></p>`}
    </article>
  `}function ne(e){return D.sections.find(t=>t.key===e.sectionKey)}function j(){let e=D.questions[D.index];if(!e)return le();let t=ne(e),n=D.questions.filter(t=>t.sectionKey===e.sectionKey&&D.answers.get(t.id)?.selected!=null).length,r=D.questions.filter(t=>t.sectionKey===e.sectionKey).length,i=D.answers.get(e.id)?.selected;return`
    <div class="exam-layout">
      <aside class="exam-aside">
        <span class="card-label">Secciones</span>
        <ol class="exam-section-list">
          ${D.sections.map(t=>{let n=D.questions.filter(e=>e.sectionKey===t.key).length,r=D.questions.filter(e=>e.sectionKey===t.key&&D.answers.get(e.id)?.selected!=null).length;return`
              <li>
                <button data-exam-action="jump" data-index="${D.questions.findIndex(e=>e.sectionKey===t.key)}" class="${t.key===e.sectionKey?`active`:``}">
                  <span>${S(t.title)}</span>
                  <small>${r}/${n} · ${C(re(t.key))}</small>
                </button>
              </li>
            `}).join(``)}
        </ol>
      </aside>

      <section class="card exam-question">
        <div class="exam-progress-top">
          <span>Pregunta ${D.index+1} de ${D.questions.length}</span>
          <span>Sección ${t?.order??`—`} · ${S(t?.title||`Tema`)} (${n}/${r})</span>
        </div>
        <progress class="exam-progress" max="${D.questions.length}" value="${D.index+1}"></progress>
        <h2>${S(e.prompt)}</h2>
        <div class="exam-options">
          ${(e.options||[]).map((e,t)=>`
            <button class="exam-option ${i===t?`selected`:``}" data-exam-action="answer" data-option="${t}">
              <span class="exam-letter">${x[t]||t+1}</span>
              <span>${S(e)}</span>
            </button>
          `).join(``)}
        </div>
        <div class="answer-foot exam-nav">
          <button class="btn ghost" data-exam-action="prev" ${D.index===0?`disabled`:``}>← Anterior</button>
          <span class="muted"><small>${D.questions.filter(e=>D.answers.get(e.id)?.selected!=null).length} contestadas</small></span>
          ${D.index===D.questions.length-1?`<button class="btn primary" data-exam-action="finish">Terminar examen ✓</button>`:`<button class="btn primary" data-exam-action="next">Siguiente →</button>`}
        </div>
      </section>
    </div>
  `}function re(e){let t=0;for(let n of D.questions)n.sectionKey===e&&(t+=D.answers.get(n.id)?.elapsed||0,n.id===D.questions[D.index]?.id&&(t+=Math.max(0,Math.round(performance.now()-D.questionStart))));return t}async function M(e,t){if(e===`start`)return ie();if(e===`answer`)return ae(Number(t.option));if(e===`next`)return oe(D.index+1);if(e===`prev`)return oe(D.index-1);if(e===`jump`)return oe(Number(t.index));if(e===`finish`)return se();if(e===`retry`)return O(D.root,{onClose:D.onClose,preview:D.preview})}async function ie(){if(D.error=``,!r)return D.error=`La plataforma no está conectada a la base de datos.`,k();let{data:e,error:t}=await r.rpc(D.preview?`app_preview_final_exam`:`app_start_final_exam`);if(t)return D.error=t.message||`No se pudo iniciar el examen.`,k();D.sessionId=D.preview?null:e.sessionId,D.questions=e.questions||[],D.sections=e.sections||[],D.startedAt=Date.now(),D.answers=new Map,D.index=0,D.view=`question`,D.error=``,D.questionStart=performance.now(),k()}function N(){let e=D.questions[D.index];if(!e)return;let t=Math.max(0,Math.round(performance.now()-D.questionStart)),n=D.answers.get(e.id)||{selected:null,elapsed:0};n.elapsed+=t,D.answers.set(e.id,n),D.questionStart=performance.now()}async function ae(e){let t=D.questions[D.index];if(!t||!Number.isInteger(e))return;let n=D.answers.get(t.id)||{selected:null,elapsed:0},i=n.selected,a=Math.max(0,Math.round(performance.now()-D.questionStart));if(D.questionStart=performance.now(),D.answers.set(t.id,{selected:e,elapsed:n.elapsed+a}),D.root.querySelectorAll(`.exam-option`).forEach(t=>{t.classList.toggle(`selected`,Number(t.dataset.option)===e)}),D.preview)return;let{error:o}=await r.rpc(`app_answer_final_exam`,{p_session_id:D.sessionId,p_question_id:t.id,p_selected_index:e,p_duration_ms:n.elapsed+a});o?(D.answers.set(t.id,{selected:i,elapsed:n.elapsed}),D.error=o.message||`No se pudo guardar la respuesta; vuelve a intentarlo.`,k()):D.root.querySelector(`.exam-question`)?.querySelectorAll(`.exam-option`).forEach(t=>{t.classList.toggle(`selected`,Number(t.dataset.option)===e)})}function oe(e){e<0||e>=D.questions.length||(N(),D.index=e,D.error=``,k(),D.root.querySelector(`.exam-question h2`)?.scrollIntoView({block:`start`,behavior:`smooth`}))}async function se(){N();let e=D.questions.filter(e=>D.answers.get(e.id)?.selected==null).length;if(e&&!window.confirm(`Todavía hay ${e} preguntas sin contestar. ¿Terminar de todos modos?`))return;if(D.preview){D.result=ce(),D.view=`results`,D.error=``,k();return}let{data:t,error:n}=await r.rpc(`app_finish_final_exam`,{p_session_id:D.sessionId});if(n)return D.error=n.message||`No se pudo terminar el examen.`,k();D.result=t,D.view=`results`,D.error=``,k()}function ce(){let e=D.questions.map(e=>{let t=D.answers.get(e.id)||{selected:null,elapsed:0},n=Number(e.correctIndex);return{id:e.id,prompt:e.prompt,selectedIndex:t.selected??null,correctIndex:n,isCorrect:t.selected===n,durationMs:t.elapsed||0,explanation:e.explanation||``}}),t=e.filter(e=>e.isCorrect).length,n=e.length,r=D.sections.map(t=>{let n=D.questions.map((t,n)=>({question:t,answer:e[n]})).filter(e=>e.question.sectionKey===t.key);return{num:t.order??t.num,title:t.title,correct:n.filter(e=>e.answer.isCorrect).length,total:n.length,answered:n.filter(e=>e.answer.selectedIndex!=null).length,timeMs:n.reduce((e,t)=>e+t.answer.durationMs,0)}});return{sessionId:`Vista previa · no guardada`,score:n?Math.round(t*1e4/n)/100:0,correct:t,total:n,answered:e.filter(e=>e.selectedIndex!=null).length,durationMs:e.reduce((e,t)=>e+t.durationMs,0),sections:r,answers:e}}function le(){let e=D.result;if(!e)return A();let t=Date.now()-D.startedAt,n=Number(e.score||0),r=n>=70?`good`:n>=60?`fair`:`bad`;return`
    <article class="card wide exam-result">
      ${D.preview?`<p class="pill">Vista previa: nada se guardó en la base ni en el panel de resultados.</p>`:``}
      <div class="exam-result-head">
        <div>
          <span class="card-label">${D.preview?`Revisión del profesorado`:`Resultado`}</span>
          <h1>Examen final de Español</h1>
          <p class="muted">Sesión ${S(e.sessionId)} · terminado ${S(w(new Date))}</p>
        </div>
        <div class="exam-score ${r}">
          <strong>${n.toFixed(2)}%</strong>
          <small>${e.correct}/${e.total} aciertos</small>
        </div>
      </div>

      <div class="exam-facts">
        <div><strong>${C(t)}</strong><small>tiempo total de la sesión</small></div>
        <div><strong>${C(e.durationMs)}</strong><small>tiempo contestando</small></div>
        <div><strong>${e.answered}/${e.total}</strong><small>respuestas registradas</small></div>
      </div>

      <h2>Desglose por sección</h2>
      <div class="exam-table-wrap">
        <table class="exam-table">
          <thead><tr><th>#</th><th>Tema</th><th>Aciertos</th><th>Tiempo</th></tr></thead>
          <tbody>
            ${(e.sections||[]).map(e=>`
              <tr>
                <td>${e.num}</td>
                <td>${S(e.title)}</td>
                <td>${e.correct}/${e.total}</td>
                <td>${C(e.timeMs)}</td>
              </tr>
            `).join(``)}
          </tbody>
        </table>
      </div>

      <h2>Revisión de respuestas</h2>
      <div class="exam-review">
        ${(e.answers||[]).map((e,t)=>`
          <details class="exam-review-item ${e.isCorrect?`ok`:`wrong`}">
            <summary>
              <span>${t+1}. ${S(e.prompt)}</span>
              <span class="pill ${e.isCorrect?`success`:`pill-amber`}">${e.isCorrect?`Correcta`:`Incorrecta`} · ${C(e.durationMs)}</span>
            </summary>
            <p>Tu respuesta: <strong>${e.selectedIndex==null?`Sin responder`:S(x[e.selectedIndex]||e.selectedIndex+1)}</strong> · Correcta: <strong>${S(x[e.correctIndex]||e.correctIndex+1)}</strong></p>
            ${e.explanation?`<p class="muted">${S(e.explanation)}</p>`:``}
          </details>
        `).join(``)}
      </div>

      <div class="row exam-result-actions">
        <button class="btn ghost" data-exam-action="retry">Volver al inicio</button>
        <a class="btn ghost" href="${y}" target="_blank" rel="noopener">📖 Repasar con la guía</a>
      </div>
    </article>
  `}var ue={admin:`Administrador`,teacher:`Profesor`,student:`Alumno`,guardian:`Tutor`},de={admin:`Administra usuarios, contenido y configuración del piloto.`,teacher:`Activa unidades, registra asistencia y da seguimiento a tu grupo.`,student:`Tus unidades activas aparecerán aquí cuando el profesor las abra.`,guardian:`Aquí verás el avance de tus hijos cuando la cuenta esté vinculada.`},P={not_started:`Sin empezar`,in_progress:`En progreso`,completed:`Completada`,mastered:`Dominada`},fe={tipo:`Práctica`,reto:`Reto`,capitulo:`Capítulo`},pe=`v3-2026`,me=`v8-pulido`,he=20,ge={dashboard:`📊 Dashboard`,alumnos:`👥 Alumnos`,examen:`🎓 Examen final`,materias:`📚 Materias`,asistencia:`📅 Asistencia`,pagos:`💳 Pagos`,tareas:`📝 Tareas`,actividad:`📈 Actividad`,tutores:`💬 Tutores`,usuarios:`🛠️ Usuarios`,contenido:`🗂️ Contenido`,auditoria:`🧾 Auditoría`,configuracion:`⚙️ Configuración`},_e={present:`Presente`,late:`Tarde`,excused:`Justificado`,absent:`Falta`},ve={diagnostic:`Diagnóstico`,quiz:`Examen corto`,exam:`Examen`,project:`Tarea / Proyecto`,participation:`Participación`,other:`Otra`},ye={apertura:{label:`Apertura a la experiencia`,emoji:`💡`,copy:`Curiosidad, imaginación y ganas de aprender cosas nuevas.`},responsabilidad:{label:`Responsabilidad`,emoji:`🎯`,copy:`Constancia, orden y cumplimiento de tus metas.`},extraversion:{label:`Extraversión`,emoji:`🗣️`,copy:`Energía social y facilidad para conectar con otras personas.`},amabilidad:{label:`Amabilidad`,emoji:`🤝`,copy:`Empatía, respeto y ganas de colaborar.`},estabilidad:{label:`Estabilidad emocional`,emoji:`🌊`,copy:`Calma y manejo de la presión en momentos difíciles.`}},be=[{id:`p1`,dim:`apertura`,text:`Me gusta probar cosas nuevas y aprender temas distintos.`},{id:`p2`,dim:`apertura`,text:`Soy imaginativo/a y disfruto crear ideas, historias o proyectos.`},{id:`p3`,dim:`apertura`,reverse:!0,text:`Prefiero quedarme con las rutinas de siempre antes que probar novedades.`},{id:`p4`,dim:`responsabilidad`,text:`Cumplo mis tareas aunque no tenga muchas ganas.`},{id:`p5`,dim:`responsabilidad`,text:`Organizo mi tiempo y mis materiales con anticipación.`},{id:`p6`,dim:`responsabilidad`,reverse:!0,text:`Dejo las cosas para el último momento.`},{id:`p7`,dim:`extraversion`,text:`Disfruto hablar con gente nueva y hacer amigos.`},{id:`p8`,dim:`extraversion`,text:`Me siento con energía cuando estoy en grupo.`},{id:`p9`,dim:`extraversion`,reverse:!0,text:`Prefiero quedarme callado/a en reuniones grandes.`},{id:`p10`,dim:`amabilidad`,text:`Escucho y ayudo cuando alguien tiene un problema.`},{id:`p11`,dim:`amabilidad`,reverse:!0,text:`Me cuesta ponerme en el lugar de los demás.`},{id:`p12`,dim:`amabilidad`,text:`Trato con respeto a quienes piensan distinto a mí.`},{id:`p13`,dim:`estabilidad`,text:`Me recupero rápido cuando algo me sale mal.`},{id:`p14`,dim:`estabilidad`,reverse:!0,text:`Me preocupo mucho por cosas que todavía no pasan.`},{id:`p15`,dim:`estabilidad`,text:`Mantengo la calma en situaciones de presión.`}],xe=[{label:`Nada`,emoji:`😐`},{label:`Poco`,emoji:`🙂`},{label:`A veces`,emoji:`😌`},{label:`Bastante`,emoji:`😄`},{label:`Mucho`,emoji:`🤩`}],F=[{id:`series`,title:`Contenido que disfrutas`,prompt:`¿Qué series, películas o videos sueles ver?`,help:`Elige todo lo que de verdad ves. Tus gustos nos ayudan a detectar áreas de interés.`,options:[{label:`Novelas y K-dramas`,tags:[`personas`,`emociones`]},{label:`Series de policías, crimen o misterio`,tags:[`análisis`,`lógica`,`justicia`]},{label:`Anime`,tags:[`creatividad`,`arte`]},{label:`Ciencia ficción y fantasía`,tags:[`ciencia`,`tecnología`,`creatividad`]},{label:`Documentales de naturaleza`,tags:[`ciencia`,`naturaleza`]},{label:`Documentales de historia`,tags:[`historia`,`cultura`]},{label:`Deportes`,tags:[`deporte`,`equipo`,`salud`]},{label:`Comedia`,tags:[`creatividad`,`personas`]},{label:`Drama`,tags:[`personas`,`emociones`]},{label:`Terror o suspenso`,tags:[`análisis`,`creatividad`]},{label:`Caricaturas`,tags:[`arte`,`creatividad`]},{label:`Reality shows`,tags:[`personas`,`actualidad`]},{label:`Superhéroes`,tags:[`justicia`,`creatividad`]},{label:`Videos de YouTube`,tags:[`actualidad`,`tecnología`]},{label:`Podcasts`,tags:[`cultura`,`actualidad`]},{label:`Videojuegos`,tags:[`tecnología`,`lógica`]},{label:`Contenido de cocina`,tags:[`cocina`,`creatividad`]},{label:`Música y conciertos`,tags:[`música`,`arte`]},{label:`Moda y belleza`,tags:[`diseño`,`creatividad`]},{label:`Tecnología y gadgets`,tags:[`tecnología`,`ciencia`]}]},{id:`subjects`,title:`Materias favoritas`,prompt:`¿Qué materias de la escuela disfrutas o se te dan mejor?`,help:`Piensa en las clases que más te gustan, aunque no seas el mejor de tu grupo.`,options:[{label:`Español y Literatura`,tags:[`lectura`,`escritura`]},{label:`Matemáticas`,tags:[`cálculo`,`lógica`]},{label:`Física y Química`,tags:[`ciencia`,`experimentos`]},{label:`Biología`,tags:[`ciencia`,`naturaleza`]},{label:`Historia`,tags:[`historia`,`cultura`]},{label:`Geografía`,tags:[`naturaleza`,`cultura`]},{label:`Inglés u otros idiomas`,tags:[`idiomas`,`cultura`]},{label:`Computación`,tags:[`tecnología`,`lógica`]},{label:`Artes`,tags:[`arte`,`creatividad`]},{label:`Música`,tags:[`música`,`arte`]},{label:`Educación física`,tags:[`deporte`,`salud`]},{label:`Civismo o Ética`,tags:[`sociedad`,`debate`]},{label:`Tecnología o taller`,tags:[`manualidades`,`construcción`]}]},{id:`activities`,title:`Actividades favoritas`,prompt:`¿Qué actividades disfrutas hacer en tu tiempo libre o en la escuela?`,help:`Marca todas las que realmente disfrutes, no las que creas que deberías elegir.`,options:[{label:`Leer`,tags:[`lectura`,`cultura`]},{label:`Escribir`,tags:[`escritura`,`creatividad`]},{label:`Resolver problemas matemáticos`,tags:[`cálculo`,`lógica`]},{label:`Hacer experimentos`,tags:[`ciencia`,`experimentos`]},{label:`Dibujar o diseñar`,tags:[`arte`,`diseño`]},{label:`Tocar un instrumento o cantar`,tags:[`música`,`arte`]},{label:`Hacer deporte`,tags:[`deporte`,`salud`]},{label:`Bailar`,tags:[`arte`,`deporte`]},{label:`Ayudar a otras personas`,tags:[`ayudar`,`empatía`]},{label:`Usar computadoras o programar`,tags:[`tecnología`,`lógica`]},{label:`Jugar videojuegos`,tags:[`tecnología`,`lógica`]},{label:`Cuidar plantas o animales`,tags:[`naturaleza`,`animales`]},{label:`Cocinar`,tags:[`cocina`,`creatividad`]},{label:`Armar o reparar cosas`,tags:[`manualidades`,`construcción`]},{label:`Debatir`,tags:[`debate`,`sociedad`]},{label:`Organizar eventos`,tags:[`organización`,`liderazgo`]},{label:`Aprender idiomas`,tags:[`idiomas`,`cultura`]},{label:`Vender o emprender`,tags:[`negocios`,`emprendimiento`]}]},{id:`aptitudes`,title:`Aptitudes`,prompt:`¿En qué te sientes bueno/a o crees que destacas?`,help:`Piensa en lo que profesores, familiares o amigos te han reconocido.`,options:[{label:`Cálculo mental`,tags:[`cálculo`]},{label:`Comprensión de lectura`,tags:[`lectura`]},{label:`Escritura`,tags:[`escritura`]},{label:`Memorizar`,tags:[`memoria`]},{label:`Creatividad`,tags:[`creatividad`]},{label:`Comunicación`,tags:[`comunicación`]},{label:`Liderazgo`,tags:[`liderazgo`]},{label:`Organización`,tags:[`organización`]},{label:`Tecnología`,tags:[`tecnología`]},{label:`Deporte`,tags:[`deporte`]},{label:`Música`,tags:[`música`]},{label:`Dibujo o arte`,tags:[`arte`]},{label:`Empatía`,tags:[`empatía`]},{label:`Resolver conflictos`,tags:[`sociedad`,`empatía`]},{label:`Manualidades`,tags:[`manualidades`]},{label:`Análisis de datos`,tags:[`datos`,`análisis`]}]},{id:`workdays`,title:`Un día de trabajo`,prompt:`¿Qué te gustaría hacer en un día de trabajo?`,help:`Imagina tu rutina ideal. Elige las actividades que más te emocionen.`,options:[{label:`Atender y ayudar personas`,tags:[`ayudar`,`personas`]},{label:`Resolver problemas con números`,tags:[`cálculo`,`análisis`]},{label:`Crear diseños o contenido`,tags:[`creatividad`,`diseño`]},{label:`Construir o reparar cosas`,tags:[`construcción`,`manualidades`]},{label:`Investigar y experimentar`,tags:[`ciencia`,`experimentos`]},{label:`Vender o negociar`,tags:[`negocios`,`comunicación`]},{label:`Enseñar o capacitar`,tags:[`comunicación`,`personas`]},{label:`Organizar equipos o eventos`,tags:[`organización`,`liderazgo`]},{label:`Cuidar animales`,tags:[`animales`,`naturaleza`]},{label:`Cuidar la salud de personas`,tags:[`salud`,`ayudar`]},{label:`Programar o crear apps`,tags:[`tecnología`,`lógica`]},{label:`Escribir historias o noticias`,tags:[`escritura`,`lectura`]},{label:`Defender causas o personas`,tags:[`justicia`,`debate`]},{label:`Cocinar o preparar alimentos`,tags:[`cocina`,`creatividad`]},{label:`Producir música o videos`,tags:[`música`,`creatividad`]},{label:`Entrenar o competir`,tags:[`deporte`,`salud`]}]},{id:`environment`,title:`Ambiente de trabajo`,prompt:`¿Cómo te imaginas trabajando en el futuro?`,help:`Puedes elegir varios ambientes. No hay respuestas correctas o incorrectas.`,options:[{label:`Solo/a`,tags:[`autonomía`]},{label:`En equipo`,tags:[`equipo`]},{label:`Al aire libre`,tags:[`naturaleza`]},{label:`En oficina`,tags:[`organización`]},{label:`En laboratorio`,tags:[`experimentos`]},{label:`Con personas`,tags:[`personas`]},{label:`Con animales`,tags:[`animales`]},{label:`Con números y datos`,tags:[`datos`,`cálculo`]},{label:`Con tecnología`,tags:[`tecnología`]},{label:`Creando cosas`,tags:[`creatividad`,`diseño`]},{label:`Ayudando a la comunidad`,tags:[`ayudar`,`sociedad`]},{label:`Liderando proyectos`,tags:[`liderazgo`]}]},{id:`values`,title:`Lo que valoras`,prompt:`¿Qué es lo más importante para ti en un futuro trabajo?`,help:`Elige hasta tres opciones que más te importen.`,options:[{label:`Ayudar a los demás`,tags:[`ayudar`]},{label:`Creatividad`,tags:[`creatividad`]},{label:`Estabilidad económica`,tags:[`estabilidad`]},{label:`Libertad`,tags:[`autonomía`]},{label:`Aprender siempre`,tags:[`ciencia`,`cultura`]},{label:`Liderar`,tags:[`liderazgo`]},{label:`Impacto social`,tags:[`sociedad`]},{label:`Trabajo seguro`,tags:[`estabilidad`]},{label:`Reconocimiento`,tags:[`liderazgo`]},{label:`Tiempo libre`,tags:[`bienestar`]}]},{id:`future`,title:`Tu futuro`,prompt:`¿Cómo te imaginas en el futuro?`,help:`Elige las escenas que más te gustaría vivir dentro de unos años.`,options:[{label:`Ayudando a mi comunidad`,tags:[`ayudar`,`sociedad`]},{label:`Con mi propio negocio`,tags:[`negocios`,`liderazgo`]},{label:`Viviendo de mi arte`,tags:[`arte`,`creatividad`]},{label:`Siendo reconocido en mi profesión`,tags:[`liderazgo`]},{label:`Viajando por mi trabajo`,tags:[`idiomas`,`actualidad`]},{label:`Trabajando con tecnología`,tags:[`tecnología`]},{label:`En un hospital o laboratorio`,tags:[`salud`,`ciencia`]},{label:`En una oficina`,tags:[`organización`,`negocios`]},{label:`Al aire libre`,tags:[`naturaleza`,`deporte`]},{label:`Dando clases`,tags:[`comunicación`,`personas`]},{label:`En un juzgado o despacho`,tags:[`justicia`,`debate`]},{label:`Con estabilidad económica`,tags:[`estabilidad`]}]}],Se=[{name:`Medicina`,tags:[`salud`,`ciencia`,`ayudar`,`personas`]},{name:`Enfermería`,tags:[`salud`,`ayudar`,`personas`,`equipo`]},{name:`Psicología`,tags:[`personas`,`emociones`,`ayudar`,`ciencia`]},{name:`Nutrición`,tags:[`salud`,`ciencia`,`ayudar`,`bienestar`]},{name:`Veterinaria`,tags:[`animales`,`salud`,`ciencia`,`naturaleza`]},{name:`Biología`,tags:[`ciencia`,`naturaleza`,`experimentos`,`análisis`]},{name:`Química`,tags:[`ciencia`,`experimentos`,`análisis`,`cálculo`]},{name:`Física`,tags:[`ciencia`,`cálculo`,`análisis`,`tecnología`]},{name:`Matemáticas`,tags:[`cálculo`,`análisis`,`datos`,`lógica`]},{name:`Ingeniería en sistemas`,tags:[`tecnología`,`cálculo`,`lógica`,`datos`]},{name:`Ciencia de datos`,tags:[`datos`,`cálculo`,`tecnología`,`análisis`]},{name:`Ingeniería civil`,tags:[`cálculo`,`construcción`,`naturaleza`,`organización`]},{name:`Ingeniería mecánica`,tags:[`cálculo`,`construcción`,`tecnología`,`manualidades`]},{name:`Ingeniería industrial`,tags:[`cálculo`,`organización`,`negocios`,`liderazgo`]},{name:`Arquitectura`,tags:[`arte`,`construcción`,`creatividad`,`diseño`]},{name:`Diseño gráfico`,tags:[`arte`,`creatividad`,`tecnología`,`diseño`]},{name:`Animación y videojuegos`,tags:[`arte`,`tecnología`,`creatividad`,`lógica`]},{name:`Diseño de modas`,tags:[`diseño`,`arte`,`creatividad`,`actualidad`]},{name:`Comunicación`,tags:[`escritura`,`personas`,`creatividad`,`actualidad`]},{name:`Periodismo`,tags:[`escritura`,`lectura`,`actualidad`,`sociedad`]},{name:`Derecho`,tags:[`lectura`,`debate`,`sociedad`,`justicia`]},{name:`Criminología`,tags:[`justicia`,`análisis`,`sociedad`,`lógica`]},{name:`Administración`,tags:[`organización`,`liderazgo`,`negocios`,`datos`]},{name:`Contaduría`,tags:[`cálculo`,`organización`,`datos`,`negocios`]},{name:`Docencia`,tags:[`ayudar`,`personas`,`comunicación`,`lectura`]},{name:`Trabajo social`,tags:[`ayudar`,`sociedad`,`personas`,`empatía`]},{name:`Gastronomía`,tags:[`cocina`,`creatividad`,`manualidades`,`emprendimiento`]},{name:`Música`,tags:[`música`,`arte`,`creatividad`,`disciplina`]},{name:`Artes escénicas`,tags:[`arte`,`creatividad`,`personas`,`comunicación`]},{name:`Ciencias del deporte`,tags:[`deporte`,`salud`,`equipo`,`disciplina`]},{name:`Turismo`,tags:[`personas`,`idiomas`,`organización`,`actualidad`]},{name:`Mercadotecnia`,tags:[`creatividad`,`negocios`,`personas`,`actualidad`]},{name:`Relaciones internacionales`,tags:[`idiomas`,`sociedad`,`debate`,`actualidad`]},{name:`Ciencias políticas`,tags:[`sociedad`,`debate`,`actualidad`,`liderazgo`]},{name:`Historia`,tags:[`historia`,`cultura`,`lectura`,`sociedad`]},{name:`Literatura`,tags:[`lectura`,`escritura`,`cultura`,`creatividad`]},{name:`Lenguas extranjeras`,tags:[`idiomas`,`cultura`,`comunicación`,`lectura`]}],I={mode:`student`,session:null,profile:null,dashboard:null,dashboardError:``,view:`dashboard`,unitView:null,unitResults:{},error:``,notice:``,staffTab:`dashboard`,paymentsPage:1,sidebarCollapsed:localStorage.getItem(`ecoems_sidebar`)===`collapsed`,collapsedSubjects:Te(),fichaStudentId:null,fichaTrigger:null,fichaEscHandler:null,unitAssign:null,payDialog:null,subjectsGroupId:null,activeTest:null,loading:!0,pendingLoginUsername:``,studentInvitation:null,passwordRecovery:!1},L=null,R=null,Ce=null,we=null;function z(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function Te(){try{let e=JSON.parse(localStorage.getItem(`ecoems_collapsed_subjects`)||`[]`);return new Set(Array.isArray(e)?e:[])}catch{return new Set}}function Ee(){localStorage.setItem(`ecoems_collapsed_subjects`,JSON.stringify([...I.collapsedSubjects]))}function De(e){I.collapsedSubjects.has(e)?I.collapsedSubjects.delete(e):I.collapsedSubjects.add(e),Ee()}function Oe(e){let[t,...n]=String(e).split(` `);return{emoji:t,text:n.join(` `)}}var ke=[`ecoems_nav_open`,`ecoems_sidebar_off`,`curso_comipems_v1`,`curso_ecoems_alumnos_v1`,`curso_ecoems_pagos_v1`,`curso_ecoems_asistencia_v1`,`curso_ecoems_plan_v1`,`curso_ecoems_perfiles_v1`,`curso_ecoems_entregas_v1`,`lectura_reto_v1`,`mate_reto_v1`];function Ae(){let e=new Set;for(let t=0;t<localStorage.length;t+=1){let n=localStorage.key(t);n&&n.startsWith(`ecoems_`)&&e.add(n)}for(let t of ke)e.add(t);for(let t of e)localStorage.removeItem(t);I.sidebarCollapsed=!1,I.collapsedSubjects=new Set}function B(e){I.error=e,I.notice=``}function V(e){I.notice=e,I.error=``}function je(e,t){if(!e)return()=>{};let n=document.activeElement,r=`a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])`,i=n=>{if(n.key===`Escape`){n.preventDefault(),t();return}if(n.key!==`Tab`)return;let i=[...e.querySelectorAll(r)].filter(e=>e.offsetParent!==null||e===document.activeElement);if(!i.length)return;let a=i[0],o=i[i.length-1];n.shiftKey&&document.activeElement===a?(n.preventDefault(),o.focus()):!n.shiftKey&&document.activeElement===o&&(n.preventDefault(),a.focus())};return document.addEventListener(`keydown`,i),requestAnimationFrame(()=>{(e.querySelector(`[autofocus]`)||e.querySelector(r))?.focus()}),()=>{document.removeEventListener(`keydown`,i),n?.isConnected&&typeof n.focus==`function`&&n.focus()}}function Me(){if(!I.error&&!I.notice)return``;let e=!!I.error,t=e?`error`:`notice`,n=I.error||I.notice;return`<div class="alert ${t}" role="${e?`alert`:`status`}" aria-live="${e?`assertive`:`polite`}">${z(n)}</div>`}function H(){return`
    <header class="top">
      <a class="brand" href="/" aria-label="ECOEMS inicio">
        <span class="brand-mark">E</span>
        <span>ECOEMS <small>Plataforma</small></span>
      </a>
      <div class="top-actions">
        <span class="env-pill">${z(i)}</span>
        <span class="env-pill" title="Versión del build">${z(me)}</span>
        <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
      </div>
    </header>
  `}function Ne(){let e=I.dashboard?.privacy?.version||pe;return`
    <footer class="privacy-footer">
      <a href="${z(I.dashboard?.privacy?.url||`/privacidad.html`)}" target="_blank" rel="noopener">Aviso de privacidad</a>
      ${I.session?`
        <span aria-hidden="true">·</span>
        <button class="link-button" type="button" id="data-request-btn">Solicitar mis datos</button>
      `:``}
      <span aria-hidden="true">·</span>
      <span>Versión ${z(e)}</span>
      <span aria-hidden="true">·</span>
      <span>Documento en revisión legal</span>
    </footer>
  `}function Pe(){let e=localStorage.getItem(`ecoems_theme`);document.documentElement.setAttribute(`data-theme`,e===`light`?`light`:`dark`)}function Fe(){let e=(document.documentElement.getAttribute(`data-theme`)===`light`?`light`:`dark`)==`light`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`ecoems_theme`,e);let t=L.querySelector(`#theme-toggle`);t&&(t.textContent=e===`light`?`☀️`:`🌙`)}function Ie(){let e=L.querySelector(`#theme-toggle`);e&&(e.textContent=document.documentElement.getAttribute(`data-theme`)===`light`?`☀️`:`🌙`,e.addEventListener(`click`,Fe))}function Le(){L.innerHTML=`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="center">
        <div class="panel loading-panel">
          <div class="spinner" aria-hidden="true"></div>
          <p>Cargando sesión…</p>
        </div>
      </main>
    </div>
  `}function Re(){L.innerHTML=`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel config-panel">
          <span class="kicker">Fase 1 · base local</span>
          <h1>Falta conectar Supabase</h1>
          <p>La estructura del proyecto ya está creada. Para iniciar sesión, copia las llaves de tu proyecto de Supabase en el archivo <code>.env</code>.</p>
          <ol class="steps">
            <li>Copia <code>.env.example</code> a <code>.env</code>.</li>
            <li>Pega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            <li>Reinicia el servidor con <code>npm run dev</code>.</li>
          </ol>
          <pre><code>cp .env.example .env
npm run dev</code></pre>
          <p class="muted">El dominio de alumnos configurado es <strong>${z(e)}</strong>.</p>
          <div class="row">
            <span class="pill">Sin datos reales</span>
            <span class="pill">Sin llaves privadas en el frontend</span>
          </div>
        </section>
      </main>
    </div>
  `}function U(){let e=I.mode===`student`,t=I.mode===`guardian`,n=I.pendingLoginUsername||``;I.pendingLoginUsername=``,L.innerHTML=`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">Acceso al piloto</span>
          <h1>Entra a tu cuenta</h1>
          <p class="muted">Sin autorregistro. Las cuentas las crea el profesor o el administrador.</p>

          <div class="mode-tabs" role="tablist" aria-label="Tipo de acceso">
            <button class="mode-tab ${e?`active`:``}" data-mode="student" role="tab" aria-selected="${e}">Alumno</button>
            <button class="mode-tab ${I.mode===`teacher`?`active`:``}" data-mode="teacher" role="tab" aria-selected="${I.mode===`teacher`}">Profesor</button>
            <button class="mode-tab ${t?`active`:``}" data-mode="guardian" role="tab" aria-selected="${t}">Tutor</button>
          </div>

          ${Me()}

          <form id="login-form" class="form">
            ${e?`
              <label class="field">
                <span>Usuario</span>
                <input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ana.martinez o tu correo" value="${z(n)}" required>
              </label>
              <p class="hint">Entra con el usuario que te dio tu profesor, o con tu <strong>correo</strong> si ya tenías cuenta.</p>
              <label class="field">
                <span>Contraseña</span>
                <input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              </label>
            `:t?`
              <div class="guardian-login-note">
                <span class="card-label">Acceso para tutores</span>
                <h2>Usa tu enlace de acceso</h2>
                <p>Tu profesor te envía el enlace de acceso por <strong>correo electrónico</strong>. Ábrelo desde tu bandeja de entrada y entrarás directo, sin contraseña.</p>
                <p class="hint">¿El enlace venció o no lo tienes? Pídele a tu profesor que te reenvíe la invitación.</p>
              </div>
            `:`
              <label class="field">
                <span>Correo</span>
                <input name="email" type="email" autocomplete="email" placeholder="profesor@correo.com" required>
              </label>
              <label class="field">
                <span>Contraseña</span>
                <input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              </label>
            `}
            ${t?``:`
              <div class="row">
                <button class="btn primary" type="submit" id="submit-btn">Entrar</button>
                <button class="btn ghost" type="button" id="forgot-password-btn">Olvidé mi contraseña</button>
              </div>
            `}
          </form>

          <p class="fine-print">Recupera tu contraseña con tu correo registrado. Los tutores entran con el enlace que reciben por correo.</p>
          ${Ne()}
        </section>
      </main>
    </div>
  `,L.querySelectorAll(`[data-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{I.mode=e.dataset.mode,I.error=``,I.notice=``,U()})}),L.querySelector(`#login-form`).addEventListener(`submit`,$e),L.querySelector(`#forgot-password-btn`)?.addEventListener(`click`,Ve),Ie()}function ze(e){return`
    <div class="unit-assign-overlay" data-password-reset-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="password-reset-title">
        <button type="button" class="ficha-close" data-password-reset-close aria-label="Cerrar">✕</button>
        <header class="unit-assign-head">
          <span class="card-label">Recuperar acceso</span>
          <h2 id="password-reset-title">Restablece tu contraseña</h2>
          <p class="muted">Te enviaremos un enlace de un solo uso a tu correo registrado.</p>
        </header>
        <form id="password-reset-form" class="form">
          <label class="field">
            <span>Correo registrado</span>
            <input name="email" type="email" autocomplete="email" value="${z(e)}" placeholder="tu@correo.com" required>
          </label>
          <p class="hint">Si el correo existe en la plataforma, recibirás las instrucciones en unos minutos.</p>
          <div class="unit-assign-error" data-password-reset-error hidden></div>
          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-password-reset-close>Cancelar</button>
            <button type="submit" class="btn primary" id="password-reset-submit">Enviar enlace</button>
          </footer>
        </form>
      </section>
    </div>
  `}function Be(){let e=L.querySelector(`#login-form input[name="username"], #login-form input[name="email"]`),t=String(e?.value||``).trim();return t?t.includes(`@`)?t.toLowerCase():a(t):``}function Ve(){He(),document.body.insertAdjacentHTML(`beforeend`,ze(Be())),document.body.classList.add(`unit-assign-open`);let e=document.querySelector(`[data-password-reset-overlay]`);Ce=je(e,He),e.querySelectorAll(`[data-password-reset-close]`).forEach(e=>{e.addEventListener(`click`,He)}),e.addEventListener(`click`,t=>{t.target===e&&He()}),e.querySelector(`#password-reset-form`).addEventListener(`submit`,Ue)}function He(){Ce&&=(Ce(),null),document.querySelectorAll(`[data-password-reset-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function Ue(e){e.preventDefault();let t=e.currentTarget,n=String(new FormData(t).get(`email`)||``).trim().toLowerCase(),i=t.querySelector(`#password-reset-submit`),a=t.querySelector(`[data-password-reset-error]`);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n))a&&(a.textContent=`Escribe un correo válido.`,a.hidden=!1);else{i.disabled=!0,i.textContent=`Enviando…`;try{let{error:e}=await r.auth.resetPasswordForEmail(n,{redirectTo:window.location.href.split(`#`)[0]});if(e)throw e}catch{a&&(a.textContent=`No se pudo enviar el enlace. Intenta de nuevo en unos minutos.`,a.hidden=!1),i.disabled=!1,i.textContent=`Enviar enlace`;return}He(),V(`Si el correo está registrado, ya recibiste las instrucciones para crear tu contraseña.`),U()}}function We(){return`
    <div class="unit-assign-overlay" data-data-request-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="data-request-title">
        <button type="button" class="ficha-close" data-data-request-close aria-label="Cerrar">✕</button>
        <header class="unit-assign-head">
          <span class="card-label">Privacidad</span>
          <h2 id="data-request-title">Solicitar mis datos</h2>
          <p class="muted">Registramos tu solicitud con fecha y plazo de respuesta en el portal.</p>
        </header>
        <form id="data-request-form" class="form">
          <label class="field">
            <span>Tipo de solicitud</span>
            <select name="kind" required>
              <option value="access">Acceso a mis datos</option>
              <option value="rectification">Rectificación</option>
              <option value="cancellation">Cancelación</option>
              <option value="opposition">Oposición</option>
              <option value="portability">Portabilidad</option>
              <option value="revocation">Revocación de consentimiento</option>
            </select>
          </label>
          <label class="field">
            <span>Detalles (opcional)</span>
            <textarea name="details" rows="4" maxlength="2000" placeholder="Explica qué necesitas"></textarea>
          </label>
          <div class="unit-assign-error" data-data-request-error hidden></div>
          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-data-request-close>Cancelar</button>
            <button type="submit" class="btn primary">Enviar solicitud</button>
          </footer>
        </form>
      </section>
    </div>
  `}function Ge(){Ke(),document.body.insertAdjacentHTML(`beforeend`,We()),document.body.classList.add(`unit-assign-open`);let e=document.querySelector(`[data-data-request-overlay]`);we=je(e,Ke),e.querySelectorAll(`[data-data-request-close]`).forEach(e=>{e.addEventListener(`click`,Ke)}),e.addEventListener(`click`,t=>{t.target===e&&Ke()}),e.querySelector(`#data-request-form`).addEventListener(`submit`,qe)}function Ke(){we&&=(we(),null),document.querySelectorAll(`[data-data-request-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function qe(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),i=t.querySelector(`[data-data-request-error]`),a=t.querySelector(`button[type="submit"]`);a.disabled=!0,a.textContent=`Enviando…`;let o;try{let e=await r.rpc(`app_create_data_request`,{p_kind:String(n.get(`kind`)||``),p_details:String(n.get(`details`)||``).trim()||null});if(e.error)throw e.error;o=e.data}catch(e){i&&(i.textContent=e?.message||`No se pudo registrar la solicitud. Intenta de nuevo.`,i.hidden=!1),a.disabled=!1,a.textContent=`Enviar solicitud`;return}Ke(),V(`Solicitud registrada. Plazo de respuesta: ${q(String(o?.due_at||``).slice(0,10))}.`),$()}function W(){let e=I.profile?.full_name||``,t=!!I.passwordRecovery;L.innerHTML=`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">${t?`Recuperación de acceso`:`Primer ingreso`}</span>
          <h1>${t?`Elige una nueva contraseña`:`Hola, ${z(e.split(` `)[0]||`alumno`)} 👋`}</h1>
          <p class="muted">${t?`Usamos el enlace de recuperación que enviamos a tu correo. Crea una contraseña nueva para entrar.`:`Tu contraseña actual es temporal. Crea una nueva que solo tú conozcas para continuar.`}</p>

          ${Me()}

          <form id="change-password-form" class="form">
            <label class="field">
              <span>Nueva contraseña (mínimo 12 caracteres, con mayúscula, minúscula y número)</span>
              <input name="password" type="password" autocomplete="new-password" minlength="12" placeholder="Tu nueva contraseña" required>
            </label>
            <label class="field">
              <span>Confirma tu nueva contraseña</span>
              <input name="confirm" type="password" autocomplete="new-password" minlength="12" placeholder="Repite la contraseña" required>
            </label>
            <button class="btn primary" type="submit" id="change-password-btn">Guardar y continuar</button>
          </form>

          <p class="fine-print">Elige una contraseña que recuerdes: con ella entrarás a partir de ahora.</p>
          ${Ne()}
        </section>
      </main>
    </div>
  `,L.querySelector(`#change-password-form`).addEventListener(`submit`,Je),Ie()}async function Je(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),i=L.querySelector(`#change-password-btn`),a=String(n.get(`password`)||``),o=String(n.get(`confirm`)||``);if(I.error=``,I.notice=``,a.length<12)B(`La contraseña debe tener al menos 12 caracteres.`),W();else if(!/[a-z]/.test(a)||!/[A-Z]/.test(a)||!/\d/.test(a))B(`La contraseña debe incluir al menos una minúscula, una mayúscula y un número.`),W();else if(a!==o)B(`Las contraseñas no coinciden.`),W();else{i.disabled=!0,i.textContent=`Guardando…`;try{let{data:e,error:t}=await r.functions.invoke(`complete-password-change`,{body:{new_password:a}});if(t)throw t;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la contraseña`);I.profile={...I.profile||{},must_change_password:!1},I.passwordRecovery=!1,V(`Contraseña actualizada. ¡Bienvenido!`),I.view=`dashboard`,$(),await G(I.profile),tt()}catch(e){B(e?.message||`No se pudo actualizar la contraseña. Intenta de nuevo.`),W()}}}function Ye(){let e=new URL(window.location.href);e.searchParams.has(`link_token`)&&(e.searchParams.delete(`link_token`),window.history.replaceState({},``,e.pathname+e.search+e.hash))}function Xe(e){L.innerHTML=`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">Invitación de alumno</span>
          <h1>Crea tu contraseña</h1>
          <p class="muted">Tu profesor generó este enlace de un solo uso. Elige una contraseña que solo tú conozcas.</p>

          ${Me()}

          <form id="link-redeem-form" class="form">
            <label class="field">
              <span>Nueva contraseña (mínimo 12, con mayúscula, minúscula y número)</span>
              <input name="password" type="password" autocomplete="new-password" minlength="12" placeholder="Tu nueva contraseña" required>
            </label>
            <label class="field">
              <span>Confirma tu nueva contraseña</span>
              <input name="confirm" type="password" autocomplete="new-password" minlength="12" placeholder="Repite la contraseña" required>
            </label>
            <button class="btn primary" type="submit" id="link-redeem-btn">Guardar contraseña</button>
          </form>

          <p class="fine-print">Si el enlace venció, pide a tu profesor que genere uno nuevo.</p>
          <div class="row">
            <button class="btn ghost" type="button" id="link-redeem-cancel">Ya tengo contraseña</button>
          </div>
          ${Ne()}
        </section>
      </main>
    </div>
  `,L.querySelector(`#link-redeem-form`).addEventListener(`submit`,t=>{Ze(t,e)}),L.querySelector(`#link-redeem-cancel`).addEventListener(`click`,()=>{Ye(),I.error=``,I.notice=``,U()}),Ie()}async function Ze(e,t){e.preventDefault();let n=e.currentTarget,i=new FormData(n),a=L.querySelector(`#link-redeem-btn`),o=String(i.get(`password`)||``),s=String(i.get(`confirm`)||``);if(I.error=``,I.notice=``,o.length<12)B(`La contraseña debe tener al menos 12 caracteres.`),Xe(t);else if(!/[a-z]/.test(o)||!/[A-Z]/.test(o)||!/\d/.test(o))B(`La contraseña debe incluir al menos una minúscula, una mayúscula y un número.`),Xe(t);else if(o!==s)B(`Las contraseñas no coinciden.`),Xe(t);else{a.disabled=!0,a.textContent=`Guardando…`;try{let{data:e,error:n}=await r.functions.invoke(`redeem-student-link-token`,{body:{token:t,new_password:o}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo canjear la invitación`);Ye(),I.mode=`student`,I.pendingLoginUsername=e.username||e.email||``,V(`Contraseña creada. Entra con tu usuario ${e.username||e.email}.`),U()}catch(e){B(await Qe(e,`No se pudo canjear la invitación. Pide un enlace nuevo.`)),Xe(t)}}}async function Qe(e,t){try{let t=e?.context;if(t&&typeof t.clone==`function`){let e=await t.clone().json();if(e?.error)return String(e.error)}}catch{}return e?.message||t}async function $e(e){e.preventDefault();let t=e.currentTarget,n=L.querySelector(`#submit-btn`),i=new FormData(t);I.error=``,I.notice=``,n.disabled=!0,n.textContent=`Conectando…`;try{let e=String(i.get(`username`)||``).trim(),t=I.mode===`student`?e.includes(`@`)?e.toLowerCase():a(e):String(i.get(`email`)||``).trim().toLowerCase();if(!t)throw Error(`Escribe un usuario válido.`);let{data:n,error:o}=await r.auth.signInWithPassword({email:t,password:String(i.get(`password`)||``)});if(o)throw o;n.session&&await et(n.session)}catch(e){let t=String(e?.message||``);t.toLowerCase().includes(`invalid login`)?B(`Usuario o contraseña incorrectos.`):t.toLowerCase().includes(`email not confirmed`)?B(`La cuenta aún no está confirmada. Pide apoyo al administrador.`):t.toLowerCase().includes(`rate limit`)?B(`Demasiados intentos. Espera un momento y vuelve a probar.`):B(`No se pudo iniciar sesión. Revisa tus datos o consulta a soporte.`),U()}finally{n.disabled=!1,n.textContent=`Entrar`}}async function et(e){if(!e){I.session=null,I.profile=null,I.dashboard=null,I.dashboardError=``,I.view=`dashboard`,I.unitView=null,I.unitResults={},R=null,U();return}if(R===e.access_token)return;R=e.access_token,I.session=e;let{data:t,error:n}=await r.from(`profiles`).select(`id, role, full_name, username, email, active, must_change_password`).eq(`id`,e.user.id).maybeSingle();n?(R=null,B(`No se pudo cargar tu perfil. Revisa la conexión con Supabase.`),st(`No se pudo cargar el perfil`,I.error)):t?t.active?(I.profile=t,I.dashboard=null,I.dashboardError=``,I.view=`dashboard`,I.unitView=null,I.unitResults={},I.error=``,I.notice=``,t.must_change_password?(I.view=`change-password`,W()):($(),await G(t),tt())):(await r.auth.signOut(),R=null,B(`Tu cuenta está inactiva. Consulta a la institución.`),U()):(await r.auth.signOut(),R=null,B(`Tu cuenta existe, pero no tiene perfil. Pide al administrador que la complete.`),U())}async function G(e){try{let t=await nt(e);if(I.profile?.id!==e.id)return;I.dashboard=t,I.dashboardError=``}catch(t){if(I.profile?.id!==e.id)return;console.error(`dashboard_error`,t?.message||t),I.dashboard=null,I.dashboardError=`No se pudieron cargar los datos de tu panel. ${t?.message||``}`}$()}function tt(){let e=String(window.location.hash||``).replace(/^#\/?/,``).split(`?`)[0].toLowerCase();if([`examen`,`final-exam`,`vocacional`,`vocational`].includes(e)&&I.session&&I.profile&&I.view!==`change-password`){if(window.history.replaceState({},``,window.location.pathname+window.location.search),e===`examen`||e===`final-exam`){if(I.profile.role!==`student`)return;O(L,{onClose:()=>{$(),G(I.profile)}})}else window.location.assign(new URL(`vocacional.html`,window.location.href).href)}}function K(e){if(e)throw e}async function nt(e){return e.role===`admin`?rt():e.role===`teacher`?it(e.id):e.role===`guardian`?ot(e):at(e.id)}async function rt(){let[e,t,n,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T]=await Promise.all([r.from(`academic_years`).select(`name,starts_on,ends_on`).eq(`is_active`,!0).maybeSingle(),r.from(`groups`).select(`id,name,level,schedule,teacher_id`).order(`name`),r.from(`profiles`).select(`id,role,full_name,email,username,active,phone,created_at`).order(`created_at`),r.from(`students`).select(`id,student_code,group_id,profile_id,status`).order(`student_code`),r.from(`guardians`).select(`id,profile_id,email,full_name,phone,active`).order(`email`),r.from(`student_guardians`).select(`student_id,guardian_id`),r.from(`settings`).select(`key,value,updated_at,updated_by`).order(`key`),r.rpc(`app_admin_content_stats`),r.from(`units`).select(`id,subject_id,num,title,status`).order(`num`),r.rpc(`app_staff_dashboard`),r.rpc(`app_subject_board`),r.from(`student_profiles`).select(`*`),r.from(`terms`).select(`id,academic_year_id,name,starts_on,ends_on`).order(`starts_on`),r.from(`unit_assignments`).select(`id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at`),r.from(`unit_versions`).select(`id,unit_id,version,published_at`).not(`published_at`,`is`,null).order(`version`,{ascending:!1}),r.from(`student_unit_overrides`).select(`assignment_id,student_id,status,opens_at,closes_at`),r.rpc(`app_staff_tasks`),r.rpc(`app_activity_log`,{p_limit:80}),r.rpc(`app_external_accounts`),r.from(`student_billing`).select(`*`),r.from(`payments`).select(`id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason`).order(`paid_at`,{ascending:!1}).limit(600),r.from(`student_billing_status`).select(`*`),r.from(`audit_log`).select(`id,actor_id,action,entity_type,entity_id,created_at`).order(`created_at`,{ascending:!1}).limit(200),r.from(`data_requests`).select(`id,profile_id,student_id,kind,details,status,received_at,due_at,resolved_at,resolution`).order(`received_at`,{ascending:!1}).limit(200),r.from(`final_exam_sessions`).select(`id,student_id,subject_id,status,score,correct_answers,answered_questions,total_questions,duration_ms,started_at,finished_at`).order(`started_at`,{ascending:!1}).limit(300)]);K(e.error),K(t.error),K(n.error),K(i.error),K(a.error),K(o.error),K(s.error),K(c.error),K(l.error),K(u.error),K(d.error),K(f.error),K(p.error),K(m.error),K(h.error),K(g.error),K(_.error),K(v.error),K(y.error),K(b.error),K(x.error),K(S.error),K(C.error),K(w.error),K(T.error);let E=n.data||[],D=i.data||[],O=a.data||[],ee=t.data||[],te=l.data||[],k=new Map((c.data||[]).map(e=>[e.subject_id,e.subject_name])),A=new Map;for(let e of h.data||[])A.has(e.unit_id)||A.set(e.unit_id,[]),A.get(e.unit_id).push(e);let ne=te.filter(e=>e.status===`published`).map(e=>({...e,subject_name:k.get(e.subject_id)||e.subject_id,versions:A.get(e.id)||[]})),j=new Map;for(let e of g.data||[])j.has(e.assignment_id)||j.set(e.assignment_id,[]),j.get(e.assignment_id).push(e);let re=E.reduce((e,t)=>(e[t.role]=(e[t.role]||0)+1,e),{}),M=new Map(E.map(e=>[e.id,e.full_name])),ie=new Map(ee.map(e=>[e.id,e.name])),N=new Map(E.map(e=>[e.id,e.full_name])),ae=new Map(D.map(e=>[e.id,e.student_code])),oe=new Map(D.map(e=>[e.id,e])),se=new Map;for(let e of o.data||[])se.has(e.guardian_id)||se.set(e.guardian_id,[]),se.get(e.guardian_id).push(ae.get(e.student_id)||`?`);return{kind:`admin`,year:e.data,groups:ee.map(e=>({...e,teacher_name:N.get(e.teacher_id)||`Sin profesor`})),profiles:E,students:D.map(e=>({...e,full_name:M.get(e.profile_id)||`Alumno sin nombre`,group_name:ie.get(e.group_id)||`Sin grupo`})),guardians:O.map(e=>({...e,students:se.get(e.id)||[]})),settings:s.data||[],stats:c.data||[],units:te,overview:u.data||null,board:(d.data||{}).subjects||[],assignments:(m.data||[]).map(e=>({...e,overrides:j.get(e.id)||[]})),publishedUnits:ne,tasks:(_.data||{}).tasks||[],activity:(v.data||{}).entries||[],externalAccounts:y.data||[],billingByStudent:new Map((b.data||[]).map(e=>[e.student_id,e])),payments:x.data||[],billingStatusByStudent:new Map((S.data||[]).map(e=>[e.student_id,e])),auditLog:C.data||[],dataRequests:w.data||[],examSessions:(T.data||[]).map(e=>{let t=oe.get(e.student_id)||{};return{...e,student_name:M.get(t.profile_id)||`Alumno sin nombre`,student_code:ae.get(e.student_id)||`—`,group_name:ie.get(t.group_id)||`Sin grupo`}}),studentProfiles:new Map((f.data||[]).map(e=>[e.student_id,e])),terms:p.data||[],subjectNames:new Map((c.data||[]).map(e=>[e.subject_id,e.subject_name])),counts:{profiles:E.length,students:D.length,...re}}}async function it(e){let t=await r.from(`groups`).select(`id,name,level,schedule`).eq(`teacher_id`,e).order(`name`);K(t.error);let n=t.data||[],i=n.map(e=>e.id),a=[];if(i.length){let e=await r.from(`students`).select(`id,student_code,group_id,profile_id`).in(`group_id`,i).order(`student_code`);K(e.error),a=e.data||[]}let o=a.map(e=>e.id),s=[...new Set(a.map(e=>e.profile_id))],c=[];if(s.length){let e=await r.from(`profiles`).select(`id,full_name`).in(`id`,s);K(e.error),c=e.data||[]}let[l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E]=await Promise.all([r.from(`units`).select(`id,title,subject_id,estimated_minutes`).eq(`status`,`published`).order(`title`),r.from(`unit_versions`).select(`id,unit_id,version,published_at`).not(`published_at`,`is`,null).order(`version`,{ascending:!1}),i.length?r.from(`unit_assignments`).select(`id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at`).in(`group_id`,i).order(`created_at`,{ascending:!1}):Promise.resolve({data:[],error:null}),i.length?r.from(`student_unit_overrides`).select(`assignment_id,student_id,status,opens_at,closes_at`):Promise.resolve({data:[],error:null}),r.from(`subjects`).select(`id,name`).order(`name`),r.rpc(`app_staff_dashboard`),o.length?r.from(`student_stats`).select(`student_id,xp_total,current_streak,best_streak,units_completed,last_activity_date`).in(`student_id`,o):Promise.resolve({data:[],error:null}),o.length?r.from(`student_guardians`).select(`student_id,guardian_id`).in(`student_id`,o):Promise.resolve({data:[],error:null}),r.from(`guardians`).select(`id,full_name,email,phone,relationship`),r.rpc(`app_subject_board`),o.length?r.from(`student_profiles`).select(`*`).in(`student_id`,o):Promise.resolve({data:[],error:null}),r.from(`terms`).select(`id,academic_year_id,name,starts_on,ends_on`).order(`starts_on`),r.rpc(`app_staff_tasks`),r.rpc(`app_activity_log`,{p_limit:80}),o.length?r.from(`student_billing`).select(`*`).in(`student_id`,o):Promise.resolve({data:[],error:null}),o.length?r.from(`payments`).select(`id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason`).in(`student_id`,o).order(`paid_at`,{ascending:!1}).limit(400):Promise.resolve({data:[],error:null}),o.length?r.from(`student_billing_status`).select(`*`).in(`student_id`,o):Promise.resolve({data:[],error:null}),o.length?r.from(`final_exam_sessions`).select(`id,student_id,subject_id,status,score,correct_answers,answered_questions,total_questions,duration_ms,started_at,finished_at`).in(`student_id`,o).order(`started_at`,{ascending:!1}).limit(300):Promise.resolve({data:[],error:null})]);K(l.error),K(u.error),K(d.error),K(f.error),K(p.error),K(m.error),K(h.error),K(g.error),K(_.error),K(v.error),K(y.error),K(b.error),K(x.error),K(S.error),K(C.error),K(w.error),K(T.error),K(E.error);let D=new Map(c.map(e=>[e.id,e.full_name])),O=new Map(a.map(e=>[e.id,e])),ee=new Map(n.map(e=>[e.id,e.name])),te=new Map((p.data||[]).map(e=>[e.id,e.name])),k=new Map;for(let e of u.data||[])k.has(e.unit_id)||k.set(e.unit_id,[]),k.get(e.unit_id).push(e);let A=(l.data||[]).map(e=>({...e,subject_name:te.get(e.subject_id)||e.subject_id,versions:k.get(e.id)||[]})),ne=new Map(A.map(e=>[e.id,e.title])),j=new Map;for(let e of f.data||[])j.has(e.assignment_id)||j.set(e.assignment_id,[]),j.get(e.assignment_id).push(e);let re=(d.data||[]).map(e=>({...e,unit_title:ne.get(e.unit_id)||`Unidad`,overrides:j.get(e.id)||[]})),M=new Map((h.data||[]).map(e=>[e.student_id,e])),ie=new Map((_.data||[]).map(e=>[e.id,e])),N=new Map;for(let e of g.data||[]){N.has(e.student_id)||N.set(e.student_id,[]);let t=ie.get(e.guardian_id);t&&N.get(e.student_id).push(t)}return{kind:`teacher`,overview:m.data||null,board:(v.data||{}).subjects||[],tasks:(x.data||{}).tasks||[],activity:(S.data||{}).entries||[],billingByStudent:new Map((C.data||[]).map(e=>[e.student_id,e])),payments:w.data||[],billingStatusByStudent:new Map((T.data||[]).map(e=>[e.student_id,e])),examSessions:(E.data||[]).map(e=>{let t=O.get(e.student_id)||{};return{...e,student_name:D.get(t.profile_id)||`Alumno sin nombre`,student_code:t.student_code||`—`,group_name:ee.get(t.group_id)||`Sin grupo`}}),studentProfiles:new Map((y.data||[]).map(e=>[e.student_id,e])),terms:b.data||[],groups:n.map(e=>({...e,students:a.filter(t=>t.group_id===e.id).map(e=>({...e,full_name:D.get(e.profile_id)||`Alumno sin nombre`,stats:M.get(e.id)||null,guardians:N.get(e.id)||[]}))})),students:n.map(e=>({...e,students:a.filter(t=>t.group_id===e.id).map(t=>({...t,full_name:D.get(t.profile_id)||`Alumno sin nombre`,stats:M.get(t.id)||null,guardians:N.get(t.id)||[],group_name:e.name}))})).flatMap(e=>e.students),publishedUnits:A,assignments:re}}async function at(e){let t=await r.from(`students`).select(`id,student_code,group_id,status`).eq(`profile_id`,e).maybeSingle();if(K(t.error),!t.data)return{kind:`student`,student:null,group:null,units:[],activeAssignments:0};let[n,i,a]=await Promise.all([r.from(`groups`).select(`name,level,schedule`).eq(`id`,t.data.group_id).maybeSingle(),r.from(`unit_assignments`).select(`id,unit_id,unit_version_id,instructions,opens_at,closes_at,status,visible`).eq(`group_id`,t.data.group_id).in(`status`,[`active`,`closed`]).eq(`visible`,!0).order(`created_at`),r.from(`student_guidance`).select(`*`).eq(`student_id`,t.data.id).maybeSingle()]);K(n.error),K(i.error),K(a.error);let o=i.data||[],s=o.map(e=>e.id),c=[];if(s.length){let e=await r.from(`student_unit_overrides`).select(`assignment_id,status,opens_at,closes_at`).eq(`student_id`,t.data.id).in(`assignment_id`,s);K(e.error),c=e.data||[]}let l=new Map(c.map(e=>[e.assignment_id,e])),u=Date.now(),d=o.filter(e=>{let t=l.get(e.id);if((t?.status||e.status)!==`active`)return!1;let n=t?.opens_at||e.opens_at,r=t?.closes_at||e.closes_at;return!(n&&new Date(n).getTime()>u||r&&new Date(r).getTime()<=u)}),f=[...new Set(d.map(e=>e.unit_id))],p=d.map(e=>e.id),m=[],h=[],g=[];if(f.length){let[e,n,i]=await Promise.all([r.from(`units`).select(`id,title,subject_id,estimated_minutes`).in(`id`,f),r.from(`subjects`).select(`id,name`).order(`name`),r.from(`unit_progress`).select(`assignment_id,status,attempts_count,best_accuracy,completed_at`).eq(`student_id`,t.data.id).in(`assignment_id`,p)]);K(e.error),K(n.error),K(i.error),m=e.data||[],h=n.data||[],g=i.data||[]}let _=new Map(m.map(e=>[e.id,e])),v=new Map(h.map(e=>[e.id,e.name])),y=new Map(g.map(e=>[e.assignment_id,e])),b=d.map(e=>{let t=_.get(e.unit_id);return{...e,unit:t?{...t,subject_name:v.get(t.subject_id)||t.subject_id}:null,progress:y.get(e.id)||null}}),x=await T();return{kind:`student`,student:t.data,group:n.data,profile:a.data||{},units:b,activeAssignments:b.length,exam:x}}async function ot(e){let[t,n]=await Promise.all([r.from(`guardians`).select(`id`).eq(`profile_id`,e.id).maybeSingle(),r.from(`privacy_document`).select(`version,url,sha256`).maybeSingle()]);K(t.error);let i=n.error||!n.data?{version:pe,url:`/privacidad.html`,sha256:``}:n.data,a=t.data?.id;if(!a)return{kind:`guardian`,privacy:i,billingByStudent:new Map,payments:[],children:[],pending:[]};let o=await r.from(`student_guardians`).select(`student_id`).eq(`guardian_id`,a).order(`student_id`);K(o.error);let s=[...new Set((o.data||[]).map(e=>e.student_id))];if(!s.length)return{kind:`guardian`,privacy:i,billingByStudent:new Map,payments:[],children:[],pending:[]};let c=await r.from(`privacy_consents`).select(`student_id,document_version,accepted_at,revoked_at`).eq(`guardian_id`,a).in(`student_id`,s);K(c.error);let l=i.version||pe,u=new Map;for(let e of c.data||[])e.document_version===l&&!e.revoked_at&&u.set(e.student_id,e);let d=s.filter(e=>u.has(e)),f=s.filter(e=>!u.has(e)),p=d.length?await r.from(`students`).select(`id,student_code,group_id,profile_id`).in(`id`,d).order(`student_code`):{data:[],error:null};K(p.error);let m=p.data||[],h=[...new Set(m.map(e=>e.profile_id))],g=[...new Set(m.map(e=>e.group_id))],_=m.map(e=>e.id),[v,y,b,x,S,C,w,T,E,D,O,ee,te,k,A,ne,j]=await Promise.all([h.length?r.from(`profiles`).select(`id,full_name`).in(`id`,h):Promise.resolve({data:[],error:null}),g.length?r.from(`groups`).select(`id,name`).in(`id`,g):Promise.resolve({data:[],error:null}),_.length?r.from(`student_billing`).select(`*`).in(`student_id`,_):Promise.resolve({data:[],error:null}),_.length?r.from(`payments`).select(`id,student_id,amount,paid_at,method,period,period_start,period_end,status,receipt_no,voided_at,void_reason`).in(`student_id`,_).order(`paid_at`,{ascending:!1}).limit(120):Promise.resolve({data:[],error:null}),_.length?r.from(`student_billing_status`).select(`*`).in(`student_id`,_):Promise.resolve({data:[],error:null}),_.length?r.from(`student_guidance`).select(`*`).in(`student_id`,_):Promise.resolve({data:[],error:null}),_.length?r.from(`unit_progress`).select(`student_id,assignment_id,status,best_accuracy,completed_at,attempts_count`).in(`student_id`,_):Promise.resolve({data:[],error:null}),g.length?r.from(`unit_assignments`).select(`id,group_id,unit_id,status,visible,opens_at,closes_at`).in(`group_id`,g):Promise.resolve({data:[],error:null}),_.length?r.from(`grades`).select(`student_id,assessment_id,score,status,notes,recorded_at`).in(`student_id`,_):Promise.resolve({data:[],error:null}),g.length?r.from(`assessments`).select(`id,group_id,subject_id,name,type,max_score,assessment_date`).in(`group_id`,g):Promise.resolve({data:[],error:null}),_.length?r.from(`attendance`).select(`student_id,session_id,status,minutes_late`).in(`student_id`,_):Promise.resolve({data:[],error:null}),g.length?r.from(`attendance_sessions`).select(`id,group_id,session_date,topic`).in(`group_id`,g):Promise.resolve({data:[],error:null}),_.length?r.from(`observations`).select(`student_id,category,body,created_at`).in(`student_id`,_).eq(`visibility`,`family`):Promise.resolve({data:[],error:null}),g.length?r.from(`tasks`).select(`id,group_id,subject_id,title,due_at,max_score,task_type`).in(`group_id`,g).is(`archived_at`,null):Promise.resolve({data:[],error:null}),_.length?r.from(`task_submissions`).select(`task_id,student_id,status,score,feedback,submitted_at`).in(`student_id`,_):Promise.resolve({data:[],error:null}),_.length?r.from(`student_stats`).select(`student_id,xp_total,units_completed,units_mastered,accuracy,reading_wpm,reading_comprehension`).in(`student_id`,_):Promise.resolve({data:[],error:null}),r.from(`subjects`).select(`id,name`).order(`name`)]);K(v.error),K(y.error),K(b.error),K(x.error),K(S.error),K(C.error),K(w.error),K(T.error),K(E.error),K(D.error),K(O.error),K(ee.error),K(te.error),K(k.error),K(A.error),K(ne.error),K(j.error);let re=[...new Set((T.data||[]).map(e=>e.unit_id).filter(Boolean))],M=re.length?await r.from(`units`).select(`id,title,subject_id`).in(`id`,re):{data:[],error:null};K(M.error);let ie=new Map((v.data||[]).map(e=>[e.id,e.full_name])),N=new Map((y.data||[]).map(e=>[e.id,e.name])),ae=new Map((j.data||[]).map(e=>[e.id,e.name])),oe=new Map((M.data||[]).map(e=>[e.id,e])),se=new Map((T.data||[]).map(e=>[e.id,e])),ce=new Map((D.data||[]).map(e=>[e.id,e])),le=new Map((ee.data||[]).map(e=>[e.id,e]));new Map((k.data||[]).map(e=>[e.id,e]));let ue=new Map((C.data||[]).map(e=>[e.student_id,e])),de=new Map((ne.data||[]).map(e=>[e.student_id,e])),P=(e,t)=>{let n=new Map;for(let r of e||[]){let e=r[t];n.has(e)||n.set(e,[]),n.get(e).push(r)}return n},fe=P(w.data,`student_id`),me=P(E.data,`student_id`),he=P(O.data,`student_id`),ge=P(te.data,`student_id`),_e=P(A.data,`student_id`),ve=new Map(m.map(e=>{let t=(fe.get(e.id)||[]).map(e=>{let t=se.get(e.assignment_id),n=t?oe.get(t.unit_id):null;return{...e,unit_title:n?.title||`Unidad`,subject_name:n?ae.get(n.subject_id)||n.subject_id:``,opens_at:t?.opens_at||null,closes_at:t?.closes_at||null}}),n=(me.get(e.id)||[]).map(e=>{let t=ce.get(e.assessment_id);return{...e,assessment_name:t?.name||`Evaluación`,subject_name:t?ae.get(t.subject_id)||t.subject_id:``,max_score:t?.max_score??null,assessment_date:t?.assessment_date||null}}).sort((e,t)=>String(t.assessment_date||``).localeCompare(String(e.assessment_date||``))),r=(he.get(e.id)||[]).map(e=>{let t=le.get(e.session_id);return{...e,session_date:t?.session_date||null,topic:t?.topic||``}}).sort((e,t)=>String(t.session_date||``).localeCompare(String(e.session_date||``))),i=(ge.get(e.id)||[]).slice().sort((e,t)=>String(t.created_at||``).localeCompare(String(e.created_at||``))),a=_e.get(e.id)||[],o=(k.data||[]).filter(t=>t.group_id===e.group_id).map(e=>({...e,subject_name:ae.get(e.subject_id)||e.subject_id,submission:a.find(t=>t.task_id===e.id)||null})).sort((e,t)=>String(e.due_at||``).localeCompare(String(t.due_at||``)));return[e.id,{guidance:ue.get(e.id)||{},stats:de.get(e.id)||{},progress:t,grades:n,attendance:r,observations:i,tasks:o}]}));return{kind:`guardian`,privacy:i,billingByStudent:new Map((b.data||[]).map(e=>[e.student_id,e])),payments:x.data||[],billingStatusByStudent:new Map((S.data||[]).map(e=>[e.student_id,e])),academics:ve,children:m.map(e=>({...e,full_name:ie.get(e.profile_id)||`Alumno sin nombre`,group_name:N.get(e.group_id)||`Sin grupo`,consent_accepted:!0,consent_accepted_at:u.get(e.id)?.accepted_at||null})),pending:f.map((e,t)=>({id:e,label:f.length===1?`el alumno vinculado`:`el alumno ${t+1}`}))}}function st(e,t){L.innerHTML=`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel config-panel">
          <span class="kicker">Error de acceso</span>
          <h1>${z(e)}</h1>
          <p>${z(t)}</p>
          <div class="row">
            <button class="btn primary" id="retry-btn">Reintentar</button>
            <button class="btn ghost" id="fatal-logout">Cerrar sesión</button>
          </div>
        </section>
      </main>
    </div>
  `,L.querySelector(`#retry-btn`).addEventListener(`click`,()=>{I.error=``,Le(),r.auth.getSession().then(({data:e})=>{e.session?et(e.session):U()})}),L.querySelector(`#fatal-logout`).addEventListener(`click`,ti)}function q(e){if(!e)return``;let[t,n,r]=String(e).split(`-`).map(Number);return!t||!n||!r?String(e):new Intl.DateTimeFormat(`es-MX`,{day:`2-digit`,month:`short`,year:`numeric`,timeZone:`UTC`}).format(new Date(Date.UTC(t,n-1,r)))}function ct(e,t,n){return`${e} ${e===1?t:n}`}function lt(e){return wt(e)}function ut(e){let t=e.profiles.filter(e=>e.role===`teacher`),n=e.guardians,r=e.externalAccounts||[],i=new Set((e.students||[]).map(e=>e.profile_id)),a=e.profiles.filter(e=>e.role===`student`&&!i.has(e.id));return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Profesores y admin</span>
          <h2>${t.length?ct(t.length,`profesor`,`profesores`):`Sin profesores`}</h2>
        </div>
      </div>
      <ul class="data-list">
        ${e.profiles.filter(e=>e.role===`teacher`||e.role===`admin`).map(e=>`
    <li>
      <div>
        <strong>${z(e.full_name)}${e.role===`admin`?` · Tú`:``}</strong>
        <small>${z(e.email||e.username||`Sin identificador`)}</small>
      </div>
      ${e.role===`admin`?`
        <span class="pill success">Activo</span>
      `:`
        <button class="btn ghost" data-toggle-user="${z(e.id)}" data-active="${e.active?`1`:`0`}">
          ${e.active?`Desactivar`:`Activar`}
        </button>
      `}
    </li>
  `).join(``)}
      </ul>

      <details class="admin-details">
        <summary>Crear profesor</summary>
        <form class="form" id="create-teacher-form">
          <label class="field">
            <span>Nombre completo</span>
            <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
          </label>
          <label class="field">
            <span>Correo</span>
            <input name="email" type="email" autocomplete="off" placeholder="profesor@colegio.mx" required>
          </label>
          <label class="field">
            <span>Contraseña (mínimo 12, con mayúscula, minúscula y número)</span>
            <input name="password" type="text" autocomplete="off" minlength="12" placeholder="Contraseña temporal" required>
          </label>
          <button class="btn primary" type="submit">Crear profesor</button>
        </form>
      </details>
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Alumnos</span>
          <h2>${e.students.length?ct(e.students.length,`alumno`,`alumnos`):`Sin alumnos`}</h2>
        </div>
      </div>
      ${e.students.length?`
        <ul class="data-list">
          ${e.students.map(e=>`
            <li>
              <div>
                <strong>${z(e.full_name)}</strong>
                <small>${z(e.student_code)} · ${z(e.group_name)} · ${z(e.status)}</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-reset-student="${z(e.id)}" data-student-name="${z(e.full_name)}">Nueva contraseña</button>
                <button class="btn ghost" data-reissue-invite="${z(e.id)}" data-student-name="${z(e.full_name)}">Enlace de acceso</button>
              </div>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay alumnos.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Tutores</span>
          <h2>${n.length?ct(n.length,`tutor`,`tutores`):`Sin tutores`}</h2>
        </div>
      </div>
      ${n.length?`
        <ul class="data-list">
          ${n.map(e=>`
            <li>
              <div>
                <strong>${z(e.full_name)}</strong>
                <small>${z(e.email||e.phone||`Sin contacto`)} · Alumnos: ${e.students.map(z).join(`, `)||`—`}</small>
              </div>
              <span class="pill ${e.active?`success`:``}">${e.active?`Activo`:`Inactivo`}</span>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay tutores. Invítalos desde el panel del profesor.</p>`}
    </article>

    ${dt(r,a)}
  `}function dt(e,t){return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Detección de colados</span>
          <h2>Cuentas externas</h2>
        </div>
        <span class="pill ${e.length?`pill-red`:`success`}">${e.length?ct(e.length,`cuenta`,`cuentas`):`Ninguna`}</span>
      </div>
      <p class="muted">Cuentas creadas fuera de la plataforma (sin perfil ni grupo). No pueden ver nada del curso. Aquí puedes <strong>bloquearlas</strong> o vincularlas desde el alta de alumnos con su correo.</p>
      ${e.length?`
        <ul class="data-list">
          ${e.map(e=>`
            <li>
              <div>
                <strong>${z(e.email)}</strong>
                <small>
                  ${e.banned?`⛔ Bloqueada`:e.email_confirmed?`Correo confirmado`:`⚠️ Correo sin confirmar`}
                  · Creada ${z(J(e.created_at))}
                  · Último acceso: ${e.last_sign_in_at?z(J(e.last_sign_in_at)):`nunca`}
                </small>
              </div>
              <button class="btn ghost ${e.banned?``:`danger`}" data-ban-account="${z(e.id)}" data-ban="${e.banned?`0`:`1`}">
                ${e.banned?`Desbloquear`:`Bloquear`}
              </button>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">No hay cuentas externas detectadas. ¡Nadie colado! ✅</p>`}
    </article>

    ${t.length?`
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Revisar</span>
            <h2>Perfiles de alumno sin ficha vinculada</h2>
          </div>
          <span class="pill pill-amber">${t.length}</span>
        </div>
        <ul class="data-list">
          ${t.map(e=>`
            <li>
              <div>
                <strong>${z(e.full_name)}</strong>
                <small>${z(e.email||e.username||`Sin identificador`)} · Sin ficha de alumno en ningún grupo</small>
              </div>
              <button class="btn ghost" data-toggle-user="${z(e.id)}" data-active="${e.active?`1`:`0`}">
                ${e.active?`Desactivar`:`Activar`}
              </button>
            </li>
          `).join(``)}
        </ul>
      </article>
    `:``}
  `}function ft(e){let t=new Map;for(let n of e.units)t.has(n.subject_id)||t.set(n.subject_id,[]),t.get(n.subject_id).push(n);return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Contenido</span>
          <h2>Materias y unidades</h2>
        </div>
        <span class="pill">Versión 1 publicada</span>
      </div>
      ${e.stats.length?`
        <ul class="data-list">
          ${e.stats.map(e=>`
            <li>
              <div>
                <strong>${z(e.subject_name)}</strong>
                <small>
                  ${e.units_total} unidades · ${e.units_published} publicadas ·
                  ${e.exercises} ejercicios · ${e.quiz_count} quiz · ${Number(e.has_reto)>0?`con reto`:`sin reto`}
                </small>
              </div>
              <span class="pill ${e.subject_active?`success`:``}">${e.subject_active?`Activa`:`Inactiva`}</span>
            </li>
            ${(t.get(e.subject_id)||[]).map(e=>`
              <li class="unit-row">
                <div>
                  <small>U${String(e.num).padStart(2,`0`)} · ${z(e.title)}</small>
                </div>
                <span class="pill ${e.status===`published`?`success`:``}">${z(e.status)}</span>
              </li>
            `).join(``)}
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Sin estadísticas de contenido.</p>`}
    </article>
  `}var pt={access:`Acceso`,rectification:`Rectificación`,cancellation:`Cancelación`,opposition:`Oposición`,portability:`Portabilidad`,revocation:`Revocación`},mt={received:`Recibida`,in_progress:`En proceso`,resolved:`Resuelta`,rejected:`Rechazada`};function ht(e){let t=e.auditLog||[],n=e.dataRequests||[],r=new Map((e.profiles||[]).map(e=>[e.id,e.full_name||e.email||e.id]));return`
    <div class="section-title">
      <div>
        <span class="card-label">Gobierno</span>
        <h2>Auditoría y solicitudes ARCO</h2>
      </div>
      <span class="pill">${t.length} eventos · ${n.length} solicitudes</span>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">PRIV-06</span>
          <h2>Solicitudes de datos</h2>
        </div>
      </div>
      ${n.length?`
        <ul class="data-list audit-list">
          ${n.map(e=>`
            <li>
              <div>
                <strong>${z(pt[e.kind]||e.kind)} · ${z(mt[e.status]||e.status)}</strong>
                <small>Recibida: ${z(q(String(e.received_at).slice(0,10)))} · Plazo: ${z(q(String(e.due_at).slice(0,10)))}${e.resolved_at?` · Resuelta: ${z(q(String(e.resolved_at).slice(0,10)))}`:``}</small>
                ${e.details?`<p>${z(e.details)}</p>`:``}
                ${e.resolution?`<p class="muted"><strong>Resolución:</strong> ${z(e.resolution)}</p>`:``}
              </div>
              ${e.status===`received`||e.status===`in_progress`?`
                <div class="row">
                  <select data-request-status="${z(e.id)}" aria-label="Nuevo estado">
                    <option value="in_progress">En proceso</option>
                    <option value="resolved">Resuelta</option>
                    <option value="rejected">Rechazada</option>
                  </select>
                  <input data-request-resolution="${z(e.id)}" placeholder="Motivo de la resolución" minlength="10" aria-label="Motivo de la resolución">
                  <button class="btn primary" data-resolve-request="${z(e.id)}">Resolver</button>
                </div>
              `:``}
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">No hay solicitudes registradas.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">SEC-07</span>
          <h2>Registro de acciones</h2>
        </div>
      </div>
      ${t.length?`
        <ul class="data-list audit-list">
          ${t.map(e=>`
            <li>
              <div>
                <strong>${z(e.action)}</strong>
                <small>${z(r.get(e.actor_id)||`Sistema`)} · ${z(e.entity_type)}${e.entity_id?` · ${z(e.entity_id)}`:``}</small>
              </div>
              <span class="pill">${z(q(String(e.created_at).slice(0,10)))}</span>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Todavía no hay eventos auditados.</p>`}
    </article>
  `}async function gt(e){let t=e.dataset.resolveRequest,n=L.querySelector(`[data-request-status="${t}"]`)?.value,i=String(L.querySelector(`[data-request-resolution="${t}"]`)?.value||``).trim();if(n!==`in_progress`&&n!==`resolved`&&n!==`rejected`){B(`Selecciona un estado válido.`),$();return}if(n!==`in_progress`&&i.length<10){B(`Escribe una resolución de al menos 10 caracteres.`),$();return}e.disabled=!0,e.textContent=`Guardando…`;let{error:a}=await r.rpc(`app_resolve_data_request`,{p_request_id:t,p_status:n,p_resolution:i||`Solicitud tomada en atención.`});a?B(a.message||`No se pudo actualizar la solicitud.`):V(`Solicitud actualizada y registrada en auditoría.`),$(),await G(I.profile)}function _t(e){return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Configuración</span>
          <h2>Parámetros del sistema</h2>
        </div>
      </div>
      ${e.settings.length?`
        <ul class="data-list settings-list">
          ${e.settings.map(e=>`
            <li>
              <div>
                <strong>${z(e.key)}</strong>
                <small>Actualizado: ${z(e.updated_at?new Date(e.updated_at).toLocaleString():`—`)}</small>
              </div>
              <div class="row setting-edit">
                <input data-setting-value="${z(e.key)}" value="${z(JSON.stringify(e.value))}">
                <button class="btn primary" data-save-setting="${z(e.key)}">Guardar</button>
              </div>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">Sin parámetros configurados.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Entorno</span>
          <h2>Información técnica</h2>
        </div>
      </div>
      <ul class="data-list">
        <li><div><strong>App</strong><small>${z(i)} · GitHub Pages</small></div></li>
        <li><div><strong>Supabase</strong><small>${z(vt())}</small></div></li>
        <li><div><strong>Aviso de privacidad vigente</strong><small>${z(pe)}</small></div></li>
      </ul>
    </article>
  `}function vt(){try{return new URL(`https://ioikcrdxneuydylyhvwi.supabase.co`).host}catch{return`sin configurar`}}function yt(e){if(!e)return``;let t=new Date(`${String(e).slice(0,10)}T12:00:00`);return Number.isNaN(t.getTime())?``:t.toLocaleDateString(`es-MX`,{weekday:`short`,day:`numeric`})}function J(e){if(!e)return``;let t=new Date(e);if(Number.isNaN(t.getTime()))return``;let n=Math.max(0,Math.round((Date.now()-t.getTime())/1e3));if(n<60)return`ahora`;let r=Math.round(n/60);if(r<60)return`hace ${r} min`;let i=Math.round(r/60);if(i<24)return`hace ${i} h`;let a=Math.round(i/24);return a===1?`ayer`:a<30?`hace ${a} días`:t.toLocaleDateString(`es-MX`)}function bt(e){let t=[],n=e?.pending_consent||[],r=e?.inactive_students||[],i=e?.assignments_ending_soon||[];n.length&&t.push(`
      <div class="attention-item">
        <span class="dot dot-amber"></span>
        <div><strong>${n.length} ${n.length===1?`tutor sin consentimiento`:`tutores sin consentimiento`}</strong>
        <div class="muted"><small>${n.slice(0,4).map(e=>`${z(e.student)} · ${z(e.guardian)}`).join(` · `)}${n.length>4?`…`:``}</small></div></div>
      </div>
    `);for(let e of r.slice(0,3))t.push(`
      <div class="attention-item">
        <span class="dot dot-red"></span>
        <div><strong>${z(e.name||e.student)}</strong> sin actividad reciente
        <div class="muted"><small>${e.days?`última actividad hace ${e.days} días`:`sin actividad registrada`} · ${z(e.student)}</small></div></div>
      </div>
    `);r.length>3&&t.push(`
      <div class="attention-item"><span class="dot dot-red"></span>
      <div><strong>${r.length-3} alumnos más</strong> sin actividad reciente.</div></div>
    `),e?.attendance_missing_today&&t.push(`
      <div class="attention-item"><span class="dot dot-blue"></span>
      <div><strong>Asistencia de hoy sin registrar</strong>
      <div class="muted"><small>Pásala en la sección de asistencia del grupo.</small></div></div></div>
    `),e?.units_without_assignments>0&&t.push(`
      <div class="attention-item"><span class="dot dot-blue"></span>
      <div><strong>${e.units_without_assignments} unidades publicadas sin activar</strong>
      <div class="muted"><small>Actívalas desde la sección de unidades del grupo.</small></div></div></div>
    `);for(let e of i.slice(0,3))t.push(`
      <div class="attention-item"><span class="dot dot-amber"></span>
      <div><strong>«${z(e.unit)}» por cerrar</strong>
      <div class="muted"><small>${z(e.group)} · cierra ${z(q(String(e.closes).slice(0,10)))}</small></div></div>
    `);return t.length?t.join(``):`<div class="attention-item"><span class="dot dot-green"></span><div><strong>Todo en orden 🎉</strong><div class="muted"><small>No hay pendientes que requieran tu atención.</small></div></div></div>`}function xt(e){let t=Array.isArray(e)?e:[];return t.length?`
    <div class="feed-list">
      ${t.map(e=>`
        <div class="feed-item">
          <span class="feed-emoji">${e.kind===`completed`?`🏆`:`✏️`}</span>
          <div>
            <strong>${z(e.name||e.student)}</strong> ${z(e.text)}
            <div><small>${z(e.student)} · ${z(J(e.ts))}</small></div>
          </div>
          <span class="${e.ok?`feed-ok`:`feed-bad`}">${e.ok?`✓`:`✗`}</span>
        </div>
      `).join(``)}
    </div>
  `:`<p class="empty-state">Todavía no hay actividad reciente. Cuando los alumnos trabajen, aparecerá aquí.</p>`}function St(e){if(!e)return``;let t=e.counts||{},n=e.activity||{};return`
    <div class="dash-stats">
      <div class="stat-card stat-blue"><span class="stat-num">${t.students??0}</span><span class="stat-label">Alumnos activos</span></div>
      <div class="stat-card stat-violet"><span class="stat-num">${t.published_units??0}</span><span class="stat-label">Unidades publicadas</span></div>
      <div class="stat-card stat-green"><span class="stat-num">${n.today_attempts??0}</span><span class="stat-label">Intentos hoy</span></div>
      <div class="stat-card stat-amber"><span class="stat-num">${n.week_completions??0}</span><span class="stat-label">Completadas · 7 días</span></div>
      <div class="stat-card stat-pink"><span class="stat-num">${n.xp_total??0}</span><span class="stat-label">XP del grupo</span></div>
    </div>
  `}function Ct(e){if(!e)return``;let t=e.activity||{},n=Array.isArray(t.series)?t.series:[],r=Math.max(1,...n.map(e=>Math.max(e.attempts||0,e.completions||0)));return`
    <div class="dash-grid">
      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Actividad</span><h2>Últimos 7 días</h2></div>
          <span class="pill pill-blue">${t.week_attempts??0} intentos</span>
        </div>
        <div class="mini-chart">
          ${n.map(e=>`
            <div class="bar-wrap">
              <span class="bar-count">${e.attempts||0}</span>
              <div class="bar" style="height:${Math.max(3,Math.round((e.attempts||0)/r*100))}%"></div>
              <span class="bar-label">${z(yt(e.day))}</span>
            </div>
          `).join(``)}
        </div>
      </article>

      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Recordatorios</span><h2>Requiere tu atención</h2></div>
        </div>
        <div class="attention-list">${bt(e.attention)}</div>
      </article>
    </div>
  `}function wt(e){let t=I.profile?.role===`admin`,n=I.staffTab||`dashboard`,r=!!I.sidebarCollapsed;return`
    <div class="staff-app ${r?`collapsed`:``}">
      <aside class="staff-sidebar" aria-label="Secciones">
        <a class="brand staff-brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span class="brand-copy">ECOEMS <small>Plataforma</small></span>
        </a>

        <nav class="staff-nav">
          <span class="side-label">${t?`Administración`:`Mi espacio`}</span>
          ${(t?[`dashboard`,`alumnos`,`examen`,`materias`,`asistencia`,`pagos`,`tareas`,`actividad`,`usuarios`,`contenido`,`auditoria`,`configuracion`]:[`dashboard`,`alumnos`,`examen`,`materias`,`asistencia`,`pagos`,`tareas`,`actividad`,`tutores`]).map(e=>{let t=Oe(ge[e]);return`
              <button class="staff-tab-btn ${n===e?`active`:``}" data-staff-tab="${e}" title="${z(t.text)}">
                <span class="nav-emoji" aria-hidden="true">${z(t.emoji)}</span>
                <span class="nav-text">${z(t.text)}</span>
              </button>
            `}).join(``)}
        </nav>

        <div class="staff-sidebar-footer">
          <button class="staff-tab-btn sidebar-toggle" id="sidebar-toggle" title="${r?`Mostrar menú`:`Ocultar menú`}" aria-label="${r?`Mostrar menú`:`Ocultar menú`}" aria-expanded="${r?`false`:`true`}">
            <span class="nav-emoji" aria-hidden="true">${r?`»`:`«`}</span>
            <span class="nav-text">${r?`Mostrar menú`:`Ocultar menú`}</span>
          </button>
          <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
          <button class="staff-tab-btn" id="logout-btn" title="Cerrar sesión">
            <span class="nav-emoji" aria-hidden="true">🚪</span>
            <span class="nav-text">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div class="staff-main">
        <main id="main-content" tabindex="-1" class="staff-content">
          ${Me()}
          ${Tt(e,n)}
          ${Ne()}
        </main>
      </div>
    </div>
  `}function Tt(e,t){return e?t===`alumnos`?jt(e):t===`examen`?Mt(e):t===`materias`?It(e):t===`asistencia`?Lt(e):t===`pagos`?Kt(e):t===`tareas`?en(e):t===`actividad`?tn(e):t===`tutores`?nn(e):t===`usuarios`?ut(e):t===`contenido`?ft(e):t===`auditoria`?ht(e):t===`configuracion`?_t(e):Dt(e):I.dashboardError?`
        <article class="card wide">
          <span class="card-label">Panel</span>
          <h2>No se pudo cargar</h2>
          <p>${z(I.dashboardError)}</p>
        </article>
      `:`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `}function Et(){let e=I.profile;if(!e)return``;let t=ue[e.role]||`Usuario`,n=e.full_name||e.username||e.email||`Sin nombre`,r=e.username?`@${e.username}`:e.email||`Sin identificador`;return`
    <section class="welcome">
      <div>
        <span class="kicker">Sesión activa</span>
        <h1>Hola, ${z(n.split(` `)[0])} 👋</h1>
        <p class="muted">${z(de[e.role]||`Tu cuenta está conectada.`)}</p>
      </div>
      <div class="identity">
        <span class="avatar">${z(n.slice(0,1).toUpperCase())}</span>
        <div>
          <strong>${z(n)}</strong>
          <small>${z(t)} · ${z(r)}</small>
        </div>
      </div>
    </section>
  `}function Dt(e){let t=e.overview?.scores||{},n=Array.isArray(t.students)?t.students:[];return`
    ${Et()}

    <div class="section-title">
      <div>
        <span class="card-label">Panel de control</span>
        <h2>¿Cómo va el grupo?</h2>
      </div>
      <span class="pill">${z(e.kind===`admin`?`Vista global`:`Tu grupo`)}</span>
    </div>

    ${St(e.overview)}
    ${Ct(e.overview)}

    <div class="dash-grid">
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Score del grupo</span>
            <h2>${t.group??0} / 100</h2>
          </div>
        </div>
        <p class="muted">Promedio del grupo: 50 % avance de unidades + 50 % precisión en ejercicios.</p>
        ${n.length?`
          <div class="feed-list">
            ${n.map(e=>`
              <div class="feed-item">
                <span class="feed-emoji">${e.score>=80?`🏆`:e.score>=50?`📈`:`🌱`}</span>
                <div>
                  <strong>${z(e.name)}</strong>
                  <div><small>${z(e.code)} · ⚡ ${e.xp} XP · 📚 ${e.units_done}/${e.units_total} unidades · ${e.accuracy==null?`sin precisión`:`🎯 ${Math.round(e.accuracy)}%`} · faltas: ${e.absences}</small></div>
                </div>
                <span class="score-num">${e.score}</span>
              </div>
            `).join(``)}
          </div>
        `:`<p class="empty-state">Aún no hay alumnos en el grupo.</p>`}
      </article>

      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">En vivo</span><h2>Actividad reciente</h2></div>
        </div>
        ${xt(e.overview?.recent)}
      </article>
    </div>
  `}function Ot(e){return e>=80?`high`:e>=50?`mid`:`low`}function kt(e,t){let n=[];for(let r of e.board||[]){let e=0,i=0,a=0,o=0;for(let n of r.units||[]){i+=1;let r=(n.students||[]).find(e=>e.code===t||e.id===t);r&&(r.status===`completed`||r.status===`mastered`)&&(e+=1),r&&r.accuracy!=null&&(a+=Number(r.accuracy),o+=1)}i>0&&n.push({subject:r.name,color:r.color,done:e,total:i,accuracy:o?Math.round(a/o):null})}return n}function At(e,t){for(let n of e.board||[])for(let e of n.units||[]){let r=(e.students||[]).find(e=>e.code===t||e.id===t);if(!r||r.status===`not_started`)return`${n.name} · ${e.title}`}return null}function jt(e){let t=e.students||[],n=new Map((e.overview?.scores?.students||[]).map(e=>[e.code,e]));return t.length?`
    <div class="section-title">
      <div>
        <span class="card-label">Alumnos</span>
        <h2>${t.length} ${t.length===1?`alumna inscrita`:`alumnos inscritos`}</h2>
      </div>
    </div>

    <div class="student-cards">
      ${t.map(e=>{let t=n.get(e.student_code)||{},r=t.score??0;return`
          <article class="student-card">
            <div class="student-card-head">
              <div class="avatar-big">${z((e.full_name||`A`).slice(0,1).toUpperCase())}</div>
              <span class="score-ring ${Ot(r)}" title="Score general">${r}</span>
            </div>
            <div>
              <strong>${z(e.full_name)}</strong>
              <div class="muted"><small>${z(e.student_code)} · ${z(e.group_name||`Sin grupo`)}</small></div>
            </div>
            <div class="student-mini-stats">
              <span class="pill pill-pink">⚡ ${t.xp??0} XP</span>
              <span class="pill pill-green">📚 ${t.units_done??0}/${t.units_total??`—`}</span>
              ${t.accuracy==null?``:`<span class="pill pill-blue">🎯 ${Math.round(t.accuracy)}%</span>`}
              <span class="pill ${(t.absences??0)>0?`pill-red`:``}">Faltas: ${t.absences??0}</span>
            </div>
            <button class="btn ghost" data-ficha-toggle="${z(e.id)}">Ver ficha completa</button>
          </article>
        `}).join(``)}
    </div>

    ${Nt(e)}
  `:`
      <div class="section-title"><div><span class="card-label">Alumnos</span><h2>Grupo</h2></div></div>
      <article class="card wide"><p class="empty-state">Todavía no hay alumnos. Da de alta al primero aquí abajo.</p></article>
      ${Nt(e)}
    `}function Mt(e){let t=Array.isArray(e.examSessions)?e.examSessions:[],n=t.filter(e=>e.status===`completed`),r=t.filter(e=>e.status===`in_progress`),i=n.filter(e=>Number.isFinite(Number(e.score))),a=i.length?(i.reduce((e,t)=>e+Number(t.score),0)/i.length).toFixed(2):`—`,o=e=>e?new Date(e).toLocaleString(`es-MX`,{day:`2-digit`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}):`—`,s=e=>{let t=Math.max(0,Math.round(Number(e||0)/1e3));return`${String(Math.floor(t/60)).padStart(2,`0`)}:${String(t%60).padStart(2,`0`)}`};return`
    ${Et()}

    <div class="section-title">
      <div>
        <span class="card-label">Evaluación</span>
        <h2>Examen final de Español</h2>
      </div>
      <div class="row">
        <span class="pill ${n.length?`success`:``}">${n.length} ${n.length===1?`resultado`:`resultados`}</span>
        <button class="btn ghost" data-preview-final-exam>Vista previa del examen →</button>
      </div>
    </div>

    <div class="dash-grid">
      <article class="card">
        <span class="card-label">Sesiones</span>
        <h2>${t.length}</h2>
        <p class="muted">Incluye sesiones terminadas y en curso.</p>
      </article>
      <article class="card">
        <span class="card-label">Terminadas</span>
        <h2>${n.length}</h2>
        <p class="muted">Con puntaje calculado en el servidor.</p>
      </article>
      <article class="card">
        <span class="card-label">Promedio</span>
        <h2>${a}${a===`—`?``:` %`}</h2>
        <p class="muted">Solo alumnos que terminaron el examen.</p>
      </article>
      <article class="card">
        <span class="card-label">En curso</span>
        <h2>${r.length}</h2>
        <p class="muted">${t[0]?`Última sesión: ${z(o(t[0].started_at))}`:`Todavía sin actividad.`}</p>
      </article>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Detalle</span>
          <h2>Resultados por alumno</h2>
        </div>
      </div>
      ${t.length?`
        <div class="feed-list">
          ${t.map(e=>{let t=e.status===`completed`,n=Number(e.score);return`
              <div class="feed-item">
                <span class="feed-emoji">${t?`🎓`:`⏳`}</span>
                <div>
                  <strong>${z(e.student_name||`Alumno`)}</strong>
                  <div>
                    <small>
                      ${z(e.student_code||`—`)} · ${z(e.group_name||`Sin grupo`)}
                      · ${t?`${Number(e.correct_answers)}/${Number(e.total_questions)} aciertos`:`${Number(e.answered_questions||0)} respondidas`}
                      · ⏱ ${s(e.duration_ms)}
                      · ${z(o(e.started_at))}
                    </small>
                  </div>
                </div>
                <span class="pill ${t?`success`:`pill-amber`}">${t&&Number.isFinite(n)?`${n.toFixed(2)} %`:`En curso`}</span>
              </div>
            `}).join(``)}
        </div>
      `:`<p class="empty-state">Todavía no hay sesiones del examen. Cuando un alumno lo conteste, el resultado aparecerá aquí con aciertos, tiempo y puntaje.</p>`}
    </article>

    <article class="card wide">
      <span class="card-label">Orientación vocacional</span>
      <h2>Test oficial y taller ampliado</h2>
      <p class="muted">El test vocacional oficial se consulta en la ficha de cada alumno, dentro de la pestaña <strong>Alumnos</strong>. El taller ampliado vive en su propia página, <a href="./vocacional.html">Taller vocacional →</a>; sus respuestas (RIASEC y checklist) permanecen en el dispositivo de quien lo usa y no se guardan en la base.</p>
    </article>
  `}function Nt(e){let t=e.groups||[],n=e.kind===`admin`;return`
    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">Alta</span><h2>Nuevo alumno</h2></div>
      </div>
      <form class="form" ${n?`id="admin-create-student-form"`:``} ${n?``:`data-create-student-group="${z(t[0]?.id||``)}"`}>
        ${n?`
          <label class="field">
            <span>Grupo</span>
            <select name="group_id" data-admin-groups required>
              <option value="">Selecciona un grupo…</option>
              ${t.map(e=>`
                <option value="${z(e.id)}">${z(e.name)}${e.teacher_name?` · ${z(e.teacher_name)}`:``}</option>
              `).join(``)}
            </select>
          </label>
        `:``}
        <label class="field">
          <span>Nombre completo</span>
          <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
        </label>
        <label class="field">
          <span>Usuario (opcional — si lo dejas vacío, se genera del nombre)</span>
          <input name="username" autocomplete="off" placeholder="ej. maria.lopez">
        </label>
        <label class="field">
          <span>Contraseña temporal (mín. 12, con mayúscula, minúscula y número)</span>
          <input name="password" type="text" autocomplete="off" minlength="12" required>
        </label>
        <label class="field">
          <span>Matrícula (opcional)</span>
          <input name="student_code" autocomplete="off" placeholder="ECO-2027-001">
        </label>
        <div class="row">
          <button class="btn primary" type="submit">Dar de alta</button>
        </div>
        <div class="create-student-result" data-create-result="${n?`admin`:`teacher`}"></div>
      </form>

      <details class="admin-details" ${I.studentInvitation?`open`:``}>
        <summary>Invitar alumno (elige su propia contraseña)</summary>
        <p class="hint">Crea la cuenta y genera un enlace de un solo uso para que el alumno establezca su contraseña. Entrégalo por un canal seguro: vence en 72 h y no se puede reutilizar.</p>
        <form class="form" data-invite-student-form data-invite-group-default="${z(t[0]?.id||``)}">
          ${n?`
            <label class="field">
              <span>Grupo</span>
              <select name="group_id" data-invite-groups required>
                <option value="">Selecciona un grupo…</option>
                ${t.map(e=>`
                  <option value="${z(e.id)}">${z(e.name)}${e.teacher_name?` · ${z(e.teacher_name)}`:``}</option>
                `).join(``)}
              </select>
            </label>
          `:``}
          <label class="field">
            <span>Nombre completo</span>
            <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
          </label>
          <label class="field">
            <span>Usuario (opcional — si lo dejas vacío, se genera del nombre)</span>
            <input name="username" autocomplete="off" placeholder="ej. maria.lopez">
          </label>
          <label class="field">
            <span>Matrícula (opcional)</span>
            <input name="student_code" autocomplete="off" placeholder="ECO-2027-001">
          </label>
          <div class="row">
            <button class="btn primary" type="submit">Generar invitación</button>
          </div>
          <div class="create-student-result" data-invite-student-result></div>
        </form>
      </details>

      ${Pt(I.studentInvitation)}
    </article>
  `}function Pt(e){return e?`
    <div class="answer-box correct" data-student-invitation>
      <strong>Invitación para ${z(e.fullName)}</strong>
      <p>Comparte este enlace con el alumno o su tutor. Vence en 72 h y solo funciona una vez.</p>
      <label class="field">
        <span>Enlace de invitación</span>
        <input readonly value="${z(e.redeemUrl)}" data-invitation-url>
      </label>
      <div class="row">
        <button class="btn ghost" type="button" data-copy-invitation>Copiar enlace</button>
        <button class="btn ghost" type="button" data-dismiss-invitation>Ocultar</button>
      </div>
      <p><small>Usuario: ${z(e.username)} · Matrícula: ${z(e.studentCode)} · Vence: ${z(e.expiresAtLabel)}</small></p>
    </div>
  `:``}function Ft(e,t){let n=(e.publishedUnits||[]).find(e=>e.id===t);return n?.versions?.length?n.versions[0].id:``}function It(e){let t=e.board||[],n=e.groups||[],r=n.some(e=>e.id===I.subjectsGroupId)?I.subjectsGroupId:n[0]?.id||null,i=e.students||[],a=new Map;for(let t of e.assignments||[])t.group_id===r&&(a.has(t.unit_id)||a.set(t.unit_id,t));let o=e.terms||[];return t.length?`
    <div class="section-title">
      <div>
        <span class="card-label">Materias</span>
        <h2>Unidades, exámenes y calificaciones</h2>
      </div>
      <div class="row">
        ${n.length>1?`
          <label class="field inline-field">
            <span>Grupo</span>
            <select data-subjects-group>
              ${n.map(e=>`<option value="${z(e.id)}" ${e.id===r?`selected`:``}>${z(e.name)}</option>`).join(``)}
            </select>
          </label>
        `:``}
        <span class="pill">${t.length} materias</span>
      </div>
    </div>

    ${t.map(t=>{let n=[];for(let e of t.units||[]){let t=a.get(e.id);t&&n.push(t)}let s=I.collapsedSubjects.has(t.id);return`
        <article class="board-subject ${s?`collapsed`:``}" style="border-left: 5px solid ${z(t.color||`#5b8cff`)}">
          <div class="board-head">
            <button class="board-toggle" data-subject-toggle="${z(t.id)}" aria-expanded="${s?`false`:`true`}" title="${s?`Mostrar`:`Ocultar`} ${z(t.name)}">
              <span class="chev" aria-hidden="true">▾</span>
              <h3 style="margin:0">${z(t.name)}</h3>
            </button>
            <span class="pill">${(t.units||[]).length} unidades</span>
            <span class="pill">${(t.assessments||[]).length} evaluaciones</span>
          </div>

          <div class="board-body" data-subject-body="${z(t.id)}">
          <span class="card-label">Unidades (orden del curso)</span>
          ${(t.units||[]).map(t=>{let n=a.get(t.id),o=t.students||[],s=i.filter(e=>e.group_id===r),c=(n?.overrides||[]).filter(e=>e.status===`closed`).length,l=Math.max(0,s.length-c),u=Ft(e,t.id);return`
              <div class="board-unit">
                <span class="pill pill-blue">U${String(t.num).padStart(2,`0`)}</span>
                <div>
                  <strong>${z(t.title)}</strong>
                  <div class="muted"><small>${t.estimated?`${t.estimated} min`:``}</small></div>
                </div>
                <div class="row">
                  ${n&&n.status===`active`?`<span class="pill success">Activa</span>
                       <span class="pill">${l}/${s.length} alumnos</span>
                       <button class="btn-mini" data-manage-assignment="${z(n.id)}" data-unit-group="${z(r)}">Alumnos</button>
                       <button class="btn-mini danger" data-close-assignment="${z(n.id)}">Cerrar</button>`:n&&n.status===`closed`?`<span class="pill pill-red">Cerrada</span>
                         <button class="btn-mini" data-reopen-assignment="${z(n.id)}">Reabrir</button>`:r?`<button class="btn-mini primary" data-activate-unit="${z(t.id)}:${z(u)}" data-unit-group="${z(r)}">Activar</button>`:`<span class="pill">Sin activar</span>`}
                </div>
                <div class="unit-students">
                  ${o.length?o.map(e=>`
                    <span class="student-chip ${e.status===`completed`||e.status===`mastered`?`done`:e.status===`in_progress`?`progress`:`todo`}">
                      ${z(e.name||e.code)} ${e.status===`completed`||e.status===`mastered`?`✓`:e.status===`in_progress`?`…`:`·`}${e.accuracy==null?``:` ${Math.round(e.accuracy)}%`}
                    </span>
                  `).join(``):`<span class="muted"><small>Sin avance registrado</small></span>`}
                </div>
              </div>
            `}).join(``)}

          <span class="card-label">Exámenes y tareas</span>
          ${(t.assessments||[]).map(e=>`
            <div class="assessment-box" data-assessment-box="${z(e.id)}">
              <div class="section-title">
                <div>
                  <strong>${z(e.title)}</strong>
                  <div class="muted"><small>${z(ve[e.type]||e.type)} · sobre ${e.max} · ${z(e.date?q(String(e.date).slice(0,10)):`sin fecha`)}</small></div>
                </div>
                <button class="btn-mini" data-toggle-grades="${z(e.id)}">Calificar</button>
              </div>
              <div class="grades-editor hidden" data-grades-editor="${z(e.id)}">
                ${i.map(t=>{let n=(e.grades||[]).find(e=>e.student===t.student_code);return`
                    <div class="grade-row">
                      <span>${z(t.full_name)}</span>
                      <input type="number" step="0.1" min="0" max="${z(e.max)}" value="${n?z(n.score??``):``}" data-grade-student="${z(t.id)}" placeholder="—">
                      <button class="btn-mini primary" data-save-grade="${z(e.id)}" data-student="${z(t.id)}">Guardar</button>
                    </div>
                  `}).join(``)}
              </div>
            </div>
          `).join(``)||`<p class="empty-state">Sin exámenes ni tareas en esta materia.</p>`}

          ${r?`
            <details class="admin-details">
              <summary>Nueva evaluación (examen, tarea, proyecto…)</summary>
              <form class="form" data-create-assessment="${z(t.id)}" data-group="${z(r)}">
                <label class="field"><span>Nombre</span><input name="name" required placeholder="Examen parcial 1"></label>
                <label class="field">
                  <span>Tipo</span>
                  <select name="type">
                    ${Object.entries(ve).map(([e,t])=>`<option value="${e}">${z(t)}</option>`).join(``)}
                  </select>
                </label>
                <div class="row">
                  <label class="field"><span>Puntaje máximo</span><input name="max_score" type="number" step="0.1" value="10" required></label>
                  <label class="field"><span>Fecha</span><input name="assessment_date" type="date"></label>
                  <label class="field"><span>Trimestre</span>
                    <select name="term_id">${o.map(e=>`<option value="${z(e.id)}">${z(e.name)}</option>`).join(``)}</select>
                  </label>
                </div>
                <button class="btn primary" type="submit">Crear evaluación</button>
              </form>
            </details>
          `:``}
          </div>
        </article>
      `}).join(``)}
  `:`
      <div class="section-title"><div><span class="card-label">Materias</span><h2>Contenido</h2></div></div>
      <article class="card wide"><p class="empty-state">Aún no hay materias activas con contenido.</p></article>
    `}function Lt(e){let t=e.groups||[];return t.length?`
    <div class="section-title">
      <div>
        <span class="card-label">Asistencia</span>
        <h2>Tomar lista y justificar</h2>
      </div>
      <span class="pill">Las faltas no afectan calificaciones; solo son informativas</span>
    </div>
    ${t.map(e=>`
      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Grupo</span><h2>${z(e.name)}</h2></div>
        </div>
        <div class="row">
          <button class="btn primary" data-attendance-open="${z(e.id)}">Tomar asistencia</button>
          <button class="btn ghost" data-history-open="${z(e.id)}">Ver historial</button>
        </div>
        <div class="attendance-area hidden" data-attendance-area="${z(e.id)}"></div>
        <div class="attendance-history hidden" data-history-box="${z(e.id)}"></div>
      </article>
    `).join(``)}
  `:`
      <div class="section-title"><div><span class="card-label">Asistencia</span><h2>Grupos</h2></div></div>
      <article class="card wide"><p class="empty-state">No tienes grupos asignados.</p></article>
    `}var Rt={semanal:`Semanal`,quincenal:`Quincenal`,mensual:`Mensual`,contado:`Contado`,beca:`Beca`,otro:`Otro`},zt={efectivo:`Efectivo`,transferencia:`Transferencia`,tarjeta:`Tarjeta`,otro:`Otro`};function Bt(e,t){return(t||[]).filter(t=>t.student_id===e&&t.status!==`voided`)}function Vt(e,t){return Bt(e,t).reduce((e,t)=>e+Number(t.amount||0),0)}function Ht(e,t){return Bt(e,t).slice().sort((e,t)=>String(t.paid_at).localeCompare(String(e.paid_at)))[0]||null}function Y(e){return Number(e||0).toLocaleString(`es-MX`,{style:`currency`,currency:`MXN`})}function X(e){return e.toISOString().slice(0,10)}function Ut(e,t){if(![`semanal`,`quincenal`,`mensual`].includes(e))return null;let n=new Date(`${t||X(new Date)}T00:00:00Z`);if(Number.isNaN(n.getTime()))return null;let r=n.getUTCFullYear(),i=n.getUTCMonth();if(e===`mensual`)return{start:X(new Date(Date.UTC(r,i,1))),end:X(new Date(Date.UTC(r,i+1,0)))};if(e===`quincenal`)return n.getUTCDate()<=15?{start:X(new Date(Date.UTC(r,i,1))),end:X(new Date(Date.UTC(r,i,15)))}:{start:X(new Date(Date.UTC(r,i,16))),end:X(new Date(Date.UTC(r,i+1,0)))};let a=(n.getUTCDay()+6)%7,o=new Date(Date.UTC(r,i,n.getUTCDate()-a)),s=new Date(Date.UTC(o.getUTCFullYear(),o.getUTCMonth(),o.getUTCDate()+6));return{start:X(o),end:X(s)}}function Wt(e){return e===`voided`?`Anulado`:e===`partial`?`Parcial`:`Pagado`}function Gt(e){return{"al corriente":`Al corriente`,parcial:`Pago parcial`,pendiente:`Pendiente`,vencido:`Vencido`,beca:`Beca`,manual:`Plan manual`,"sin cuota":`Sin cuota`}[e]||`Pendiente`}function Kt(e){let t=e.students||[],n=e.billingByStudent||new Map,r=e.billingStatusByStudent||new Map,i=e.payments||[],a=Math.max(1,Math.ceil(i.length/he)),o=Math.min(Math.max(1,I.paymentsPage),a),s=i.slice((o-1)*he,o*he),c=new Date,l=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,`0`)}`,u=i.filter(e=>e.status!==`voided`),d=i.length-u.length,f=u.filter(e=>String(e.paid_at||``).slice(0,7)===l),p=f.reduce((e,t)=>e+Number(t.amount||0),0),m=u.reduce((e,t)=>e+Number(t.amount||0),0),h=t.filter(e=>n.has(e.id)).length;return`
    <div class="section-title">
      <div>
        <span class="card-label">Finanzas</span>
        <h2>Pagos y planes por alumno</h2>
      </div>
      <span class="pill">${t.length} ${t.length===1?`alumno`:`alumnos`}</span>
    </div>

    <div class="pay-summary">
      <article class="card pay-stat pay-stat-violet">
        <span class="pay-stat-icon" aria-hidden="true">📅</span>
        <div>
          <span class="card-label">Este mes (${c.toLocaleDateString(`es-MX`,{month:`short`})})</span>
          <h2>${Y(p)}</h2>
          <p class="muted">${f.length} ${f.length===1?`pago`:`pagos`} registrados</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-green">
        <span class="pay-stat-icon" aria-hidden="true">💰</span>
        <div>
          <span class="card-label">Ingresos totales</span>
          <h2>${Y(m)}</h2>
          <p class="muted">${d?`${d} ${d===1?`pago anulado excluido`:`pagos anulados excluidos`}`:`Todo lo registrado en la plataforma`}</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-blue">
        <span class="pay-stat-icon" aria-hidden="true">🗂️</span>
        <div>
          <span class="card-label">Planes asignados</span>
          <h2>${h}/${t.length}</h2>
          <p class="muted">${[...new Set([...n.values()].map(e=>e.plan))].length} ${[...new Set([...n.values()].map(e=>e.plan))].length===1?`tipo de plan`:`tipos de plan`}</p>
        </div>
      </article>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Alumnos</span>
          <h2>Estado de cuentas</h2>
        </div>
      </div>
      ${t.length?`
        <div class="pay-board">
          ${t.map(e=>{let t=n.get(e.id)||{},a=r.get(e.id)||{},o=t.plan||a.plan||`mensual`,s=Vt(e.id,i),c=Ht(e.id,i),l=(e.full_name||`A`).trim().slice(0,1).toUpperCase(),u=a.period_start?{start:a.period_start,end:a.period_end}:Ut(o),d=a.balance==null?null:Number(a.balance),f=d==null?`is-none`:d>0?`is-debt`:d<0?`is-credit`:`is-even`,p=d==null?`Sin datos`:d>0?`Por pagar`:d<0?`A favor`:`Al corriente`,m=a.paid==null?null:Number(a.paid),h=c?String(c.paid_at).slice(0,10):a.last_paid_at?String(a.last_paid_at).slice(0,10):null,g=t.fee||a.fee;return`
              <article class="pay-card">
                <div class="pay-card-head">
                  <span class="pay-avatar" aria-hidden="true">${z(l)}</span>
                  <div class="pay-who">
                    <strong>${z(e.full_name)}</strong>
                    <small>${z(e.student_code||``)}${e.group_name?` · ${z(e.group_name)}`:``}</small>
                  </div>
                  <span class="pill ${n.has(e.id)?``:`pill-amber`}">${n.has(e.id)?z(Rt[o]||o):`Sin plan`}</span>
                </div>
                <p class="pay-card-period">📆 Periodo: ${u&&u.start?`${z(q(u.start))} – ${z(q(u.end))}`:`Sin periodo definido`}</p>
                <div class="pay-balance ${f}">
                  <div>
                    <span class="card-label">Saldo</span>
                    <strong>${d==null?`—`:Y(Math.abs(d))}</strong>
                  </div>
                  <span class="pay-balance-tag">${p}</span>
                </div>
                <div class="pay-card-body">
                  <div class="pay-metric">
                    <span class="card-label">Cuota</span>
                    <strong>${g?Y(g):`—`}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">${m==null?`Pagado acumulado`:`Pagado en el periodo`}</span>
                    <strong class="${(m??s)>0?`pay-good`:``}">${Y(m??s)}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Estado</span>
                    <strong class="${a.status===`al corriente`||a.status===`beca`?`pay-good`:`pay-last`}">${z(Gt(a.status))}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Último pago</span>
                    <strong class="pay-last">${h?z(q(h)):`—`}</strong>
                  </div>
                </div>
                <p class="pay-card-history">Total histórico registrado: ${Y(s)}</p>
                <div class="pay-card-actions">
                  <button class="btn primary" data-open-pay-dialog="${z(e.id)}" data-pay-mode="payment">💵 Registrar pago</button>
                  <button class="btn ghost" data-open-pay-dialog="${z(e.id)}" data-pay-mode="plan">⚙️ Plan</button>
                </div>
              </article>
            `}).join(``)}
        </div>
      `:`<p class="empty-state">Todavía no hay alumnos en tus grupos.</p>`}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Historial</span>
          <h2>Últimos pagos registrados</h2>
        </div>
      </div>
      ${i.length?`
        ${kn({total:i.length,page:o,target:`payments`})}
        <ul class="data-list pay-list">
          ${s.map(e=>`
              <li>
                <div>
                  <strong>${z(t.find(t=>t.id===e.student_id)?.full_name||`Alumno`)}${e.receipt_no?` · ${z(e.receipt_no)}`:``}</strong>
                  <small>${z(q(String(e.paid_at).slice(0,10)))} · ${z(zt[e.method]||e.method)}${e.period_start?` · ${z(q(e.period_start))}–${z(q(e.period_end))}`:e.period?` · ${z(e.period)}`:``}${e.status===`voided`&&e.void_reason?` · Motivo: ${z(e.void_reason)}`:``}</small>
                </div>
                <div class="pay-history-actions">
                  <span class="pill ${e.status===`voided`?`pill-amber`:`success`}">${Y(e.amount)} · ${z(Wt(e.status))}</span>
                  <button class="btn ghost" data-receipt-payment="${z(e.id)}" aria-label="Descargar recibo ${z(e.receipt_no||e.id)}">Recibo</button>
                  ${e.status===`voided`?``:`<button class="btn ghost" data-void-payment="${z(e.id)}">Anular</button>`}
                </div>
              </li>
            `).join(``)}
        </ul>
      `:`<p class="empty-state">Aún no hay pagos registrados. Usa "Registrar pago" en cada alumno.</p>`}
    </article>
  `}function qt(){let e=I.payDialog;if(!e)return``;let t=I.dashboard,n=(t?.students||[]).find(t=>t.id===e.studentId),r=(t?.billingByStudent||new Map).get(e.studentId)||{},i=new Date().toISOString().slice(0,10),a=(n?.full_name||`A`).trim().slice(0,1).toUpperCase(),o=e.mode===`plan`;return`
    <div class="unit-assign-overlay" data-pay-overlay>
      <section class="unit-assign-dialog pay-dialog" role="dialog" aria-modal="true" aria-labelledby="pay-title">
        <button type="button" class="ficha-close" data-pay-close aria-label="Cerrar">✕</button>

        <header class="pay-dialog-head">
          <span class="pay-avatar pay-avatar-lg" aria-hidden="true">${z(a)}</span>
          <div class="pay-who">
            <span class="card-label">${o?`Plan de pago`:`Registrar pago`}</span>
            <h2 id="pay-title">${z(n?.full_name||`Alumno`)}</h2>
            <p class="muted">${z(n?.student_code||``)}${n?.group_name?` · ${z(n.group_name)}`:``}${!o&&r.plan?` · Plan ${z(Rt[r.plan]||r.plan)}`:``}</p>
          </div>
        </header>

        <form class="form pay-form" data-pay-form>
          ${o?`
            <div class="pay-plan-grid">
              ${Object.entries(Rt).map(([e,t])=>`
                <button type="button" class="pay-plan-option ${(r.plan||`mensual`)===e?`selected`:``}" data-pay-plan="${e}">
                  ${z(t)}
                </button>
              `).join(``)}
              <input type="hidden" name="plan" value="${z(r.plan||`mensual`)}">
            </div>
            <label class="field">
              <span>Cuota por periodo (pesos)</span>
              <input name="fee" type="number" min="0" step="0.01" value="${r.fee??``}" placeholder="ej. 250">
            </label>
            <label class="field">
              <span>Notas (opcional)</span>
              <textarea name="notes" placeholder="ej. beca del 20%, incluye material…">${z(r.notes||``)}</textarea>
            </label>
          `:`
            <label class="field">
              <span>Monto (pesos)</span>
              <div class="pay-amount-wrap">
                <span class="pay-currency">$</span>
                <input name="amount" type="number" min="1" step="0.01" required placeholder="0.00">
              </div>
            </label>
            <label class="field">
              <span>Fecha del pago</span>
              <input name="paid_at" type="date" required value="${i}">
            </label>
            <div class="field">
              <span>Método</span>
              <div class="pay-method-grid">
                ${Object.entries(zt).map(([e,t],n)=>`
                  <button type="button" class="pay-method-option ${n===0?`selected`:``}" data-pay-method="${e}">
                    ${z(t)}
                  </button>
                `).join(``)}
                <input type="hidden" name="method" value="efectivo">
              </div>
            </div>
            <label class="field">
              <span>Concepto (opcional)</span>
              <input name="period" placeholder="ej. semana del 2 nov, noviembre, inscripción">
            </label>
            <label class="field">
              <span>Notas (opcional)</span>
              <textarea name="notes" placeholder="ej. pagó el tutor en efectivo"></textarea>
            </label>
          `}

          <div class="pay-error" data-pay-error hidden></div>

          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-pay-close>Cancelar</button>
            <button type="submit" class="btn primary">${o?`Guardar plan`:`Registrar pago`}</button>
          </footer>
        </form>
      </section>
    </div>
  `}function Jt(e,t){I.payDialog={studentId:e,mode:t,escHandler:null},Yt()}function Yt(){document.querySelectorAll(`[data-pay-overlay]`).forEach(e=>e.remove()),I.payDialog?.escHandler&&(I.payDialog.escHandler(),I.payDialog.escHandler=null);let e=qt();if(!e){document.body.classList.remove(`unit-assign-open`);return}document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`unit-assign-open`);let t=document.querySelector(`[data-pay-overlay]`),n=()=>Xt();t.querySelectorAll(`[data-pay-close]`).forEach(e=>{e.addEventListener(`click`,n)}),t.addEventListener(`click`,e=>{e.target===t&&n()}),I.payDialog.escHandler=je(t,n);let r=t.querySelector(`[data-pay-form]`);r&&r.addEventListener(`submit`,e=>$t(e,r)),t.querySelectorAll(`[data-pay-method]`).forEach(e=>{e.addEventListener(`click`,()=>{t.querySelectorAll(`[data-pay-method]`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=r?.querySelector(`input[name="method"]`);n&&(n.value=e.dataset.payMethod)})}),t.querySelectorAll(`[data-pay-plan]`).forEach(e=>{e.addEventListener(`click`,()=>{t.querySelectorAll(`[data-pay-plan]`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=r?.querySelector(`input[name="plan"]`);n&&(n.value=e.dataset.payPlan)})}),requestAnimationFrame(()=>{t.querySelector(`[data-pay-close]`)?.focus()})}function Xt(){I.payDialog?.escHandler&&I.payDialog.escHandler(),I.payDialog=null,document.querySelectorAll(`[data-pay-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function Zt(e){let t=e.dataset.voidPayment;if(!t||e.disabled)return;let n=window.prompt(`Motivo de la anulación (mínimo 3 caracteres):`,``);if(n===null)return;let i=n.trim();if(i.length<3){B(`Escribe un motivo de al menos 3 caracteres para anular el pago.`);return}e.disabled=!0,e.textContent=`Anulando…`;let{error:a}=await r.rpc(`app_void_payment`,{p_payment_id:t,p_reason:i});a?(B(a.message||`No se pudo anular el pago.`),e.disabled=!1,e.textContent=`Anular`):(V(`Pago anulado. El historial conserva el registro y el motivo.`),await G(I.profile))}function Qt(e){let t=(I.dashboard?.payments||[]).find(t=>t.id===e);if(!t){B(`No se encontró el pago para generar el recibo.`);return}let n=(I.dashboard?.students||[]).find(e=>e.id===t.student_id),r=(I.dashboard?.billingByStudent||new Map).get(t.student_id)||{};v({id:t.id,receipt_no:t.receipt_no,paid_at:q(String(t.paid_at||``).slice(0,10)),amount:Y(t.amount),method:zt[t.method]||t.method||`—`,period_start:t.period_start?q(t.period_start):``,period_end:t.period_end?q(t.period_end):``,period:t.period,status:t.status,student_name:n?.full_name||`Alumno`,student_code:n?.student_code||``,group_name:n?.group_name||``,plan:Rt[r.plan]||r.plan||``,void_reason:t.void_reason||``}),V(t.status===`voided`?`Recibo descargado. El documento marca el pago como anulado.`:`Recibo descargado.`)}async function $t(e,t){e.preventDefault();let n=I.payDialog;if(!n)return;let i=new FormData(t),a=t.querySelector(`button[type="submit"]`),o=t.querySelector(`[data-pay-error]`);a&&(a.disabled=!0);try{if(n.mode===`plan`){let e=String(i.get(`fee`)||``).trim(),{error:t}=await r.from(`student_billing`).upsert({student_id:n.studentId,plan:String(i.get(`plan`)||`mensual`),fee:e?Number(e):null,notes:String(i.get(`notes`)||``).trim()||null,updated_by:I.profile?.id??null,updated_at:new Date().toISOString()},{onConflict:`student_id`});if(t)throw t;Xt(),V(`Plan de pago guardado.`)}else{let e=Number(i.get(`amount`));if(!e||e<=0)throw Error(`Escribe un monto válido.`);let t=String(i.get(`paid_at`)||X(new Date)),a=Ut(((I.dashboard?.billingByStudent||new Map).get(n.studentId)||{}).plan||`mensual`,t),{error:o}=await r.from(`payments`).insert({student_id:n.studentId,amount:e,paid_at:t,method:String(i.get(`method`)||`efectivo`),period:String(i.get(`period`)||``).trim()||null,notes:String(i.get(`notes`)||``).trim()||null,period_start:a?.start||null,period_end:a?.end||null,idempotency_key:crypto.randomUUID(),recorded_by:I.profile?.id??null});if(o)throw o.code===`23505`||/duplicad|idéntico/i.test(o.message||``)?Error(`Ya existe un pago idéntico para ese periodo. Revisa el historial antes de registrarlo otra vez.`):o;Xt(),V(`Pago registrado con folio.`)}await G(I.profile)}catch(e){a&&(a.disabled=!1),o&&(o.hidden=!1,o.textContent=e?.message||`No se pudo guardar.`)}}function en(e){let t=e.tasks||[],n=e.groups||[],r=e.board||[],i=e.publishedUnits||e.units||[],a={pending:`Pendiente`,submitted:`Entregada`,late:`Tarde`},o=e=>{if(!e.due_at)return`Sin fecha`;let t=new Date(e.due_at),n=t.getTime()<Date.now()&&(e.submissions||[]).some(e=>e.status===`pending`),r=t.toLocaleDateString(`es-MX`,{day:`2-digit`,month:`short`});return n?`Venció ${r}`:`Entrega ${r}`};return`
    <div class="section-title">
      <div>
        <span class="card-label">Tareas</span>
        <h2>Asignar, revisar y calificar</h2>
      </div>
      <span class="pill">${t.length} ${t.length===1?`tarea activa`:`tareas activas`}</span>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">Nueva tarea</span><h2>Asignar al grupo</h2></div>
      </div>
      <form class="form task-form" id="create-task-form">
        <label class="field"><span>Título</span><input name="title" required placeholder="Investigación sobre figuras literarias"></label>
        <div class="task-form-grid">
          <label class="field"><span>Grupo</span>
            <select name="group_id" required>
              ${n.map(e=>`<option value="${z(e.id)}">${z(e.name)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Materia</span>
            <select name="subject_id" required>
              ${r.map(e=>`<option value="${z(e.id)}">${z(e.name)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Tipo</span>
            <select name="task_type">
              ${Object.entries(ve).map(([e,t])=>`<option value="${e}" ${e===`project`?`selected`:``}>${z(t)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Unidad (opcional)</span>
            <select name="unit_id">
              <option value="">Sin unidad</option>
              ${i.map(e=>`<option value="${z(e.id)}">${z(e.subject_name||e.subject_id||``)} · ${z(e.title)}</option>`).join(``)}
            </select>
          </label>
          <label class="field"><span>Fecha de entrega</span><input name="due_at" type="datetime-local"></label>
          <label class="field"><span>Puntaje máximo</span><input name="max_score" type="number" min="0.1" step="0.1" value="10" required></label>
        </div>
        <label class="field"><span>Instrucciones</span><textarea name="instructions" rows="3" placeholder="Qué debe entregar el alumno, formato y criterios."></textarea></label>
        <button class="btn primary" type="submit">Crear tarea</button>
      </form>
    </article>

    ${t.length?t.map(e=>{let t=e.submissions||[],n=t.filter(e=>e.status===`submitted`||e.status===`late`).length;return`
        <article class="task-card" data-task-card="${z(e.id)}">
          <div class="task-head">
            <div>
              <span class="card-label" style="color:${z(e.subject_color||`var(--brand)`)}">${z(e.subject_name||`Materia`)}</span>
              <h3>${z(e.title)}</h3>
              <div class="task-meta">
                <span class="pill pill-blue">${z(e.group_name||`Grupo`)}</span>
                <span class="pill ${e.due_at&&new Date(e.due_at)<new Date?`pill-red`:`pill-green`}">${z(o(e))}</span>
                <span class="pill">${z(e.max_score)} pts</span>
                <span class="pill" data-task-count="${z(e.id)}">${n}/${t.length} entregadas</span>
                ${e.unit_title?`<span class="pill">${z(e.unit_title)}</span>`:``}
              </div>
            </div>
          </div>
          ${e.instructions?`<p class="muted task-instructions">${z(e.instructions)}</p>`:``}
          <div class="task-students">
            ${t.length?t.map(t=>`
              <div class="task-student" data-task-row data-task-id="${z(e.id)}" data-student-id="${z(t.student_id)}" data-status="${z(t.status||`pending`)}">
                <div class="attendance-who">
                  <span class="avatar small">${z((t.name||`?`).slice(0,1).toUpperCase())}</span>
                  <div>
                    <strong>${z(t.name)}</strong>
                    <small>${z(t.code)}</small>
                  </div>
                </div>
                <div class="status-seg" role="group" aria-label="Entrega de ${z(t.name)}">
                  ${Object.entries(a).map(([e,n])=>`
                    <button class="status-btn ${(t.status||`pending`)===e?`active`:``}" type="button" data-task-status="${e}">${z(n)}</button>
                  `).join(``)}
                </div>
                <input class="task-score" type="number" min="0" max="${z(e.max_score)}" step="0.1" value="${t.score??``}" placeholder="Pts" data-task-score aria-label="Puntaje de ${z(t.name)}">
                <button class="btn-mini primary" type="button" data-save-task-submission>Guardar</button>
              </div>
            `).join(``):`<p class="empty-state">Este grupo no tiene alumnos activos.</p>`}
          </div>
        </article>
      `}).join(``):`<article class="card wide"><p class="empty-state">Aún no hay tareas. Crea la primera arriba.</p></article>`}
  `}function tn(e){let t=e.activity||[];return`
    <div class="section-title">
      <div>
        <span class="card-label">Actividad</span>
        <h2>Registro de actividades</h2>
      </div>
      <span class="pill">${t.length} eventos recientes</span>
    </div>
    <article class="card wide">
      <div class="activity-filters" data-activity-filters>
        ${[[`todo`,`Todo`],[`ejercicio`,`Ejercicios`],[`unidad`,`Unidades`],[`tarea`,`Tareas`],[`calificacion`,`Calificaciones`],[`observacion`,`Observaciones`]].map(([e,t],n)=>`
          <button class="filter-chip ${n===0?`active`:``}" type="button" data-activity-filter="${e}">${z(t)}</button>
        `).join(``)}
      </div>
      <div class="activity-feed" data-activity-feed>
        ${t.length?t.map(e=>`
          <div class="activity-item" data-activity-kind="${z(e.kind)}">
            <span class="activity-emoji" aria-hidden="true">${z(e.emoji||`•`)}</span>
            <div class="activity-body">
              <strong>${z(e.title||`Actividad`)}</strong>
              <span>${z(e.detail||``)}</span>
              <small>${z(e.name||``)}${e.student?` · ${z(e.student)}`:``} · ${z(J(e.ts))}</small>
            </div>
          </div>
        `).join(``):`<p class="empty-state">Todavía no hay actividad registrada. En cuanto haya ejercicios, entregas o calificaciones aparecerán aquí.</p>`}
      </div>
    </article>
  `}function nn(e){let t=e.students||[];return`
    <div class="section-title">
      <div>
        <span class="card-label">Tutores</span>
        <h2>Invitaciones por correo y avisos a tutores</h2>
      </div>
    </div>
    <article class="card wide">
      <div class="card-heading"><div><span class="card-label">Alumnos</span><h2>Vínculos con tutores</h2></div></div>
      ${t.length?`
        <ul class="data-list invite-list">
          ${t.map(e=>`
            <li>
              <div>
                <strong>${z(e.full_name)}</strong>
                <small>${z(e.student_code)} · ${(e.guardians||[]).length} ${(e.guardians||[]).length===1?`tutor`:`tutores`} vinculado(s)</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-invite-toggle="${z(e.id)}">Invitar tutor</button>
                <button class="btn ghost" data-advise-student="${z(e.id)}">Avisar tutor</button>
                <button class="btn ghost" data-reissue-invite="${z(e.id)}" data-student-name="${z(e.full_name)}">Enlace de acceso</button>
              </div>
              <form class="form invite-form hidden" data-invite-form="${z(e.id)}" data-student-code="${z(e.student_code)}">
                <label class="field"><span>Nombre del tutor</span><input name="full_name" required placeholder="Nombre completo"></label>
                <label class="field"><span>Teléfono (WhatsApp)</span><input name="phone" type="tel" placeholder="52 1 55 1234 5678"></label>
                <label class="field"><span>Parentesco (opcional)</span><input name="relationship" placeholder="madre, padre…"></label>
                <label class="field"><span>Correo (opcional — si no tiene, se genera uno interno)</span><input name="email" type="email"></label>
                <div class="row">
                  <button class="btn primary" type="submit">Crear invitación</button>
                  <button class="btn ghost" type="button" data-invite-cancel="${z(e.id)}">Cancelar</button>
                </div>
              </form>
              <div class="invite-result hidden" data-invite-result="${z(e.id)}"></div>
              <div class="advise-form hidden" data-advise-form="${z(e.id)}"></div>
            </li>
          `).join(``)}
        </ul>
      `:`<p class="empty-state">No hay alumnos. Da de alta primero.</p>`}
    </article>
  `}var rn=[`var(--brand)`,`var(--brand-2)`,`#0ea5e9`,`#f59e0b`,`#10b981`,`#ef4444`,`#ec4899`,`#14b8a6`];function an(e){let t=0;for(let n of String(e||``))t=t*31+n.charCodeAt(0)|0;return rn[Math.abs(t)%rn.length]}function on(e){if(!e.student)return`
      <article class="card wide">
        <span class="card-label">Mi espacio</span>
        <h2>Sin expediente de alumno</h2>
        <p>Tu cuenta existe, pero aún no está vinculada a un grupo.</p>
      </article>
    `;let t=I.profile?.full_name||`Alumno`,r=t.split(` `)[0],i=t.trim().slice(0,1).toUpperCase(),a=e.profile||{},o=Number(!!a.personality?.completed_at)+Number(!!a.aptitude?.completed_at);return`
    <section class="student-hero">
      <div class="student-hero-copy">
        <span class="kicker">Hola, ${z(r)} 👋</span>
        <h1>Tu camino al bachillerato</h1>
        <p class="muted">${z(e.group?[e.group.level,e.group.schedule].filter(Boolean).join(` · `)||`Grupo sin horario`:`Tu grupo aún no está asignado.`)}</p>
        <div class="student-hero-chips">
          <span class="hero-chip">📚 ${ct(e.activeAssignments,`unidad activa`,`unidades activas`)}</span>
          <span class="hero-chip">🧭 ${o} de 2 tests completados</span>
          <span class="hero-chip">🎓 ${z(e.student.student_code)}</span>
        </div>
      </div>
      <div class="student-hero-actions">
        <span class="student-avatar" aria-hidden="true">${z(i)}</span>
        <a class="btn primary" href="./curso/">📚 Abrir curso completo</a>
        <a class="btn ghost" href="${y}" target="_blank" rel="noopener">📖 Guía de examen</a>
      </div>
    </section>

    <div class="section-title">
      <div>
        <span class="card-label">Tus unidades</span>
        <h2>${e.units.length?`Sigue tu ruta de estudio`:`Aún no hay unidades`}</h2>
      </div>
      ${e.units.length?`<span class="pill">${e.units.length}</span>`:``}
    </div>

    ${e.units.length?`
      <div class="student-unit-grid">
        ${e.units.map(e=>{let t=e.progress?.status||`not_started`,n=P[t]||`Sin empezar`,r=e.progress?.best_accuracy==null?null:`${Math.round(e.progress.best_accuracy)}%`,i=e.progress?.attempts_count||0;return`
            <article class="student-unit-card" style="--accent:${an(e.unit?.subject_name)}">
              <div class="student-unit-top">
                <span class="student-unit-subject">${z(e.unit?.subject_name||`Materia`)}</span>
                <span class="pill ${t===`completed`||t===`mastered`?`success`:t===`in_progress`?`pill-blue`:``}">${z(n)}</span>
              </div>
              <h3>${z(e.unit?.title||`Unidad`)}</h3>
              <div class="student-unit-stats">
                ${r?`<span class="hero-chip">🎯 ${z(r)}</span>`:``}
                ${i>0?`<span class="hero-chip">🔄 ${i} ${i===1?`intento`:`intentos`}</span>`:``}
              </div>
              <button class="btn ghost" data-open-unit="${z(e.id)}">${t===`completed`||t===`mastered`?`Repasar →`:`Estudiar →`}</button>
            </article>
          `}).join(``)}
      </div>
    `:`<article class="card wide"><p class="empty-state">Tus unidades aparecerán aquí cuando el profesor las active. 🔒</p></article>`}

    ${E(e.exam)}
    ${n()}
    ${cn(e)}
  `}function sn(e,t){let n=t===`personality`?e?.personality:e?.aptitude;return n&&typeof n==`object`?n:null}function cn(e){let t=e.profile||{},n=sn(t,`personality`),r=sn(t,`vocational`),i=!!n?.completed_at,a=!!r?.completed_at,o=Array.isArray(t.interests)?t.interests:[],s=Array.isArray(t.aptitudes)?t.aptitudes:[],c=(Array.isArray(t.career_suggestions)?t.career_suggestions:[]).slice(0,3).map(e=>typeof e==`string`?e:e?.name).filter(Boolean);return`
    <article class="card wide student-tests">
      <div class="card-heading">
        <div>
          <span class="card-label">Mi orientación</span>
          <h2>Conócete y descubre tu camino</h2>
        </div>
        <span class="pill">${i&&a?`2 de 2 completados`:`${Number(i)+Number(a)} de 2 completados`}</span>
      </div>
      <p class="muted">Responde con calma y honestidad. No hay respuestas correctas: tus resultados ayudan a tu profesor a acompañarte mejor.</p>

      <div class="test-grid">
        <div class="test-card ${i?`done`:``}">
          <span class="test-emoji" aria-hidden="true">🧠</span>
          <div class="test-copy">
            <strong>Test de personalidad</strong>
            <p>15 preguntas sobre tu forma de ser, aprender y convivir.</p>
            <span class="pill ${i?`success`:``}">${i?`Completado`:`Pendiente`}</span>
          </div>
          <button class="btn ${i?`ghost`:`primary`}" data-start-test="personality">${i?`Volver a hacerlo`:`Comenzar`}</button>
        </div>

        <div class="test-card ${a?`done`:``}">
          <span class="test-emoji" aria-hidden="true">🧭</span>
          <div class="test-copy">
            <strong>Test de orientación vocacional</strong>
            <p>Intereses, aptitudes y carreras que podrían encajar contigo.</p>
            <span class="pill ${a?`success`:``}">${a?`Completado`:`Pendiente`}</span>
          </div>
          <button class="btn ${a?`ghost`:`primary`}" data-start-test="vocational">${a?`Volver a hacerlo`:`Comenzar`}</button>
        </div>
      </div>

      ${o.length||s.length||c.length?`
        <div class="test-summary">
          ${c.length?`
            <div class="test-summary-block">
              <span class="card-label">Carreras que podrían interesarte</span>
              <div class="ficha-tags">
                ${c.map(e=>`<span class="ficha-tag">🎓 ${z(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
          ${o.length?`
            <div class="test-summary-block">
              <span class="card-label">Tus intereses</span>
              <div class="ficha-tags">
                ${o.slice(0,8).map(e=>`<span class="ficha-tag">${z(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
          ${s.length?`
            <div class="test-summary-block">
              <span class="card-label">Tus aptitudes</span>
              <div class="ficha-tags">
                ${s.slice(0,8).map(e=>`<span class="ficha-tag">${z(e)}</span>`).join(``)}
              </div>
            </div>
          `:``}
        </div>
      `:``}
    </article>
  `}function ln(e){let t={},n={};for(let r of be){let i=e[r.id];if(i==null)continue;let a=r.reverse?5-i:i+1;t[r.dim]=(t[r.dim]||0)+a,n[r.dim]=(n[r.dim]||0)+1}let r={};for(let e of Object.keys(ye)){let i=n[e]||0,a=t[e]||0;r[e]=i?Math.max(0,Math.min(100,Math.round((a-i)/Math.max(1,i*4)*100))):0}return r}function un(e){let t=new Set,n={};for(let r of F){let i=Array.isArray(e[r.id])?e[r.id]:[];n[r.id]=i;for(let e of i){let n=r.options.find(t=>t.label===e);for(let e of n?.tags||[])t.add(e)}}let r=[...new Set([...e.series||[],...e.subjects||[],...e.activities||[]])],i=[...new Set(e.aptitudes||[])],a=[...new Set(e.workdays||[])],o=[...new Set(e.environment||[])],s=[...new Set(e.values||[])],c=[...new Set(e.future||[])],l={};for(let e of Se)for(let t of e.tags)l[t]=(l[t]||0)+1;let u=Se.map(e=>{let n=e.tags.filter(e=>t.has(e)),r=n.reduce((e,t)=>e+1/l[t],0);return{name:e.name,matches:n,weight:r}}).filter(e=>e.matches.length>0).sort((e,t)=>t.weight-e.weight||e.name.localeCompare(t.name)).slice(0,8),d=u[0]?.weight||1,f=u.map(e=>({name:e.name,score:Math.round(e.weight/d*100),matches:e.matches}));return{version:1,completed_at:new Date().toISOString(),interests:r,aptitudes:i,workdays:a,environment:o,values:s,future:c,tags:[...t],career_suggestions:f,career_choice:e.career_choice||null}}function dn(e){return Object.entries(e).sort((e,t)=>t[1]-e[1]).slice(0,2).map(([e])=>e)}function fn(e){return e.kind===`personality`?be.length:F.length+1}function pn(e){return e.kind===`personality`?be[e.step]||null:F[e.step]||null}function mn(e){if(e.kind===`personality`){let t=be[e.step];if(!t)return``;let n=e.answers[t.id];return`
      <div class="test-scale">
        ${xe.map((e,t)=>`
          <button type="button" class="test-option ${n===t?`selected`:``}" data-test-option="${t}">
            <span aria-hidden="true">${e.emoji}</span>
            <strong>${z(e.label)}</strong>
          </button>
        `).join(``)}
      </div>
    `}if(e.step>=F.length){let t=un(e.answers).career_suggestions.map(e=>e.name),n=e.answers.career_choice||``;return`
      <div class="test-career-grid">
        ${t.map(e=>`
          <button type="button" class="test-option ${n===e?`selected`:``}" data-test-option="${z(e)}">
            <span aria-hidden="true">🎓</span>
            <strong>${z(e)}</strong>
          </button>
        `).join(``)}
        <button type="button" class="test-option ${n===`Aún no lo sé`?`selected`:``}" data-test-option="Aún no lo sé">
          <span aria-hidden="true">🤔</span>
          <strong>Aún no lo sé</strong>
        </button>
      </div>
      ${t.length?`<p class="hint">Estas carreras salen de tus intereses y aptitudes. Puedes elegir una o decir que aún no lo sabes.</p>`:``}
    `}let t=F[e.step],n=e.answers[t.id]||[],r=t.id===`values`?3:null;return`
    <div class="test-choice-grid">
      ${t.options.map(e=>`
        <button type="button" class="test-option ${n.includes(e.label)?`selected`:``}" data-test-option="${z(e.label)}">
          <span class="test-check" aria-hidden="true">${n.includes(e.label)?`✓`:`+`}</span>
          <strong>${z(e.label)}</strong>
        </button>
      `).join(``)}
    </div>
    <div class="test-choice-foot">
      <span class="pill">${n.length} seleccionados${r?` · máximo ${r}`:``}</span>
      <button type="button" class="btn-mini" data-test-clear ${n.length?``:`hidden`}>Limpiar selección</button>
    </div>
  `}function hn(e){let t=e.result||{},n=e.kind===`personality`?t.personality:t.aptitude,r=I.dashboard?.profile||{};if(e.kind===`personality`){let e=n?.scores||{},t=dn(e).map(e=>ye[e]?.label).filter(Boolean);return`
      <div class="test-result">
        <div class="test-result-hero">
          <span class="test-result-emoji" aria-hidden="true">🧠</span>
          <div>
            <span class="card-label">Test completado</span>
            <h2>Tu perfil de personalidad</h2>
            <p class="muted">${t.length?`Tus rasgos más marcados son ${t.join(` y `)}.`:`Gracias por responder con honestidad.`}</p>
          </div>
        </div>

        <div class="test-score-list">
          ${Object.entries(ye).map(([t,n])=>{let r=e[t]??0;return`
              <div class="test-score">
                <div class="test-score-head">
                  <span>${n.emoji} ${z(n.label)}</span>
                  <strong>${r}%</strong>
                </div>
                <div class="ficha-bar" aria-hidden="true">
                  <div class="ficha-bar-fill" style="--bar-color:${r>=70?`var(--good)`:r>=40?`var(--brand)`:`var(--amber)`};--bar-scale:${(r/100).toFixed(3)}"></div>
                </div>
                <small>${z(n.copy)}</small>
              </div>
            `}).join(``)}
        </div>

        <div class="test-result-note">
          <strong>Tu profesor ya puede ver este resultado en tu ficha.</strong>
          <span>Puedes volver a hacer el test cuando quieras; se guardará la versión más reciente.</span>
        </div>

        <div class="test-result-actions">
          <button type="button" class="btn ghost" data-test-retry>Volver a hacerlo</button>
          <button type="button" class="btn primary" data-test-close>Cerrar</button>
        </div>
      </div>
    `}let i=Array.isArray(n?.career_suggestions)?n.career_suggestions:[],a=Array.isArray(n?.interests)?n.interests:[],o=Array.isArray(n?.aptitudes)?n.aptitudes:[],s=n?.career_choice||r.career_choice;return`
    <div class="test-result">
      <div class="test-result-hero">
        <span class="test-result-emoji" aria-hidden="true">🧭</span>
        <div>
          <span class="card-label">Test completado</span>
          <h2>Tu orientación vocacional</h2>
          <p class="muted">${s?`Elegiste ${z(s)} como una carrera que te llama la atención.`:`Estas son las carreras que mejor combinan con tus respuestas.`}</p>
        </div>
      </div>

      ${i.length?`
        <div class="test-career-results">
          <span class="card-label">Carreras sugeridas</span>
          ${i.map(e=>`
            <div class="test-career-row">
              <div>
                <strong>${z(e.name)}</strong>
                <small>${(e.matches||[]).map(e=>z(e)).join(` · `)||`Coincide con tu perfil`}</small>
              </div>
              <div class="test-career-score">
                <div class="ficha-bar" aria-hidden="true">
                  <div class="ficha-bar-fill" style="--bar-color:var(--brand-2);--bar-scale:${(Math.max(0,Math.min(100,e.score))/100).toFixed(3)}"></div>
                </div>
                <strong>${e.score}%</strong>
              </div>
            </div>
          `).join(``)}
        </div>
      `:`<p class="ficha-empty">Todavía no hay suficientes coincidencias. Puedes repetir el test eligiendo más intereses.</p>`}

      <div class="test-tag-columns">
        ${a.length?`
          <div class="test-summary-block">
            <span class="card-label">Intereses que elegiste</span>
            <div class="ficha-tags">${a.map(e=>`<span class="ficha-tag">${z(e)}</span>`).join(``)}</div>
          </div>
        `:``}
        ${o.length?`
          <div class="test-summary-block">
            <span class="card-label">Aptitudes que reconociste</span>
            <div class="ficha-tags">${o.map(e=>`<span class="ficha-tag">${z(e)}</span>`).join(``)}</div>
          </div>
        `:``}
      </div>

      <div class="test-result-note">
        <strong>Tu profesor ya puede ver estos intereses y carreras en tu ficha.</strong>
        <span>Puedes repetir el test si tus gustos cambian.</span>
      </div>

      <div class="test-result-actions">
        <button type="button" class="btn ghost" data-test-retry>Volver a hacerlo</button>
        <button type="button" class="btn primary" data-test-close>Cerrar</button>
      </div>
    </div>
  `}function gn(e){let t=fn(e),n=Math.min(e.step,t-1);if(e.kind===`personality`){let t=be[n];return t?e.answers[t.id]!=null:!1}return n>=F.length?!!e.answers.career_choice:(e.answers[F[n].id]||[]).length>0}function _n(){let e=I.activeTest;if(!e)return``;if(e.saved)return`
      <div class="test-overlay" data-test-overlay>
        <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
          <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>
          <div class="test-body">${hn(e)}</div>
        </section>
      </div>
    `;let t=fn(e),n=Math.min(e.step,t-1),r=Math.round((n+1)/t*100),i=pn(e),a=e.kind===`vocational`&&n>=F.length,o=e.kind===`personality`?`Test de personalidad`:`Test de orientación vocacional`,s=e.kind===`personality`?`Pregunta ${n+1}`:a?`Tu carrera ideal`:F[n].title,c=e.kind===`personality`?i.text:a?`¿Cuál de estas carreras te llama más la atención?`:F[n].prompt,l=e.kind===`personality`?`Elige la opción que mejor te describa. No hay respuestas buenas o malas.`:a?`Puedes elegir una carrera o decir que aún no lo sabes.`:F[n].help,u=gn(e);return`
    <div class="test-overlay" data-test-overlay>
      <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
        <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>

        <header class="test-header">
          <div>
            <span class="card-label">${z(o)}</span>
            <h2 id="test-title">${z(s)}</h2>
          </div>
          <span class="pill">${n+1} / ${t}</span>
        </header>

        <div class="test-progress" aria-hidden="true">
          <div class="test-progress-fill" style="width:${r}%"></div>
        </div>

        <div class="test-body">
          <h3 class="test-prompt">${z(c)}</h3>
          <p class="test-help">${z(l)}</p>
          ${mn(e)}
          <div class="test-error" data-test-error hidden></div>
        </div>

        <footer class="test-footer">
          <button type="button" class="btn ghost" data-test-back ${n===0?`disabled`:``}>← Atrás</button>
          <button type="button" class="btn primary" data-test-next aria-disabled="${u?`false`:`true`}" ${u?``:`data-pending="1"`}>
            ${n===t-1?`Guardar resultados`:`Siguiente →`}
          </button>
        </footer>
      </section>
    </div>
  `}function vn(){let e=document.querySelector(`[data-test-overlay]`);if(!e)return;let t=I.activeTest;if(!t)return;let n=()=>xn({refresh:!0});if(e.querySelectorAll(`[data-test-close]`).forEach(e=>{e.addEventListener(`click`,n)}),e.addEventListener(`click`,t=>{t.target===e&&n()}),I.activeTest.escHandler=je(e,n),t.saved){e.querySelectorAll(`[data-test-retry]`).forEach(e=>{e.addEventListener(`click`,()=>{let e=t.kind;xn({silent:!0}),bn(e)})});return}let r=()=>{let t=e.querySelector(`.test-dialog`);t&&(t.scrollTop=0)},i=()=>{let n=e.querySelector(`[data-test-next]`);if(!n)return;let r=gn(t);n.setAttribute(`aria-disabled`,r?`false`:`true`),r?n.removeAttribute(`data-pending`):n.setAttribute(`data-pending`,`1`)},a=()=>{let n=e.querySelector(`.test-choice-foot`);if(!n)return;let r=F[t.step];if(!r)return;let a=Array.isArray(t.answers[r.id])?t.answers[r.id]:[],o=r.id===`values`?3:null,s=n.querySelector(`.pill`);s&&(s.textContent=`${a.length} seleccionados${o?` · máximo ${o}`:``}`);let c=n.querySelector(`[data-test-clear]`);c&&(c.hidden=a.length===0),i()};e.querySelectorAll(`[data-test-option]`).forEach(n=>{n.addEventListener(`click`,()=>{let i=n.dataset.testOption,o=fn(t);if(t.kind===`personality`){let e=be[t.step];t.answers[e.id]=Number(i),t.step<o-1?(t.step+=1,yn(),r()):Sn(null);return}if(t.step>=F.length){t.answers.career_choice=i,n.classList.add(`selected`);let r=e.querySelector(`[data-test-error]`);r&&(r.hidden=!1,r.textContent=`Guardando tus resultados…`),Sn(null);return}let s=F[t.step],c=Array.isArray(t.answers[s.id])?[...t.answers[s.id]]:[],l=c.indexOf(i),u=s.id===`values`?3:null;l>=0?c.splice(l,1):(!u||c.length<u)&&c.push(i),t.answers[s.id]=c;let d=c.includes(i);n.classList.toggle(`selected`,d);let f=n.querySelector(`.test-check`);f&&(f.textContent=d?`✓`:`+`),a()})});let o=e.querySelector(`[data-test-clear]`);o&&o.addEventListener(`click`,()=>{let n=F[t.step];n&&(t.answers[n.id]=[],e.querySelectorAll(`[data-test-option].selected`).forEach(e=>{e.classList.remove(`selected`);let t=e.querySelector(`.test-check`);t&&(t.textContent=`+`)}),a())}),e.querySelector(`[data-test-back]`)?.addEventListener(`click`,()=>{t.step>0&&(--t.step,yn(),r())}),e.querySelector(`[data-test-next]`)?.addEventListener(`click`,async n=>{if(!gn(t)){let n=e.querySelector(`[data-test-error]`);n&&(n.hidden=!1,n.textContent=t.kind===`personality`?`Elige una opción antes de continuar.`:`Selecciona al menos una opción antes de continuar.`);return}let r=fn(t);t.step<r-1?(t.step+=1,yn()):await Sn(n.currentTarget)})}function yn(){document.querySelectorAll(`[data-test-overlay]`).forEach(e=>e.remove()),I.activeTest?.escHandler&&(I.activeTest.escHandler(),I.activeTest.escHandler=null);let e=_n();e?(document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`test-open`),vn(),requestAnimationFrame(()=>{document.querySelector(`[data-test-close]`)?.focus()})):document.body.classList.remove(`test-open`)}function bn(e){I.activeTest={kind:e,step:0,answers:{},saved:!1,result:null,escHandler:null},yn()}function xn({silent:e=!1,refresh:t=!1}={}){I.activeTest?.escHandler&&I.activeTest.escHandler(),I.activeTest=null,document.querySelectorAll(`[data-test-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`test-open`),t&&!e&&$()}async function Sn(e){let t=I.activeTest;if(!t||t.saving||e?.disabled)return;t.saving=!0;let n=document.querySelector(`[data-test-error]`);n&&e&&(n.hidden=!0,n.textContent=``);let i;if(t.kind===`personality`){let e=ln(t.answers);i={version:1,completed_at:new Date().toISOString(),scores:e,top:dn(e),answers:t.answers}}else i=un(t.answers);e&&(e.disabled=!0,e.textContent=`Guardando…`);let{data:a,error:o}=await r.rpc(`app_save_student_test`,{p_kind:t.kind,p_payload:i});o?(t.saving=!1,e&&(e.disabled=!1,e.textContent=`Guardar resultados`),n&&(n.hidden=!1,n.textContent=o.message||`No se pudieron guardar los resultados.`)):(t.saved=!0,t.result=a||{},t.savedAt=new Date().toISOString(),I.dashboard&&(I.dashboard.profile=I.dashboard.profile||{},t.kind===`personality`?I.dashboard.profile.personality=i:(I.dashboard.profile.aptitude=i,I.dashboard.profile.interests=i.interests,I.dashboard.profile.aptitudes=i.aptitudes,I.dashboard.profile.strengths=i.aptitudes,I.dashboard.profile.career_suggestions=i.career_suggestions,i.career_choice&&(I.dashboard.profile.career_choice=i.career_choice))),yn())}function Cn(e){let t=e.privacy||{},r=t.version||pe,i=t.url||`/privacidad.html`,a=e.children||[],o=e.pending||[],s=a.length>0,c=a.length+o.length,l=c?o.length?`Pendiente`:`Aceptado`:`Sin vínculos`,u=c&&!o.length?`success`:``;return`
    <article class="card wide privacy-gate">
      <div class="card-heading">
        <div>
          <span class="card-label">Privacidad</span>
          <h2>Aviso de privacidad ${z(r)}</h2>
        </div>
        <span class="pill ${u}">${l}</span>
      </div>
      ${c?`
        <p>Para consultar la información de tus hijos, lee el aviso y confirma que lo entiendes. Sin ese consentimiento, la plataforma no muestra datos del alumno.</p>
      `:`
        <p>Cuando la institución vincule a tus hijos, aparecerán aquí. Antes de mostrar sus datos deberás leer y aceptar el aviso de privacidad.</p>
      `}
      <div class="row">
        <a class="btn ghost" href="${z(i)}" target="_blank" rel="noopener">Leer el aviso completo</a>
      </div>
      ${o.length?`
        <label class="checkbox-field">
          <input type="checkbox" data-consent-ack>
          <span>He leído y entiendo el <a href="${z(i)}" target="_blank" rel="noopener">aviso de privacidad</a> ${z(r)}.</span>
        </label>
        <ul class="data-list">
          ${o.map(e=>`
            <li>
              <div>
                <strong>${z(e.label)}</strong>
                <small>Sin consentimiento vigente. No se muestran sus datos.</small>
              </div>
              <button class="btn primary" data-consent-student="${z(e.id)}" disabled>Aceptar y ver datos</button>
            </li>
          `).join(``)}
        </ul>
        <p class="hint">Marca la casilla para habilitar el botón. El consentimiento se registra por alumno.</p>
      `:c?`
        <p class="hint">Consentimiento vigente. Puedes revocarlo cuando quieras desde la lista de tus hijos.</p>
      `:``}
    </article>

    ${s?`
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Mis hijos</span>
            <h2>${ct(a.length,`alumno vinculado`,`alumnos vinculados`)}</h2>
          </div>
          <span class="pill">Solo lectura</span>
        </div>
        <ul class="data-list">
          ${a.map(e=>{let t=e.consent_accepted_at?q(String(e.consent_accepted_at).slice(0,10)):``;return`
              <li>
                <div>
                  <strong>${z(e.full_name)}</strong>
                  <small>${z(e.student_code)} · ${z(e.group_name)}${t?` · Consentimiento del ${z(t)}`:``}</small>
                </div>
                <button class="btn ghost" data-revoke-consent="${z(e.id)}" data-revoke-name="${z(e.full_name)}">Revocar consentimiento</button>
              </li>
            `}).join(``)}
        </ul>
        <p class="muted"><small>Si revocas el consentimiento, dejaremos de mostrar la información del alumno hasta que vuelvas a aceptar el aviso.</small></p>
      </article>
    `:``}

    ${s?wn(e):``}

    ${s?n():``}

    ${s?En(e):``}
  `}function wn(e){let t=e.children||[],n=e.academics||new Map;return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Seguimiento</span>
          <h2>Avance, calificaciones y tareas</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      <p class="muted"><small>Ves lo que el personal registra para tus hijos. No puedes editar nada desde aquí.</small></p>
      ${t.map(e=>Tn(e,n.get(e.id)||{})).join(``)}
    </article>
  `}function Tn(e,t){let n=t.stats||{},r=t.progress||[],i=t.grades||[],a=t.attendance||[],o=t.observations||[],s=t.tasks||[],c=t.guidance||{},l=a.reduce((e,t)=>(e[t.status]=(e[t.status]||0)+1,e),{}),u=a.length,d=u?Math.round(((l.present||0)+(l.late||0))*100/u):null,f=r.filter(e=>e.status===`completed`||e.status===`mastered`).length,p=r.filter(e=>e.status===`in_progress`).length,m=s.filter(e=>!e.submission||e.submission.status===`pending`),h=Array.isArray(c.interests)?c.interests:[],g=Array.isArray(c.aptitudes)?c.aptitudes:[],_=Array.isArray(c.strengths)?c.strengths:[],v=Array.isArray(c.career_suggestions)?c.career_suggestions.map(e=>typeof e==`string`?e:e?.name).filter(Boolean):[],y=h.length||g.length||_.length||v.length||c.career_choice,b=e=>e.submission?{pending:`Pendiente`,submitted:`Entregada`,late:`Entregada tarde`}[e.submission.status]||`Pendiente`:`Sin registrar`,x=e=>({present:`Asistencia`,late:`Retardo`,excused:`Justificado`,absent:`Falta`})[e]||e;return`
    <section class="guardian-child">
      <div class="guardian-child-head">
        <div>
          <h3>${z(e.full_name)}</h3>
          <small>${z(e.student_code)} · ${z(e.group_name)}</small>
        </div>
        <span class="pill">Solo lectura</span>
      </div>

      <div class="guardian-grid">
        <div class="guardian-block">
          <h4>Avance <span class="guardian-ro">Solo lectura</span></h4>
          <div class="guardian-chips">
            <span class="hero-chip">🎯 ${f} ${f===1?`unidad completada`:`unidades completadas`}</span>
            <span class="hero-chip">📚 ${p} en curso</span>
            <span class="hero-chip">⚡ ${Number(n.xp_total||0)} XP</span>
          </div>
          ${r.length?`
            <ul class="data-list compact">
              ${r.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${z(e.unit_title)}</strong>
                    <small>${z(e.subject_name||`Materia`)} · ${z(P[e.status]||e.status)}${e.best_accuracy==null?``:` · ${Math.round(e.best_accuracy)}%`}</small>
                  </div>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Todavía no hay avance registrado.</p>`}
        </div>

        <div class="guardian-block">
          <h4>Calificaciones visibles <span class="guardian-ro">Solo lectura</span></h4>
          ${i.length?`
            <ul class="data-list compact">
              ${i.slice(0,8).map(e=>`
                <li>
                  <div>
                    <strong>${z(e.assessment_name)}</strong>
                    <small>${z(e.subject_name||`Materia`)}${e.assessment_date?` · ${z(q(e.assessment_date))}`:``}</small>
                  </div>
                  <span class="pill ${e.score==null?``:`success`}">${e.score==null?`Pendiente`:`${e.score}/${e.max_score??`—`}`}</span>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Aún no hay calificaciones marcadas como visibles para la familia.</p>`}
        </div>

        <div class="guardian-block">
          <h4>Asistencia <span class="guardian-ro">Solo lectura</span></h4>
          ${u?`
            <div class="guardian-chips">
              <span class="hero-chip">✅ ${d}% de asistencia</span>
              ${Object.entries(l).map(([e,t])=>`<span class="hero-chip">${z(x(e))}: ${t}</span>`).join(``)}
            </div>
            <ul class="data-list compact">
              ${a.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${e.session_date?z(q(e.session_date)):`Sesión`}</strong>
                    <small>${z(e.topic||`Sin tema registrado`)}${e.minutes_late?` · ${e.minutes_late} min tarde`:``}</small>
                  </div>
                  <span class="pill ${e.status===`absent`?`pill-amber`:``}">${z(x(e.status))}</span>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Aún no hay registros de asistencia.</p>`}
        </div>

        <div class="guardian-block">
          <h4>Tareas <span class="guardian-ro">Solo lectura</span></h4>
          ${s.length?`
            <div class="guardian-chips">
              <span class="hero-chip">📝 ${m.length} pendientes</span>
            </div>
            <ul class="data-list compact">
              ${s.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${z(e.title)}</strong>
                    <small>${z(e.subject_name||`Materia`)}${e.due_at?` · entrega ${z(q(String(e.due_at).slice(0,10)))}`:``}</small>
                  </div>
                  <span class="pill ${e.submission?.status===`submitted`?`success`:e.submission?.status===`late`?`pill-amber`:``}">${z(b(e))}${e.submission?.score==null?``:` · ${e.submission.score}/${e.max_score??`—`}`}</span>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">Aún no hay tareas asignadas.</p>`}
        </div>

        <div class="guardian-block wide">
          <h4>Observaciones para la familia <span class="guardian-ro">Solo lectura</span></h4>
          ${o.length?`
            <ul class="data-list compact">
              ${o.slice(0,6).map(e=>`
                <li>
                  <div>
                    <strong>${z(e.category||`Observación`)}</strong>
                    <small>${z(q(String(e.created_at).slice(0,10)))}</small>
                    <p>${z(e.body)}</p>
                  </div>
                </li>
              `).join(``)}
            </ul>
          `:`<p class="empty-state">No hay observaciones visibles para la familia.</p>`}
        </div>

        <div class="guardian-block wide">
          <h4>Orientación vocacional <span class="guardian-ro">Solo lectura</span></h4>
          <p class="hint">Resumen orientativo, no diagnóstico. Las notas internas de orientación quedan reservadas al personal docente.</p>
          ${y?`
            ${c.career_choice?`<p><strong>Carrera de interés:</strong> ${z(c.career_choice)}</p>`:``}
            ${h.length?`<p><strong>Intereses:</strong> ${h.map(e=>z(e)).join(` · `)}</p>`:``}
            ${g.length?`<p><strong>Aptitudes:</strong> ${g.map(e=>z(e)).join(` · `)}</p>`:``}
            ${_.length?`<p><strong>Fortalezas:</strong> ${_.map(e=>z(e)).join(` · `)}</p>`:``}
            ${v.length?`<p><strong>Carreras sugeridas:</strong> ${v.slice(0,6).map(e=>z(e)).join(` · `)}</p>`:``}
          `:`<p class="empty-state">El alumno todavía no ha completado los test de orientación.</p>`}
        </div>
      </div>
    </section>
  `}function En(e){let t=e.billingByStudent||new Map,n=e.billingStatusByStudent||new Map;return`
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Cuentas</span>
          <h2>Plan y pagos de tus hijos</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      ${e.children.map(r=>{let i=t.get(r.id)||{},a=n.get(r.id)||{},o=i.plan||a.plan||`mensual`,s=Vt(r.id,e.payments),c=Ht(r.id,e.payments),l=Bt(r.id,e.payments).slice().sort((e,t)=>String(t.paid_at).localeCompare(String(e.paid_at))).slice(0,3),u=a.period_start?{start:a.period_start,end:a.period_end}:Ut(o),d=a.balance==null?null:Number(a.balance),f=d==null?`is-none`:d>0?`is-debt`:d<0?`is-credit`:`is-even`,p=d==null?`Sin datos`:d>0?`Por pagar`:d<0?`A favor`:`Al corriente`;return`
          <div class="guardian-pay">
            <div class="guardian-pay-head">
              <div>
                <strong>${z(r.full_name)}</strong>
                <small>${z(r.student_code)}</small>
              </div>
              <div class="pay-cells">
                <span class="pill">${z(Rt[o]||o)}${i.fee?` · ${Y(i.fee)}`:``}</span>
                ${a.status?`<span class="pill ${a.status===`al corriente`||a.status===`beca`?`success`:`pill-amber`}">${z(Gt(a.status))}</span>`:``}
                <span class="pill ${s>0?`success`:``}">Pagado: ${Y(s)}</span>
                ${c?`<span class="pill">Último pago: ${z(q(String(c.paid_at).slice(0,10)))}</span>`:`<span class="pill">Sin pagos registrados</span>`}
              </div>
            </div>
            <p class="muted pay-card-period"><small>📆 Periodo: ${u&&u.start?`${z(q(u.start))} – ${z(q(u.end))}`:`Sin periodo definido`}</small></p>
            <div class="pay-balance pay-balance-compact ${f}">
              <div>
                <span class="card-label">Saldo del periodo</span>
                <strong>${d==null?`—`:Y(Math.abs(d))}</strong>
              </div>
              <span class="pay-balance-tag">${p}</span>
            </div>
            <p class="muted"><small>Total histórico registrado: ${Y(s)} · Los pagos anulados no se contabilizan.</small></p>
            ${l.length?`
              <ul class="data-list">
                ${l.map(e=>`
                  <li>
                    <div>
                      <strong>${Y(e.amount)}${e.receipt_no?` · ${z(e.receipt_no)}`:``}</strong>
                      <small>${z(q(String(e.paid_at).slice(0,10)))} · ${z(zt[e.method]||e.method)}${e.period_start?` · ${z(q(e.period_start))}–${z(q(e.period_end))}`:``}${e.status===`voided`?` · Anulado`:``}</small>
                    </div>
                    <div class="pay-history-actions">
                      <span class="pill ${e.status===`voided`?`pill-amber`:`success`}">${z(Wt(e.status))}</span>
                      <button class="btn ghost" data-receipt-payment="${z(e.id)}" aria-label="Descargar recibo ${z(e.receipt_no||e.id)}">Recibo</button>
                    </div>
                  </li>
                `).join(``)}
              </ul>
            `:``}
            ${i.notes?`<p class="muted"><small>📝 ${z(i.notes)}</small></p>`:``}
            <p class="muted"><small>¿Algo no cuadra? Escribe a la institución para revisar tu estado de cuenta.</small></p>
          </div>
        `}).join(``)}
    </article>
  `}function Dn(e){return I.dashboardError?`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>No se pudo cargar</h2>
        <p>${z(I.dashboardError)}</p>
      </article>
    `:I.dashboard?I.dashboard.kind===`admin`?lt(I.dashboard):I.dashboard.kind===`teacher`?wt(I.dashboard):I.dashboard.kind===`guardian`?Cn(I.dashboard):on(I.dashboard):`
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `}function On(e){if(e.role===`admin`||e.role===`teacher`)return wt(I.dashboard);let t=ue[e.role]||`Usuario`,n=e.full_name||e.username||e.email||`Sin nombre`,r=e.username?`@${e.username}`:e.email||`Sin identificador`;return`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Sesión activa</span>
            <h1>Hola, ${z(n.split(` `)[0])}</h1>
            <p class="muted">${z(de[e.role]||`Tu cuenta está conectada.`)}</p>
          </div>
          <div class="identity">
            <span class="avatar">${z(n.slice(0,1).toUpperCase())}</span>
            <div>
              <strong>${z(n)}</strong>
              <small>${z(t)} · ${z(r)}</small>
            </div>
          </div>
        </section>

        ${Me()}

        <div class="grid">
          <article class="card">
            <span class="card-label">Conexión</span>
            <h2>Supabase conectado</h2>
            <p>La sesión y el perfil se cargaron desde la base. Entorno: <strong>${z(i)}</strong>.</p>
            <span class="pill success">Operativo</span>
          </article>

          <article class="card">
            <span class="card-label">Rol</span>
            <h2>${z(t)}</h2>
            <p>${z(de[e.role]||``)}</p>
            <span class="pill">${z(e.role)}</span>
          </article>

          ${Dn(e)}
        </div>

        <div class="row end">
          <button class="btn ghost" id="logout-btn">Cerrar sesión</button>
        </div>
      </main>
      ${Ne()}
    </div>
  `}function kn({total:e,page:t,target:n,pageSize:r=he}){let i=Math.max(1,Math.ceil(e/r)),a=Math.min(Math.max(1,t),i),o=e?(a-1)*r+1:0,s=Math.min(a*r,e);return`
    <div class="pagination" aria-label="Paginación">
      <span>Mostrando ${s-o+1} de ${e} · filas ${o}–${s}</span>
      <div class="row">
        <button class="btn-mini" data-pagination="${z(n)}" data-page="${a-1}" ${a<=1?`disabled`:``} aria-label="Página anterior">← Anterior</button>
        <span aria-live="polite">Página ${a} de ${i}</span>
        <button class="btn-mini" data-pagination="${z(n)}" data-page="${a+1}" ${a>=i?`disabled`:``} aria-label="Página siguiente">Siguiente →</button>
      </div>
    </div>
  `}function Z(e){return z(e).replaceAll(`
`,`<br>`)}function An(e){return P[e?.status]||`Sin empezar`}function jn(e,t){return t?e===t.correct_index?`correct`:e===t.selected_index&&!t.is_correct?`incorrect`:``:``}function Mn(e,t,n){let r=Array.isArray(e.options)?e.options:[],i=n.exerciseKey?`data-answer-kind="exercise" data-answer-key="${z(n.exerciseKey)}"`:`data-answer-kind="quiz" data-answer-part="${z(n.part)}" data-answer-key="${z(n.questionKey)}"`,a=n.exerciseKey?`exercise:${n.exerciseKey}`:`quiz:${n.part}:${n.questionKey}`;return`
    <article class="card wide question-card">
      <span class="card-label">${z(n.title||`Pregunta`)}</span>
      <h2>${z(e.prompt||`Pregunta`)}</h2>
      <div class="options">
        ${r.map((e,n)=>`
          <button class="option-btn ${jn(n,t)}"
            ${i}
            data-answer-index="${n}">
            ${z(e)}
          </button>
        `).join(``)}
      </div>
      ${t?`
        <div class="answer-box ${t.is_correct?`correct`:`incorrect`}">
          <strong>${t.is_correct?`Correcto`:`Todavía no`}</strong>
          ${t.explanation?`<p>${z(t.explanation)}</p>`:``}
          <div class="answer-foot">
            <small>Intento ${t.attempt_no||1}</small>
            <button class="btn-mini" data-retry-question="${z(a)}">↺ Reintentar</button>
          </div>
        </div>
      `:``}
    </article>
  `}function Nn(e,t){let n=String(e.key||``);return e.type===`exercise`?Mn(e,t[`exercise:${n}`],{title:`Ejercicio`,exerciseKey:n}):`
    <article class="card wide unit-section">
      <span class="card-label">${e.type===`example`?`Ejemplo`:`Lección`}</span>
      <h2>${z(e.title||`Sección`)}</h2>
      <p class="unit-body">${Z(e.body||``)}</p>
    </article>
  `}function Pn(e,t){let n=String(e.key||``),r=!!t;return`
    <article class="card wide question-card">
      <span class="card-label">Ejercicio ${z(n.replace(`ej-`,``))}</span>
      <h2>${z(e.prompt||`Ejercicio`)}</h2>
      ${e.figure?`<div class="figure">${z(e.figure)}</div>`:``}
      <button class="btn ghost reveal-btn" data-reveal="${z(n)}">Ver respuesta</button>
      <div class="flashcard-answer hidden" data-flashcard-answer="${z(n)}">
        <p class="unit-body"><strong>Respuesta:</strong> ${z(e.answer||``)}</p>
        ${(e.steps||[]).length?`
          <ol class="steps">
            ${e.steps.map(e=>`<li>${z(e)}</li>`).join(``)}
          </ol>
        `:``}
        ${(e.acceptedAnswers||[]).length?`
          <p class="muted"><small>También vale: ${e.acceptedAnswers.map(z).join(` · `)}</small></p>
        `:``}
        <div class="row">
          <button class="btn primary" data-answer-kind="flashcard"
            data-answer-key="${z(n)}" data-answer-text="${z(e.answer)}"
            ${r?`disabled`:``}>Lo acerté</button>
          <button class="btn ghost" data-answer-kind="flashcard"
            data-answer-key="${z(n)}" data-answer-text="x"
            ${r?`disabled`:``}>Todavía no</button>
        </div>
      </div>
      ${t?`
        <div class="answer-box ${t.is_correct?`correct`:`incorrect`}">
          <strong>${t.is_correct?`Correcto`:`Todavía no`}</strong>
          ${t.explanation?`<p>${z(t.explanation)}</p>`:``}
          <small>Intento ${t.attempt_no||1}</small>
        </div>
      `:``}
    </article>
  `}function Fn(e,t,n){return`
    <article class="card wide unit-section">
      <span class="card-label">${z(e)}</span>
      <h2>${z(t)}</h2>
      <p class="unit-body">${Z(n)}</p>
    </article>
  `}function In(e,t){return`
    <article class="card wide unit-section">
      <span class="card-label">Ejemplo ${t+1}</span>
      <h2>${z(e.prompt||`Ejemplo`)}</h2>
      ${(e.steps||[]).length?`
        <ol class="steps">
          ${e.steps.map(e=>`<li>${z(e)}</li>`).join(``)}
        </ol>
      `:``}
      ${e.result?`<p class="unit-body"><strong>Resultado:</strong> ${z(e.result)}</p>`:``}
    </article>
  `}function Ln(e){if(!e||typeof e!=`object`)return``;let t=e.intro,n=Array.isArray(e.bloques)?e.bloques:[];return(t?`
    <article class="card wide unit-section">
      <span class="card-label">Capítulo</span>
      <h2>${z(t.t||`Antes de empezar`)}</h2>
      ${t.p1?`<p class="unit-body">${Z(t.p1)}</p>`:``}
      ${t.p2?`<p class="unit-body">${Z(t.p2)}</p>`:``}
      ${(t.items||[]).length?`
        <ul class="steps">
          ${t.items.map(e=>`<li>${z(String(e))}</li>`).join(``)}
        </ul>
      `:``}
    </article>
  `:``)+n.map(e=>`
    <article class="card wide unit-section">
      <span class="card-label">${z(e.rotulo||`Bloque`)}</span>
      <h2>${z(e.nombre||`Sección del capítulo`)}</h2>
      ${e.intro?`<p class="unit-body">${Z(e.intro)}</p>`:``}
      ${(e.cards||[]).map(e=>`
        <div class="chapter-card">
          <strong>${z(e.titulo||``)}</strong>
          ${e.pill?`<span class="pill">${z(e.pill)}</span>`:``}
          ${e.hace?`<p class="unit-body">${Z(e.hace)}</p>`:``}
        </div>
      `).join(``)}
    </article>
  `).join(``)}function Rn(e){let t=Array.isArray(e.theory)?e.theory:[],n=Array.isArray(e.guides)?e.guides:[],r=Array.isArray(e.examples)?e.examples:[],i=Array.isArray(e.commonMistakes)?e.commonMistakes:[],a=Array.isArray(e.exercises)?e.exercises:[],o=e.unit?.hook||``,s=e.unit?.truco||``;return[o?Fn(`Para empezar`,`¿De qué trata?`,o):``,t.map((e,t)=>Fn(`Concepto`,`Idea ${t+1}`,e)).join(``),s?Fn(`Truco`,`Recuerda`,s):``,n.map((e,t)=>Fn(`Guía práctica`,`Actividad ${t+1}`,e)).join(``),r.map(In).join(``),i.map(e=>`
      <article class="card wide unit-section mistake-card">
        <span class="card-label">Error común</span>
        <h2>${z(e.title||`Cuidado`)}</h2>
        <p class="unit-body">${Z(e.detail||``)}</p>
      </article>
    `).join(``),Ln(e.chapter),a.map(e=>Pn(e,I.unitResults[`exercise:${e.key}`])).join(``)].join(``)}function zn(e,t){let n=Array.isArray(e.quiz)?e.quiz:[],r=e.reto&&typeof e.reto==`object`?e.reto:null;return[...n.map(e=>{let n=e.part||`tipo`,r=String(e.key||``);return Mn(e,t[`quiz:${n}:${r}`],{title:fe[n]||`Quiz`,part:n,questionKey:r})}),r?Mn(r,t[`quiz:reto:${String(r.key||``)}`],{title:`Reto final`,part:`reto`,questionKey:String(r.key||``)}):``].join(``)}function Bn(e){if(!e)return``;if(e.loading)return`
      <div class="shell">
        ${H()}
        <main id="main-content" tabindex="-1" class="dashboard">
          <section class="welcome">
            <div>
              <span class="kicker">Unidad activa</span>
              <h1>Abriendo unidad…</h1>
              <p class="muted">Estamos cargando el contenido y tu avance.</p>
            </div>
          </section>
          <div class="grid">
            <article class="card wide">
              <div class="spinner" aria-hidden="true"></div>
              <p>Cargando…</p>
            </article>
          </div>
          <div class="row end">
            <button class="btn ghost" id="back-btn">Volver al panel</button>
          </div>
        </main>
      </div>
    `;let t=e.assignment,n=e.unit,r=e.version?.content||{},i=Array.isArray(r.sections)&&r.sections.length>0,a=e.progress,o=a?.status===`completed`||a?.status===`mastered`,s=Array.isArray(r.unit?.objective)?r.unit.objective[0]:r.unit?.objective||``,c=n?.estimated_minutes||r.unit?.estimatedMinutes,l=n?.subject_name||r.unit?.subjectKey||`Materia`,u=i||Array.isArray(r.exercises)&&r.exercises.length>0||Array.isArray(r.quiz)&&r.quiz.length>0||!!r.reto,d=!e.requirements||e.requirements.can_complete,f=e.quizPolicy?.max_attempts,p=f===0?`sin límite de intentos`:Number.isInteger(f)&&f>0?`${f} intentos por pregunta`:``;return`
    <div class="shell">
      ${H()}
      <main id="main-content" tabindex="-1" class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Unidad activa</span>
            <h1>${z(n?.title||`Unidad`)}</h1>
            <p class="muted">${z(s||`Contenido de la unidad.`)}</p>
          </div>
          <div class="identity">
            <span class="avatar">${z((n?.title||`U`).slice(0,1).toUpperCase())}</span>
            <div>
              <strong>${z(l)}</strong>
              <small>${z(An(a))}${c?` · ${c} min`:``}</small>
            </div>
          </div>
        </section>

        ${Me()}

        <div class="grid">
          <article class="card wide">
            <div class="card-heading">
              <div>
                <span class="card-label">Sesión</span>
                <h2>${z(n?.title||`Unidad`)}</h2>
              </div>
              <span class="pill ${o?`success`:``}">${z(An(a))}</span>
            </div>
            <p>${z(l)}${c?` · ${c} minutos estimados`:``}${e.version?.version?` · versión ${e.version.version}`:``}</p>
            ${t.instructions?`<p class="unit-body">${Z(t.instructions)}</p>`:``}
          </article>

          ${i?r.sections.map(e=>Nn(e,I.unitResults)).join(``):Rn(r)}
          ${zn(r,I.unitResults)}
          ${p?`<p class="hint">Política de intentos: ${z(p)}.</p>`:``}

          ${u?``:`<article class="card wide"><p class="empty-state">Esta versión todavía no tiene ejercicios.</p></article>`}

          ${e.requirements?`
            <article class="card wide requirement-card" role="status" aria-live="polite">
              <span class="card-label">Requisitos de completado</span>
              <p>${z(e.requirements.message)}</p>
              <small class="muted">Mínimo ${z(String(e.requirements.rules?.min_exercises_pct??60))} % de ejercicios y ${z(String(e.requirements.rules?.min_quiz_accuracy??70))} % de precisión en el quiz.</small>
            </article>
          `:``}
        </div>

        <div class="row end">
          <button class="btn ghost" id="back-btn">Volver al panel</button>
          <button class="btn primary" id="complete-unit-btn" ${o||!d?`disabled`:``}>
            ${o?`Unidad completada`:d?`Marcar como completada`:`Faltan requisitos`}
          </button>
        </div>
      </main>
    </div>
  `}function Q(){L.innerHTML=Bn(I.unitView);let e=L.querySelector(`#back-btn`);e&&e.addEventListener(`click`,Vn);let t=L.querySelector(`#complete-unit-btn`);t&&t.addEventListener(`click`,Gn),L.querySelectorAll(`[data-answer-key]`).forEach(e=>{e.addEventListener(`click`,Wn)}),L.querySelectorAll(`[data-retry-question]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.retryQuestion;t&&(delete I.unitResults[t],Q())})}),L.querySelectorAll(`[data-reveal]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.reveal,n=L.querySelector(`[data-flashcard-answer="${t}"]`);n&&(n.classList.toggle(`hidden`),e.textContent=n.classList.contains(`hidden`)?`Ver respuesta`:`Ocultar respuesta`)})}),Ie()}function Vn(){I.view=`dashboard`,I.unitView=null,I.unitResults={},I.error=``,I.notice=``,$(),G(I.profile)}async function Hn(e){let t=(I.dashboard?.units||[]).find(t=>t.id===e);if(t){I.view=`unit`,I.unitResults={},I.error=``,I.notice=``,I.unitView={assignment:t,unit:t.unit,version:null,progress:t.progress,requirements:null,quizPolicy:null,loading:!0},Q();try{let[e,n,i,a]=await Promise.all([r.from(`unit_versions`).select(`content,version`).eq(`id`,t.unit_version_id).maybeSingle(),r.rpc(`app_start_unit`,{p_assignment_id:t.id}),r.rpc(`app_unit_requirements`,{p_assignment_id:t.id}),r.rpc(`app_quiz_policy`)]);if(K(e.error),K(n.error),K(i.error),K(a.error),I.view!==`unit`||I.unitView?.assignment.id!==t.id)return;I.unitView={assignment:t,unit:t.unit,version:e.data,progress:n.data||t.progress,requirements:i.data,quizPolicy:a.data,loading:!1}}catch(e){if(I.view!==`unit`||I.unitView?.assignment.id!==t.id)return;console.error(`open_unit_error`,e?.message||e),B(`No se pudo abrir la unidad. ${e?.message||``}`.trim()),I.unitView={...I.unitView,loading:!1}}Q()}}async function Un(){let e=I.unitView;if(!e||e.loading)return;let{data:t,error:n}=await r.rpc(`app_unit_requirements`,{p_assignment_id:e.assignment.id});n||I.view===`unit`&&I.unitView?.assignment.id===e.assignment.id&&(I.unitView={...I.unitView,requirements:t},Q())}async function Wn(e){let t=e.currentTarget,n=I.unitView;if(!n||n.loading||t.disabled)return;let i=t.dataset.answerKind,a=t.dataset.answerKey,o=t.dataset.answerPart||`reto`,s=i===`exercise`||i===`flashcard`?`exercise:${a}`:`quiz:${o}:${a}`;if(!a)return;if(i===`flashcard`){I.error=``,I.notice=``,t.disabled=!0;try{let{data:e,error:i}=await r.rpc(`app_record_exercise_attempt`,{p_assignment_id:n.assignment.id,p_exercise_key:a,p_answer:{text:t.dataset.answerText||`x`},p_duration_ms:null});if(i)throw i;if(I.view!==`unit`||I.unitView?.assignment.id!==n.assignment.id)return;I.unitResults[s]=e,e.progress&&(I.unitView.progress=e.progress)}catch{if(I.view!==`unit`||I.unitView?.assignment.id!==n.assignment.id)return;B(`No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.`)}Q();return}let c=Number(t.dataset.answerIndex);if(!Number.isNaN(c)){I.error=``,I.notice=``,t.disabled=!0;try{let{data:e,error:t}=i===`exercise`?await r.rpc(`app_record_exercise_attempt`,{p_assignment_id:n.assignment.id,p_exercise_key:a,p_answer:{index:c},p_duration_ms:null}):await r.rpc(`app_submit_quiz_answer`,{p_assignment_id:n.assignment.id,p_part:o,p_question_key:a,p_selected_index:c});if(t)throw t;if(I.view!==`unit`||I.unitView?.assignment.id!==n.assignment.id)return;I.unitResults[s]={...e,selected_index:c},e.progress&&(I.unitView.progress=e.progress)}catch{if(I.view!==`unit`||I.unitView?.assignment.id!==n.assignment.id)return;B(`No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.`)}Q(),Un()}}async function Gn(){let e=I.unitView;if(!e||e.loading)return;let t=L.querySelector(`#complete-unit-btn`);t&&(t.disabled=!0,t.textContent=`Guardando…`),I.error=``,I.notice=``;let{data:n,error:i}=await r.rpc(`app_complete_unit`,{p_assignment_id:e.assignment.id});i?(B(i.message||`No se pudo completar la unidad. Revisa la conexión e intenta de nuevo.`),Q()):I.view===`unit`&&I.unitView?.assignment.id===e.assignment.id&&(I.unitView.progress=n,V(`Unidad marcada como completada.`),Q())}function Kn(e,t){let n=(I.dashboard?.groups||[]).find(t=>t.id===e),r=new Set((t?.overrides||[]).filter(e=>e.status===`closed`).map(e=>e.student_id));return(n?.students||[]).map(e=>({id:e.id,full_name:e.full_name||`Alumno sin nombre`,student_code:e.student_code||``,selected:!r.has(e.id)}))}function qn({mode:e,unitId:t,versionId:n,groupId:r,assignmentId:i=null}){let a=I.dashboard,o=i?(a?.assignments||[]).find(e=>e.id===i):null,s=r||o?.group_id,c=t||o?.unit_id,l=n||o?.unit_version_id,u=(a?.groups||[]).find(e=>e.id===s);if(!u||!c){B(`No se pudo identificar la unidad o el grupo.`);return}let d=(a?.publishedUnits||[]).find(e=>e.id===c),f=Kn(s,o);I.unitAssign={mode:e,unitId:c,versionId:l||Ft(a,c),groupId:s,assignmentId:i,unitTitle:d?.title||`Unidad`,groupName:u.name,students:f,closesAt:o?.closes_at?String(o.closes_at).slice(0,10):``,saving:!1,escHandler:null},Xn()}function Jn(){let e=I.unitAssign;if(!e)return``;let t=e.students.filter(e=>e.selected).length,n=t===e.students.length,r=t===0;return`
    <div class="unit-assign-overlay" data-unit-assign-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="unit-assign-title">
        <button type="button" class="ficha-close" data-unit-assign-close aria-label="Cerrar">✕</button>

        <header class="unit-assign-head">
          <span class="card-label">${e.mode===`activate`?`Activar unidad`:`Alumnos de la unidad`}</span>
          <h2 id="unit-assign-title">${z(e.unitTitle)}</h2>
          <p class="muted">${z(e.groupName)} · elige a qué alumnos se activa esta unidad.</p>
        </header>

        <div class="unit-assign-toolbar">
          <span class="pill ${t?`success`:`pill-red`}">${t}/${e.students.length} alumnos seleccionados</span>
          <div class="row">
            <button type="button" class="btn-mini" data-unit-assign-all ${n?`disabled`:``}>Todos</button>
            <button type="button" class="btn-mini" data-unit-assign-none ${r?`disabled`:``}>Ninguno</button>
          </div>
        </div>

        ${e.students.length?`
          <div class="unit-assign-list">
            ${e.students.map(e=>`
              <label class="unit-assign-row ${e.selected?`selected`:``}">
                <input type="checkbox" data-unit-assign-student="${z(e.id)}" ${e.selected?`checked`:``}>
                <span class="unit-assign-avatar" aria-hidden="true">${z((e.full_name||`A`).trim().slice(0,1).toUpperCase())}</span>
                <span class="unit-assign-name">
                  <strong>${z(e.full_name)}</strong>
                  <small>${z(e.student_code||`Sin matrícula`)}</small>
                </span>
                <span class="unit-assign-state">${e.selected?`Incluido`:`Excluido`}</span>
              </label>
            `).join(``)}
          </div>
        `:`<p class="ficha-empty">Este grupo todavía no tiene alumnos.</p>`}

        <label class="field unit-assign-date">
          <span>Fecha de cierre (opcional)</span>
          <input type="date" data-unit-assign-closes value="${z(e.closesAt)}">
          <small class="hint">Si la dejas vacía, la unidad quedará abierta hasta que la cierres.</small>
        </label>

        <div class="unit-assign-error" data-unit-assign-error hidden></div>

        <footer class="unit-assign-foot">
          <button type="button" class="btn ghost" data-unit-assign-close>Cancelar</button>
          <button type="button" class="btn primary" data-unit-assign-save ${t?``:`disabled`}>
            ${e.mode===`activate`?`Activar para ${t} ${t===1?`alumno`:`alumnos`}`:`Guardar cambios`}
          </button>
        </footer>
      </section>
    </div>
  `}function Yn(){let e=document.querySelector(`[data-unit-assign-overlay]`),t=I.unitAssign;if(!e||!t)return;let n=()=>Zn();e.querySelectorAll(`[data-unit-assign-close]`).forEach(e=>{e.addEventListener(`click`,n)}),e.addEventListener(`click`,t=>{t.target===e&&n()}),t.escHandler=je(e,n),e.querySelectorAll(`[data-unit-assign-student]`).forEach(e=>{e.addEventListener(`change`,()=>{let n=t.students.find(t=>t.id===e.dataset.unitAssignStudent);n&&(n.selected=e.checked),Xn()})}),e.querySelector(`[data-unit-assign-all]`)?.addEventListener(`click`,()=>{t.students.forEach(e=>{e.selected=!0}),Xn()}),e.querySelector(`[data-unit-assign-none]`)?.addEventListener(`click`,()=>{t.students.forEach(e=>{e.selected=!1}),Xn()});let r=e.querySelector(`[data-unit-assign-closes]`);r&&r.addEventListener(`change`,()=>{t.closesAt=r.value}),e.querySelector(`[data-unit-assign-save]`)?.addEventListener(`click`,e=>{Qn(e.currentTarget)})}function Xn(){document.querySelectorAll(`[data-unit-assign-overlay]`).forEach(e=>e.remove()),I.unitAssign?.escHandler&&(I.unitAssign.escHandler(),I.unitAssign.escHandler=null);let e=Jn();e?(document.body.insertAdjacentHTML(`beforeend`,e),document.body.classList.add(`unit-assign-open`),Yn(),requestAnimationFrame(()=>{document.querySelector(`[data-unit-assign-close]`)?.focus()})):document.body.classList.remove(`unit-assign-open`)}function Zn(){I.unitAssign?.escHandler&&I.unitAssign.escHandler(),I.unitAssign=null,document.querySelectorAll(`[data-unit-assign-overlay]`).forEach(e=>e.remove()),document.body.classList.remove(`unit-assign-open`)}async function Qn(e){let t=I.unitAssign;if(!t||t.saving)return;let n=t.students.filter(e=>e.selected);if(!n.length)return;let i=document.querySelector(`[data-unit-assign-error]`),a=()=>{t.saving=!1,e&&(e.disabled=!1,e.textContent=t.mode===`activate`?`Activar para ${n.length} ${n.length===1?`alumno`:`alumnos`}`:`Guardar cambios`)};i&&(i.hidden=!0,i.textContent=``),t.saving=!0,e&&(e.disabled=!0,e.textContent=`Guardando…`);let o=t.closesAt?`${t.closesAt}T23:59:59`:null;try{let e=t.assignmentId;if(t.mode===`activate`){if(!t.versionId)throw Error(`La unidad no tiene una versión publicada.`);let{data:n,error:i}=await r.from(`unit_assignments`).insert({group_id:t.groupId,unit_id:t.unitId,unit_version_id:t.versionId,status:`active`,visible:!0,opens_at:new Date().toISOString(),closes_at:o,created_by:I.profile?.id??null}).select(`id`).single();if(i)throw i;e=n.id}else{let{error:t}=await r.from(`unit_assignments`).update({closes_at:o}).eq(`id`,e);if(t)throw t}let i=t.students.filter(e=>!e.selected);if(i.length){let t=i.map(t=>({assignment_id:e,student_id:t.id,status:`closed`,created_by:I.profile?.id??null})),{error:n}=await r.from(`student_unit_overrides`).upsert(t,{onConflict:`assignment_id,student_id`});if(n)throw n}if(t.mode===`manage`&&n.length){let{error:t}=await r.from(`student_unit_overrides`).update({status:`active`}).eq(`assignment_id`,e).in(`student_id`,n.map(e=>e.id));if(t)throw t}let a=n.length;Zn(),V(t.mode===`activate`?`Unidad activada para ${a} ${a===1?`alumno`:`alumnos`}.`:`Alumnos de la unidad actualizados.`),await G(I.profile)}catch(e){a(),i&&(i.hidden=!1,i.textContent=e?.message||`No se pudo guardar la activación.`)}}function $n(e){let[t,n]=String(e.dataset.activateUnit||``).split(`:`),r=e.dataset.unitGroup||e.closest(`[data-group-id]`)?.dataset.groupId||I.subjectsGroupId;!t||!n||!r||e.disabled?B(`No se pudo identificar la unidad o el grupo.`):(I.error=``,I.notice=``,qn({mode:`activate`,unitId:t,versionId:n,groupId:r}))}function er(e){let t=e.dataset.manageAssignment,n=e.dataset.unitGroup;t&&!e.disabled&&(I.error=``,I.notice=``,qn({mode:`manage`,assignmentId:t,groupId:n}))}async function tr(e,t){let n=e.dataset.closeAssignment||e.dataset.reopenAssignment;if(!n||e.disabled)return;let i=t===`active`;I.error=``,I.notice=``,e.disabled=!0,e.textContent=i?`Reabriendo…`:`Cerrando…`;try{let{error:e}=await r.from(`unit_assignments`).update({status:t,...i?{closes_at:null,opens_at:new Date().toISOString()}:{}}).eq(`id`,n);if(e)throw e;V(i?`Unidad reabierta. Los alumnos pueden continuar.`:`Unidad cerrada. El progreso de los alumnos se conserva.`),await G(I.profile)}catch(t){B(t?.message||`No se pudo ${i?`reabrir`:`cerrar`} la unidad.`),e.disabled=!1,e.textContent=i?`Reabrir`:`Cerrar`}}function nr(e){return Array.isArray(e)?e.filter(Boolean).map(rr).join(`, `):``}function rr(e){return typeof e==`string`?e:e&&typeof e==`object`&&e.name?e.name:``}function ir(e){let t=(Array.isArray(e)?e:[]).map(e=>({name:typeof e==`string`?e:e?.name,matches:Array.isArray(e?.matches)?e.matches.map(String):[]})).filter(e=>!!e.name),n={};for(let e of Se)for(let t of e.tags)n[t]=(n[t]||0)+1;let r=t.map(e=>({...e,weight:e.matches.reduce((e,t)=>e+1/(n[t]||1),0)})).sort((e,t)=>t.weight-e.weight||e.name.localeCompare(t.name)),i=r[0]?.weight||1;return r.map(e=>({name:e.name,matches:e.matches,score:Math.round(e.weight/i*100)}))}function ar(e){return`<div class="ficha-loading"><span class="spinner" aria-hidden="true"></span><span>${z(e)}</span></div>`}function or(e,t,n,r,i){return`
    <div class="ficha-stat ${z(r||``)}">
      <span class="ficha-stat-icon" aria-hidden="true">${e}</span>
      <div class="ficha-stat-copy">
        <strong data-ficha-stat="${z(i)}">${z(t)}</strong>
        <small data-ficha-stat-label="${z(i)}">${z(n)}</small>
      </div>
    </div>
  `}function sr(e){let t=Math.max(0,Math.min(100,Math.round(Number(e)||0))),n=2*Math.PI*42,r=n*(1-t/100);return`
    <div class="ficha-ring ${Ot(t)}" role="img" aria-label="Score general ${t} de 100">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="ring-track" cx="50" cy="50" r="42" />
        <circle class="ring-fill" cx="50" cy="50" r="42" style="--dash:${n.toFixed(2)};--offset:${r.toFixed(2)}" />
      </svg>
      <div class="ficha-ring-center"><strong>${t}</strong><small>/100</small></div>
    </div>
  `}function cr(e){return e.length?`
    <div class="ficha-subject-list">
      ${e.map(e=>{let t=e.total?Math.round(e.done/e.total*100):0;return`
          <div class="ficha-subject">
            <div class="ficha-subject-head">
              <strong>${z(e.subject)}</strong>
              <span>${e.done}/${e.total} · ${t}%</span>
            </div>
            <div class="ficha-bar" aria-hidden="true">
              <div class="ficha-bar-fill" style="--bar-color:${z(e.color||`var(--brand)`)};--bar-scale:${(t/100).toFixed(3)}"></div>
            </div>
            <div class="ficha-subject-meta">
              ${e.accuracy==null?`Sin precisión registrada`:`🎯 ${e.accuracy}% precisión`}
              · ${e.done===e.total?`materia completa`:`${e.total-e.done} por completar`}
            </div>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Sin avance registrado todavía. Cuando empiece una unidad aparecerá aquí.</p>`}function lr(e){return e?`
    <article class="ficha-card ficha-focus">
      <span class="card-label">Siguiente paso</span>
      <h3>⏭️ ${z(e)}</h3>
      <p class="card-sub">Recomendación: abrir esta unidad en la siguiente sesión y revisar los ejercicios con menor precisión.</p>
      <span class="ficha-focus-chip">Enfoque sugerido</span>
    </article>
  `:`
      <article class="ficha-card ficha-focus ficha-focus-done">
        <span class="card-label">Siguiente paso</span>
        <h3>🎉 ¡Al día!</h3>
        <p class="card-sub">No le falta ninguna unidad por empezar. Aprovecha para reforzar las materias con menor precisión.</p>
      </article>
    `}function ur(e){return new Map((e.board||[]).map(e=>[e.id,e.name]))}function dr(e,t){let n=Array.isArray(t?.units)?t.units:[],r=ur(e);return n.length?`
    <div class="ficha-unit-list">
      ${n.map(e=>{let t=e.status||`not_started`,n=t===`completed`||t===`mastered`?`success`:t===`in_progress`?`pill-blue`:``;return`
          <div class="ficha-unit-row">
            <div class="ficha-unit-main">
              <strong>${z(e.unit||`Unidad`)}</strong>
              <small>${z(r.get(e.subject)||`Materia`)} · ${e.attempts||0} intentos${e.accuracy==null?``:` · 🎯 ${Math.round(e.accuracy)}%`}</small>
            </div>
            <span class="pill ${n}">${z(P[t]||t)}</span>
            <small class="ficha-unit-when">${e.last?z(J(e.last)):`Sin actividad`}</small>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Este alumno no tiene unidades asignadas.</p>`}function fr(e,t,n){let r=Array.isArray(n?.recent)?n.recent:[],i=(e.overview?.recent||[]).filter(e=>e.student===t.student_code).map(e=>({ts:e.ts,kind:e.kind===`completed`?`unidad`:`ejercicio`,text:e.text,ok:e.ok})),a=[...r,...i].filter(e=>e.ts).sort((e,t)=>new Date(t.ts)-new Date(e.ts)).slice(0,10);return a.length?`
    <div class="ficha-timeline">
      ${a.map(e=>{let t=e.kind===`quiz`?`🧠`:e.kind===`unidad`?`📚`:`✏️`;return`
          <div class="ficha-timeline-item">
            <span class="ficha-timeline-dot ${e.ok?`ok`:`bad`}" aria-hidden="true">${e.ok?`✓`:`✗`}</span>
            <div class="ficha-timeline-copy">
              <strong>${z(e.text)}</strong>
              <small>${z(J(e.ts))}</small>
            </div>
            <span class="ficha-timeline-emoji" aria-hidden="true">${t}</span>
          </div>
        `}).join(``)}
    </div>
  `:`<p class="ficha-empty">Sin actividad registrada todavía.</p>`}function pr(e,t){let n=Array.isArray(t)?t.map(rr).filter(Boolean):[];return n.length?`
    <div class="ficha-tag-group">
      <span class="card-label">${z(e)}</span>
      <div class="ficha-tags">
        ${n.map(e=>`<span class="ficha-tag">${z(e)}</span>`).join(``)}
      </div>
    </div>
  `:``}function mr(e){let t=e.personality&&typeof e.personality==`object`?e.personality:null,n=e.aptitude&&typeof e.aptitude==`object`?e.aptitude:null,r=!!t?.completed_at,i=!!n?.completed_at,a=t?.scores||{},o=Array.isArray(n?.career_suggestions)?n.career_suggestions:[],s=Array.isArray(n?.interests)?n.interests:[];return`
    <div class="ficha-test-results">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div>
            <h3>🧠 Test de personalidad</h3>
            <p class="card-sub">${r?`Respondido ${z(J(t.completed_at))}`:`El alumno todavía no ha respondido este test.`}</p>
          </div>
          <span class="pill ${r?`success`:``}">${r?`Completado`:`Pendiente`}</span>
        </div>
        ${r?`
          <div class="test-score-list">
            ${Object.entries(ye).map(([e,t])=>{let n=Number(a[e]??0);return`
                <div class="test-score">
                  <div class="test-score-head">
                    <span>${t.emoji} ${z(t.label)}</span>
                    <strong>${n}%</strong>
                  </div>
                  <div class="ficha-bar" aria-hidden="true">
                    <div class="ficha-bar-fill" style="--bar-color:${n>=70?`var(--good)`:n>=40?`var(--brand)`:`var(--amber)`};--bar-scale:${(Math.max(0,Math.min(100,n))/100).toFixed(3)}"></div>
                  </div>
                </div>
              `}).join(``)}
          </div>
        `:`<p class="ficha-empty">Cuando lo complete, aquí verás sus rasgos principales.</p>`}
      </article>

      <article class="ficha-card">
        <div class="ficha-card-head">
          <div>
            <h3>🧭 Orientación vocacional</h3>
            <p class="card-sub">${i?`Respondido ${z(J(n.completed_at))}`:`El alumno todavía no ha respondido este test.`}</p>
          </div>
          <span class="pill ${i?`success`:``}">${i?`Completado`:`Pendiente`}</span>
        </div>
        ${i?`
          ${o.length?`
            <div class="test-career-results">
              ${ir(o).slice(0,6).map(e=>`
                  <div class="test-career-row">
                    <div>
                      <strong>${z(e.name)}</strong>
                      <small>${e.matches.map(e=>z(e)).join(` · `)||`Coincide con su perfil`}</small>
                    </div>
                    <div class="test-career-score">
                      <div class="ficha-bar" aria-hidden="true">
                        <div class="ficha-bar-fill" style="--bar-color:var(--brand-2);--bar-scale:${(Math.max(0,Math.min(100,e.score))/100).toFixed(3)}"></div>
                      </div>
                      <strong>${e.score}%</strong>
                    </div>
                  </div>
                `).join(``)}
            </div>
          `:``}
          ${s.length?`
            <div class="test-summary-block">
              <span class="card-label">Intereses detectados</span>
              <div class="ficha-tags">${s.slice(0,12).map(e=>`<span class="ficha-tag">${z(e)}</span>`).join(``)}</div>
            </div>
          `:``}
        `:`<p class="ficha-empty">Cuando lo complete, aquí verás sus intereses y carreras sugeridas.</p>`}
      </article>
    </div>
  `}function hr(e,t){let n=[[`Carreras sugeridas`,t.career_suggestions],[`Intereses`,t.interests],[`Aptitudes`,t.aptitudes],[`Fortalezas`,t.strengths],[`Áreas a trabajar`,t.weaknesses]].map(([e,t])=>pr(e,t)).filter(Boolean).join(``);return`
    <div class="ficha-profile-summary">
      <div class="ficha-profile-career">
        <span class="card-label">Meta vocacional</span>
        <h3>${z(t.career_choice||`Aún sin definir`)}</h3>
        <p class="card-sub">${t.career_choice?`Carrera objetivo registrada para orientar su ruta.`:`Define la carrera que quiere estudiar para personalizar el acompañamiento.`}</p>
      </div>
      ${n?`<div class="ficha-tag-groups">${n}</div>`:`<p class="ficha-empty">Todavía no hay intereses ni aptitudes registradas.</p>`}
    </div>

    ${mr(t)}

    <form class="form ficha-profile-form" data-save-profile="${z(e.id)}">
      <div class="ficha-form-grid">
        <label class="field"><span>Carrera que quiere</span><input name="career_choice" value="${z(t.career_choice||``)}" placeholder="ej. Medicina"></label>
        <label class="field"><span>Áreas a trabajar (separadas por coma)</span><input name="weaknesses" value="${z(nr(t.weaknesses))}" placeholder="organización, ansiedad…"></label>
        <label class="field wide"><span>Notas de orientación vocacional</span><textarea name="vocational_notes" placeholder="Acuerdos, seguimiento y observaciones de orientación…">${z(t.vocational_notes||``)}</textarea></label>
      </div>
      <p class="hint">🔒 Carreras sugeridas, intereses, aptitudes y fortalezas salen de los tests del alumno; no se editan a mano.</p>
      <div class="ficha-form-actions">
        <button class="btn primary" type="submit">Guardar perfil profesional</button>
      </div>
    </form>
  `}function gr(e){return`
    <div class="ficha-observations-layout">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div><h3>✍️ Nueva observación</h3><p class="card-sub">Registra acuerdos, avances o situaciones a dar seguimiento.</p></div>
        </div>
        <form class="form" data-add-observation="${z(e.id)}">
          <div class="ficha-form-grid">
            <label class="field">
              <span>Categoría</span>
              <select name="category">
                <option value="">General</option>
                <option value="académico">Académico</option>
                <option value="conducta">Conducta</option>
                <option value="emocional">Emocional</option>
                <option value="vocacional">Vocacional</option>
                <option value="asistencia">Asistencia</option>
              </select>
            </label>
            <label class="field">
              <span>Visible para</span>
              <select name="visibility">
                <option value="internal">Solo personal</option>
                <option value="family">Personal y tutor</option>
              </select>
            </label>
            <label class="field wide"><span>Observación</span><textarea name="body" required placeholder="Escribe la observación…"></textarea></label>
          </div>
          <div class="ficha-form-actions">
            <button class="btn primary" type="submit">Agregar observación</button>
          </div>
        </form>
      </article>

      <article class="ficha-card">
        <div class="ficha-card-head">
          <div><h3>📝 Historial</h3><p class="card-sub">Observaciones internas y compartidas con el tutor.</p></div>
        </div>
        <div data-observations-list="${z(e.id)}">${ar(`Cargando observaciones…`)}</div>
      </article>
    </div>
  `}function _r(e,t,n=null){let r=e.studentProfiles?.get(t.id)||{},i=kt(e,t.student_code),a=At(e,t.student_code),o=(e.overview?.scores?.students||[]).find(e=>e.code===t.student_code)||{},s=n?.stats||{},c=Number(o.score??0),l=Number(s.xp??o.xp??t.stats?.xp_total??0),u=Number(s.streak??t.stats?.current_streak??0),d=Number(s.best??t.stats?.best_streak??0),f=Number(s.units??o.units_done??t.stats?.units_completed??0),p=Number(o.units_total??e.overview?.published_units_total??0),m=s.accuracy??o.accuracy??null,h=Number(o.absences??0),g=s.last||t.stats?.last_activity_date||null,_=(t.full_name||`A`).trim().slice(0,1).toUpperCase(),v=t.status||`active`,y=v===`active`?`Activa`:v===`inactive`?`Inactiva`:v;return`
    <div class="ficha-overlay" data-ficha-overlay>
      <section class="ficha-dialog" role="dialog" aria-modal="true" aria-labelledby="ficha-title" data-ficha-dialog="${z(t.id)}" data-detail-loaded="${n?`1`:`0`}">
        <button type="button" class="ficha-close" data-ficha-close aria-label="Cerrar ficha">✕</button>

        <header class="ficha-hero">
          <div class="ficha-hero-main">
            <div class="ficha-avatar" aria-hidden="true">${z(_)}</div>
            <div class="ficha-identity">
              <span class="ficha-eyebrow">Ficha del alumno</span>
              <h2 id="ficha-title">${z(t.full_name||`Alumno sin nombre`)}</h2>
              <div class="ficha-meta">
                <span class="ficha-chip">🎓 ${z(t.student_code||`—`)}</span>
                <span class="ficha-chip">👥 ${z(t.group_name||`Sin grupo`)}</span>
                <span class="ficha-chip ${v===`active`?`success`:``}">${z(y)}</span>
              </div>
            </div>
          </div>
          <div class="ficha-score">
            ${sr(c)}
            <span>Score general</span>
            <small data-ficha-last>${g?`Última actividad ${z(J(g))}`:`Sin actividad registrada`}</small>
          </div>
        </header>

        <div class="ficha-stat-grid">
          ${or(`⚡`,l.toLocaleString(`es-MX`),`XP acumulados`,`violet`,`xp`)}
          ${or(`🔥`,u,d?`Racha actual · récord ${d}`:`Racha actual`,`amber`,`streak`)}
          ${or(`📚`,p?`${f}/${p}`:f,`Unidades completadas`,`blue`,`units`)}
          ${or(`🎯`,m==null?`—`:`${Math.round(m)}%`,`Precisión en ejercicios`,`green`,`accuracy`)}
          ${or(`🗓️`,h,`Faltas registradas`,h?`red`:`green`,`absences`)}
        </div>

        <nav class="ficha-tabs" role="tablist" aria-label="Secciones de la ficha">
          <button type="button" class="ficha-tab active" data-ficha-tab="resumen" role="tab" aria-selected="true" aria-controls="ficha-panel-resumen">📊 Avance</button>
          <button type="button" class="ficha-tab" data-ficha-tab="perfil" role="tab" aria-selected="false" aria-controls="ficha-panel-perfil">🧭 Perfil profesional</button>
          <button type="button" class="ficha-tab" data-ficha-tab="observaciones" role="tab" aria-selected="false" aria-controls="ficha-panel-observaciones">📝 Observaciones</button>
        </nav>

        <div class="ficha-body">
          <section class="ficha-panel" data-ficha-panel="resumen" id="ficha-panel-resumen" role="tabpanel">
            <div class="ficha-overview-grid">
              <article class="ficha-card">
                <div class="ficha-card-head">
                  <div><h3>📚 Cómo va por materia</h3><p class="card-sub">Avance sobre las unidades publicadas de cada materia.</p></div>
                </div>
                ${cr(i)}
              </article>

              ${lr(a)}

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🧩 Unidades asignadas</h3><p class="card-sub">Estatus, intentos y precisión por unidad.</p></div>
                </div>
                <div data-ficha-units>${n?dr(e,n):ar(`Cargando unidades…`)}</div>
              </article>

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🕒 Actividad reciente</h3><p class="card-sub">Últimos ejercicios y quizzes registrados.</p></div>
                </div>
                <div data-ficha-activity>${n?fr(e,t,n):ar(`Cargando actividad…`)}</div>
              </article>
            </div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="perfil" id="ficha-panel-perfil" role="tabpanel">
            <div data-ficha-profile-panel>${hr(t,r)}</div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="observaciones" id="ficha-panel-observaciones" role="tabpanel">
            ${gr(t)}
          </section>
        </div>
      </section>
    </div>
  `}function vr(e,t=`ok`){if(!document.querySelector(`.ficha-dialog`)){t===`error`?B(e):V(e);return}let n=document.querySelector(`[data-ficha-toast]`);n||(n=document.createElement(`div`),n.dataset.fichaToast=``,document.body.appendChild(n)),n.className=`ficha-toast ${t}`,n.textContent=e,clearTimeout(n._hideTimer),n._hideTimer=setTimeout(()=>n.remove(),4200)}function yr(e,t=document){let n=t.querySelector(`[data-save-profile="${e}"]`);n&&n.addEventListener(`submit`,t=>Tr(t,e))}function br(e){let t=document.querySelector(`[data-ficha-overlay]`);if(!t)return;let n=()=>xr();t.querySelectorAll(`[data-ficha-close]`).forEach(e=>{e.addEventListener(`click`,n)}),t.addEventListener(`click`,e=>{e.target===t&&n()}),t.querySelectorAll(`[data-ficha-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.dataset.fichaTab;t.querySelectorAll(`[data-ficha-tab]`).forEach(t=>{let n=t===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,String(n))}),t.querySelectorAll(`[data-ficha-panel]`).forEach(e=>{e.classList.toggle(`hidden`,e.dataset.fichaPanel!==n)})})}),yr(e,t);let r=t.querySelector(`[data-add-observation="${e}"]`);r&&r.addEventListener(`submit`,t=>Dr(t,e)),I.fichaEscHandler=je(t,n),Er(e)}function xr({silent:e=!1}={}){let t=document.querySelector(`[data-ficha-overlay]`);t&&t.remove(),document.querySelectorAll(`[data-ficha-toast]`).forEach(e=>e.remove()),document.body.classList.remove(`ficha-open`),I.fichaEscHandler&&=(I.fichaEscHandler(),null);let n=I.fichaTrigger;I.fichaStudentId=null,I.fichaTrigger=null,!e&&n?.isConnected&&n.focus()}function Sr(e,t=null){let n=I.dashboard,r=(n?.students||[]).find(t=>t.id===e);r&&(xr({silent:!0}),I.fichaStudentId=e,I.fichaTrigger=t,document.body.insertAdjacentHTML(`beforeend`,_r(n,r)),document.body.classList.add(`ficha-open`),br(e),wr(e),requestAnimationFrame(()=>{document.querySelector(`[data-ficha-close]`)?.focus()}))}function Cr(e,t,n){let r=[...document.querySelectorAll(`[data-ficha-dialog]`)].find(e=>e.dataset.fichaDialog===t.id);if(!r)return;let i=n?.stats||{},a=(e.overview?.scores?.students||[]).find(e=>e.code===t.student_code)||{},o=Number(a.units_total??e.overview?.published_units_total??0),s=(e,t)=>{let n=r.querySelector(`[data-ficha-stat="${e}"]`);n&&(n.textContent=t)};s(`xp`,Number(i.xp??a.xp??0).toLocaleString(`es-MX`)),s(`streak`,String(i.streak??0)),i.best!=null&&((e,t)=>{let n=r.querySelector(`[data-ficha-stat-label="${e}"]`);n&&(n.textContent=t)})(`streak`,`Racha actual · récord ${i.best}`),s(`units`,o?`${i.units??0}/${o}`:String(i.units??0)),s(`accuracy`,i.accuracy==null?`—`:`${Math.round(i.accuracy)}%`);let c=r.querySelector(`[data-ficha-last]`);c&&(c.textContent=i.last?`Última actividad ${J(i.last)}`:`Sin actividad registrada`);let l=r.querySelector(`[data-ficha-units]`);l&&(l.innerHTML=dr(e,n));let u=r.querySelector(`[data-ficha-activity]`);u&&(u.innerHTML=fr(e,t,n)),r.dataset.detailLoaded=`1`}async function wr(e){let{data:t,error:n}=await r.rpc(`app_student_detail`,{p_student_id:e}),i=[...document.querySelectorAll(`[data-ficha-dialog]`)].find(t=>t.dataset.fichaDialog===e);if(!i)return;if(n||!t){let e=`No se pudo cargar el detalle: ${n?.message||`error`}`,t=i.querySelector(`[data-ficha-units]`),r=i.querySelector(`[data-ficha-activity]`);t&&(t.innerHTML=`<p class="ficha-empty">${z(e)}</p>`),r&&(r.innerHTML=`<p class="ficha-empty">${z(e)}</p>`);return}let a=(I.dashboard?.students||[]).find(t=>t.id===e);a&&Cr(I.dashboard,a,t)}async function Tr(e,t){e.preventDefault();let n=e.currentTarget,i=new FormData(n),a=e=>String(e||``).split(`,`).map(e=>e.trim()).filter(Boolean),o=e=>{let t=String(e||``).trim();if(!t)return{};try{let e=JSON.parse(t);return e&&typeof e==`object`?e:{nota:t}}catch{return{nota:t}}},s={student_id:t,career_choice:String(i.get(`career_choice`)||``).trim()||null,weaknesses:a(i.get(`weaknesses`)),vocational_notes:String(i.get(`vocational_notes`)||``).trim()||null,updated_at:new Date().toISOString()};i.has(`career_suggestions`)&&(s.career_suggestions=a(i.get(`career_suggestions`))),i.has(`interests`)&&(s.interests=a(i.get(`interests`))),i.has(`aptitudes`)&&(s.aptitudes=a(i.get(`aptitudes`))),i.has(`strengths`)&&(s.strengths=a(i.get(`strengths`))),i.has(`personality`)&&(s.personality=o(i.get(`personality`))),i.has(`aptitude`)&&(s.aptitude=o(i.get(`aptitude`))),I.error=``,I.notice=``;let c=n.querySelector(`button[type="submit"]`);c&&(c.disabled=!0);let{error:l}=await r.from(`student_profiles`).upsert(s,{onConflict:`student_id`});if(c&&(c.disabled=!1),l){vr(l?.message||`No se pudo guardar el perfil profesional.`,`error`);return}if(I.dashboard?.studentProfiles){let e=I.dashboard.studentProfiles.get(t)||{};I.dashboard.studentProfiles.set(t,{...e,...s})}let u=document.querySelector(`[data-ficha-profile-panel]`),d=(I.dashboard?.students||[]).find(e=>e.id===t);u&&d&&I.dashboard?.studentProfiles&&(u.innerHTML=hr(d,I.dashboard.studentProfiles.get(t)||{}),yr(t,u)),vr(`Perfil profesional guardado.`,`ok`)}async function Er(e){let t=document.querySelector(`[data-observations-list="${e}"]`);if(!t)return;let{data:n,error:i}=await r.from(`observations`).select(`id,category,body,visibility,created_at,author_id`).eq(`student_id`,e).is(`deleted_at`,null).order(`created_at`,{ascending:!1});t.innerHTML=i||!n?.length?i?`<p class="ficha-empty">No se pudieron cargar las observaciones: ${z(i.message||`error`)}</p>`:`<p class="ficha-empty">Sin observaciones todavía. La primera que registres aparecerá aquí.</p>`:`
    <div class="ficha-observation-list">
      ${n.map(e=>`
        <article class="ficha-observation">
          <div class="ficha-observation-head">
            <span class="ficha-chip">${z(e.category||`General`)}</span>
            <span class="ficha-chip ${e.visibility===`family`?`success`:``}">${e.visibility===`family`?`👨‍👩‍👧 Tutor`:`🔒 Interno`}</span>
            <small>${z(J(e.created_at))}</small>
          </div>
          <p>${z(e.body)}</p>
        </article>
      `).join(``)}
    </div>
  `}async function Dr(e,t){e.preventDefault();let n=e.currentTarget,i=new FormData(n),a=String(i.get(`category`)||``).trim(),o=String(i.get(`body`)||``).trim(),s=String(i.get(`visibility`)||`internal`);if(!o)return;let c=n.querySelector(`button[type="submit"]`);c&&(c.disabled=!0),I.error=``,I.notice=``;let{error:l}=await r.from(`observations`).insert({student_id:t,author_id:I.profile?.id??null,category:a||null,body:o,visibility:s});l?(vr(l?.message||`No se pudo guardar la observación.`,`error`),c&&(c.disabled=!1)):(n.reset(),c&&(c.disabled=!1),await Er(t),vr(`Observación guardada.`,`ok`))}async function Or(e){let t=e.dataset.saveGrade,n=e.dataset.student,i=e.closest(`.assessment-box`)?.querySelector(`[data-grade-student="${n}"]`);if(!t||!n||!i||e.disabled)return;let a=i.value.trim(),o=a===``?null:Number(a);if(o!==null&&(Number.isNaN(o)||o<0)){B(`El puntaje debe ser un número válido.`);return}I.error=``,I.notice=``,e.disabled=!0,e.textContent=`…`;let{error:s}=await r.from(`grades`).upsert({assessment_id:t,student_id:n,score:o,status:o===null?`pending`:`recorded`,recorded_by:I.profile?.id??null,recorded_at:new Date().toISOString()},{onConflict:`assessment_id,student_id`});s?(B(s?.message||`No se pudo guardar la calificación.`),e.disabled=!1,e.textContent=`Guardar`):(V(`Calificación guardada.`),e.disabled=!1,e.textContent=`Guardar`)}async function kr(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),i=t.dataset.createAssessment,a=t.dataset.group,o=String(n.get(`name`)||``).trim(),s=String(n.get(`type`)||`other`),c=Number(n.get(`max_score`)||0),l=String(n.get(`assessment_date`)||``).trim()||null,u=String(n.get(`term_id`)||``);if(!o||!c||c<=0||!a){B(`Completa nombre, puntaje máximo y grupo.`);return}if(u||=I.dashboard?.terms?.[0]?.id,!u){B(`No hay un trimestre configurado para esta evaluación.`);return}let d=t.querySelector(`button[type="submit"]`);d&&(d.disabled=!0),I.error=``,I.notice=``;let{error:f}=await r.from(`assessments`).insert({group_id:a,subject_id:i,term_id:u,name:o,type:s,max_score:c,assessment_date:l,created_by:I.profile?.id??null});f?(B(f?.message?.includes(`duplicate`)||f?.code===`23505`?`Ya existe una evaluación con ese nombre en la materia.`:f?.message||`No se pudo crear la evaluación.`),d&&(d.disabled=!1)):(V(`Evaluación creada. Ahora puedes calificar a cada alumno.`),await G(I.profile))}async function Ar(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),i=String(n.get(`group_id`)||``),a=String(n.get(`subject_id`)||``),o=String(n.get(`unit_id`)||``).trim(),s=String(n.get(`title`)||``).trim(),c=String(n.get(`instructions`)||``).trim(),l=String(n.get(`task_type`)||`project`),u=Number(n.get(`max_score`)||0),d=String(n.get(`due_at`)||``).trim();if(!i||!a||!s||!u||u<=0){B(`Completa grupo, materia, título y puntaje máximo.`);return}let f=t.querySelector(`button[type="submit"]`);f&&(f.disabled=!0,f.textContent=`Creando…`),I.error=``,I.notice=``;let{error:p}=await r.from(`tasks`).insert({group_id:i,subject_id:a,unit_id:o||null,title:s,instructions:c||null,task_type:l,due_at:d?new Date(d).toISOString():null,max_score:u,created_by:I.profile?.id??null});p?(B(p?.message||`No se pudo crear la tarea.`),f&&(f.disabled=!1,f.textContent=`Crear tarea`)):(V(`Tarea creada. Ya puedes registrar entregas y calificaciones.`),await jr(),await Mr().catch(()=>{}),$())}async function jr(){let{data:e,error:t}=await r.rpc(`app_staff_tasks`);if(t)throw t;I.dashboard&&(I.dashboard.tasks=(e||{}).tasks||[])}async function Mr(){let{data:e,error:t}=await r.rpc(`app_activity_log`,{p_limit:80});if(t)throw t;I.dashboard&&(I.dashboard.activity=(e||{}).entries||[])}async function Nr(e){let t=e.closest(`[data-task-row]`);if(!t)return;let n=t.dataset.taskId,i=t.dataset.studentId,a=t.dataset.status||`pending`,o=t.querySelector(`[data-task-score]`),s=String(o?.value||``).trim(),c=s===``?null:Number(s),l=Number(o?.max||0);if(c!==null&&Number.isNaN(c)){B(`El puntaje debe ser un número.`);return}if(c!==null&&l&&c>l){B(`El puntaje no puede superar ${l}.`);return}e.disabled=!0;let u=e.textContent;e.textContent=`…`,I.error=``,I.notice=``;let d=a===`pending`?null:new Date().toISOString(),{error:f}=await r.from(`task_submissions`).upsert({task_id:n,student_id:i,status:a,score:c,submitted_at:d,recorded_by:I.profile?.id??null,updated_at:new Date().toISOString()},{onConflict:`task_id,student_id`});if(f){B(f?.message||`No se pudo guardar la entrega.`),e.disabled=!1,e.textContent=u;return}let p=(I.dashboard?.tasks||[]).find(e=>e.id===n);if(p){let e=(p.submissions||[]).find(e=>e.student_id===i);e&&(e.status=a,e.score=c,e.submitted_at=d,e.updated_at=new Date().toISOString());let t=(p.submissions||[]).filter(e=>e.status===`submitted`||e.status===`late`).length,r=L.querySelector(`[data-task-count="${n}"]`);r&&(r.textContent=`${t}/${(p.submissions||[]).length} entregadas`)}await Mr().catch(()=>{}),e.disabled=!1,e.textContent=`✓ Guardado`,window.setTimeout(()=>{e.textContent=u},1600)}async function Pr(e,t){let n=L.querySelector(`[data-history-box="${e}"]`);if(!n)return;if(!n.classList.contains(`hidden`)){n.classList.add(`hidden`),t.textContent=`Ver historial`;return}n.classList.remove(`hidden`),t.textContent=`Ocultar historial`,n.innerHTML=`<div class="spinner" aria-hidden="true"></div>`;let i=(I.dashboard?.groups||[]).find(t=>t.id===e)?.students||[],{data:a,error:o}=await r.from(`attendance_sessions`).select(`id,session_date`).eq(`group_id`,e).order(`session_date`,{ascending:!1}).limit(12);if(o||!a?.length){n.innerHTML=`<p class="empty-state">Todavía no hay sesiones de asistencia registradas.</p>`;return}let s=a.map(e=>e.id),{data:c,error:l}=await r.from(`attendance`).select(`session_id,student_id,status`).in(`session_id`,s);if(l){n.innerHTML=`<p class="empty-state">No se pudo cargar el historial.</p>`;return}let u={present:`✅`,late:`⏰`,excused:`✳️`,absent:`❌`},d=new Map;for(let e of i)d.set(e.id,{name:e.full_name,code:e.student_code,cells:new Map,absences:0});for(let e of c||[]){let t=d.get(e.student_id);t&&(t.cells.set(e.session_id,e.status),e.status===`absent`&&(t.absences+=1))}n.innerHTML=`
    <table class="attendance-history-table">
      <thead>
        <tr>
          <th>Alumno</th>
          ${a.map(e=>`<th>${z(q(String(e.session_date).slice(0,10)))}</th>`).join(``)}
          <th>Faltas</th>
        </tr>
      </thead>
      <tbody>
        ${[...d.values()].map(e=>`
          <tr>
            <td><strong>${z(e.name)}</strong><div class="muted"><small>${z(e.code)}</small></div></td>
            ${a.map(t=>`<td>${u[e.cells.get(t.id)]||`·`}</td>`).join(``)}
            <td>${e.absences}</td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
    <p class="muted"><small>✅ presente · ⏰ tarde · ✳️ justificado · ❌ falta · · sin registro</small></p>
  `}function $(){xr({silent:!0}),xn({silent:!0}),Zn(),Xt(),L.innerHTML=On(I.profile),L.querySelector(`#logout-btn`).addEventListener(`click`,ti),L.querySelectorAll(`[data-open-final-exam]`).forEach(e=>{e.addEventListener(`click`,()=>{O(L,{onClose:()=>{$(),G(I.profile)}})})}),L.querySelectorAll(`[data-preview-final-exam]`).forEach(e=>{e.addEventListener(`click`,()=>{O(L,{preview:!0,onClose:$})})}),L.querySelectorAll(`[data-open-unit]`).forEach(e=>{e.addEventListener(`click`,()=>Hn(e.dataset.openUnit))}),L.querySelectorAll(`[data-consent-ack]`).forEach(e=>{e.addEventListener(`change`,()=>{L.querySelectorAll(`[data-consent-student]`).forEach(t=>{t.disabled=!e.checked})})}),L.querySelectorAll(`[data-consent-student]`).forEach(e=>{e.addEventListener(`click`,()=>$r(e.dataset.consentStudent,e))}),L.querySelectorAll(`[data-revoke-consent]`).forEach(e=>{e.addEventListener(`click`,()=>{ei(e.dataset.revokeConsent,e.dataset.revokeName||``,e)})}),L.querySelectorAll(`[data-invite-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=L.querySelector(`[data-invite-form="${e.dataset.inviteToggle}"]`);t&&t.classList.toggle(`hidden`)})}),L.querySelectorAll(`[data-invite-cancel]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=L.querySelector(`[data-invite-form="${e.dataset.inviteCancel}"]`);t&&t.classList.add(`hidden`)})}),L.querySelectorAll(`[data-invite-form]`).forEach(e=>{e.addEventListener(`submit`,Qr)}),L.querySelectorAll(`[data-staff-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{I.staffTab=e.dataset.staffTab,I.error=``,I.notice=``,$()})}),L.querySelectorAll(`[data-pagination]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.page);!Number.isFinite(t)||t<1||(e.dataset.pagination===`payments`&&(I.paymentsPage=t),$(),L.querySelector(`[data-pagination]`)?.scrollIntoView({block:`nearest`}))})}),L.querySelectorAll(`[data-ficha-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>Sr(e.dataset.fichaToggle,e))}),L.querySelectorAll(`[data-toggle-grades]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=L.querySelector(`[data-grades-editor="${e.dataset.toggleGrades}"]`);t&&t.classList.toggle(`hidden`)})}),L.querySelectorAll(`[data-save-grade]`).forEach(e=>{e.addEventListener(`click`,()=>Or(e))}),L.querySelectorAll(`[data-create-assessment]`).forEach(e=>{e.addEventListener(`submit`,kr)}),L.querySelectorAll(`[data-history-open]`).forEach(e=>{e.addEventListener(`click`,()=>Pr(e.dataset.historyOpen,e))});let e=L.querySelector(`#create-teacher-form`);e&&e.addEventListener(`submit`,Fr),L.querySelectorAll(`[data-invite-student-form]`).forEach(e=>{e.addEventListener(`submit`,t=>{Ur(t,e.querySelector(`[data-invite-groups]`)?.value||e.dataset.inviteGroupDefault||``)})}),L.querySelectorAll(`[data-copy-invitation]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.closest(`[data-student-invitation]`)?.querySelector(`[data-invitation-url]`);if(t)try{await navigator.clipboard.writeText(t.value),e.textContent=`Copiado ✓`,setTimeout(()=>{e.textContent=`Copiar enlace`},2e3)}catch{t.select(),e.textContent=`Copia manual`}})}),L.querySelectorAll(`[data-dismiss-invitation]`).forEach(e=>{e.addEventListener(`click`,()=>{I.studentInvitation=null,$()})}),L.querySelectorAll(`[data-reset-student]`).forEach(e=>{e.addEventListener(`click`,()=>Ir(e.dataset.resetStudent,e))}),L.querySelectorAll(`[data-reissue-invite]`).forEach(e=>{e.addEventListener(`click`,()=>Wr(e.dataset.reissueInvite,e))}),L.querySelectorAll(`[data-toggle-user]`).forEach(e=>{e.addEventListener(`click`,()=>Lr(e))}),L.querySelectorAll(`[data-ban-account]`).forEach(e=>{e.addEventListener(`click`,()=>Rr(e))}),L.querySelectorAll(`[data-save-setting]`).forEach(e=>{e.addEventListener(`click`,()=>zr(e.dataset.saveSetting,e))}),L.querySelectorAll(`[data-resolve-request]`).forEach(e=>{e.addEventListener(`click`,()=>gt(e))}),L.querySelectorAll(`[data-create-student-group]`).forEach(e=>{e.addEventListener(`submit`,t=>Br(t,e.dataset.createStudentGroup))});let t=L.querySelector(`#admin-create-student-form`);t&&t.addEventListener(`submit`,e=>{Br(e,t.querySelector(`[data-admin-groups]`)?.value)}),L.querySelectorAll(`[data-advise-student]`).forEach(e=>{e.addEventListener(`click`,()=>Gr(e.dataset.adviseStudent))}),L.querySelectorAll(`[data-attendance-open]`).forEach(e=>{e.addEventListener(`click`,()=>qr(e.dataset.attendanceOpen))}),L.querySelectorAll(`[data-attendance-close]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=L.querySelector(`[data-attendance-area="${e.dataset.attendanceClose}"]`);t&&t.classList.add(`hidden`),e.style.display=`none`;let n=L.querySelector(`[data-attendance-open="${e.dataset.attendanceClose}"]`);n&&(n.style.display=``)})}),L.querySelectorAll(`[data-student-detail]`).forEach(e=>{e.addEventListener(`click`,()=>Sr(e.dataset.studentDetail,e))}),L.querySelectorAll(`[data-start-test]`).forEach(e=>{e.addEventListener(`click`,()=>bn(e.dataset.startTest))}),L.querySelectorAll(`[data-activate-unit]`).forEach(e=>{e.addEventListener(`click`,()=>$n(e))}),L.querySelectorAll(`[data-manage-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>er(e))}),L.querySelectorAll(`[data-open-pay-dialog]`).forEach(e=>{e.addEventListener(`click`,()=>Jt(e.dataset.openPayDialog,e.dataset.payMode||`payment`))}),L.querySelectorAll(`[data-void-payment]`).forEach(e=>{e.addEventListener(`click`,()=>Zt(e))}),L.querySelectorAll(`[data-receipt-payment]`).forEach(e=>{e.addEventListener(`click`,()=>Qt(e.dataset.receiptPayment))});let n=L.querySelector(`[data-subjects-group]`);n&&n.addEventListener(`change`,()=>{I.subjectsGroupId=n.value,$()}),L.querySelectorAll(`[data-close-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>tr(e,`closed`))}),L.querySelectorAll(`[data-reopen-assignment]`).forEach(e=>{e.addEventListener(`click`,()=>tr(e,`active`))});let r=L.querySelector(`#sidebar-toggle`);r&&r.addEventListener(`click`,()=>{I.sidebarCollapsed=!I.sidebarCollapsed,localStorage.setItem(`ecoems_sidebar`,I.sidebarCollapsed?`collapsed`:`open`);let e=L.querySelector(`.staff-app`);e&&e.classList.toggle(`collapsed`,I.sidebarCollapsed);let t=!I.sidebarCollapsed;r.setAttribute(`aria-expanded`,String(t)),r.title=t?`Ocultar menú`:`Mostrar menú`;let n=r.querySelector(`.nav-emoji`),i=r.querySelector(`.nav-text`);n&&(n.textContent=t?`«`:`»`),i&&(i.textContent=t?`Ocultar menú`:`Mostrar menú`)}),L.querySelectorAll(`[data-subject-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.subjectToggle;De(t);let n=e.closest(`.board-subject`);if(!n)return;let r=I.collapsedSubjects.has(t);n.classList.toggle(`collapsed`,r),e.setAttribute(`aria-expanded`,String(!r))})}),L.querySelectorAll(`[data-activity-filter]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.activityFilter;L.querySelectorAll(`[data-activity-filter]`).forEach(t=>{t.classList.toggle(`active`,t===e)}),L.querySelectorAll(`[data-activity-kind]`).forEach(e=>{e.classList.toggle(`hidden`,t!==`todo`&&e.dataset.activityKind!==t)})})});let i=L.querySelector(`#create-task-form`);i&&i.addEventListener(`submit`,Ar),L.querySelectorAll(`[data-task-status]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`[data-task-row]`);t&&(t.dataset.status=e.dataset.taskStatus,t.querySelectorAll(`[data-task-status]`).forEach(t=>{t.classList.toggle(`active`,t===e)}))})}),L.querySelectorAll(`[data-save-task-submission]`).forEach(e=>{e.addEventListener(`click`,()=>Nr(e))}),Ie()}async function Fr(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),i=String(n.get(`full_name`)||``).trim(),a=String(n.get(`email`)||``).trim().toLowerCase(),o=String(n.get(`password`)||``);if(!i||!a||o.length<12||!/[a-z]/.test(o)||!/[A-Z]/.test(o)||!/\d/.test(o)){B(`Completa los datos: nombre, correo y contraseña de al menos 12 caracteres con mayúscula, minúscula y número.`);return}let s=t.querySelector(`button[type="submit"]`);s.disabled=!0,s.textContent=`Creando…`,I.error=``,I.notice=``;try{let{data:e,error:n}=await r.functions.invoke(`admin-create-teacher`,{body:{full_name:i,email:a,password:o}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo crear el profesor`);V(`Profesor ${e.profile.full_name} creado. Entrégale el correo y la contraseña.`),t.reset(),await G(I.profile)}catch(e){B(e?.message||`No se pudo crear el profesor.`),s.disabled=!1,s.textContent=`Crear profesor`}}async function Ir(e,t){if(e&&!t.disabled){I.error=``,I.notice=``,t.disabled=!0,t.textContent=`Generando…`;try{let{data:n,error:i}=await r.functions.invoke(`admin-reset-student-password`,{body:{student_id:e}});if(i)throw i;if(!n?.temporary_password)throw Error(n?.error||`No se pudo restablecer la contraseña`);V(`Contraseña temporal de ${t.dataset.studentName||n.username||`el alumno`} (${n.username}): ${n.temporary_password}. Entrégala una sola vez.`),t.disabled=!1,t.textContent=`Nueva contraseña`}catch(e){B(e?.message||`No se pudo restablecer la contraseña.`),t.disabled=!1,t.textContent=`Nueva contraseña`}}}async function Lr(e){let t=e.dataset.toggleUser,n=e.dataset.active===`1`;if(!t||e.disabled)return;let i=e.closest(`li`)?.querySelector(`strong`)?.textContent||`usuario`;if((n||window.confirm(`¿Activar la cuenta de ${i}?`))&&(!n||window.confirm(`¿Desactivar la cuenta de ${i}? Perderá el acceso de inmediato.`))){I.error=``,I.notice=``,e.disabled=!0;try{let{data:e,error:a}=await r.functions.invoke(`deactivate-user`,{body:{user_id:t,active:!n}});if(a)throw a;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la cuenta`);V(`Cuenta de ${i} ${e.active?`activada`:`desactivada`}.`),await G(I.profile)}catch(t){B(t?.message||`No se pudo actualizar la cuenta.`),e.disabled=!1}}}async function Rr(e){let t=e.dataset.banAccount,n=e.dataset.ban===`1`;if(!t||e.disabled)return;let i=e.closest(`li`)?.querySelector(`strong`)?.textContent||`la cuenta`;if(window.confirm(n?`¿Bloquear ${i}? No podrá iniciar sesión con esa cuenta.`:`¿Desbloquear ${i}? Volverá a poder iniciar sesión (seguirá sin ver contenido hasta que se vincule).`)){I.error=``,I.notice=``,e.disabled=!0;try{let{data:e,error:a}=await r.rpc(`app_ban_account`,{p_user_id:t,p_ban:n});if(a)throw a;if(!e?.ok)throw Error(e?.error||`No se pudo actualizar la cuenta`);V(`Cuenta ${i} ${n?`bloqueada`:`desbloqueada`}.`),await G(I.profile)}catch(t){B(t?.message||`No se pudo actualizar la cuenta.`),e.disabled=!1}}}async function zr(e,t){let n=L.querySelector(`[data-setting-value="${e}"]`);if(!n||t.disabled)return;let i;try{i=JSON.parse(n.value)}catch{B(`El valor de ${e} debe ser JSON válido.`);return}I.error=``,I.notice=``,t.disabled=!0,t.textContent=`Guardando…`;try{let{error:n}=await r.from(`settings`).upsert({key:e,value:i,updated_by:I.profile?.id??null});if(n)throw n;V(`Configuración ${e} guardada.`),t.disabled=!1,t.textContent=`Guardar`}catch(n){B(n?.message||`No se pudo guardar ${e}.`),t.disabled=!1,t.textContent=`Guardar`}}async function Br(e,t){e.preventDefault();let n=e.currentTarget,i=new FormData(n),a=String(i.get(`full_name`)||``).trim(),o=String(i.get(`username`)||``).trim().toLowerCase(),s=String(i.get(`password`)||``),c=String(i.get(`student_code`)||``).trim().toUpperCase();if(!t){B(`Selecciona un grupo para el alumno.`);return}if(!a){B(`Escribe el nombre completo del alumno.`);return}if(s.length<12||!/[a-z]/.test(s)||!/[A-Z]/.test(s)||!/\d/.test(s)){B(`Completa los datos: nombre y contraseña temporal (12+ caracteres, con mayúscula, minúscula y número). El usuario se genera del nombre si lo dejas vacío.`);return}let l=n.querySelector(`button[type="submit"]`);l&&(l.disabled=!0,l.textContent=`Dando de alta…`),I.error=``,I.notice=``;try{let e=n.querySelector(`[data-create-result]`),{data:i,error:l}=await r.functions.invoke(`admin-create-student`,{body:{full_name:a,username:o||null,password:s,group_id:t,student_code:c||null}});if(l)throw l;if(!i?.ok)throw Error(i?.error||`No se pudo dar de alta al alumno`);e&&(e.innerHTML=`
        <div class="answer-box correct">
          <strong>Alumno dado de alta</strong>
          <p>Usuario: <b>${z(i.access.username)}</b><br>
          Contraseña temporal: <b>${z(s)}</b><br>
          <small>Entrégaselas una vez. En su primer ingreso, el alumno deberá crear su propia contraseña.</small></p>
        </div>
      `),V(`Alumno ${i.student?.student_code||o} dado de alta en el grupo.`),n.reset(),await G(I.profile)}catch(e){B(e?.message||`No se pudo dar de alta al alumno.`),l&&(l.disabled=!1,l.textContent=`Dar de alta`)}}function Vr(e){let t=new URL(window.location.href);return t.search=``,t.hash=``,t.searchParams.set(`link_token`,e),t.toString()}function Hr(e){let t=new Date(e||``);return Number.isNaN(t.getTime())?``:t.toLocaleString(`es-MX`,{dateStyle:`medium`,timeStyle:`short`})}async function Ur(e,t){e.preventDefault();let n=e.currentTarget,i=new FormData(n),a=String(i.get(`full_name`)||``).trim(),o=String(i.get(`username`)||``).trim().toLowerCase(),s=String(i.get(`student_code`)||``).trim().toUpperCase();if(!t){B(`Selecciona un grupo para el alumno.`);return}if(!a){B(`Escribe el nombre completo del alumno.`);return}let c=n.querySelector(`button[type="submit"]`);c&&(c.disabled=!0,c.textContent=`Generando…`),I.error=``,I.notice=``,I.studentInvitation=null;try{let{data:e,error:n}=await r.functions.invoke(`issue-student-link-token`,{body:{full_name:a,username:o||null,group_id:t,student_code:s||null}});if(n)throw n;if(!e?.ok)throw Error(e?.error||`No se pudo generar la invitación`);let i=e.invitation?.token;if(!i)throw Error(`La invitación llegó sin token.`);let c=Vr(i);I.studentInvitation={fullName:a,username:e.access?.username||``,studentCode:e.student?.student_code||s||``,redeemUrl:c,expiresAtLabel:Hr(e.invitation?.expires_at)},V(`Invitación generada para ${a}. Comparte el enlace; vence en 72 h.`),await G(I.profile)}catch(e){B(await Qe(e,`No se pudo generar la invitación.`)),$()}}async function Wr(e,t){if(e&&!t.disabled){I.error=``,I.notice=``,t.disabled=!0,t.textContent=`Generando…`;try{let{data:n,error:i}=await r.functions.invoke(`issue-student-link-token`,{body:{student_id:e}});if(i)throw i;if(!n?.ok)throw Error(n?.error||`No se pudo generar el enlace`);let a=n.invitation?.token;if(!a)throw Error(`La invitación llegó sin token.`);let o=Vr(a),s=n.access?.full_name||t.dataset.studentName||`el alumno`;I.studentInvitation={fullName:s,username:n.access?.username||``,studentCode:n.student?.student_code||``,redeemUrl:o,expiresAtLabel:Hr(n.invitation?.expires_at)},I.staffTab=`alumnos`,V(`Enlace de acceso generado para ${s}. Compártelo; vence en 72 h.`),await G(I.profile)}catch(e){B(await Qe(e,`No se pudo generar el enlace de acceso.`)),t.disabled=!1,t.textContent=`Enlace de acceso`}}}function Gr(e){let t=L.querySelector(`[data-advise-form="${e}"]`);if(!t)return;let n=(I.dashboard?.groups||[]).find(t=>t.students.some(t=>t.id===e))?.students.find(t=>t.id===e),r=n?.guardians||[];t.classList.toggle(`hidden`),t.classList.contains(`hidden`)||(r.length?(t.innerHTML=`
    <span class="card-label">Aviso para ${z(n?.full_name||`el alumno`)}</span>
    <select data-advise-guardian>
      ${r.map(e=>`
        <option value="${z(e.id)}" data-phone="${z(e.phone||``)}">
          ${z(e.full_name)}${e.relationship?` (${z(e.relationship)})`:``}
        </option>
      `).join(``)}
    </select>
    <textarea data-advise-body rows="3" placeholder="Escribe el aviso que quieres enviar…"></textarea>
    <div class="row">
      <button class="btn primary" data-advise-send="${z(e)}">Enviar por WhatsApp</button>
      <button class="btn ghost" data-advise-close="${z(e)}">Cerrar</button>
    </div>
  `,t.querySelector(`[data-advise-send]`).addEventListener(`click`,()=>Kr(e,n)),t.querySelector(`[data-advise-close]`).addEventListener(`click`,()=>t.classList.add(`hidden`))):t.innerHTML=`<p class="empty-state">Este alumno no tiene tutores vinculados. Usa "Invitar tutor" primero.</p>`)}async function Kr(e,t){let n=L.querySelector(`[data-advise-form="${e}"]`);if(!n)return;let i=n.querySelector(`[data-advise-guardian]`),a=n.querySelector(`[data-advise-body]`),o=i?.selectedOptions?.[0],s=i?.value,c=o?.dataset?.phone||``,l=o?.textContent?.trim()||`el tutor`,u=String(a?.value||``).trim();if(!u){B(`Escribe el aviso que quieres enviar.`);return}if(!c){B(`El tutor no tiene teléfono registrado. Edita su ficha o comparte el aviso por otro medio.`);return}let d=`Aviso sobre ${t?.full_name||`el alumno`}`;try{let{error:t}=await r.from(`guardian_messages`).insert({student_id:e,guardian_id:s,channel:`whatsapp`,subject:d,body:u,status:`sent`,sent_at:new Date().toISOString()});if(t)throw t;let i=[`Hola ${l} 👋`,d+`:`,u].join(`
`);window.open(`https://wa.me/${c.replace(/[^\d]/g,``)}?text=${encodeURIComponent(i)}`,`_blank`,`noopener`),V(`Aviso registrado. Se abrió WhatsApp para enviarlo.`),n.classList.add(`hidden`),await G(I.profile)}catch(e){B(e?.message||`No se pudo registrar el aviso.`)}}async function qr(e,t){let n=L.querySelector(`[data-attendance-area="${e}"]`);if(!n)return;let r=L.querySelector(`[data-attendance-open="${e}"]`);if(!n.classList.contains(`hidden`)&&!t){n.classList.add(`hidden`),n.innerHTML=``,r&&(r.style.display=``);return}let i=(I.dashboard?.groups||[]).find(t=>t.id===e)?.students||[];if(!i.length){B(`El grupo no tiene alumnos.`);return}n.classList.remove(`hidden`),n.innerHTML=`<div class="spinner" aria-hidden="true"></div>`,r&&(r.style.display=`none`),I.error=``,I.notice=``;let a=new Date().toISOString().slice(0,10);await Jr(e,i,n,t||a)}async function Jr(e,t,n,i){try{let{data:a,error:o}=await r.from(`attendance_sessions`).select(`id,session_date`).eq(`group_id`,e).eq(`session_date`,i).order(`created_at`,{ascending:!0}).limit(1).maybeSingle();if(o)throw o;if(!a){let t=await r.from(`attendance_sessions`).insert({group_id:e,session_date:i,created_by:I.profile?.id??null}).select(`id,session_date`).single();if(t.error)throw t.error;a=t.data}let s=await r.from(`attendance`).select(`student_id,status`).eq(`session_id`,a.id);if(s.error)throw s.error;let c=new Map((s.data||[]).map(e=>[e.student_id,e.status])),l=new Date().toISOString().slice(0,10);n.innerHTML=`
      <div class="attendance-toolbar">
        <label class="attendance-date">
          <span>Fecha</span>
          <input type="date" value="${z(i)}" max="${z(l)}" data-attendance-date>
        </label>
        <div class="attendance-bulk">
          <button class="btn-mini" type="button" data-attendance-all="present">Todos presentes</button>
          <button class="btn-mini" type="button" data-attendance-all="absent">Todos ausentes</button>
        </div>
        <button class="btn-mini ghost" type="button" data-attendance-dismiss>Listo</button>
      </div>
      <div class="attendance-summary" data-attendance-summary></div>
      <ul class="attendance-list">
        ${t.map(e=>{let t=c.get(e.id)||`present`;return`
            <li class="attendance-row" data-attendance-row data-student-id="${z(e.id)}" data-status="${z(t)}">
              <div class="attendance-who">
                <span class="avatar small">${z((e.full_name||`?`).slice(0,1).toUpperCase())}</span>
                <div>
                  <strong>${z(e.full_name)}</strong>
                  <small>${z(e.student_code)}</small>
                </div>
              </div>
              <div class="status-seg" role="group" aria-label="Estado de ${z(e.full_name)}">
                ${Object.entries(_e).map(([e,n])=>`
                  <button class="status-btn ${t===e?`active`:``}" type="button" data-att-status="${e}">${z(n)}</button>
                `).join(``)}
              </div>
            </li>
          `}).join(``)}
      </ul>
      <div class="row end attendance-actions">
        <span class="muted" data-attendance-save-note><small>Los cambios se guardan por fecha.</small></span>
        <button class="btn primary" data-attendance-save="${z(a.id)}" data-attendance-group="${z(e)}">Guardar asistencia</button>
      </div>
    `,Yr(n,e,t),Xr(n)}catch(e){n.innerHTML=`<p class="empty-state">No se pudo cargar la asistencia: ${z(e?.message||`error`)}</p>`}}function Yr(e,t,n){let r=e.querySelector(`[data-attendance-date]`);r&&r.addEventListener(`change`,()=>{let i=r.value||new Date().toISOString().slice(0,10);e.innerHTML=`<div class="spinner" aria-hidden="true"></div>`,Jr(t,n,e,i)}),e.querySelectorAll(`[data-att-status]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.closest(`[data-attendance-row]`);n&&(n.dataset.status=t.dataset.attStatus,n.querySelectorAll(`[data-att-status]`).forEach(e=>{e.classList.toggle(`active`,e===t)}),Xr(e))})}),e.querySelectorAll(`[data-attendance-all]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.attendanceAll;e.querySelectorAll(`[data-attendance-row]`).forEach(e=>{e.dataset.status=n,e.querySelectorAll(`[data-att-status]`).forEach(e=>{e.classList.toggle(`active`,e.dataset.attStatus===n)})}),Xr(e)})});let i=e.querySelector(`[data-attendance-dismiss]`);i&&i.addEventListener(`click`,()=>{e.classList.add(`hidden`),e.innerHTML=``;let n=L.querySelector(`[data-attendance-open="${t}"]`);n&&(n.style.display=``)});let a=e.querySelector(`[data-attendance-save]`);a&&a.addEventListener(`click`,()=>Zr(a.dataset.attendanceSave,t,a,e))}function Xr(e){let t=e.querySelector(`[data-attendance-summary]`);if(!t)return;let n={present:0,late:0,excused:0,absent:0};e.querySelectorAll(`[data-attendance-row]`).forEach(e=>{let t=e.dataset.status||`present`;n[t]!=null&&(n[t]+=1)});let r=Object.values(n).reduce((e,t)=>e+t,0);t.innerHTML=`
    <span class="pill pill-green">${n.present} presentes</span>
    <span class="pill pill-amber">${n.late} tarde</span>
    <span class="pill">${n.excused} justificados</span>
    <span class="pill pill-red">${n.absent} faltas</span>
    <span class="pill pill-blue">${r} alumnos</span>
  `}async function Zr(e,t,n,i){if(i){n.disabled=!0,n.textContent=`Guardando…`,I.error=``,I.notice=``;try{let t=[...i.querySelectorAll(`[data-attendance-row]`)],a=t.map(t=>r.from(`attendance`).upsert({session_id:e,student_id:t.dataset.studentId,status:t.dataset.status||`present`,recorded_by:I.profile?.id??null},{onConflict:`session_id,student_id`})),o=(await Promise.all(a)).find(e=>e.error)?.error;if(o)throw o;let s=i.querySelector(`[data-attendance-save-note]`);s&&(s.innerHTML=`<small>Guardado a las ${z(new Date().toLocaleTimeString(`es-MX`,{hour:`2-digit`,minute:`2-digit`}))} · ${t.length} alumnos.</small>`),n.disabled=!1,n.textContent=`Guardar asistencia`}catch(e){B(e?.message||`No se pudo guardar la asistencia.`),n.disabled=!1,n.textContent=`Guardar asistencia`}}}async function Qr(e){e.preventDefault();let t=e.currentTarget,n=t.dataset.inviteForm,i=String(t.dataset.studentCode||`alumno`).toLowerCase(),a=new FormData(t),o=String(a.get(`full_name`)||``).trim(),s=String(a.get(`phone`)||``).trim(),c=String(a.get(`relationship`)||``).trim(),l=String(a.get(`email`)||``).trim().toLowerCase()||`tutor.${i}@tutores.ecoems.mx`;if(!o)return;let u=t.querySelector(`button[type="submit"]`);u&&(u.disabled=!0,u.textContent=`Creando…`),I.error=``,I.notice=``;try{let{data:e,error:i}=await r.functions.invoke(`invite-guardian`,{body:{student_id:n,full_name:o,phone:s||null,relationship:c||null,email:l}});if(i)throw i;if(!e?.ok)throw Error(e?.error||`No se pudo crear la invitación`);t.classList.add(`hidden`);let a=L.querySelector(`[data-invite-result="${n}"]`);a&&(a.classList.remove(`hidden`),a.innerHTML=`
        <span class="card-label">Invitación enviada · ${z(o)}</span>
        <p>${z(e.message||`Correo encolado para ${e.email||`el tutor`}.`)}</p>
        <p class="hint">El enlace de acceso viaja en el correo, no en esta pantalla ni en un chat. Si caduca, vuelve a generarlo con el mismo botón.</p>
      `)}catch(e){B(e?.message||`No se pudo crear la invitación. Revisa la conexión.`),u&&(u.disabled=!1,u.textContent=`Crear invitación`)}}async function $r(e,t){if(!e||t.disabled)return;if(!L.querySelector(`[data-consent-ack]`)?.checked){B(`Marca la casilla “He leído y entiendo” antes de aceptar el aviso de privacidad.`);return}I.error=``,I.notice=``,t.disabled=!0,t.textContent=`Enviando…`;let n=I.dashboard?.privacy?.version||pe;try{let{data:t,error:i}=await r.functions.invoke(`guardian-consent`,{body:{student_id:e,document_version:n,accepted:!0,acknowledged:!0}});if(i)throw i;if(t?.status!==`accepted`)throw Error(t?.error||`No se pudo registrar el consentimiento`);I.notice=`Consentimiento registrado. Gracias por confiar en nosotros.`,await G(I.profile)}catch(e){B(await Qe(e,`No se pudo registrar el consentimiento. Revisa la conexión e intenta de nuevo.`)),t.disabled=!1,t.textContent=`Aceptar y ver datos`}}async function ei(e,t,n){if(!e||n.disabled)return;let i=t?`a ${t}`:`a este alumno`;if(typeof window.confirm==`function`&&window.confirm(`¿Revocar el consentimiento ${i}? Dejarás de ver su información hasta que vuelvas a aceptar el aviso de privacidad.`)){I.error=``,I.notice=``,n.disabled=!0,n.textContent=`Revocando…`;try{let{data:t,error:n}=await r.functions.invoke(`guardian-consent`,{body:{student_id:e,revoke:!0,confirm:!0}});if(n)throw n;if(t?.status!==`revoked`)throw Error(t?.error||`No se pudo revocar el consentimiento`);I.notice=`Consentimiento revocado. La información del alumno ya no se muestra.`,await G(I.profile)}catch(e){B(await Qe(e,`No se pudo revocar el consentimiento. Intenta de nuevo.`)),n.disabled=!1,n.textContent=`Revocar consentimiento`}}}async function ti(){await r.auth.signOut(),Ae(),Pe(),I.session=null,I.profile=null,I.dashboard=null,I.dashboardError=``,I.error=``,I.notice=``,I.mode=`student`,R=null,U()}function ni(e){if(!e)return;if(L=e,Pe(),!t){Re();return}let n=new URLSearchParams(window.location.search).get(`link_token`);n?(r.auth.signOut().catch(()=>{}),Xe(n)):(Le(),document.addEventListener(`click`,e=>{e.target.closest(`#data-request-btn`)&&Ge()}),window.addEventListener(`hashchange`,tt),r.auth.getSession().then(({data:e})=>{e.session?et(e.session):U()}),r.auth.onAuthStateChange((e,t)=>{e===`SIGNED_OUT`?(Ae(),Pe(),I.session=null,I.profile=null,I.dashboard=null,I.dashboardError=``,I.view=`dashboard`,I.unitView=null,I.unitResults={},R=null,U()):e===`PASSWORD_RECOVERY`&&t?(async()=>{await et(t),I.profile&&(I.passwordRecovery=!0,I.view=`change-password`,W())})():t&&(e===`SIGNED_IN`||e===`TOKEN_REFRESHED`)&&et(t)}))}ni(document.querySelector(`#app`));