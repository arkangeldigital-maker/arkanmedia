// Botón de modo nocturno: alterna html[data-theme] y recuerda la elección.
// El tema inicial lo pone un script pequeño en el <head> para que no parpadee.
(() => {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const paint = () => { if (meta) meta.content = root.dataset.theme === 'dark' ? '#111220' : '#f3efe8'; };
  paint();
  document.querySelectorAll('.theme-btn').forEach(btn => {
    const label = () => {
      const dark = root.dataset.theme === 'dark', en = root.lang === 'en';
      btn.setAttribute('aria-label', dark ? (en ? 'Switch to light mode' : 'Cambiar a modo claro') : (en ? 'Switch to dark mode' : 'Cambiar a modo nocturno'));
      btn.setAttribute('aria-pressed', dark);
    };
    label();
    btn.addEventListener('click', () => {
      root.classList.add('theme-anim');
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('arkan-theme', root.dataset.theme); } catch (e) { /* sin almacenamiento */ }
      paint(); label();
      setTimeout(() => root.classList.remove('theme-anim'), 600);
    });
  });
})();
