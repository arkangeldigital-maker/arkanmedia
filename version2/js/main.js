(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduce;
  const body = document.body;
  const projects = window.PROJECTS || [];
  const catName = { web: 'Página web', sistemas: 'Sistema', identidad: 'Identidad corporativa' };

  // ---------- datos: proyectos y clientes ----------
  const media = p => `
    <div class="pcard__media">
      <div class="browser"><div class="browser__bar"><i></i><i></i><i></i><b></b></div><img src="../assets/projects/screens/${p.id}.jpg" alt=""></div>
      <div class="phone"><div class="phone__screen"><img src="../assets/projects/screens/${p.id}.jpg" alt=""></div></div>
    </div>`;
  const pad2 = n => String(n).padStart(2, '0');
  $('#work').innerHTML = projects.map((p, i) => `
    <article class="pcard" tabindex="0" role="button" data-i="${i}" aria-label="Ver proyecto ${p.name}">
      ${media(p)}
      <div class="pcard__meta"><h3><span class="pcard__n">${pad2(i + 1)}</span>${p.name}</h3><span>${catName[p.cat]} · ${p.sector}</span></div>
    </article>`).join('');

  const clients = [
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
  // 33 logos + una celda de 3 columnas cierra la rejilla en 6, 4 o 3 columnas
  $('#clients').innerHTML = clients.map(([f, n]) => `<div class="client"><img src="../assets/clients-t/${f}.png" alt="${n}" loading="lazy"><span class="client__name">${n}</span></div>`).join('') +
    `<a href="#contacto" class="client client--cta"><span>¿Tu marca aquí?</span><b><i class="ico ico--ne" aria-hidden="true"></i></b></a>`;

  // ---------- ajuste de textos grandes: si una palabra no cabe, se reduce el tamaño ----------
  const FIT = '.hero__title, .big, .scard h3, .contact__big, .foot__word, .menu__links a, .drawer h3, .pcard__meta h3, .num strong, .loader__count, .manifesto, a.client--cta span';
  const fitEl = el => {
    el.style.fontSize = '';
    const inline = getComputedStyle(el).display.startsWith('inline');
    // el espacio real es el menor entre el elemento y su contenedor (un hijo de flex puede crecer de más)
    const content = b => { const cs = getComputedStyle(b), r = b.getBoundingClientRect(); return { l: r.left + parseFloat(cs.paddingLeft) + b.clientLeft, r: r.left + b.clientLeft + b.clientWidth - parseFloat(cs.paddingRight) }; };
    const a = content(inline ? el.parentElement : el), p = content((inline ? el.parentElement : el).parentElement);
    const left = Math.max(a.l, p.l);
    const avail = Math.min(a.r, p.r) - left - (inline ? 40 : 0);
    if (avail <= 0) return;
    for (let k = 0; k < 4; k++) {
      const r = document.createRange(); r.selectNodeContents(el);
      const right = Math.max(...[...r.getClientRects()].map(x => x.right)) - left;
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

  // ---------- reloj de Veracruz ----------
  const clock = $('.clock');
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Mexico_City' }).format(new Date()); };
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
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
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
    $('.drawer__actions', drawer).innerHTML = `<a href="#contacto" class="pill pill--red">Quiero un proyecto así <span><i class="ico ico--ne" aria-hidden="true"></i></span></a>` +
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
  let via = 'whatsapp';
  $$('button[data-via]', form).forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input:not([type=checkbox]), textarea', form).forEach(f => { const bad = !f.checkValidity(); f.closest('.field').classList.toggle('is-invalid', bad); if (bad) ok = false; });
    if (!ok) { note.textContent = 'Revisa los campos marcados en rojo.'; return; }
    const d = new FormData(form), interes = d.getAll('interes');
    const text = `Hola ArkanMedia, soy ${d.get('nombre')}.\n\n${d.get('mensaje')}` + (interes.length ? `\n\nMe interesa: ${interes.join(', ')}` : '') + `\n\nEmail: ${d.get('email')}\nTeléfono: ${d.get('telefono')}`;
    const url = via === 'whatsapp' ? `https://wa.me/522297819005?text=${encodeURIComponent(text)}`
      : `mailto:contacto@arkanmedia.com?subject=${encodeURIComponent('Cotización desde la web')}&body=${encodeURIComponent(text)}`;
    window.open(url, via === 'whatsapp' ? '_blank' : '_self');
    note.textContent = '¡Gracias! Te respondemos muy pronto.';
  });

  // ---------- manifiesto: separa en palabras ----------
  const man = $('.manifesto');
  man.innerHTML = man.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const words = $$('.w', man);

  // ---------- sin GSAP: todo visible y funcional ----------
  const countUp = el => { el.textContent = el.dataset.count; };
  if (!hasGsap) {
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
  const counter = { v: 0 };
  const intro = gsap.timeline();
  intro.to(counter, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { $('.loader__count span').textContent = Math.round(counter.v); } })
    .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' })
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
  gsap.to('.hero__title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
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
  ScrollTrigger.matchMedia({
    '(min-width: 761px)': () => {
      const tr = $('#work');
      const dist = () => tr.scrollWidth - innerWidth;
      const tween = gsap.to(tr, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.work', pin: '.work__pin', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true,
          onUpdate: s => gsap.set('.work__progress span', { scaleX: s.progress }) } });
      // cada tarjeta se inclina un poco mientras pasa
      $$('.pcard', tr).forEach(card => {
        gsap.fromTo($('.pcard__media', card), { rotate: 3, scale: .92 }, { rotate: -3, scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
    },
    '(max-width: 760px)': () => {
      const tr = $('#work');
      const upd = () => gsap.set('.work__progress span', { scaleX: tr.scrollLeft / Math.max(1, tr.scrollWidth - tr.clientWidth) });
      tr.addEventListener('scroll', upd, { passive: true });
      return () => tr.removeEventListener('scroll', upd);
    },
  });

  // ---------- proyectos: el bloque oscuro crece de tarjeta a pantalla completa ----------
  gsap.fromTo('.work', { clipPath: () => `inset(0 ${innerWidth < 761 ? 12 : 32}px round 32px)` },
    { clipPath: 'inset(0 0px round 0px)', ease: 'none', immediateRender: true,
      scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true } });

  // ---------- clientes: aparecen en cascada ----------
  gsap.from('.client', { opacity: 0, y: 30, duration: .8, ease: 'power3.out', stagger: { each: .03, from: 'random' }, scrollTrigger: { trigger: '.clients__grid', start: 'top 85%' } });

  // ---------- pie: la palabra gigante sube ----------
  gsap.from('.foot__word', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
