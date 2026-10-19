// Navigation works independently from the content API.
const headerMenu = document.querySelector('.menu-toggle');
const headerNav = document.querySelector('#navigation');
function closeMenu() {
  headerNav.classList.remove('open');
  headerMenu.setAttribute('aria-expanded', 'false');
}
headerMenu.addEventListener('click', () => {
  const open = headerNav.classList.toggle('open');
  headerMenu.setAttribute('aria-expanded', String(open));
});
headerNav.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeMenu(); headerMenu.focus(); }
});
headerMenu.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
headerNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const target = document.querySelector(link.hash);
  const focusTarget = link.classList.contains('header-search') ? document.querySelector('#hero-query') : target;
  if (focusTarget) { if (!focusTarget.matches('input')) focusTarget.setAttribute('tabindex', '-1'); focusTarget.focus({preventScroll:true}); }
}));
const desktopHeader = matchMedia('(min-width:901px)');
desktopHeader.addEventListener('change', closeMenu);
function updateHeaderLocation() {
  const hash = location.hash || '#utama';
  headerNav.querySelectorAll('.nav-links a').forEach(link => {
    if (link.hash === hash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange', updateHeaderLocation);
updateHeaderLocation();
