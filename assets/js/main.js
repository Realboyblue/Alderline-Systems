(() => {
  const prefersReduced = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const planes = Array.from(document.querySelectorAll('.plane'));
  const railLinks = Array.from(document.querySelectorAll('.rail a[data-rail]'));

  const setRailActive = (id) => {
    if (!id || !railLinks.length) return;
    railLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
    });
  };

  // Plane focus (2.5D stack)
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;

    const active = visible[0].target;
    planes.forEach(p => p.classList.remove('is-active','is-behind','is-peek'));
    const idx = planes.indexOf(active);
    if (idx >= 0) {
      planes[idx].classList.add('is-active');
      if (planes[idx - 1]) planes[idx - 1].classList.add('is-behind');
      if (planes[idx + 1]) planes[idx + 1].classList.add('is-peek');
      setRailActive(active.id);
    }
  }, { threshold: [0.18,0.35,0.55,0.75] });

  planes.forEach(p => io.observe(p));

  // Rail: smooth scroll and focus
  railLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
    }, { passive: false });
  });

  // Hero tilt (quiet future)
  const tilt = document.querySelector('.hero-tilt');
  const stack = tilt ? tilt.querySelector('.stack') : null;
  if (tilt && stack && !prefersReduced()) {
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;   // 0..1
      const ny = (e.clientY - r.top) / r.height;   // 0..1
      const ry = (nx - 0.5) * 10; // degrees
      const rx = (0.5 - ny) * 8;  // degrees
      stack.style.setProperty('--rx', `${rx}deg`);
      stack.style.setProperty('--ry', `${ry}deg`);
    });
    tilt.addEventListener('mouseleave', () => {
      stack.style.setProperty('--rx', '0deg');
      stack.style.setProperty('--ry', '0deg');
    });
  }

  // Tasteful parallax
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (prefersReduced()) return;
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty('--parallaxBg', `${y * -0.06}px`);
      document.documentElement.style.setProperty('--parallaxMid', `${y * -0.10}px`);
      document.documentElement.style.setProperty('--parallaxFg', `${y * -0.14}px`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();