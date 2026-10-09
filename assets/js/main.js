(function () {
  'use strict';

  var root = document.documentElement;

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Theme toggle: an explicit choice wins, otherwise follow the OS
  var themeBtn = document.getElementById('theme-toggle');
  var prefersLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function currentTheme() {
    if (root.dataset.theme === 'light' || root.dataset.theme === 'dark') return root.dataset.theme;
    return prefersLight && prefersLight.matches ? 'light' : 'dark';
  }

  function syncThemeButton() {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', 'Switch to ' + (currentTheme() === 'dark' ? 'light' : 'dark') + ' theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeButton();
    });
    if (prefersLight && prefersLight.addEventListener) prefersLight.addEventListener('change', syncThemeButton);
    syncThemeButton();
  }

  // Mobile menu
  var menuBtn = document.getElementById('menu-toggle');
  var panel = document.getElementById('nav-panel');

  function setMenu(open) {
    if (!menuBtn || !panel) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('is-open', open);
  }

  if (menuBtn && panel) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // Header border once the page scrolls
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the section in view
  if (!('IntersectionObserver' in window)) return;
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { observer.observe(s); });
})();
