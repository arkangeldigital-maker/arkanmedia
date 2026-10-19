(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduce;
  const body = document.body;
  const UI = window.UI || { cat: { web: 'Página web', sistemas: 'Sistema', identidad: 'Identidad de marca' }, view: 'Ver proyecto', want: 'Quiero un proyecto así', group: 'Grupo', of: 'de', fix: 'Revisa los campos marcados en rojo.', thanks: '¡Gracias! Te respondemos muy pronto.', hi: 'Hola ArkanMedia, soy', interest: 'Me interesa', phone: 'Teléfono', subject: 'Cotización desde la web', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', locale: 'es-MX' };
  const projects = (window.PROJECTS || []).map(p => window.trProject ? window.trProject(p) : p);
  const catName = UI.cat;

  // ---------- datos: proyectos y clientes ----------
  const media = p => `
    <div class="pcard__media">
      <div class="browser"><div class="browser__bar"><i></i><i></i><i></i><b></b></div><img src="../assets/projects/screens/${p.id}.jpg" alt=""></div>
      <div class="phone"><div class="phone__screen"><img src="../assets/projects/${p.mobile ? 'mobile' : 'screens'}/${p.id}.jpg" alt=""${p.mobile ? ' class="is-real"' : ''}></div></div>
    </div>`;
  const pad2 = n => String(n).padStart(2, '0');
  $('#work').innerHTML = projects.map((p, i) => `
    <article class="pcard" tabindex="0" role="button" data-i="${i}" aria-label="${UI.view} ${p.name}">
      ${media(p)}
      <div class="pcard__meta"><h3><span class="pcard__n">${pad2(i + 1)}</span>${p.name}</h3><span>${catName[p.cat]} · ${p.sector}</span></div>
    </article>`).join('');

  const clients = [
    ['patymartes.svg', 'Paty Martes'], ['masagua.svg', 'Grupo MAS'], ['lda.png', 'LDA Veracruz'],
    ['casahoms.png', 'CASA HOMS Deutschland'], ['fhsa.svg', 'Fortströer Hernández'],
    ['hp-icave.svg', 'Hutchison Ports ICAVE'], ['hp-lct.svg', 'Hutchison Ports LCT'], ['hp-eit.svg', 'Hutchison Ports EIT'], ['hp-timsa.svg', 'Hutchison Ports TIMSA'],
    ['hp-tilh.svg', 'Hutchison Ports TILH'], ['hp-ecv.svg', 'Hutchison Ports ECV'], ['hp-lcmt.svg', 'Hutchison Ports LCMT'], ['hp-tng.svg', 'Hutchison Ports TNG'],
    ['colon', 'Colegio Cristóbal Colón'], ['aaa', 'Agentes Aduanales de Veracruz'], ['cmic', 'CMIC'], ['carboncito', 'El Carboncito'],
    ['expediente', 'Blog Expediente'], ['lideres', 'Líderes'], ['edifica', 'Edifica Construcciones'], ['prosigo', 'Prosigo'],
    ['legotec', 'Legotec'], ['iab', 'Grupo IAB'], ['ipesa', 'IPESA'], ['puertoevento', 'Puerto Evento'],
    ['cecilia', 'Cecilia Brunette'], ['caee', 'Instituto CAEE'], ['dipemci', 'Dipemci'], ['calor', 'Al Calor Deportivo'],
    ['approachmen', 'Approachmen'], ['halley', 'Grupo Halley'], ['hola', 'Hola Tours'], ['mrseguridad', 'MR Seguridad'],
    ['parroquia', 'Parroquia'], ['novedades', 'Novedades'], ['especiales', 'Especiales'], ['zapata', 'Zapata'],
    ['ladeport', 'LaDeport'], ['photobook', 'Photobook'], ['medicagama', 'Médica Gama'], ['vissage', 'Vissage'],
    ['moncheri', 'Monchéri'], ['hasue', 'Hasue de México'], ['kidiatras', 'Kidiatras'], ['drraul', 'Dr. Raúl Barragán'],
    ['ejemex', 'Ejecutivos Mexicanos'],
  ];
  const clientCard = ([f, n], clone) => `<div class="client"${clone ? ' aria-hidden="true"' : ''}><img src="../assets/clients-t/${f.includes('.') ? f : f + '.png'}" alt="${clone ? '' : n}" loading="lazy" draggable="false"><span class="client__name">${n}</span></div>`;

  // ---------- ajuste de textos grandes: si una palabra no cabe, se reduce el tamaño ----------
  const FIT = '.hero__title, .big, .scard h3, .contact__big, .foot__word, .menu__links a, .drawer h3, .pcard__meta h3, .num strong, .loader__count, .manifesto, a.client--cta span, .client__name, .global__title, .step h3';
  const fitEl = el => {
    el.style.fontSize = '';
    const inline = getComputedStyle(el).display.startsWith('inline');
    // el espacio real es el menor entre el elemento y su contenedor (un hijo de flex puede crecer de más)
    const content = b => { const cs = getComputedStyle(b), r = b.getBoundingClientRect(); return { l: r.left + parseFloat(cs.paddingLeft) + b.clientLeft, r: r.left + b.clientLeft + b.clientWidth - parseFloat(cs.paddingRight) }; };
    const a = content(inline ? el.parentElement : el), p = content((inline ? el.parentElement : el).parentElement);
    const left = Math.max(a.l, p.l);
    const avail = (Math.min(a.r, p.r) - left) / (el.getBoundingClientRect().width / (el.offsetWidth || 1) || 1) - (inline ? 40 : 0);
    if (avail <= 0) return;
    // las tarjetas apiladas están escaladas: se corrige la medida con la escala real
    const sc = el.getBoundingClientRect().width / (el.offsetWidth || 1) || 1;
    for (let k = 0; k < 4; k++) {
      const r = document.createRange(); r.selectNodeContents(el);
      const right = (Math.max(...[...r.getClientRects()].map(x => x.right)) - left) / sc;
      if (right <= avail + .5) break;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = Math.max(12, fs * avail / right * .985) + 'px';
    }
  };
  const fitAll = (root = document) => $$(FIT, root).forEach(fitEl);
  let fitT;
  addEventListener('resize', () => { clearTimeout(fitT); fitT = setTimeout(() => { fitAll(); window.ScrollTrigger?.refresh(); }, 150); });
  fitAll();
  document.fonts?.ready.then(() => { fitAll(); window.ScrollTrigger?.refresh(); });

  // ---------- hero: las letras que cruzan el círculo rojo se ven blancas ----------
  const orb = $('.hero__orb'), white = $('.hero__title--white');
  let heroOn = true;
  new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; }).observe($('.hero'));
  const paintMask = () => {
    if (heroOn) {
      const o = orb.getBoundingClientRect(), c = white.getBoundingClientRect();
      const r = +getComputedStyle(orb).opacity > .5 ? o.width / 2 : 0, x = o.left + o.width / 2 - c.left, y = o.top + o.height / 2 - c.top;
      white.style.setProperty('--orb-mask', `radial-gradient(circle ${r}px at ${x}px ${y}px, #000 ${r - .5}px, transparent ${r + .5}px)`);
    }
    requestAnimationFrame(paintMask);
  };
  requestAnimationFrame(paintMask);

  // ---------- reloj de Veracruz ----------
  const clock = $('.clock');
  const tick = () => { clock.textContent = new Intl.DateTimeFormat(UI.locale, { hour: '2-digit', minute: '2-digit', timeZone: 'America/Mexico_City' }).format(new Date()); };
  tick(); setInterval(tick, 20000);
  $('.year').textContent = new Date().getFullYear();

  // ---------- desplazamiento suave ----------
  let lenis = null;
  if (hasGsap && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = target => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else (typeof target === 'string' ? $(target) : target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    e.preventDefault();
    setMenu(false);
    closeDrawer();
    scrollTo(a.getAttribute('href'));
  });

  // ---------- cabecera ----------
  const hdr = $('.hdr');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-solid', y > 30);
    hdr.classList.toggle('is-hidden', y > 300 && y > lastY && !body.classList.contains('menu-open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  // ---------- menú ----------
  const menuBtn = $('.menu-btn'), menu = $('#menu');
  function setMenu(open) {
    if (open === body.classList.contains('menu-open')) return;
    if (open) {
      const r = $('.menu-btn__icon').getBoundingClientRect();
      menu.style.setProperty('--cx', r.left + r.width / 2 + 'px');
      menu.style.setProperty('--cy', r.top + r.height / 2 + 'px');
      lenis?.stop();
    } else lenis?.start();
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? UI.closeMenu : UI.openMenu);
    open ? menu.removeAttribute('inert') : menu.setAttribute('inert', '');
  }
  menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));

  // ---------- detalle de proyecto ----------
  const drawer = $('#drawer'), dBody = $('.drawer__body', drawer);
  let cur = 0, lastFocus = null;
  const fill = i => {
    const p = projects[i];
    cur = i;
    $('.drawer__media', drawer).innerHTML = media(p);
    $('.drawer__tags', drawer).innerHTML = `<span>${catName[p.cat]}</span><span>${p.sector}</span>`;
    $('#dr-title').textContent = p.name;
    $('.drawer__desc', drawer).innerHTML = p.desc.map(d => `<p>${d}</p>`).join('');
    const slug = (window.PROJECT_SLUGS || {})[p.id];
    $('.drawer__actions', drawer).innerHTML = (slug ? `<a href="proyectos/${slug}.html" class="pill pill--red">${UI.detail || 'Ver detalle'} <span><i class="ico ico--ne" aria-hidden="true"></i></span></a>` : '') +
      `<a href="#contacto" class="pill">${UI.want} <span><i class="ico ico--ne" aria-hidden="true"></i></span></a>` +
      (p.url ? `<a href="${p.url}" target="_blank" rel="noopener" class="pill">Ver sitio <span><i class="ico ico--ne" aria-hidden="true"></i></span></a>` : '');
    $('.drawer__count', drawer).textContent = `${pad2(i + 1)} / ${pad2(projects.length)}`;
    dBody.scrollTop = 0;
    fitEl($('#dr-title'));
  };
  const openDrawer = i => {
    lastFocus = document.activeElement;
    fill(i);
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    body.classList.add('drawer-open');
    lenis?.stop();
    setTimeout(() => $('.drawer__close', drawer).focus({ preventScroll: true }), 50);
  };
  function closeDrawer() {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    body.classList.remove('drawer-open');
    lenis?.start();
    lastFocus?.focus({ preventScroll: true });
  }
  const step = d => {
    dBody.classList.add('is-swapping');
    setTimeout(() => { fill((cur + d + projects.length) % projects.length); dBody.classList.remove('is-swapping'); }, reduce ? 0 : 300);
  };
  $('#work').addEventListener('click', e => { const c = e.target.closest('.pcard'); if (c && !dragged) openDrawer(+c.dataset.i); });
  $('#work').addEventListener('keydown', e => { const c = e.target.closest('.pcard'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openDrawer(+c.dataset.i); } });
  drawer.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeDrawer(); });
  $('.drawer__prev', drawer).addEventListener('click', () => step(-1));
  $('.drawer__next', drawer).addEventListener('click', () => step(1));
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { setMenu(false); closeDrawer(); }
    if (!drawer.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  // en móvil la fila de proyectos se arrastra con el dedo; evita abrir el detalle al soltar
  let dragged = false;
  $('#work').addEventListener('pointerdown', e => { dragged = false; const x0 = e.clientX; const mv = ev => { if (Math.abs(ev.clientX - x0) > 8) dragged = true; }; addEventListener('pointermove', mv); addEventListener('pointerup', () => removeEventListener('pointermove', mv), { once: true }); });

  // ---------- cursor ----------
  if (fine && !reduce) {
    const c = $('.cursor');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerover', e => {
      c.classList.toggle('is-view', !!e.target.closest('.pcard'));
      c.classList.toggle('is-link', !e.target.closest('.pcard') && !!e.target.closest('a, button, label'));
    });
  }

  // ---------- formulario ----------
  const form = $('#form'), note = $('.form__note', form);
  let via = 'direct';
  $$('button[data-via]', form).forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('.field input, .field textarea', form).forEach(f => { const bad = !f.checkValidity(); f.closest('.field').classList.toggle('is-invalid', bad); if (bad) ok = false; });
    if (!ok) { note.textContent = UI.fix; return; }
    const privacy = $('input[name=privacidad]', form);
    privacy.closest('.check').classList.toggle('is-invalid', !privacy.checked);
    if (!privacy.checked) { note.textContent = UI.accept || 'Acepta el aviso de privacidad para continuar.'; return; }
    if ($('.form__honey', form).value) return; // relleno automático de robots
    const d = new FormData(form), interes = $$('.chips input:checked', form).map(c => c.nextElementSibling.textContent.trim());
    const text = `${UI.hi} ${d.get('nombre')}.\n\n${d.get('mensaje')}` + (interes.length ? `\n\n${UI.interest}: ${interes.join(', ')}` : '') + `\n\nEmail: ${d.get('email')}\n${UI.phone}: ${d.get('telefono')}`;
    if (via === 'whatsapp') {
      window.open(`https://wa.me/522297819005?text=${encodeURIComponent(text)}`, '_blank');
      note.textContent = UI.thanks;
      return;
    }
    // envío directo al correo de ArkanMedia (FormSubmit), sin que el visitante abra otra app
    form.classList.add('is-sending');
    note.textContent = UI.sending || 'Enviando…';
    fetch('https://formsubmit.co/ajax/contacto@arkanmedia.com', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: UI.subject, _template: 'table', _captcha: 'false', Nombre: d.get('nombre'), Email: d.get('email'), Telefono: d.get('telefono'), Interes: interes.join(', '), Mensaje: d.get('mensaje'), Idioma: window.LANG || 'es', _replyto: d.get('email') }),
    }).then(r => r.json()).then(r => {
      if (String(r.success) !== 'true') throw new Error(r.message);
      form.reset();
      note.textContent = UI.thanks;
    }).catch(() => { note.textContent = UI.fail || 'No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.'; })
      .finally(() => form.classList.remove('is-sending'));
  });

  // ---------- preguntas frecuentes: una abierta a la vez ----------
  $$('.qa__q').forEach(q => q.addEventListener('click', () => {
    const item = q.closest('.qa'), open = !item.classList.contains('is-open');
    $$('.qa.is-open').forEach(o => { o.classList.remove('is-open'); $('.qa__q', o).setAttribute('aria-expanded', 'false'); });
    item.classList.toggle('is-open', open);
    q.setAttribute('aria-expanded', open);
  }));

  // ---------- slider de clientes ----------
  // cada columna lleva 1 logo en escritorio y 2 en celular (dos filas); se recorre por columnas
  (() => {
    const wrap = $('#clients'), vp = $('.logos__viewport', wrap), track = $('.logos__track', wrap), dotsEl = $('.logos__dots', wrap);
    let per = 6, rows = 0, N = 0, i = 0, timer = null, busy = false;
    const colW = () => vp.clientWidth / per;
    const setX = anim => {
      track.style.transition = anim && !reduce ? 'transform .9s cubic-bezier(.65, 0, .35, 1)' : 'none';
      track.style.transform = `translate3d(${-i * colW()}px,0,0)`;
    };
    const build = () => {
      const cs = getComputedStyle(wrap);
      const newPer = parseInt(cs.getPropertyValue('--per')) || 6, newRows = parseInt(cs.getPropertyValue('--rows')) || 1;
      if (newRows !== rows) {
        rows = newRows;
        const cols = [];
        for (let k = 0; k < clients.length; k += rows) cols.push(clients.slice(k, k + rows));
        N = cols.length;
        const col = (c, clone) => `<div class="logos__col">${c.map(x => clientCard(x, clone)).join('')}${c.length < rows ? '<div class="client client--empty" aria-hidden="true"></div>' : ''}</div>`;
        // las primeras columnas se repiten al final para que el recorrido sea infinito sin saltos
        track.innerHTML = cols.map(c => col(c)).join('') + cols.slice(0, 6).map(c => col(c, true)).join('');
        $$('.client__name', track).forEach(fitEl);
        i = 0;
      }
      per = newPer;
      const groups = Math.ceil(N / per);
      dotsEl.innerHTML = Array.from({ length: groups }, (_, k) => `<button role="tab" aria-label="${UI.group} ${k + 1} ${UI.of} ${groups}"></button>`).join('');
      $$('button', dotsEl).forEach((d, k) => d.addEventListener('click', () => { go(k * per); restart(); }));
      i = Math.min(i, N - 1); setX(false); paintDots();
    };
    const paintDots = () => { const g = Math.floor((i % N) / per); $$('button', dotsEl).forEach((d, k) => { d.classList.toggle('is-active', k === g); d.setAttribute('aria-selected', k === g); }); };
    const go = n => {
      if (n < 0) { i += N; setX(false); void track.offsetWidth; n += N; }
      i = Math.min(n, N); setX(true); paintDots();
    };
    track.addEventListener('transitionend', () => { if (i >= N) { i -= N; setX(false); } });
    const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => { if (!busy && !document.hidden) go(i + 1); }, 2400); };
    wrap.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') busy = true; });
    wrap.addEventListener('pointerleave', () => { busy = false; });
    let x0 = null;
    vp.addEventListener('pointerdown', e => { x0 = e.clientX; });
    addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? per : -per)); restart(); }
    });
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 150); });
    build(); restart();
  })();

  // ---------- manifiesto: separa en palabras ----------
  const man = $('.manifesto');
  man.innerHTML = man.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const words = $$('.w', man);

  // ---------- sin GSAP: todo visible y funcional ----------
  const countUp = el => { el.textContent = el.dataset.count; };
  if (!hasGsap) {
    $$('.step').forEach(st => st.classList.add('is-on'));
    $('.loader').remove(); body.classList.remove('is-loading');
    words.forEach(w => { w.style.opacity = 1; });
    $$('[data-count]').forEach(countUp);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ---------- cargador + entrada del hero ----------
  const lines = $$('.hero__title .word, .hero__pill');
  gsap.set(lines, { yPercent: 110 });
  gsap.set('.split-up', { y: 30, opacity: 0 });
  gsap.set('.badge', { scale: 0, rotate: -90 });
  gsap.set('.hero__orb', { scale: .3, opacity: 0 });
  let skipLoader = false;
  try { skipLoader = sessionStorage.getItem('arkan-skip-loader') === '1'; sessionStorage.removeItem('arkan-skip-loader'); } catch (e) { /* sin almacenamiento */ }
  if (skipLoader) gsap.set('.loader', { display: 'none' });
  const counter = { v: 0 };
  const intro = gsap.timeline();
  intro.to(counter, { v: 100, duration: skipLoader ? 0 : 1.4, ease: 'power2.inOut', onUpdate: () => { $('.loader__count span').textContent = Math.round(counter.v); } })
    .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: skipLoader ? 0 : 1, ease: 'expo.inOut' })
    .add(() => { $('.loader').remove(); body.classList.remove('is-loading'); }, '-=.3')
    .to('.hero__orb', { scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out' }, '-=.6')
    .to(lines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .08 }, '<')
    .to('.split-up', { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .1 }, '-=.9')
    .to('.badge', { scale: 1, rotate: 0, duration: 1.2, ease: 'elastic.out(1, .6)' }, '-=.9');
  gsap.set('.loader', { clipPath: 'inset(0 0 0% 0)' });

  // la esfera sigue al mouse y se aleja con el scroll
  if (fine) {
    const orbX = gsap.quickTo('.hero__orb', 'x', { duration: 1.2, ease: 'power3' });
    const orbY = gsap.quickTo('.hero__orb', 'y', { duration: 1.2, ease: 'power3' });
    $('.hero').addEventListener('pointermove', e => { orbX((e.clientX / innerWidth - .5) * 80); orbY((e.clientY / innerHeight - .5) * 80); });
  }
  gsap.to('.hero__type', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__orb', { yPercent: 40, scale: .7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // ---------- cinta: avanza sola y acelera con la velocidad del scroll ----------
  const track = $('.ticker__track');
  let tx = 0, boost = 0;
  ScrollTrigger.create({ onUpdate: s => { boost = Math.min(Math.abs(s.getVelocity()) / 300, 12); } });
  gsap.ticker.add(() => {
    const half = track.scrollWidth / 2;
    tx -= 1 + boost; boost *= .92;
    if (-tx >= half) tx += half;
    track.style.transform = `translate3d(${tx}px,0,0)`;
  });

  // ---------- manifiesto palabra por palabra ----------
  gsap.to(words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: man, start: 'top 80%', end: 'bottom 45%', scrub: true } });

  // ---------- contadores ----------
  $$('[data-count]').forEach(el => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v); } });
  });

  // ---------- títulos grandes: entran desde abajo ----------
  $$('.big, .contact__row').forEach(el => {
    gsap.from(el, { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  // ---------- servicios: la tarjeta de atrás se encoge al apilarse ----------
  const cards = $$('.scard');
  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    gsap.to(card, { scale: .92 - (cards.length - i) * .01, ease: 'none',
      scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 30%', scrub: true } });
  });

  // ---------- proyectos: scroll horizontal fijado (solo escritorio) ----------
  // contador y flechas del carrusel de proyectos
  const arrows = $$('.work__arrow'), countEl = $('.work__count b');
  $('.work__total').textContent = pad2(projects.length);
  const setNav = (idx, atStart, atEnd) => {
    countEl.textContent = pad2(Math.min(projects.length, idx + 1));
    arrows[0].disabled = atStart; arrows[1].disabled = atEnd;
  };
  const cardStep = () => { const c = $$('.pcard'); return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : innerWidth; };

  ScrollTrigger.matchMedia({
    '(min-width: 761px)': () => {
      const tr = $('#work');
      const dist = () => tr.scrollWidth - innerWidth;
      const tween = gsap.to(tr, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.work', pin: '.work__pin', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true,
          onUpdate: s => { gsap.set('.work__progress span', { scaleX: s.progress }); setNav(Math.round(s.progress * dist() / cardStep()), s.progress < .01, s.progress > .99); } } });
      const st = tween.scrollTrigger;
      setNav(0, true, false);
      // las flechas mueven la página una tarjeta hacia adelante o atrás dentro del recorrido fijado
      const go = dir => {
        const cur = Math.round(st.progress * dist() / cardStep());
        const x = Math.max(0, Math.min(dist(), (cur + dir) * cardStep()));
        const y = st.start + x;
        lenis ? lenis.scrollTo(y, { duration: 1 }) : scrollTo({ top: y, behavior: 'smooth' });
      };
      const onClick = e => go(+e.currentTarget.dataset.dir);
      arrows.forEach(a => a.addEventListener('click', onClick));
      // la palabra del fondo avanza en sentido contrario, más lento
      gsap.to('.work__word', { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '.work', start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } });
      // cada tarjeta se inclina un poco mientras pasa
      $$('.pcard', tr).forEach(card => {
        gsap.fromTo($('.pcard__media', card), { rotate: 3, scale: .92 }, { rotate: -3, scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
      return () => arrows.forEach(a => a.removeEventListener('click', onClick));
    },
    '(max-width: 760px)': () => {
      const tr = $('#work');
      const swipe = $('.work__swipe');
      tr.append(swipe); // queda encima de la primera tarjeta
      const upd = () => {
        const max = Math.max(1, tr.scrollWidth - tr.clientWidth);
        gsap.set('.work__progress span', { scaleX: tr.scrollLeft / max });
        setNav(Math.round(tr.scrollLeft / cardStep()), tr.scrollLeft < 4, tr.scrollLeft > max - 4);
        if (tr.scrollLeft > 20) swipe.classList.add('is-gone');
      };
      const onClick = e => tr.scrollBy({ left: +e.currentTarget.dataset.dir * cardStep(), behavior: 'smooth' });
      arrows.forEach(a => a.addEventListener('click', onClick));
      tr.addEventListener('scroll', upd, { passive: true });
      upd();
      return () => { tr.removeEventListener('scroll', upd); arrows.forEach(a => a.removeEventListener('click', onClick)); };
    },
  });

  // ---------- proceso: la línea se llena y cada paso se enciende al pasar ----------
  const vertical = () => innerWidth <= 760;
  gsap.fromTo('.steps__line i', { scaleX: 0, scaleY: 0 }, { scaleX: () => vertical() ? 1 : 1, scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: true, invalidateOnRefresh: true } });
  $$('.step').forEach(step => ScrollTrigger.create({ trigger: step, start: 'top 70%', onEnter: () => step.classList.add('is-on'), onLeaveBack: () => step.classList.remove('is-on') }));
  gsap.from('.step', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.steps', start: 'top 80%' } });
  gsap.from('.qa', { y: 30, opacity: 0, duration: .9, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });

  // ---------- detalles gráficos: se desplazan a distinta velocidad ----------
  $$('.deco[data-speed]').forEach(el => {
    gsap.to(el, { y: () => +el.dataset.speed * 400, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });

  // ---------- clientes: aparecen en cascada ----------
  gsap.from('.logos', { opacity: 0, y: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.logos', start: 'top 88%' } });

  // ---------- pie: la palabra gigante sube ----------
  gsap.from('.foot__word', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
