(() => {
  const prefersReduced = () =>
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
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setMenu(false));
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // ===== Smooth-ish, stable section highlighting (no blur/pointer weirdness) =====
  const planes = Array.from(document.querySelectorAll('.plane'));
  const railLinks = Array.from(document.querySelectorAll('.rail a[data-rail]'));

  const setRailActive = (id) => {
    if (!id || !railLinks.length) return;
    railLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
    });
  };

  let activeId = '';
  let ticking = false;

  const chooseActivePlane = () => {
    if (!planes.length) return;

    const header = document.querySelector('.topbar');
    const headerH = header ? header.getBoundingClientRect().height : 0;

    // A little above center feels better with a sticky header
    const targetY = headerH + (window.innerHeight - headerH) * 0.33;

    let best = null;
    let bestDist = Infinity;

    for (const p of planes) {
      const r = p.getBoundingClientRect();
      // Ignore sections fully out of view
      if (r.bottom < headerH + 40 || r.top > window.innerHeight - 40) continue;
      const center = (r.top + r.bottom) / 2;
      const d = Math.abs(center - targetY);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }

    if (!best) return;

    const id = best.id || '';
    if (id && id !== activeId) {
      activeId = id;
      planes.forEach(p => p.classList.remove('is-active', 'is-behind', 'is-peek'));
      const idx = planes.indexOf(best);
      if (idx >= 0) {
        planes[idx].classList.add('is-active');
        if (planes[idx - 1]) planes[idx - 1].classList.add('is-behind');
        if (planes[idx + 1]) planes[idx + 1].classList.add('is-peek');
      }
      setRailActive(id);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      chooseActivePlane();

      // Tasteful parallax (desktop only)
      if (prefersReduced()) return;
      if (window.innerWidth < 900) return;
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty('--parallaxBg', `${y * -0.05}px`);
      document.documentElement.style.setProperty('--parallaxMid', `${y * -0.08}px`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Rail: allow default anchor behavior (CSS scroll-margin handles header offset)

  // Hero tilt (desktop only)
  const tilt = document.querySelector('.hero-tilt');
  const stack = tilt ? tilt.querySelector('.stack') : null;
  if (tilt && stack && !prefersReduced() && window.innerWidth >= 900) {
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;   // 0..1
      const ny = (e.clientY - r.top) / r.height;  // 0..1
      const ry = (nx - 0.5) * 8; // degrees
      const rx = (0.5 - ny) * 6;
      stack.style.setProperty('--rx', `${rx}deg`);
      stack.style.setProperty('--ry', `${ry}deg`);
    });
    tilt.addEventListener('mouseleave', () => {
      stack.style.setProperty('--rx', '0deg');
      stack.style.setProperty('--ry', '0deg');
    });
  }
})();
