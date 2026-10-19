// Genera las páginas de servicio (servicios/*.html) y de proyecto (proyectos/*.html)
// a partir de ../js/projects.js y de las traducciones de js/i18n.js.
// Uso: node version2/tools/build-pages.js   (desde la raíz del repo)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const V2 = path.join(__dirname, '..');
const ROOT = path.join(V2, '..');
const BASE = 'https://arkangeldigital-maker.github.io/arkanmedia/version2/';
const VER = process.argv[2] || String(Date.now()).slice(0, 10);

// ---------- datos ----------
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js/projects.js'), 'utf8'), sandbox);
const PROJECTS = sandbox.window.PROJECTS;
const i18n = fs.readFileSync(path.join(V2, 'js/i18n.js'), 'utf8');
const SECTOR_EN = vm.runInNewContext('(' + i18n.match(/const SECTOR = (\{.*?\});/)[1] + ')');
const DESC_EN = vm.runInNewContext('(' + i18n.match(/const PROJ = (\{[\s\S]*?\n  \});/)[1] + ')');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bi = (es, en, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-l="es">${es}</${tag}><${tag}${cls ? ` class="${cls}"` : ''} data-l="en">${en}</${tag}>`;
const slugify = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// slug único por proyecto
const seen = {};
PROJECTS.forEach(p => {
  let s = slugify(p.name);
  if (seen[s]) s += p.cat === 'identidad' ? '-identidad' : '-' + p.cat;
  seen[s] = true;
  p.slug = s;
});

// ---------- servicios ----------
const SERVICES = [
  {
    slug: 'paginas-web', es: 'Diseño de páginas web', en: 'Web design',
    leadEs: 'Sitios que hablan a tus clientes de forma clara y efectiva: diseño, usabilidad y accesibilidad, hechos a la imagen de tu empresa y sin plantillas.',
    leadEn: 'Websites that speak to your customers clearly and effectively: design, usability and accessibility, built in your company’s image and without templates.',
    incEs: ['Diseño 100% a la medida', 'Adaptado a celular, tableta y computadora', 'Panel para administrar tu contenido', 'Optimización para Google desde el inicio', 'Formularios, WhatsApp y mapas', 'Sitios en uno o varios idiomas'],
    incEn: ['100% custom design', 'Built for phones, tablets and computers', 'Admin panel to manage your content', 'Search-engine ready from day one', 'Forms, WhatsApp and maps', 'Single or multi-language websites'],
    match: p => p.cat === 'web',
  },
  {
    slug: 'apps-moviles', es: 'Apps móviles', en: 'Mobile apps',
    leadEs: 'Apps para Android e iOS a la medida de tu negocio, amigables y desarrolladas con los estándares actuales para que tus clientes te lleven en el bolsillo.',
    leadEn: 'Android and iOS apps tailored to your business, friendly and built to current standards so your customers can carry you in their pocket.',
    incEs: ['Apps para iOS y Android', 'Diseño de experiencia e interfaz', 'Conexión con tu sitio o sistema', 'Notificaciones y funciones a la medida', 'Publicación en App Store y Google Play', 'Soporte y actualizaciones'],
    incEn: ['iOS and Android apps', 'Experience and interface design', 'Integration with your website or system', 'Notifications and custom features', 'App Store and Google Play publishing', 'Support and updates'],
    match: () => false, // aún no hay apps en el portafolio
  },
  {
    slug: 'identidad-de-marca', es: 'Identidad de marca', en: 'Brand identity',
    leadEs: 'Creamos o renovamos tu identidad: logotipo, colores y aplicaciones para que tu marca se reconozca a la primera y se vea profesional en todos lados.',
    leadEn: 'We create or refresh your identity: logo, colors and applications so your brand is recognized at first sight and looks professional everywhere.',
    incEs: ['Diseño de logotipo', 'Paleta de colores y tipografías', 'Manual de marca', 'Papelería y tarjetas', 'Aplicaciones para redes sociales', 'Archivos listos para imprenta y web'],
    incEn: ['Logo design', 'Color palette and typography', 'Brand guidelines', 'Stationery and business cards', 'Social media assets', 'Print and web-ready files'],
    match: p => p.cat === 'identidad',
  },
  {
    slug: 'tiendas-en-linea', es: 'Tiendas y pagos en línea', en: 'Online stores & payments',
    leadEs: 'Vende en internet con un carrito de compras a tu medida: tus clientes arman su pedido, pagan con tarjeta o en OXXO y tú recibes la orden al instante.',
    leadEn: 'Sell online with a custom shopping cart: customers build their order, pay by card or cash at OXXO stores, and you get the order instantly.',
    incEs: ['Catálogo de productos administrable', 'Carrito de compras', 'Pagos con tarjeta y en OXXO', 'Pedidos directo a tu correo', 'Chat con tus clientes', 'Envíos y promociones'],
    incEn: ['Manageable product catalog', 'Shopping cart', 'Card and OXXO payments', 'Orders straight to your inbox', 'Customer chat', 'Shipping and promotions'],
    match: p => ['patymartes', '14801280352', '14801268812', '14801247272', 'masagua'].includes(p.id),
  },
  {
    slug: 'seo-hosting-sistemas', es: 'SEO, hosting y sistemas', en: 'SEO, hosting & software',
    leadEs: 'Te posicionamos en Google, gestionamos tu dominio y hosting con 99.9% de disponibilidad, y ordenamos la información de tu empresa con sistemas a la medida.',
    leadEn: 'We rank you on Google, manage your domain and hosting with 99.9% uptime, and organize your company’s information with custom software.',
    incEs: ['Posicionamiento en Google y Bing', 'Dominio y hosting administrados', 'Certificado de seguridad (https)', 'Sistemas e intranets a la medida', 'Permisos por usuario', 'Respaldo y soporte'],
    incEn: ['Google and Bing rankings', 'Managed domain and hosting', 'Security certificate (https)', 'Custom systems and intranets', 'Per-user permissions', 'Backups and support'],
    match: p => p.cat === 'sistemas' || ['14801250882', '14801317222'].includes(p.id) || p.id === 'icave',
  },
];
const serviceFor = p => {
  const s = SERVICES.filter(sv => sv.match(p) && sv.slug !== 'apps-moviles');
  return s.length ? s : [SERVICES[0]];
};
const CAT = { web: ['Página web', 'Website'], sistemas: ['Sistema', 'Software'], identidad: ['Identidad de marca', 'Brand identity'] };

// ---------- piezas comunes ----------
const ICO_NE = '<i class="ico ico--ne" aria-hidden="true"></i>';
const head = ({ title, titleEn, desc, descEn, url, img, depth }) => `<!doctype html>
<html lang="es" data-title-en="${esc(titleEn)}" data-desc-en="${esc(descEn)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>/* idioma antes de pintar para no parpadear */(function(){var u=new URLSearchParams(location.search).get('lang'),s=null;try{s=localStorage.getItem('arkan-lang')}catch(e){}var l=u==='es'||u==='en'?u:s||((navigator.language||'es').toLowerCase().indexOf('es')===0?'es':'en');document.documentElement.lang=l;if(u){try{localStorage.setItem('arkan-lang',u)}catch(e){}}})();</script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#f3efe8">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="es" href="${url}?lang=es">
  <link rel="alternate" hreflang="en" href="${url}?lang=en">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ArkanMedia">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${depth}../assets/img/icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${depth}css/style.css?v=${VER}">
  <link rel="stylesheet" href="${depth}css/sub.css?v=${VER}">
</head>
<body class="sub">
  <header class="shdr">
    <a href="${depth}" class="shdr__logo"><img src="${depth}assets/logo-dark.png" alt="ArkanMedia" width="173" height="53"></a>
    <nav class="shdr__nav" aria-label="Principal">
      <a href="${depth}#servicios">${bi('Servicios', 'Services')}</a>
      <a href="${depth}#proyectos">${bi('Proyectos', 'Work')}</a>
      <a href="${depth}#proceso">${bi('Proceso', 'Process')}</a>
      <a href="${depth}#contacto">${bi('Contacto', 'Contact')}</a>
    </nav>
    <div class="lang" role="group" aria-label="Idioma / Language"><button class="lang__btn" data-lang="es" lang="es" aria-label="Español">ES</button><button class="lang__btn" data-lang="en" lang="en" aria-label="English">EN</button></div>
    <a href="#cotizar" class="hdr__cta shdr__cta">${bi('Cotizar', 'Get a quote')}</a>
  </header>
  <main>
`;
const foot = depth => `  </main>
  <footer class="foot sfoot">
    <div class="foot__row">
      <p>© <span class="year"></span> ArkanMedia · ${bi('Diseño web y apps · De Veracruz para el mundo', 'Web design & apps · From Veracruz to the world')}</p>
      <a href="${depth}aviso-de-privacidad.html" class="ulink">${bi('Aviso de privacidad', 'Privacy notice')}</a>
      <a href="${depth}" class="ulink">${bi('Volver al inicio', 'Back to home')}</a>
    </div>
  </footer>
  <a class="wa" href="https://wa.me/522297819005" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.9 17.8L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4 11.8 11.8 0 0 0 8.4-20.1z"/></svg></a>
  <script src="${depth}js/sub.js?v=${VER}"></script>
</body>
</html>
`;
const media = (p, depth) => `<div class="pcard__media">
        <div class="browser"><div class="browser__bar"><i></i><i></i><i></i><b></b></div><img src="${depth}../assets/projects/screens/${p.id}.jpg" alt="${esc(p.name)}"></div>
        <div class="phone"><div class="phone__screen"><img src="${depth}../assets/projects/${p.mobile ? 'mobile' : 'screens'}/${p.id}.jpg" alt=""${p.mobile ? ' class="is-real"' : ''}></div></div>
      </div>`;
const card = (p, depth) => `<a class="mini" href="${depth}proyectos/${p.slug}.html">
          <span class="mini__img"><img src="${depth}../assets/projects/screens/${p.id}.jpg" alt="" loading="lazy"></span>
          <span class="mini__meta"><small>${bi(esc(p.sector), esc(SECTOR_EN[p.sector] || p.sector))}</small><b>${esc(p.name)}</b></span>
        </a>`;
const quoteForm = (svc, depth, projectName) => `
    <section class="squote" id="cotizar">
      <div class="squote__text">
        <p class="tag">${bi('Cotiza', 'Get a quote')}</p>
        <h2 class="sh2">${projectName ? bi('¿Quieres un proyecto <em>así</em>?', 'Want a project <em>like this</em>?') : bi(`Cotiza tu proyecto de <em>${esc(svc.es.toLowerCase())}</em>`, `Get a quote for <em>${esc(svc.en.toLowerCase())}</em>`)}</h2>
        <p>${bi('Cuéntanos tu idea y te preparamos una propuesta a la medida, estés donde estés.', 'Tell us your idea and we’ll put together a tailor-made proposal, wherever you are.')}</p>
        <a class="ulink" href="https://wa.me/522297819005?text=${encodeURIComponent(projectName ? `Hola ArkanMedia, vi el proyecto ${projectName} y quiero algo similar.` : `Hola ArkanMedia, me interesa ${svc.es.toLowerCase()}.`)}" target="_blank" rel="noopener">${bi('O escríbenos por WhatsApp', 'Or message us on WhatsApp')} ${ICO_NE}</a>
      </div>
      <form class="form sform" novalidate data-service="${esc(svc.es)}"${projectName ? ` data-project="${esc(projectName)}"` : ''}>
        <input type="text" name="_honey" class="form__honey" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="field"><span>${bi('¿Cómo te llamas?', 'Your name')}</span><input name="nombre" required autocomplete="name"></label>
        <label class="field"><span>${bi('Tu correo', 'Your email')}</span><input name="email" type="email" required autocomplete="email"></label>
        <label class="field"><span>${bi('Tu teléfono', 'Your phone')}</span><input name="telefono" type="tel" required autocomplete="tel"></label>
        <label class="field"><span>${bi('Cuéntanos tu idea', 'Tell us your idea')}</span><textarea name="mensaje" rows="3" required></textarea></label>
        <label class="check"><input type="checkbox" name="privacidad" required><span>${bi(`He leído y acepto el <a href="${depth}aviso-de-privacidad.html" target="_blank" rel="noopener">aviso de privacidad</a>.`, `I have read and accept the <a href="${depth}aviso-de-privacidad.html" target="_blank" rel="noopener">privacy notice</a>.`)}</span></label>
        <div class="form__actions"><button class="pill pill--red">${bi('Enviar mensaje', 'Send message')} <span>${ICO_NE}</span></button></div>
        <p class="form__note" role="status"></p>
      </form>
    </section>`;

// ---------- páginas de servicio ----------
fs.mkdirSync(path.join(V2, 'servicios'), { recursive: true });
SERVICES.forEach((svc, si) => {
  const d = '../';
  const rel = PROJECTS.filter(svc.match).slice(0, 6);
  const others = SERVICES.filter(o => o !== svc);
  const html = head({
    title: `${svc.es} en Veracruz | ArkanMedia`, titleEn: `${svc.en} | ArkanMedia`,
    desc: svc.leadEs, descEn: svc.leadEn, url: `${BASE}servicios/${svc.slug}.html`, img: `${BASE}assets/og.jpg`, depth: d,
  }) + `
    <section class="shero">
      <nav class="crumbs" aria-label="Ruta"><a href="${d}">${bi('Inicio', 'Home')}</a><span>/</span><a href="${d}#servicios">${bi('Servicios', 'Services')}</a><span>/</span><b>${bi(esc(svc.es), esc(svc.en))}</b></nav>
      <p class="tag">${bi(`Servicio ${String(si + 1).padStart(2, '0')}`, `Service ${String(si + 1).padStart(2, '0')}`)}</p>
      <h1 class="sh1 fit">${bi(esc(svc.es), esc(svc.en))}</h1>
      <p class="shero__lead">${bi(esc(svc.leadEs), esc(svc.leadEn))}</p>
      <div class="shero__cta">
        <a href="#cotizar" class="pill pill--red">${bi('Cotizar ahora', 'Get a quote')} <span>${ICO_NE}</span></a>
        <a href="#incluye" class="pill">${bi('Qué incluye', 'What’s included')} <span>${ICO_NE}</span></a>
      </div>
    </section>

    <section class="sinc" id="incluye">
      <h2 class="sh2">${bi('Qué <em>incluye</em>', 'What’s <em>included</em>')}</h2>
      <ul class="sinc__list">
        ${svc.incEs.map((t, i) => `<li><span class="sinc__n">${String(i + 1).padStart(2, '0')}</span>${bi(esc(t), esc(svc.incEn[i]))}</li>`).join('\n        ')}
      </ul>
    </section>

    <section class="swhy">
      <div class="swhy__item"><b>+10</b>${bi('años creando sitios, apps e identidades', 'years creating websites, apps and identities')}</div>
      <div class="swhy__item"><b>100%</b>${bi('a la medida, sin plantillas', 'custom-made, no templates')}</div>
      <div class="swhy__item"><b>ES · EN</b>${bi('atendemos clientes en todo el mundo', 'working with clients worldwide')}</div>
    </section>
${rel.length ? `
    <section class="srel">
      <div class="srel__head"><h2 class="sh2">${bi('Proyectos <em>relacionados</em>', 'Related <em>work</em>')}</h2><a class="ulink" href="${d}#proyectos">${bi('Ver todos', 'See all')} ${ICO_NE}</a></div>
      <div class="minis">
        ${rel.map(p => card(p, d)).join('\n        ')}
      </div>
    </section>` : ''}
${quoteForm(svc, d)}

    <section class="sothers">
      <p class="tag">${bi('Otros servicios', 'Other services')}</p>
      <div class="sothers__list">
        ${others.map(o => `<a href="${o.slug}.html">${bi(esc(o.es), esc(o.en))} ${ICO_NE}</a>`).join('\n        ')}
      </div>
    </section>
` + foot(d);
  fs.writeFileSync(path.join(V2, 'servicios', svc.slug + '.html'), html);
});

// ---------- páginas de proyecto ----------
fs.mkdirSync(path.join(V2, 'proyectos'), { recursive: true });
PROJECTS.forEach((p, i) => {
  const d = '../';
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const en = DESC_EN[p.id] || p.desc;
  const svcs = serviceFor(p);
  const pool = PROJECTS.filter(o => o !== p && o !== prev && o !== next);
  const more = [...pool.filter(o => o.cat === p.cat), ...pool.filter(o => o.cat !== p.cat)].slice(0, 3);
  const nav = (o, dir) => `<a class="pnav__item pnav__item--${dir}" href="${o.slug}.html" rel="${dir}">
          <span class="pnav__label">${dir === 'prev' ? `<i class="ico ico--left" aria-hidden="true"></i> ${bi('Anterior', 'Previous')}` : `${bi('Siguiente', 'Next')} <i class="ico ico--right" aria-hidden="true"></i>`}</span>
          <span class="pnav__img"><img src="${d}../assets/projects/screens/${o.id}.jpg" alt="" loading="lazy"></span>
          <b>${esc(o.name)}</b>
        </a>`;
  const html = head({
    title: `${p.name} | Proyecto de ArkanMedia`, titleEn: `${p.name} | ArkanMedia project`,
    desc: p.desc[0], descEn: en[0], url: `${BASE}proyectos/${p.slug}.html`, img: `${BASE}../assets/projects/screens/${p.id}.jpg`, depth: d,
  }) + `
    <article class="proj">
      <section class="phero">
        <nav class="crumbs" aria-label="Ruta"><a href="${d}">${bi('Inicio', 'Home')}</a><span>/</span><a href="${d}#proyectos">${bi('Proyectos', 'Work')}</a><span>/</span><b>${esc(p.name)}</b></nav>
        <p class="drawer__tags"><span>${bi(CAT[p.cat][0], CAT[p.cat][1])}</span><span>${bi(esc(p.sector), esc(SECTOR_EN[p.sector] || p.sector))}</span><span class="pcount">${String(i + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}</span></p>
        <h1 class="sh1 fit">${esc(p.name)}</h1>
      </section>
      <div class="pstage">${media(p, d)}</div>
      <section class="pbody">
        <div class="pbody__col">
          <h2 class="sh3">${bi('Sobre el proyecto', 'About the project')}</h2>
          <p>${bi(esc(p.desc[0]), esc(en[0]))}</p>
          ${p.desc[1] ? `<h2 class="sh3">${bi('Lo que hicimos', 'What we did')}</h2>
          <p>${bi(esc(p.desc[1]), esc(en[1] || p.desc[1]))}</p>` : ''}
        </div>
        <aside class="pbody__side">
          <dl class="pfacts">
            <div><dt>${bi('Cliente', 'Client')}</dt><dd>${esc(p.name)}</dd></div>
            <div><dt>${bi('Sector', 'Industry')}</dt><dd>${bi(esc(p.sector), esc(SECTOR_EN[p.sector] || p.sector))}</dd></div>
            <div><dt>${bi('Tipo', 'Type')}</dt><dd>${bi(CAT[p.cat][0], CAT[p.cat][1])}</dd></div>
            <div><dt>${bi('Servicios', 'Services')}</dt><dd>${svcs.map(s => `<a href="${d}servicios/${s.slug}.html">${bi(esc(s.es), esc(s.en))}</a>`).join('')}</dd></div>
          </dl>
        </aside>
      </section>
      <nav class="pnav" aria-label="${esc('Más proyectos')}">
        ${nav(prev, 'prev')}
        ${nav(next, 'next')}
      </nav>
    </article>
${quoteForm(svcs[0], d, p.name)}

    <section class="srel">
      <div class="srel__head"><h2 class="sh2">${bi('Otros <em>proyectos</em>', 'More <em>work</em>')}</h2><a class="ulink" href="${d}#proyectos">${bi('Ver todos', 'See all')} ${ICO_NE}</a></div>
      <div class="minis">
        ${more.map(o => card(o, d)).join('\n        ')}
      </div>
    </section>
` + foot(d);
  fs.writeFileSync(path.join(V2, 'proyectos', p.slug + '.html'), html);
});

// ---------- slugs para el sitio principal y sitemap ----------
fs.writeFileSync(path.join(V2, 'js/slugs.js'), '// generado por tools/build-pages.js: id de proyecto -> página de detalle\nwindow.PROJECT_SLUGS = ' + JSON.stringify(Object.fromEntries(PROJECTS.map(p => [p.id, p.slug])), null, 1) + ';\nwindow.SERVICE_SLUGS = ' + JSON.stringify(SERVICES.map(s => s.slug)) + ';\n');
const U = 'https://arkangeldigital-maker.github.io/arkanmedia/';
const urls = [['version2/', '1.0'], ...SERVICES.map(s => [`version2/servicios/${s.slug}.html`, '0.8']), ...PROJECTS.map(p => [`version2/proyectos/${p.slug}.html`, '0.6']), ['version2/aviso-de-privacidad.html', '0.3'], ['', '0.4']];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(([u, pr]) => `  <url>
    <loc>${U}${u}</loc>${u.startsWith('version2/') && !u.includes('aviso') ? `
    <xhtml:link rel="alternate" hreflang="es" href="${U}${u}?lang=es"/>
    <xhtml:link rel="alternate" hreflang="en" href="${U}${u}?lang=en"/>` : ''}
    <priority>${pr}</priority>
  </url>`).join('\n')}
</urlset>
`);
console.log(`ok: ${SERVICES.length} servicios, ${PROJECTS.length} proyectos`);
