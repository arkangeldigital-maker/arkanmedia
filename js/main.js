(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- datos ----------
  const projects = [
    ['web', '14801186192', 'Colegio Cristóbal Colón', 'Educación'],
    ['web', '14801195822', 'Ejecutivos Mexicanos', 'Educación'],
    ['web', '14801257962', 'American School Chiapas', 'Educación'],
    ['web', '14801237282', 'Dipemci', 'Construcción'],
    ['web', '14801214712', 'Edifica Construcciones', 'Construcción'],
    ['web', '14801247272', 'Grupo Halley', 'Alimentos'],
    ['web', '14800328772', 'Cecilia Brunette', 'Eventos'],
    ['web', '14801263002', 'Photobook', 'Eventos'],
    ['web', '14800341952', 'Banquetes Puerto Evento', 'Eventos'],
    ['web', '14801242082', 'LaDeport', 'Noticias'],
    ['web', '14801199212', 'Líderes MX', 'Deportes / Noticias'],
    ['web', '14801250882', 'Dr. Raúl Barragán', 'Salud'],
    ['web', '14801254312', 'Mezderma', 'Salud'],
    ['web', '14801268812', 'Perfumes Monchéri', 'Salud'],
    ['web', '14801174552', 'Indegsa', 'Industria'],
    ['web', '14800332872', 'Procovi', 'Seguridad privada'],
    ['web', '14801280352', 'Ferrenorte', 'Ecommerce'],
    ['identidad', '14801292942', 'Soy Geek', 'Tecnología'],
    ['identidad', '14801296822', 'Asadero El Carboncito', 'Alimentos'],
    ['identidad', '14801300092', 'Proclean Solutions', 'Salud'],
    ['identidad', '14801302282', 'Procovi', 'Seguridad privada'],
    ['identidad', '14801304402', 'Tendsa Group', 'Industria'],
    ['sistemas', '14801313632', 'Constructora Zerpa', 'Construcción'],
    ['sistemas', '14801317222', 'Hasue de México', 'Industria'],
  ];
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

  // ---------- proyectos ----------
  const grid = $('#projects');
  grid.innerHTML = projects.map(([cat, img, name, sector], i) => `
    <article class="project reveal" data-cat="${cat}" style="--d:${(i % 4) * 0.06}s" tabindex="0">
      <img src="assets/projects/${img}.png" alt="${name}" loading="lazy" width="494" height="494">
      <div class="project__info"><h3>${name}</h3><span>${sector}</span></div>
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
  const words = ['páginas web', 'apps móviles', 'marcas', 'tiendas online', 'sistemas'];
  const word = $('.rotator__word');
  let wi = 0;
  if (!reduceMotion) setInterval(() => {
    word.classList.add('out');
    setTimeout(() => {
      wi = (wi + 1) % words.length;
      word.textContent = words[wi];
      word.classList.remove('out');
      word.style.animation = 'none'; void word.offsetWidth; word.style.animation = '';
    }, 420);
  }, 2600);

  // ---------- nav ----------
  const nav = $('.nav'), toggle = $('.nav__toggle'), menu = $('#menu'), bar = $('.progress');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > lastY && !menu.classList.contains('is-open'));
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  const links = $$('.nav__links a:not(.btn)');
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
      dpr = Math.min(devicePixelRatio || 1, 2);
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
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
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
