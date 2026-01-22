(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const btn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  }

  if (btn && menu) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
    });

    menu.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.tagName === 'A') closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!menu.hidden) {
        const target = e.target;
        const clickedInside = menu.contains(target) || btn.contains(target);
        if (!clickedInside) closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    });
  }
})();