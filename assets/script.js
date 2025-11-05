/* Main site script: sidebar toggles, tabs, notes, search */
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Drawer / hamburger
  const sidebar = $('#sidebar');
  const burger = $('#hamburger');
  burger.addEventListener('click', () => {
    const hidden = sidebar.getAttribute('aria-hidden') === 'true';
    sidebar.setAttribute('aria-hidden', String(!hidden));
  });

  // Dropdowns in sidebar
  $$('.dropdown').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const open = sub.style.display === 'block';
      if (open) {
        sub.style.display = 'none';
        btn.setAttribute('aria-expanded','false');
      } else {
        sub.style.display = 'block';
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  // Tabs
  $$('.tab').forEach(t => {
    t.addEventListener('click', () => {
      $$('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      $$('.tab-pane').forEach(p => p.classList.add('hidden'));
      $(`#${t.dataset.target}`).classList.remove('hidden');
    });
  });

  // Notes
  const notesKey = () => `sr_notes_${document.body.getAttribute('data-lang') || 'pt'}`;
  const editor = $('#notes-editor');

  function loadNotes() {
    if (editor) editor.innerHTML = localStorage.getItem(notesKey()) || '';
  }
  loadNotes();

  $('#notes-save')?.addEventListener('click', () => {
    localStorage.setItem(notesKey(), editor.innerHTML);
    flash('Notes saved');
  });
  $('#notes-clear')?.addEventListener('click', () => {
    if (confirm('Clear all notes?')) {
      editor.innerHTML = '';
      localStorage.removeItem(notesKey());
    }
  });
  $('#notes-export')?.addEventListener('click', () => {
    const blob = new Blob([editor.innerHTML], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.html';
    a.click();
    URL.revokeObjectURL(url);
  });
  $('#notes-import')?.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.html,.txt';
    inp.onchange = () => {
      const f = inp.files[0];
      const r = new FileReader();
      r.onload = () => { editor.innerHTML = r.result; };
      r.readAsText(f);
    };
    inp.click();
  });
  $('#auto-save')?.addEventListener('change', e => {
    if (e.target.checked) {
      editor.addEventListener('input', autoSave);
    } else {
      editor.removeEventListener('input', autoSave);
    }
  });

  function autoSave() {
    localStorage.setItem(notesKey(), editor.innerHTML);
  }

  function flash(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.position = 'fixed';
    el.style.right = '16px';
    el.style.bottom = '16px';
    el.style.padding = '8px 12px';
    el.style.border = '1px solid var(--border)';
    el.style.borderRadius = '8px';
    el.style.background = 'var(--card)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  // --- AUTO-INDEXING SEARCH SYSTEM ---

const pageCache = {};
let indexed = false;
let indexingInProgress = false;

// Collect all sidebar links automatically
function collectSidebarLinks() {
  const links = Array.from(document.querySelectorAll('.menu a'));
  const unique = new Map();
  links.forEach(link => {
    const url = link.getAttribute('href');
    if (!url || unique.has(url)) return;
    unique.set(url, { url, title: link.textContent.trim() });
  });
  return Array.from(unique.values());
}

// Fetch and index the text content of all linked pages
async function indexPages() {
  if (indexed || indexingInProgress) return;
  indexingInProgress = true;

  const pagesToIndex = collectSidebarLinks();
  const status = document.createElement('div');
  status.id = 'search-status';
  status.textContent = '🔍 A indexar páginas...';
  status.style.cssText = `
    position: fixed; bottom: 16px; left: 16px;
    background: var(--card, #fff);
    border: 1px solid var(--border, #ccc);
    padding: 8px 12px; border-radius: 8px;
    font-size: 14px; z-index: 9999;
  `;
  document.body.appendChild(status);

  const ps = pagesToIndex.map(async (p, i) => {
    try {
      const r = await fetch(p.url);
      const txt = await r.text();
      const div = document.createElement('div');
      div.innerHTML = txt;
      pageCache[p.url] = { title: p.title, text: div.innerText.slice(0, 30000) };
    } catch (e) {
      console.warn('❌ Failed to fetch', p.url, e);
      pageCache[p.url] = { title: p.title, text: '' };
    }
    status.textContent = `🔍 Indexando (${i + 1}/${pagesToIndex.length})...`;
  });

  await Promise.all(ps);
  document.body.removeChild(status);
  indexed = true;
  indexingInProgress = false;
  flash('✅ Páginas indexadas para pesquisa');
}

// Run the search
$('#search-btn')?.addEventListener('click', async () => {
  const q = $('#site-search').value.trim().toLowerCase();
  if (!q) return;
  if (!indexed) await indexPages();
  runSearch(q);
});

$('#site-search')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') $('#search-btn').click();
});

function runSearch(q) {
  const out = $('#search-results');
  out.innerHTML = '';
  const results = [];

  for (const url in pageCache) {
    const entry = pageCache[url];
    if (!entry.text) continue;
    const idx = entry.text.toLowerCase().indexOf(q);
    if (idx !== -1) {
      const start = Math.max(0, idx - 80);
      const snippet =
        (start ? '…' : '') +
        entry.text.slice(start, idx + 160) +
        (entry.text.length > idx + 160 ? '…' : '');
      results.push({ url, title: entry.title, snippet });
    }
  }

  if (results.length === 0) {
    out.innerHTML = `<div class="result-item"><em>Nenhum resultado encontrado.</em></div>`;
    return;
  }

  results.forEach(r => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <h4>${r.title}</h4>
      <div class="result-snippet">${highlight(r.snippet, q)}</div>
      <div style="margin-top:8px">
        <a href="${r.url}" target="content">Abrir</a>
      </div>
    `;
    out.appendChild(item);
  });
}

// Highlight matching keyword
function highlight(snippet, q) {
  const escaped = escapeHtml(snippet);
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(regex, '<mark>$1</mark>');
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
