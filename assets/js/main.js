(() => {
  const prefersReduced = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const planes = Array.from(document.querySelectorAll('.plane'));
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
    }
  }, { threshold: [0.15,0.35,0.55,0.75] });

  planes.forEach(p => io.observe(p));

  // Noticeable parallax (still tasteful)
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