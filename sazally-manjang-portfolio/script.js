/* SAZALLY MANJANG PORTFOLIO — interaction code; no build tools needed. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const nav = document.getElementById('siteNav');
  const menuButton = document.querySelector('.menu-toggle');
  const links = [...document.querySelectorAll('.site-nav .nav-link')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateThemeControl() {
    const isLight = root.dataset.theme === 'light';
    if (!themeButton) return;
    themeButton.setAttribute('aria-pressed', String(isLight));
    themeButton.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
    themeButton.title = `Switch to ${isLight ? 'dark' : 'light'} theme`;
    themeButton.innerHTML = isLight ? '<i class="bi bi-moon-stars" aria-hidden="true"></i>' : '<i class="bi bi-sun" aria-hidden="true"></i>';
  }
  updateThemeControl();
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    if (next === 'light') root.dataset.theme = 'light';
    else delete root.dataset.theme;
    try { localStorage.setItem('sazally-theme', next); } catch (_) { /* Private mode */ }
    updateThemeControl();
  });

  function closeMenu() {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation menu');
  }
  menuButton?.addEventListener('click', () => {
    const opening = !nav?.classList.contains('open');
    nav?.classList.toggle('open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); menuButton?.focus(); }
  });
  document.addEventListener('click', event => {
    if (nav?.classList.contains('open') && !event.target.closest('.site-header')) closeMenu();
  });
  links.forEach(link => link.addEventListener('click', closeMenu));

  // Highlight the relevant nav link while scrolling. Education lives under About.
  const watchedSections = [...document.querySelectorAll('main section[id]')];
  const mapSection = id => id === 'education' ? 'about' : id;
  function updateActiveNav() {
    let current = 'home';
    const edge = window.scrollY + Math.min(window.innerHeight * .34, 260);
    watchedSections.forEach(section => { if (section.offsetTop <= edge) current = mapSection(section.id); });
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive:true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 850 && nav?.classList.contains('open')) closeMenu();
    updateActiveNav();
  });

  // Progressive enhancement: all content remains visible when IntersectionObserver is unsupported.
  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('in-view'));
  else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin:'0px 0px -35px 0px', threshold:.06 });
    reveals.forEach(el => revealObserver.observe(el));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const copyButton = document.querySelector('.copy-email');
  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 2700);
  }
  copyButton?.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard requires HTTPS');
      await navigator.clipboard.writeText(email);
      showToast('Email address copied!');
    } catch (_) {
      showToast('Select the email address above to copy it.');
    }
  });
})();
