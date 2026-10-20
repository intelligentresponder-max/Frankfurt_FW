(() => {
  'use strict';

  const FORM_ENDPOINT = null; // null = mailto-Modus; später EU-gehostetes Backend (Phase 2)
  const MAIL_FALLBACK = 'geschaeftsstelle@freiewaehler-frankfurt.de';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const getJSON = u => fetch(u).then(r => { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); });
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* Speicher gesperrt: egal */ } }
  };
  const BTN_ON = ['bg-fw-dark', 'text-white'];
  const BTN_OFF = ['bg-gray-100', 'text-gray-800'];

  const state = { links: null, themen: [], ideen: [], obrs: [], sitzungen: null, quiz: [], obr: null, filter: 'all' };

  // ---------- Hash-State: #ortsbeiraete?obr=10 ----------
  function readHash() {
    const m = location.hash.match(/^#([\w-]+)(?:\?(.*))?$/);
    if (!m) return { section: null, obr: null };
    const n = parseInt(new URLSearchParams(m[2] || '').get('obr'), 10);
    return { section: m[1], obr: n >= 1 && n <= 16 ? n : null };
  }
  function setObr(n, { scroll = false } = {}) {
    state.obr = n;
    const h = n ? `#ortsbeiraete?obr=${n}` : '#ortsbeiraete';
    history.replaceState(null, '', h);
    renderAll();
    if (scroll) $('#ortsbeiraete').scrollIntoView();
  }
  const obrName = n => { const o = state.obrs.find(x => x.nummer === n); return o ? `OBR ${o.nummer} ${o.name}` : ''; };

  // ---------- Links zentral aus data/links.json ----------
  function applyLinks() {
    document.querySelectorAll('[data-link]').forEach(a => {
      const l = state.links.links[a.dataset.link];
      if (l) a.href = l.url;
    });
    $('#kontakt-link').href = 'mailto:' + (state.links.kontakt_email || MAIL_FALLBACK);
  }

  // ---------- Ortsbeiräte, Schnellwahl, Stadtteil-Suche ----------
  function renderObr() {
    $('#schnellwahl').innerHTML = state.obrs.map(o =>
      `<button type="button" data-obr="${o.nummer}" aria-pressed="${state.obr === o.nummer}" class="obr-btn px-3 py-1.5 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fw-dark ${state.obr === o.nummer ? BTN_ON.join(' ') : 'bg-white text-gray-900 border border-gray-300'}">${o.nummer}<span class="sr-only"> ${esc(o.name)}</span></button>`).join('');
    $('#obr-grid').innerHTML = state.obrs.map(o =>
      `<button type="button" data-obr="${o.nummer}" aria-pressed="${state.obr === o.nummer}" class="obr-btn text-left p-3 rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fw-dark ${state.obr === o.nummer ? 'bg-fw-dark text-white border-fw-dark' : 'bg-white border-gray-200 hover:border-fw-dark'}"><span class="font-bold">OBR ${o.nummer}</span><br>${esc(o.name)}${o.stadtteile.length ? `<br><span class="text-xs ${state.obr === o.nummer ? 'text-white' : 'text-gray-700'}">${esc(o.stadtteile.join(', '))}</span>` : ''}</button>`).join('');
    const unver = state.obrs.some(o => !o.verifiziert);
    $('#obr-stand').textContent = unver ? 'Hinweis: Die Zuordnung der Stadtteile ist noch nicht vollständig geprüft.' : '';
    const hint = $('#obr-hinweis');
    if (state.obr) { hint.textContent = `Auswahl: ${obrName(state.obr)}. Ideen und Sitzungen sind entsprechend gefiltert.`; hint.classList.remove('hidden'); }
    else hint.classList.add('hidden');
    const sel = $('#f-obr'), cur = sel.value;
    sel.innerHTML = '<option value="">Weiß ich nicht / ganz Frankfurt</option>' + state.obrs.map(o => `<option value="${o.nummer}">OBR ${o.nummer} ${esc(o.name)}</option>`).join('');
    sel.value = state.obr ? String(state.obr) : cur;
  }

  function searchStadtteil() {
    const q = $('#stadtteil-suche').value.trim().toLowerCase();
    const out = $('#stadtteil-ergebnis');
    if (!q) { out.textContent = ''; return; }
    const hits = state.obrs.filter(o => (o.name + ' ' + o.stadtteile.join(' ')).toLowerCase().includes(q));
    if (!hits.length) { out.textContent = 'Kein Treffer. Nutze die Schnellwahl oder prüfe die Schreibweise.'; return; }
    out.innerHTML = 'Treffer: ' + hits.map(o => `<button type="button" data-obr="${o.nummer}" class="obr-btn underline text-fw-dark font-semibold rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fw-dark">OBR ${o.nummer} ${esc(o.name)}</button>`).join(', ');
  }

  // ---------- Blog ----------
  const blog = { grid: null, status: null, search: null, buttons: [] };
  function card(p) {
    return `<article class="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col" data-kategorie="${esc(p.kategorie)}">
      <div class="p-6">
        <p class="text-xs text-gray-600 mb-2">Stand: ${esc(p.stand)}</p>
        <h3 class="text-xl font-bold text-gray-900 mb-2">${esc(p.titel)}</h3>
        <p class="text-gray-700 text-sm leading-relaxed">${esc(p.teaser)}</p>
        <p class="text-xs text-gray-600 mt-3">Quelle: <a href="${esc(p.quelle_url)}" target="_blank" rel="noopener" class="underline">${esc(p.quelle)}</a></p>
      </div>
      <div class="p-6 pt-0 mt-auto space-y-3">
        <a href="${esc(state.links.links.maengelmelder.url)}" target="_blank" rel="noopener" class="block bg-fw-light text-fw-dark text-xs font-bold p-3 rounded-xl underline">Auf ffm.de melden: konkreter Mangel? Offiziell bei der Stadt melden</a>
        <a href="#mitmachen" class="inline-block text-sm font-bold text-fw-dark hover:underline">Deine Meinung an uns →</a>
      </div>
    </article>`;
  }
  function renderBlog() {
    const q = blog.search.value.trim().toLowerCase();
    const list = state.themen.filter(p =>
      (state.filter === 'all' || p.kategorie === state.filter) &&
      (!q || (p.titel + ' ' + p.teaser).toLowerCase().includes(q)));
    blog.grid.innerHTML = list.map(card).join('') ||
      `<p class="col-span-full text-center text-gray-700">${state.themen.length ? 'Keine Beiträge gefunden.' : 'Unsere Positionen erscheinen hier, sobald sie vom Vorstand freigegeben sind.'}</p>`;
    blog.status.textContent = `${list.length} Beiträge gefunden`;
  }
  function setFilter(btn) {
    state.filter = btn.dataset.filter;
    blog.buttons.forEach(b => {
      const on = b === btn;
      b.setAttribute('aria-pressed', String(on));
      BTN_ON.forEach(c => b.classList.toggle(c, on));
      BTN_OFF.forEach(c => b.classList.toggle(c, !on));
    });
    renderBlog();
  }

  // ---------- Ideen (Stimmungsbild nur lokal) ----------
  function renderIdeen() {
    const list = state.ideen.filter(i => i.freigegeben === true && (!state.obr || i.obr === null || i.obr === state.obr));
    $('#ideen-grid').innerHTML = list.map(i => {
      const k = 'stimmung:' + i.id, voted = store.get(k) === '1';
      return `<article class="border border-gray-200 rounded-2xl p-5 bg-white">
        ${i.beispiel ? '<span class="inline-block text-xs font-bold bg-gray-900 text-white px-2 py-0.5 rounded mb-2">Beispiel</span>' : ''}
        <h3 class="font-bold text-lg">${esc(i.titel)}</h3>
        <p class="mt-1 text-sm text-gray-700">${esc(i.text)}</p>
        <button type="button" data-idee="${esc(i.id)}" aria-pressed="${voted}" class="mt-3 px-4 py-2 rounded-xl text-sm font-semibold border border-fw-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fw-dark ${voted ? BTN_ON.join(' ') : 'text-fw-dark'}">Stimmungsbild (+1)</button>
        <p class="mt-1 text-xs text-gray-600">Nur lokal in deinem Browser, kein offizielles Votum.</p>
      </article>`;
    }).join('') || '<p class="text-gray-700">Keine Ideen für diese Auswahl.</p>';
  }

  // ---------- Sitzungen + .ics (RFC 5545) ----------
  const icsEsc = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  function fold(line) { // max. 75 Oktette je Zeile
    const enc = new TextEncoder(); let out = '', cur = '';
    for (const ch of line) {
      if (enc.encode(cur + ch).length > (out ? 74 : 75)) { out += cur + '\r\n '; cur = ''; }
      cur += ch;
    }
    return out + cur;
  }
  function buildICS(s) {
    const [y, m, d] = s.datum.split('-'), [hh, mm] = s.uhrzeit.split(':');
    const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FREIE WAEHLER Frankfurt//Buergerplattform//DE', 'CALSCALE:GREGORIAN',
      'BEGIN:VTIMEZONE', 'TZID:Europe/Berlin',
      'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
      'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
      'END:VTIMEZONE', 'BEGIN:VEVENT',
      `UID:${s.datum}-${s.ortsbeirat}-${s.uhrzeit.replace(':', '')}@buergerplattform.fw-frankfurt`, `DTSTAMP:${now}`,
      `DTSTART;TZID=Europe/Berlin:${y}${m}${d}T${hh}${mm}00`,
      `SUMMARY:${icsEsc('Sitzung ' + (obrName(s.ortsbeirat) || 'Ortsbeirat'))}`, `LOCATION:${icsEsc(s.ort)}`,
      `DESCRIPTION:${icsEsc('Angaben ohne Gewähr, maßgeblich ist PARLIS: ' + s.parlis_url)}`, 'END:VEVENT', 'END:VCALENDAR'];
    return lines.map(fold).join('\r\n') + '\r\n';
  }
  function renderSitzungen() {
    const d = state.sitzungen;
    $('#sitz-stand').textContent = `Stand der Daten: ${d.stand}`;
    const list = d.sitzungen.filter(s => !state.obr || s.ortsbeirat === state.obr || s.beispiel);
    $('#sitz-liste').innerHTML = list.map((s, i) => {
      const dt = new Date(s.datum + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
      return `<li class="border border-gray-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>${s.beispiel ? '<span class="inline-block text-xs font-bold bg-gray-900 text-white px-2 py-0.5 rounded mr-2">Beispiel</span>' : ''}
          <strong>${esc(obrName(s.ortsbeirat) || 'Ortsbeirat')}</strong><br>
          <span class="text-sm text-gray-700">${esc(dt)}, ${esc(s.uhrzeit)} Uhr · ${esc(s.ort)}</span></div>
        <div class="flex gap-3 text-sm font-semibold">
          <a class="underline text-fw-dark" href="${esc(s.parlis_url)}" target="_blank" rel="noopener">PARLIS</a>
          <button type="button" data-ics="${i}" class="underline text-fw-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fw-dark rounded">Zum Kalender (.ics)</button>
        </div></li>`;
    }).join('') || '<li class="text-gray-700">Noch keine Termine eingetragen. Aktuelle Termine findest du in PARLIS.</li>';
    $('#sitz-liste').dataset.count = list.length;
    renderSitzungen.list = list;
  }
  function downloadICS(i) {
    const s = renderSitzungen.list[i]; if (!s) return;
    const url = URL.createObjectURL(new Blob([buildICS(s)], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `sitzung-${s.datum}.ics`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  // ---------- Formular (mailto) ----------
  function initForm() {
    const f = $('#kontakt-form'), fs = $('#form-status');
    $('#f-dateien').addEventListener('change', e => {
      $('#dateien-liste').innerHTML = [...e.target.files].map(x => `<li>${esc(x.name)}</li>`).join('');
    });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const betreff = $('#f-betreff').value.trim(), text = $('#f-text').value.trim(), ok = $('#f-einwilligung').checked;
      const set = (id, msg, el) => { $(id).textContent = msg; el.setAttribute('aria-invalid', msg ? 'true' : 'false'); };
      set('#err-betreff', betreff ? '' : 'Bitte gib einen Betreff ein.', $('#f-betreff'));
      set('#err-text', text ? '' : 'Bitte schreib eine Nachricht.', $('#f-text'));
      set('#err-einwilligung', ok ? '' : 'Ohne Einwilligung können wir den Entwurf nicht erstellen.', $('#f-einwilligung'));
      if (!betreff || !text || !ok) { fs.textContent = ''; f.querySelector('[aria-invalid="true"]').focus(); return; }
      const o = $('#f-obr').value;
      const body = `${text}\n\nOrtsbeirat: ${o ? obrName(Number(o)) : 'nicht angegeben'}\n(Einwilligung zur Datenschutzerklärung erteilt)`;
      if (FORM_ENDPOINT) { fs.textContent = 'Backend-Modus ist noch nicht aktiviert.'; return; }
      const to = (state.links && state.links.kontakt_email) || MAIL_FALLBACK;
      location.href = `mailto:${to}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(body)}`;
      fs.textContent = 'Dein E-Mail-Programm sollte sich öffnen. Bitte sende die E-Mail dort ab und hänge Dateien selbst an.';
    });
  }

  // ---------- Quiz ----------
  function initQuiz() {
    const box = $('#quiz-box'); let i = 0, score = 0;
    const rank = s => s === state.quiz.length ? 'Römer-Profi' : s >= state.quiz.length / 2 ? 'Stadtteil-Kenner' : 'Neugieriger Frankfurter';
    function show() {
      if (!state.quiz.length) { box.innerHTML = '<p class="text-gray-700">Das Quiz ist gerade nicht verfügbar.</p>'; return; }
      if (i >= state.quiz.length) {
        box.innerHTML = `<p class="text-xl font-bold">${score} von ${state.quiz.length} richtig. Dein Rang: ${esc(rank(score))}</p><button type="button" id="quiz-neu" class="mt-4 bg-fw-dark text-white font-bold px-5 py-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fw-dark">Nochmal spielen</button>`;
        $('#quiz-neu').addEventListener('click', () => { i = 0; score = 0; show(); });
        return;
      }
      const q = state.quiz[i];
      box.innerHTML = `<fieldset><legend class="font-bold text-lg">Frage ${i + 1} von ${state.quiz.length}: ${esc(q.frage)}</legend>
        <div class="mt-4 space-y-2">${q.antworten.map((a, k) => `<button type="button" data-k="${k}" class="quiz-a block w-full text-left px-4 py-3 rounded-xl border border-gray-300 bg-white hover:border-fw-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fw-dark">${esc(a)}</button>`).join('')}</div></fieldset>
        <div id="quiz-fb" class="mt-4" aria-live="polite"></div>`;
      box.querySelectorAll('.quiz-a').forEach(b => b.addEventListener('click', () => {
        const k = Number(b.dataset.k), right = k === q.richtig;
        if (right) score++;
        box.querySelectorAll('.quiz-a').forEach(x => { x.disabled = true; if (Number(x.dataset.k) === q.richtig) x.classList.add('border-green-700', 'bg-green-50'); });
        if (!right) b.classList.add('border-red-700', 'bg-red-50');
        $('#quiz-fb').innerHTML = `<p class="font-semibold">${right ? 'Richtig!' : 'Leider falsch.'} ${esc(q.erklaerung)}</p>
          <p class="text-sm mt-1"><a class="underline text-fw-dark" href="${esc(q.quelle_url)}" target="_blank" rel="noopener">Quelle</a></p>
          <button type="button" id="quiz-weiter" class="mt-3 bg-fw-dark text-white font-bold px-5 py-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fw-dark">${i + 1 < state.quiz.length ? 'Weiter' : 'Ergebnis'}</button>`;
        $('#quiz-weiter').focus();
        $('#quiz-weiter').addEventListener('click', () => { i++; show(); });
      }));
    }
    show();
  }

  function renderAll() { renderObr(); renderIdeen(); if (state.sitzungen) renderSitzungen(); }

  // ---------- Start ----------
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-obr]'); if (o) { setObr(state.obr === Number(o.dataset.obr) ? null : Number(o.dataset.obr)); return; }
    const v = e.target.closest('[data-idee]');
    if (v) { const k = 'stimmung:' + v.dataset.idee; store.set(k, store.get(k) === '1' ? '0' : '1'); renderIdeen(); return; }
    const c = e.target.closest('[data-ics]'); if (c) downloadICS(Number(c.dataset.ics));
  });
  $('#stadtteil-form').addEventListener('submit', e => e.preventDefault());
  $('#stadtteil-suche').addEventListener('input', searchStadtteil);
  window.addEventListener('hashchange', () => { const h = readHash(); if (h.obr !== state.obr) { state.obr = h.obr; renderAll(); } });

  blog.grid = $('#blog-grid'); blog.status = $('#blog-status'); blog.search = $('#blog-search');
  blog.buttons = [...document.querySelectorAll('.blog-filter')];
  let t; blog.search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderBlog, 150); });
  blog.buttons.forEach(b => b.addEventListener('click', () => setFilter(b)));
  initForm();

  const first = readHash(); state.obr = first.obr;
  Promise.all(['links', 'themen', 'ideen', 'ortsbeiraete', 'sitzungen', 'quiz'].map(n => getJSON(`data/${n}.json`)))
    .then(([links, themen, ideen, obrs, sitz, quiz]) => {
      state.links = links; applyLinks();
      state.themen = themen.filter(p => p.freigegeben === true);
      state.ideen = ideen; state.obrs = obrs.eintraege; state.sitzungen = sitz; state.quiz = quiz;
      setFilter(blog.buttons[0]); renderAll(); initQuiz();
      if (first.section) { const el = document.getElementById(first.section); if (el) el.scrollIntoView(); }
    })
    .catch(err => {
      console.error(err);
      blog.grid.innerHTML = '<p class="col-span-full text-center text-gray-700">Inhalte konnten nicht geladen werden. Bitte lade die Seite neu.</p>';
    });
})();
