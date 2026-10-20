(() => {
  'use strict';
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong class="bg-yellow-100">$1</strong>');
  const target = document.getElementById('legal');
  fetch(target.dataset.src).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }).then(md => {
    target.innerHTML = md.split(/\n{2,}/).map(b => {
      b = b.trim();
      if (b.startsWith('# ')) return `<h1 class="text-3xl font-extrabold mb-4">${inline(b.slice(2))}</h1>`;
      if (b.startsWith('## ')) return `<h2 class="text-xl font-bold mt-8 mb-2">${inline(b.slice(3))}</h2>`;
      if (b.startsWith('> ')) return `<p class="p-3 bg-fw-light rounded-xl text-sm">${inline(b.replace(/^> ?/gm, ''))}</p>`;
      return `<p class="mt-3 text-gray-800">${inline(b).replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }).catch(() => { target.textContent = 'Text konnte nicht geladen werden.'; });
})();
