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

  //Search  
 const pagesToIndex = [
  {url:'welcome.html', title:'Bem-vindo'},

  // ----------------------------
  // 📘 ANO 1
  // ----------------------------

  // Programação
  {url:'year1/programacao/modulo1.html', title:'Ano 1 — Programação Módulo 1'},
  {url:'year1/programacao/modulo2.html', title:'Ano 1 — Programação Módulo 2'},
  {url:'year1/programacao/modulo3.html', title:'Ano 1 — Programação Módulo 3'},

  // Redes
  {url:'year1/redes/modulo1.html', title:'Ano 1 — Redes Módulo 1'},
  {url:'year1/redes/modulo2.html', title:'Ano 1 — Redes Módulo 2'},
  {url:'year1/redes/modulo3.html', title:'Ano 1 — Redes Módulo 3'},

  // Física
  {url:'year1/fisica/f1.html', title:'Ano 1 — Física F1'},
  {url:'year1/fisica/f2.html', title:'Ano 1 — Física F2'},
  {url:'year1/fisica/f3.html', title:'Ano 1 — Física F3'},
  {url:'year1/fisica/f4.html', title:'Ano 1 — Física F4'},

  // Química
  {url:'year1/quimica/f1.html', title:'Ano 1 — Química F1'},
  {url:'year1/quimica/f2.html', title:'Ano 1 — Química F2'},
  {url:'year1/quimica/f3.html', title:'Ano 1 — Química F3'},
  {url:'year1/quimica/f4.html', title:'Ano 1 — Química F4'},

  // Matemática
  {url:'year1/matematica/p1.html', title:'Ano 1 — Matemática P1'},
  {url:'year1/matematica/p2.html', title:'Ano 1 — Matemática P2'},
  {url:'year1/matematica/p3.html', title:'Ano 1 — Matemática P3'},
  {url:'year1/matematica/p4.html', title:'Ano 1 — Matemática P4'},
  {url:'year1/matematica/p5.html', title:'Ano 1 — Matemática P5'},
  {url:'year1/matematica/p6.html', title:'Ano 1 — Matemática P6'},
  {url:'year1/matematica/p7.html', title:'Ano 1 — Matemática P7'},
  {url:'year1/matematica/p8.html', title:'Ano 1 — Matemática P8'},

  // TIC
  {url:'year1/tic/modulo1.html', title:'Ano 1 — TIC Módulo 1'},
  {url:'year1/tic/modulo2.html', title:'Ano 1 — TIC Módulo 2'},
  {url:'year1/tic/modulo3.html', title:'Ano 1 — TIC Módulo 3'},

  // Arquitetura
  {url:'year1/arquitectura/modulo1/unidade1.html', title:'Ano 1 — Arquitetura Módulo 1 Unidade 1'},
  {url:'year1/arquitectura/modulo1/unidade2.html', title:'Ano 1 — Arquitetura Módulo 1 Unidade 2'},
  {url:'year1/arquitectura/modulo2.html', title:'Ano 1 — Arquitetura Módulo 2'},
  {url:'year1/arquitectura/modulo3.html', title:'Ano 1 — Arquitetura Módulo 3'},


  // ----------------------------
  // 📗 ANO 2
  // ----------------------------

  // Programação
  {url:'year2/programacao/modulo1.html', title:'Ano 2 — Programação Módulo 1'},
  {url:'year2/programacao/modulo2.html', title:'Ano 2 — Programação Módulo 2'},
  {url:'year2/programacao/modulo3.html', title:'Ano 2 — Programação Módulo 3'},

  // Redes
  {url:'year2/redes/modulo1.html', title:'Ano 2 — Redes Módulo 1'},
  {url:'year2/redes/modulo2.html', title:'Ano 2 — Redes Módulo 2'},
  {url:'year2/redes/modulo3.html', title:'Ano 2 — Redes Módulo 3'},

  // Física
  {url:'year2/fisica/f1.html', title:'Ano 2 — Física F1'},
  {url:'year2/fisica/f2.html', title:'Ano 2 — Física F2'},
  {url:'year2/fisica/f3.html', title:'Ano 2 — Física F3'},
  {url:'year2/fisica/f4.html', title:'Ano 2 — Física F4'},

  // Química
  {url:'year2/quimica/f1.html', title:'Ano 2 — Química F1'},
  {url:'year2/quimica/f2.html', title:'Ano 2 — Química F2'},
  {url:'year2/quimica/f3.html', title:'Ano 2 — Química F3'},
  {url:'year2/quimica/f4.html', title:'Ano 2 — Química F4'},

  // Matemática
  {url:'year2/matematica/p1.html', title:'Ano 2 — Matemática P1'},
  {url:'year2/matematica/p2.html', title:'Ano 2 — Matemática P2'},
  {url:'year2/matematica/p3.html', title:'Ano 2 — Matemática P3'},
  {url:'year2/matematica/p4.html', title:'Ano 2 — Matemática P4'},
  {url:'year2/matematica/p5.html', title:'Ano 2 — Matemática P5'},
  {url:'year2/matematica/p6.html', title:'Ano 2 — Matemática P6'},
  {url:'year2/matematica/p7.html', title:'Ano 2 — Matemática P7'},
  {url:'year2/matematica/p8.html', title:'Ano 2 — Matemática P8'},

  // TIC
  {url:'year2/tic/modulo1.html', title:'Ano 2 — TIC Módulo 1'},
  {url:'year2/tic/modulo2.html', title:'Ano 2 — TIC Módulo 2'},
  {url:'year2/tic/modulo3.html', title:'Ano 2 — TIC Módulo 3'},

  // Arquitetura
  {url:'year2/arquitectura/modulo1/unidade1.html', title:'Ano 2 — Arquitetura Módulo 1 Unidade 1'},
  {url:'year2/arquitectura/modulo1/unidade2.html', title:'Ano 2 — Arquitetura Módulo 1 Unidade 2'},
  {url:'year2/arquitectura/modulo2.html', title:'Ano 2 — Arquitetura Módulo 2'},
  {url:'year2/arquitectura/modulo3.html', title:'Ano 2 — Arquitetura Módulo 3'},


  // ----------------------------
  // 📙 ANO 3
  // ----------------------------

  // Programação
  {url:'year3/programacao/modulo1.html', title:'Ano 3 — Programação Módulo 1'},
  {url:'year3/programacao/modulo2.html', title:'Ano 3 — Programação Módulo 2'},
  {url:'year3/programacao/modulo3.html', title:'Ano 3 — Programação Módulo 3'},

  // Redes
  {url:'year3/redes/modulo1.html', title:'Ano 3 — Redes Módulo 1'},
  {url:'year3/redes/modulo2.html', title:'Ano 3 — Redes Módulo 2'},
  {url:'year3/redes/modulo3.html', title:'Ano 3 — Redes Módulo 3'},

  // Física
  {url:'year3/fisica/f1.html', title:'Ano 3 — Física F1'},
  {url:'year3/fisica/f2.html', title:'Ano 3 — Física F2'},
  {url:'year3/fisica/f3.html', title:'Ano 3 — Física F3'},
  {url:'year3/fisica/f4.html', title:'Ano 3 — Física F4'},

  // Química
  {url:'year3/quimica/f1.html', title:'Ano 3 — Química F1'},
  {url:'year3/quimica/f2.html', title:'Ano 3 — Química F2'},
  {url:'year3/quimica/f3.html', title:'Ano 3 — Química F3'},
  {url:'year3/quimica/f4.html', title:'Ano 3 — Química F4'},

  // Matemática
  {url:'year3/matematica/p1.html', title:'Ano 3 — Matemática P1'},
  {url:'year3/matematica/p2.html', title:'Ano 3 — Matemática P2'},
  {url:'year3/matematica/p3.html', title:'Ano 3 — Matemática P3'},
  {url:'year3/matematica/p4.html', title:'Ano 3 — Matemática P4'},
  {url:'year3/matematica/p5.html', title:'Ano 3 — Matemática P5'},
  {url:'year3/matematica/p6.html', title:'Ano 3 — Matemática P6'},
  {url:'year3/matematica/p7.html', title:'Ano 3 — Matemática P7'},
  {url:'year3/matematica/p8.html', title:'Ano 3 — Matemática P8'},

  // TIC
  {url:'year3/tic/modulo1.html', title:'Ano 3 — TIC Módulo 1'},
  {url:'year3/tic/modulo2.html', title:'Ano 3 — TIC Módulo 2'},
  {url:'year3/tic/modulo3.html', title:'Ano 3 — TIC Módulo 3'},

  // Arquitetura
  {url:'year3/arquitectura/modulo1/unidade1.html', title:'Ano 3 — Arquitetura Módulo 1 Unidade 1'},
  {url:'year3/arquitectura/modulo1/unidade2.html', title:'Ano 3 — Arquitetura Módulo 1 Unidade 2'},
  {url:'year3/arquitectura/modulo2.html', title:'Ano 3 — Arquitetura Módulo 2'},
  {url:'year3/arquitectura/modulo3.html', title:'Ano 3 — Arquitetura Módulo 3'},


  // ----------------------------
  // 🧠 PRÁTICA
  // ----------------------------
  {url:'practice/python.html', title:'Prática — Python'},
  {url:'practice/javascript.html', title:'Prática — JavaScript'},
  {url:'practice/java.html', title:'Prática — Java'},
  {url:'practice/sql.html', title:'Prática — SQL'},
  {url:'practice/c.html', title:'Prática — C'},
  {url:'practice/csharp.html', title:'Prática — C#'},
  {url:'practice/cpp.html', title:'Prática — C++'}
];
