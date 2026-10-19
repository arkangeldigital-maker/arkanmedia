// Páginas internas (servicios y proyectos): idioma, ajuste de títulos, formulario y navegación.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const html = document.documentElement;
  const lang = html.lang === 'en' ? 'en' : 'es';
  const T = (es, en) => (lang === 'en' ? en : es);

  // ---------- idioma ----------
  if (lang === 'en') {
    if (html.dataset.titleEn) document.title = html.dataset.titleEn;
    const d = $('meta[name="description"]'); if (d && html.dataset.descEn) d.content = html.dataset.descEn;
  }
  $$('.lang__btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.lang === lang);
    b.setAttribute('aria-pressed', b.dataset.lang === lang);
    b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      try { localStorage.setItem('arkan-lang', b.dataset.lang); } catch (e) { /* sin almacenamiento */ }
      const u = new URL(location.href); u.searchParams.set('lang', b.dataset.lang);
      location.replace(u.toString());
    });
  });
  $$('.year').forEach(y => { y.textContent = new Date().getFullYear(); });

  // ---------- títulos grandes: si una palabra no cabe, se reduce la letra ----------
  const fit = el => {
    el.style.fontSize = '';
    // el espacio real es el menor entre el elemento y su contenedor
    const pr = el.parentElement, pcs = getComputedStyle(pr);
    const avail = Math.min(el.clientWidth, pr.clientWidth - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight));
    for (let k = 0; k < 4; k++) {
      const r = document.createRange(); r.selectNodeContents(el);
      const rects = [...r.getClientRects()].filter(x => x.width);
      if (!rects.length) return;
      const w = Math.max(...rects.map(x => x.right)) - el.getBoundingClientRect().left;
      if (w <= avail + .5) return;
      el.style.fontSize = parseFloat(getComputedStyle(el).fontSize) * avail / w * .985 + 'px';
    }
  };
  const fitAll = () => $$('.fit, .sh2, .pnav__item b, .mini__meta b').forEach(fit);
  fitAll();
  document.fonts?.ready.then(fitAll);
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fitAll, 120); });

  // ---------- aparición suave al hacer scroll ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const els = $$('.shero > *, .phero > *, .pstage, .pbody__col > *, .pfacts, .sinc__list li, .swhy__item, .mini, .pnav__item, .squote > *, .sothers');
    els.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('rv--in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }

  // ---------- flechas del teclado: proyecto anterior / siguiente ----------
  addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    const a = e.key === 'ArrowLeft' ? $('.pnav__item--prev') : e.key === 'ArrowRight' ? $('.pnav__item--next') : null;
    if (a) location.href = a.href;
  });

  // ---------- formulario corto: envío directo al correo ----------
  $$('.sform').forEach(form => {
    const note = $('.form__note', form);
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      $$('.field input, .field textarea', form).forEach(f => { const bad = !f.checkValidity(); f.closest('.field').classList.toggle('is-invalid', bad); if (bad) ok = false; });
      if (!ok) { note.textContent = T('Revisa los campos marcados en rojo.', 'Please check the fields marked in red.'); return; }
      const pv = $('input[name=privacidad]', form);
      pv.closest('.check').classList.toggle('is-invalid', !pv.checked);
      if (!pv.checked) { note.textContent = T('Acepta el aviso de privacidad para continuar.', 'Please accept the privacy notice to continue.'); return; }
      if ($('.form__honey', form).value) return;
      const d = new FormData(form);
      const subject = form.dataset.project ? `Cotización por proyecto: ${form.dataset.project}` : `Cotización: ${form.dataset.service}`;
      form.classList.add('is-sending');
      note.textContent = T('Enviando…', 'Sending…');
      fetch('https://formsubmit.co/ajax/contacto@arkanmedia.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject, _template: 'table', _captcha: 'false', Servicio: form.dataset.service, Proyecto: form.dataset.project || '', Nombre: d.get('nombre'), Email: d.get('email'), Telefono: d.get('telefono'), Mensaje: d.get('mensaje'), Idioma: lang, Pagina: location.href, _replyto: d.get('email') }),
      }).then(r => r.json()).then(r => {
        if (String(r.success) !== 'true') throw new Error(r.message);
        form.reset();
        note.textContent = T('¡Gracias! Recibimos tu mensaje y te respondemos muy pronto.', 'Thank you! We got your message and will get back to you very soon.');
      }).catch(() => { note.textContent = T('No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.', 'We couldn’t send it. Please try again or message us on WhatsApp.'); })
        .finally(() => form.classList.remove('is-sending'));
    });
  });
})();
