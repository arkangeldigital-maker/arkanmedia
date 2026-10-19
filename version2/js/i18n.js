// Idioma del sitio: español (texto original del HTML) o inglés (este diccionario).
// Se elige por ?lang=, luego por la última elección guardada y, la primera vez, por el idioma del navegador.
(() => {
  const EN = {
    'svc.more': 'View service',
    'm.process': 'Process',
    'm.faq': 'FAQ',
    'tag.process': '(03) Process',
    'process.title': 'How we <em>work</em>',
    'process.lead': 'A clear path with no surprises: you always know what stage your project is in.',
    'p1.t': 'Discovery',
    'p1.p': 'We listen to your business, your customers and your goals. We define scope, content and timeline.',
    'p2.t': 'Proposal & design',
    'p2.p': 'We design your look and site structure to fit you, and refine it with you until you love it.',
    'p3.t': 'Development',
    'p3.p': 'We build your website or app to be fast, secure and ready to look perfect on any screen.',
    'p4.t': 'Launch',
    'p4.p': 'We go live, set up your domain, hosting and Google, and show you how to manage your content.',
    'p5.t': 'Ongoing support',
    'p5.p': 'We stay with you with support, improvements and SEO so your digital presence keeps growing.',
    'tag.faq': '(06) FAQ',
    'faq.title': 'Frequently asked <em>questions</em>',
    'q1': 'How long until my website is ready?',
    'a1': 'It depends on the scope of the project. With your quote we give you a timeline with dates for each stage, so you know exactly when it will be ready.',
    'q2': 'Are domain and hosting included?',
    'a2': 'We can purchase and manage them for you, with 99.9% uptime. If you already have your own, we work with those too.',
    'q3': 'Can I update my website myself?',
    'a3': 'Yes. If you need it, your site includes an admin panel to change text, photos, news or products without depending on anyone.',
    'q4': 'Will my website look good on mobile?',
    'a4': 'Yes. All our websites are designed to look and work perfectly on phones, tablets and computers.',
    'q5': 'Can you help me show up on Google?',
    'a5': 'Yes. Every site is delivered search-engine ready, and our SEO service improves your ranking on Google and Bing.',
    'q6': 'Do you work with companies outside Veracruz or Mexico?',
    'a6': 'Yes. We work remotely with clients in any city and country, in Spanish and English.',
    'q7': 'What happens after launch?',
    'a7': 'We can keep working with you on support, updates and improvements. We make it clear in the quote so there are no surprises.',
    'tag.work': '(04) Work',
    'tag.clients': '(05) Clients',
    'tag.contact': '(07) Contact',
    'f.privacy': 'I have read and accept the <a href="aviso-de-privacidad.html" target="_blank" rel="noopener">privacy notice</a>.',
    'f.send': 'Send message',
    'foot.privacy': 'Privacy notice',
    'meta.title': 'ArkanMedia | Digital studio from Veracruz to the world',
    'meta.desc': 'ArkanMedia: custom websites, mobile apps, brand identity, SEO and software. From Veracruz, Mexico, for clients all over the world.',
    'cursor': 'View',
    'nav.quote': 'Get a quote',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'hdr.world': 'Working worldwide',
    'm.home': 'Home', 'm.studio': 'Studio', 'm.services': 'Services', 'm.work': 'Work', 'm.clients': 'Clients', 'm.contact': 'Contact',
    'm.write': 'Write to us',
    'hero.kicker': 'Digital studio · From Veracruz to the world · 10+ years',
    'hero.aria': 'Ideas that get seen and sell',
    'hero.w1': 'Ideas', 'hero.w2': 'that', 'hero.w3': 'get&nbsp;seen', 'hero.w4': 'sell.',
    'hero.lead': 'We design websites, apps and brand identities <strong>100% tailor-made</strong> for brands in Mexico and around the world. No templates, no copycats: your brand, told the way it deserves.',
    'badge': 'Get a quote for your project',
    'badge.txt': 'Get a quote · Get a quote · Get a quote · ',
    'hero.coords': '19.1738° N<br>96.1342° W',
    'ticker': (() => { const sp = '<i class="ico ico--spark" aria-hidden="true"></i>'; const t = ['Websites', 'iOS & Android apps', 'Brand identity', 'SEO', 'Online stores', 'Global presence'].map(w => `<span>${w}</span>${sp}`).join(''); return t + t; })(),
    'tag.studio': '(01) Studio',
    'manifesto': 'ArkanMedia was born so that any company, of any size, can have a digital presence that lives up to it. From Veracruz we design, build and care for every detail for brands all over the world, as an extension of your team.',
    'n1': 'years creating', 'n2': 'projects launched', 'n3': 'happy clients', 'n4': 'tailor-made',
    'global.title': 'Digital presence all over the world',
    'global.text': 'We work remotely with companies in Mexico and any other country, in Spanish and English. Your website, ready for customers anywhere in the world.',
    'tag.services': '(02) Services',
    'services.title': 'What we <em>do</em>',
    's1.t': 'Web design', 's1.p': 'Websites that speak to your customers clearly and effectively: design, usability and accessibility, in your company’s image.', 's1.l': '<li>Corporate websites</li><li>Landing pages</li><li>Admin panel</li>',
    's2.t': 'Mobile apps', 's2.p': 'Android and iOS apps tailored to your business, friendly and built to current development standards.', 's2.l': '<li>iOS</li><li>Android</li><li>Hybrid apps</li>',
    's3.t': 'Brand identity', 's3.p': 'We create or refresh your identity: logo, colors and applications so your brand is recognized at first sight.', 's3.l': '<li>Logo</li><li>Brand guidelines</li><li>Stationery</li>',
    's4.t': 'Online stores & payments', 's4.p': 'Shopping cart, orders straight to your inbox and payments by credit card or cash at OXXO stores.', 's4.l': '<li>Point of sale</li><li>Online payments</li><li>Customer chat</li>',
    's5.t': 'SEO, hosting & software', 's5.p': 'We rank you on Google, manage your domain and hosting with 99.9% uptime, and organize your information with custom software.', 's5.l': '<li>SEO</li><li>Hosting & domain</li><li>Business software</li>',
    'work.bg': 'Projects · Projects ·',
    'work.title': 'Selected <em>work</em>',
    'work.hint': 'Swipe or use the arrows to see more · click to explore each project',
    'work.prev': 'Previous projects', 'work.next': 'More projects', 'work.swipe': 'Swipe',
    'clients.title': 'Brands that <em>trust us</em>',
    'clients.aria': 'Client logos',
    'clients.cta': 'Your brand here? Let’s talk',
    'contact.aria': 'Message us on WhatsApp',
    'contact.r1': 'Shall we talk', 'contact.r2': 'about your', 'contact.r3': 'project?',
    'contact.lead': 'Tell us what you need and we’ll put together a tailor-made proposal, wherever you are.',
    'info.hours': 'Hours', 'info.week': 'Mon to Fri', 'info.sat': 'Saturday', 'info.tz': 'Mexico City time', 'info.where': 'Location', 'info.city': 'Veracruz, Mexico', 'info.world': 'Working with clients worldwide',
    'f.name': 'Your name', 'f.email': 'Your email', 'f.phone': 'Your phone', 'f.interest': 'I’m interested in',
    'f.c1': 'Website', 'f.c2': 'Mobile app', 'f.c3': 'Brand identity', 'f.c4': 'Online store', 'f.c5': 'SEO', 'f.c6': 'Software',
    'f.msg': 'Tell us your idea', 'f.wa': 'Send via WhatsApp', 'f.mail': 'Send by email',
    'foot.txt': 'Web design & apps · From Veracruz to the world',
    'foot.top': 'Back to top',
    'd.prev': 'Previous project', 'd.next': 'Next project', 'd.close': 'Close',
  };

  // textos que arma el JS (detalle, formulario, slider)
  const UI = {
    es: { cat: { web: 'Página web', sistemas: 'Sistema', identidad: 'Identidad de marca' }, view: 'Ver proyecto', detail: 'Ver detalle', want: 'Quiero un proyecto así', group: 'Grupo', of: 'de', fix: 'Revisa los campos marcados en rojo.', thanks: '¡Gracias! Recibimos tu mensaje y te respondemos muy pronto.', sending: 'Enviando…', fail: 'No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.', accept: 'Acepta el aviso de privacidad para continuar.', hi: 'Hola ArkanMedia, soy', interest: 'Me interesa', phone: 'Teléfono', subject: 'Cotización desde la web', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', locale: 'es-MX' },
    en: { cat: { web: 'Website', sistemas: 'Software', identidad: 'Brand identity' }, view: 'View project', detail: 'View details', want: 'I want a project like this', group: 'Group', of: 'of', fix: 'Please check the fields marked in red.', thanks: 'Thank you! We got your message and will get back to you very soon.', sending: 'Sending…', fail: 'We couldn’t send it. Please try again or message us on WhatsApp.', accept: 'Please accept the privacy notice to continue.', hi: 'Hi ArkanMedia, my name is', interest: 'I’m interested in', phone: 'Phone', subject: 'Quote request from the website', openMenu: 'Open menu', closeMenu: 'Close menu', locale: 'en-US' },
  };

  // proyectos en inglés (nombre igual; sector y descripción traducidos)
  const SECTOR = { 'Educación': 'Education', 'Construcción': 'Construction', 'Alimentos': 'Food', 'Eventos': 'Events', 'Noticias': 'News', 'Deportes / Noticias': 'Sports / News', 'Salud': 'Health', 'Industria': 'Industry', 'Seguridad privada': 'Private security', 'Ecommerce': 'E-commerce', 'Tecnología': 'Technology', 'Logística': 'Logistics', 'Consultoría': 'Consulting', 'Logística portuaria': 'Port logistics', 'Cruceros': 'Cruises', 'Industria naval': 'Shipbuilding', 'Servicios públicos': 'Public utilities' };
  const PROJ = {
    'patymartes': ['Paty Martes supports families with their baby’s nutrition through an online complementary feeding workshop, cookbooks and mealtime products.', 'Website with an online store and payments from anywhere in the world, plus links to her other brands.'],
    'masagua': ['Grupo MAS provides water and sanitation services in the Veracruz metropolitan area.', 'Website with customer notices, mobile offices, water awareness programs, online payments and a support chat.'],
    'lda': ['Logística de Desarrollo e Innovación Ambiental de Veracruz offers products and solutions for nuclear safety and safeguards, radiation protection, radiochemistry and process control and automation.', 'Website with a catalog of products, services and suppliers, in Spanish and English.'],
    'casahoms': ['CASA HOMS provides port logistics in Veracruz, the strategic link between Europe and Mexico: vessel loading and unloading, warehousing, distribution and customs clearance, with door-to-door service.', 'German-language website presenting its services to the European market.'],
    'fhsa': ['Fortströer Hernández (FHSA) represents industrial companies between Mexico and Germany, offering consulting, market research and hands-on support, specialized in steel, logistics and customs.', 'English-language website presenting its services to international partners.'],
    'icave': ['Hutchison Ports container terminal at the Port of Veracruz, moving goods with precision and speed.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    'lct': ['Hutchison Ports container terminal in Lázaro Cárdenas, Michoacán, with vessel services, cargo handling and transport.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    'eit': ['Hutchison Ports terminal in Ensenada, Baja California, with vessel services, cargo management and transport to and from the terminal.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    'timsa': ['Hutchison Ports terminal in Manzanillo, Colima, with vessel services, containerized cargo and LCL handling.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    'tilh': ['Hutchison Ports intermodal terminal in central Mexico: a hub connecting road and rail, with receiving, storage and distribution of goods.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    'ecv': ['Hutchison Ports cruise terminal in Ensenada, Baja California, with cruise line services and passenger care.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    'lcmt': ['Hutchison Ports multipurpose terminal in Lázaro Cárdenas: all types of vessels, vehicles, machinery, project and oversized cargo, and a 5,000 m² warehouse.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    'tng': ['Hutchison Ports shipyard in Veracruz for building, repairing, converting and dismantling vessels.', 'Corporate website for the terminal, with its services, infrastructure, news and access to Hutchison Ports’ digital tools.'],
    '14801186192': ['Centro de Estudios Cristóbal Colón dates back to 1944, when Veracruz society needed an alternative for parents who cared deeply about their children’s education.', 'Website for Colegio Cristóbal Colón to manage its news, events and information about each academic level from an admin panel.'],
    '14801195822': ['Today EJEMEX events are known in Mexico and Latin America as the best, as confirmed by clients in the financial, industrial, metallurgical, steel, government and education sectors.', 'Website to manage seminars, courses, events, pre-registration and articles of general interest.'],
    '14801257962': ['The American School Foundation of Chiapas, A.C., was founded in 1991 in the city of Tuxtla Gutiérrez as a bilingual and multicultural educational institution. Starting from Preschool level and higher levels due to the growth of our student body and the educational demand, we opened up Elementary School and Middle School levels.'],
    '14801237282': ['A group of experienced professionals in the operation and maintenance of service real estate infrastructure.', 'Responsive website with a minimalist touch.'],
    '14801214712': ['Edifica Construcciones Steel & Panel brings together the concepts needed to design globally modular prefabricated projects, where a larger or smaller number of parts form a building system.', 'Minimalist website with client-side animations, designed to look great on mobile devices.'],
    '14801247272': ['Manufacturer of gas equipment in food-grade 304 stainless steel.', 'Website to manage products and showcase current manufacturing work through a gallery.'],
    '14800328772': ['Our passion for life, the curiosity of every member of our team and our love for what we do make our events memorable and take every celebration to the next level.', 'Minimalist responsive website, tailored to the client’s taste, with photo editing.'],
    '14801263002': ['At PhotoBook we use the best quality and technology to spontaneously capture your best smiles and special, unique moments through instant photo booth rentals.'],
    '14800341952': ['Banquetes Puerto Evento designs menus and prepares delicious banquets for weddings and other social events that call for highly professional service.', 'Responsive website with a minimalist style, built around the client’s needs.'],
    '14801242082': ['Sports news website. A news portal to manage advertising, news by category, special sections and soccer statistics.'],
    '14801199212': ['Taekwondo training and coaching. A multidisciplinary Mexican project specialized in Taekwondo that fully advises and trains athletes.', 'Responsive website to manage a newsletter and a blog about sports care.'],
    '14801250882': ['Among his main credentials, he is certified by the Mexican Board of Otorhinolaryngology and Head and Neck Surgery, the body that certifies and keeps specialists up to date.', 'Website that manages clinical cases and services. Includes strong Google ranking.'],
    '14801254312': ['MEZDERMA is a dermatology center committed to excellence and quality in caring for patients with skin, hair and nail conditions.'],
    '14801268812': ['PERFUMES MON CHÉRI was born to make a top-quality product available to everyone at an excellent price.'],
    '14801174552': ['Inspecciones No Destructivas del Golfo was founded in 2004 to provide non-destructive testing, subsea inspection services and equipment for inspecting and handling oil pipelines.', 'Website with extensive photo editing to reinforce the client’s identity.'],
    '14800332872': ['On-site security guards. Personal assistance. Alarms. CCTV. Perimeter security with drones. Policy and procedure violations. Internal risks from breach of trust. Unauthorized entry. And more.', 'Responsive website with photo editing.'],
    '14801280352': ['At FERRENORTE we are committed to friendly service. We value your business. Our mission is to offer reliable products and services with a customer-focused approach.'],
    '14801292942': ['A tech community that shares knowledge for free in southeastern Mexico.', 'We aim to spark a disruptive movement around information technology that celebrates and promotes software development culture.'],
    '14801296822': ['“El Carboncito” grill house: meats, cheeses and chicken.'],
    '14801300092': ['A company of cleaning products for homes, offices and businesses.'],
    '14801302282': ['On-site security guards. Personal assistance. Alarms. CCTV. Perimeter security with drones. Policy and procedure violations. Internal risks from breach of trust. Unauthorized entry. And more.', 'Vectorized logo.'],
    '14801304402': ['Brand identity and logo design.'],
    '14801313632': ['We are committed to protecting the physical integrity of our staff, helping preserve the environment and safeguarding our own and our clients’ facilities, which is why we enforce a very strict health and safety code.', 'System to manage operators, clients, machinery, supplies, operations, payroll, products and diesel per machine.'],
    '14801317222': ['A mostly Mexican company providing comprehensive purchasing, storage and distribution of explosive products for the oil market (seismic exploration, well perforation, drilling, etc.), serving the Oil & Gas sector.', 'Intranet that manages news, bulletins and other information of general interest for the company’s people.'],
  };

  const KEY = 'arkan-lang';
  const url = new URLSearchParams(location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* almacenamiento bloqueado */ }
  const lang = ['es', 'en'].includes(url) ? url : saved || ((navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');

  window.LANG = lang;
  window.UI = UI[lang];
  window.trProject = p => lang === 'en' ? { ...p, sector: SECTOR[p.sector] || p.sector, desc: PROJ[p.id] || p.desc } : p;

  document.documentElement.lang = lang;
  if (lang === 'en') {
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = EN[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { const v = EN[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    // en inglés la segunda línea es más larga: la miniatura pasa a la última línea
    document.querySelectorAll('.hero__title').forEach(t => { const pill = t.querySelector('.hero__pill'), last = t.querySelector('.line:last-child'); if (pill && last) last.append(' ', pill); });
    document.querySelectorAll('[data-i18n-content]').forEach(el => { const v = EN[el.dataset.i18nContent]; if (v != null) el.setAttribute('content', v); });
  }

  // botones ES / EN: guardan la elección y recargan sin repetir el cargador
  document.querySelectorAll('.lang__btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.lang === lang);
    b.setAttribute('aria-pressed', b.dataset.lang === lang);
    b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      try { localStorage.setItem(KEY, b.dataset.lang); sessionStorage.setItem('arkan-skip-loader', '1'); } catch (e) { /* sin almacenamiento */ }
      const u = new URL(location.href); u.searchParams.set('lang', b.dataset.lang); u.hash = '';
      location.replace(u.toString());
    });
  });
})();
