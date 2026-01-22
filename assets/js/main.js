(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const btn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobileMenu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        menu.hidden = true;
      } else {
        menu.hidden = false;
      }
    });

    // Close menu on link click
    menu.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.tagName === 'A') {
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  }
})();