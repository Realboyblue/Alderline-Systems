(() => {
  // Respect prefers-reduced-motion across any future enhancements
  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.getElementById('mobileMenu');
  const setMenu = (open) => {
    if (!toggle || !mobile) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) mobile.removeAttribute('hidden');
    else mobile.setAttribute('hidden', '');
  };

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      setMenu(!open);
    });

    // Close menu when a link is clicked
    mobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMenu(false));
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // Optional: keep background layers perfectly calm (no scroll transforms)
  if (prefersReduced) {
    document.documentElement.style.setProperty('--parallaxBg', '0px');
    document.documentElement.style.setProperty('--parallaxMid', '0px');
  }
})();