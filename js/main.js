(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- datos ----------
  const projects = window.PROJECTS || [];
  const clients = [
    ['colon', 'Colegio Cristóbal Colón'], ['aaa', 'Asociación de Agentes Aduanales de Veracruz'], ['cmic', 'CMIC'],
    ['carboncito', 'El Carboncito'], ['expediente', 'Blog Expediente'], ['lideres', 'Líderes'],
    ['edifica', 'Edifica Construcciones'], ['prosigo', 'Prosigo'], ['legotec', 'Legotec'],
    ['iab', 'Grupo IAB'], ['ipesa', 'IPESA'], ['puertoevento', 'Puerto Evento'],
    ['cecilia', 'Cecilia Brunette'], ['caee', 'Instituto CAEE'], ['dipemci', 'Dipemci'],
    ['calor', 'Calor'], ['approachmen', 'Approachmen'], ['halley', 'Grupo Halley'],
    ['hola', 'Hola'], ['mrseguridad', 'MR Seguridad'], ['parroquia', 'Parroquia'],
    ['novedades', 'Novedades'], ['especiales', 'Especiales'], ['zapata', 'Zapata'],
    ['ladeport', 'LaDeport'], ['photobook', 'Photobook'], ['medicagama', 'Médica Gama'],
    ['vissage', 'Vissage'], ['moncheri', 'Monchéri'], ['hasue', 'Hasue de México'],
    ['kidiatras', 'Kidiatras'], ['drraul', 'Dr. Raúl Barragán'], ['ejemex', 'Ejecutivos Mexicanos'],
  ];

  // ---------- proyectos: iMac + iPhone ----------
  const catName = { web: 'Página web', sistemas: 'Sistema informático', identidad: 'Identidad corporativa' };
  const scene = p => `
    <div class="scene" aria-hidden="true">
      <div class="imac">
        <div class="imac__body"><div class="imac__screen"><img src="assets/projects/screens/${p.id}.jpg" alt="" loading="lazy"></div><div class="imac__chin"></div></div>
        <div class="imac__stand"></div><div class="imac__foot"></div>
      </div>
      <div class="iphone"><div class="iphone__screen"><span class="iphone__island"></span><img src="assets/projects/screens/${p.id}.jpg" alt="" loading="lazy"></div></div>
    </div>`;
  const grid = $('#projects');
  grid.innerHTML = projects.map((p, i) => `
    <article class="project reveal" role="button" tabindex="0" data-cat="${p.cat}" data-i="${i}" style="--d:${(i % 3) * 0.08}s" aria-label="Ver proyecto ${p.name}">
      ${scene(p)}
      <div class="project__meta"><div><h3>${p.name}</h3><span>${p.sector}</span></div><span class="project__plus" aria-hidden="true">+</span></div>
    </article>`).join('');

  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    const items = $$('.project', grid);
    items.forEach(el => el.classList.add('is-leaving'));
    setTimeout(() => {
      items.forEach(el => {
        const show = f === 'all' || el.dataset.cat === f;
        el.classList.toggle('is-hidden', !show);
        el.classList.add('is-in');
      });
      requestAnimationFrame(() => requestAnimationFrame(() =>
        items.forEach(el => el.classList.remove('is-leaving'))));
    }, reduceMotion ? 0 : 280);
  }));

  // ---------- popup de proyecto ----------
  const modal = $('#pmodal');
  let current = -1, lastFocus = null;
  const visible = () => $$('.project:not(.is-hidden)', grid).map(el => +el.dataset.i);
  const fill = i => {
    const p = projects[i], list = visible(), pos = list.indexOf(i);
    current = i;
    $('.pmodal__stage', modal).innerHTML = scene(p);
    $('.pmodal__tags', modal).innerHTML = `<span>${catName[p.cat]}</span><span>${p.sector}</span>`;
    $('#pm-title').textContent = p.name;
    $('.pmodal__desc', modal).innerHTML = p.desc.map(d => `<p>${d}</p>`).join('');
    $('.pmodal__actions', modal).innerHTML =
      `<a href="#contacto" class="btn btn--red" data-close>Quiero un proyecto así</a>` +
      (p.url ? `<a href="${p.url}" target="_blank" rel="noopener" class="btn btn--ghost">Ver sitio ↗</a>` : '');
    $('.pmodal__count', modal).textContent = `${pos + 1} / ${list.length}`;
    // reinicia las animaciones de entrada
    $$('.pmodal__info > *', modal).forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
  };
  const openModal = i => {
    lastFocus = document.activeElement;
    fill(i);
    $('.pmodal__panel', modal).scrollTop = 0;
    modal.hidden = false;
    document.body.classList.add('pmodal-open');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    $('.pmodal__close', modal).focus({ preventScroll: true });
  };
  const closeModal = () => {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('pmodal-open');
    setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 450);
    lastFocus?.focus({ preventScroll: true });
  };
  const step = d => {
    const list = visible(), pos = list.indexOf(current);
    fill(list[(pos + d + list.length) % list.length]);
    // al cambiar de proyecto, vuelve al inicio del detalle
    $('.pmodal__panel', modal).scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  grid.addEventListener('click', e => { const card = e.target.closest('.project'); if (card) openModal(+card.dataset.i); });
  grid.addEventListener('keydown', e => {
    const card = e.target.closest('.project');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(+card.dataset.i); }
  });
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  $('.pmodal__prev', modal).addEventListener('click', () => step(-1));
  $('.pmodal__next', modal).addEventListener('click', () => step(1));
  addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  // ---------- clientes (dos filas en marquesina) ----------
  const half = Math.ceil(clients.length / 2);
  const row = (list, rev) => {
    const cards = list.map(([f, n]) => `<div class="logo-card"><img src="assets/img/${f}.png" alt="${n}" loading="lazy"></div>`).join('');
    return `<div class="logos__row${rev ? ' logos__row--rev' : ''}">${cards}${cards.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"')}</div>`;
  };
  $('#logos').innerHTML = row(clients.slice(0, half)) + row(clients.slice(half), true);

  // ---------- aparición al hacer scroll ----------
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  // ---------- contadores ----------
  const countIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  // ---------- palabra rotativa ----------
  const rotator = $('.rotator');
  const words = $$('.rotator__word', rotator);
  let wi = 0;
  if (!reduceMotion) setInterval(() => {
    if (document.hidden) return;
    const prev = words[wi];
    wi = (wi + 1) % words.length;
    const next = words[wi];
    prev.classList.remove('is-active');
    prev.classList.add('is-out');
    prev.setAttribute('aria-hidden', 'true');
    // la palabra que sale vuelve abajo sin animarse, lista para su próximo turno
    setTimeout(() => { prev.style.transition = 'none'; prev.classList.remove('is-out'); void prev.offsetWidth; prev.style.transition = ''; }, 800);
    next.classList.add('is-active');
    next.removeAttribute('aria-hidden');
  }, 2800);

  // ---------- nav ----------
  const nav = $('.nav'), burger = $('.burger'), mnav = $('#mnav'), bar = $('.progress'), body = document.body;
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > lastY && !body.classList.contains('menu-open'));
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // menú móvil: el círculo nace en el centro de la hamburguesa
  const setMenu = open => {
    if (open) {
      const r = burger.getBoundingClientRect();
      mnav.style.setProperty('--cx', r.left + r.width / 2 + 'px');
      mnav.style.setProperty('--cy', r.top + r.height / 2 + 'px');
    }
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) mnav.removeAttribute('inert'); else mnav.setAttribute('inert', '');
  };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  mnav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });
  addEventListener('resize', () => { if (innerWidth > 860 && body.classList.contains('menu-open')) setMenu(false); });

  const links = [...$$('.nav__links a:not(.btn)'), ...$$('.mnav__links a')];
  const secIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => secIO.observe(s));

  $('#year').textContent = new Date().getFullYear();

  // ---------- efectos de puntero (solo con mouse) ----------
  if (finePointer && !reduceMotion) {
    const spot = $('.spotlight');
    addEventListener('pointermove', e => {
      spot.style.setProperty('--mx', e.clientX + 'px');
      spot.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });

    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--x', px * 100 + '%');
        el.style.setProperty('--y', py * 100 + '%');
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // ---------- red de partículas en el hero ----------
  const canvas = $('.hero__canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const colors = ['211,3,3', '44,170,179', '44,140,179'];
    let w, h, dpr, pts = [], mouse = { x: -9999, y: -9999 }, running = true;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6, c: colors[(Math.random() * 3) | 0],
      }));
    };
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 16900) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(${a.c},${(1 - d / 130) * 0.35})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${a.c},.85)`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    resize();
    addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(draw);
    }).observe(canvas);
    requestAnimationFrame(draw);
  }

  // ---------- formulario (WhatsApp o correo) ----------
  const form = $('#contact-form'), note = $('.form__note', form);
  let via = 'whatsapp';
  $$('button[type=submit]', form).forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input, textarea', form).forEach(f => {
      const bad = !f.checkValidity();
      f.parentElement.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Revisa los campos marcados.'; note.style.color = 'var(--red-2)'; return; }
    const d = Object.fromEntries(new FormData(form));
    const text = `Hola ArkanMedia, soy ${d.nombre}.\n\n${d.mensaje}\n\nEmail: ${d.email}\nTeléfono: ${d.telefono}` +
      (d.presupuesto ? `\nPresupuesto: $${d.presupuesto} MXN` : '');
    const url = via === 'whatsapp'
      ? `https://wa.me/522297819005?text=${encodeURIComponent(text)}`
      : `mailto:contacto@arkanmedia.com?subject=${encodeURIComponent('Cotización desde la web')}&body=${encodeURIComponent(text)}`;
    window.open(url, via === 'whatsapp' ? '_blank' : '_self');
    note.style.color = '';
    note.textContent = '¡Gracias! Te responderemos muy pronto.';
  });
})();
