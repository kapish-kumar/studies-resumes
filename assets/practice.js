// Shared logic for practice pages: theme, language, notes, console
(() => {
  const translations = {
    en: {
      title: "Practice Console",
      notes: "Personal Notes",
      run: "Run Code",
      clear: "Clear",
      save: "Save Notes",
      external: "Open external compiler"
    },
    pt: {
      title: "Console de Prática",
      notes: "Notas Pessoais",
      run: "Executar Código",
      clear: "Limpar",
      save: "Guardar Notas",
      external: "Abrir compilador externo"
    }
  };

  let currentLang = localStorage.getItem('practice_lang') || 'en';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function translateUI() {
    $$('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
      }
    });
  }

  // Language toggle
  const langBtn = $('#lang-toggle');
  langBtn?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'pt' : 'en';
    localStorage.setItem('practice_lang', currentLang);
    translateUI();
  });
  translateUI();

  // Theme toggle
  const themeBtn = $('#theme-toggle');
  const savedTheme = localStorage.getItem('practice_theme') || 'light';
  if (savedTheme === 'dark') document.body.classList.add('dark-mode');
  themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('practice_theme', theme);
  });

  // Notes area
  const notesArea = $('#notes-area');
  const saveNotesBtn = $('#save-notes');
  const notesKey = () => `practice_notes_${document.body.getAttribute('data-lang') || ''}_${currentLang}`;

  if (notesArea) {
    const txt = localStorage.getItem(notesKey()) || '';
    notesArea.value = txt;
    saveNotesBtn?.addEventListener('click', () => {
      localStorage.setItem(notesKey(), notesArea.value);
      alert(currentLang === 'en' ? "Notes saved!" : "Notas guardadas!");
    });
  }

  // Console run (for JS only inline)
  const runBtn = $('#run-btn');
  const codeArea = $('#code-area');
  const outputFrame = $('#output-frame');

  runBtn?.addEventListener('click', () => {
    const lang = document.body.getAttribute('data-lang');
    const code = codeArea.value;
    if (lang === 'javascript') {
      const html = `
        <html><body>
          <pre id="out"></pre>
          <script>
            console.stdlog = console.log.bind(console);
            console.log = function(){
              var out = document.getElementById('out');
              out.textContent += Array.from(arguments).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\\n';
              console.stdlog.apply(console, arguments);
            };
            try { ${code} } catch(e) { document.getElementById('out').textContent += 'Error: '+e+'\\n'; }
          <\/script>
        </body></html>`;
      outputFrame.srcdoc = html;
    } else {
      // For non-JS, just instruct external
      outputFrame.srcdoc = `<pre>${currentLang === 'en'
        ? "Use the external compiler link below to run this code."
        : "Use o link do compilador externo abaixo para executar este código."
      }</pre>`;
    }
  });

})();
