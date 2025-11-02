/* Main site script: sidebar toggles, tabs, notes, search, theme, language */
(() => {
  const translations = {
    en: {
      title: "Studies Resumes — Management Technician",
      site_name: "Studies Resumes",
      year1: "Year 1",
      year2: "Year 2",
      year3: "Year 3",
      practice: "Practice",
      help_text: "Click a topic to open. Use Notes & Search.",
      tab_pages: "Pages",
      tab_notes: "Notes",
      tab_search: "Search",
      save_note: "Save",
      clear_note: "Clear",
      export_note: "Export",
      import_note: "Import",
      auto_save: "Auto save",
      search: "Search"
    },
    pt: {
      title: "Resumo de Estudos — Técnico de Gestão",
      site_name: "Resumo de Estudos",
      year1: "Ano 1",
      year2: "Ano 2",
      year3: "Ano 3",
      practice: "Prática",
      help_text: "Clique num tópico para abrir. Use Notas & Pesquisa.",
      tab_pages: "Páginas",
      tab_notes: "Notas",
      tab_search: "Pesquisar",
      save_note: "Guardar",
      clear_note: "Limpar",
      export_note: "Exportar",
      import_note: "Importar",
      auto_save: "Auto guardar",
      search: "Pesquisar"
    }
  };

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

  // Theme
  const themeBtn = $('#toggle-theme');
  const savedTheme = localStorage.getItem('sr_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  themeBtn.addEventListener('click', () => {
    const cur = document.body.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('sr_theme', next);
  });

  // Language
  const langSelect = $('#lang-select');
  const savedLang = localStorage.getItem('sr_lang') || 'pt';
  langSelect.value = savedLang;
  setLang(savedLang);
  langSelect.addEventListener('change', e => {
    setLang(e.target.value);
    localStorage.setItem('sr_lang', e.target.value);
  });

  function setLang(l) {
    document.documentElement.lang = l;
    document.title = translations[l].title;
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[l][key]) el.textContent = translations[l][key];
    });
  }

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

  // Search
  const pagesToIndex = [
    {url:'welcome.html', title:'Welcome'},
    {url:'year1/programacao.html', title:'Ano1 — Programação'},
    {url:'year1/redes.html', title:'Ano1 — Redes'},
    {url:'year2/programacao.html', title:'Ano2 — Programação'},
    {url:'year3/programacao.html', title:'Ano3 — Programação'},
    {url:'practice/python.html', title:'Practice Python'}
    // add all your pages …
  ];
  const pageCache = {};
  let indexed = false;

  async function indexPages() {
    const ps = pagesToIndex.map(async p => {
      try {
        const r = await fetch(p.url);
        const txt = await r.text();
        const div = document.createElement('div');
        div.innerHTML = txt;
        pageCache[p.url] = {title:p.title, text: div.innerText.slice(0,20000)};
      } catch(e) {
        pageCache[p.url] = {title:p.title, text:''};
      }
    });
    await Promise.all(ps);
  }

  $('#search-btn')?.addEventListener('click', async () => {
    const q = $('#site-search').value.trim().toLowerCase();
    if (!q) return;
    if (!indexed) { await indexPages(); indexed = true; }
    runSearch(q);
  });
  $('#site-search')?.addEventListener('keydown', e => { if (e.key === 'Enter') $('#search-btn').click(); });

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
        const snippet = (start ? '…' : '') + entry.text.slice(start, idx + 160) + (entry.text.length > idx + 160 ? '…' : '');
        results.push({url, title: entry.title, snippet});
      }
    }
    if (results.length === 0) {
      out.innerHTML = `<div class="result-item"><em>No results</em></div>`;
      return;
    }
    results.forEach(r => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `<h4>${r.title}</h4><div class="result-snippet">${escapeHtml(r.snippet)}</div><div style="margin-top:8px"><a href="${r.url}" target="content">Open</a></div>`;
      out.appendChild(item);
    });
  }

  function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  window.addEventListener('load', loadNotes);

})();
