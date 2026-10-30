export function initNavigation() {
  const menuButton = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-links');

  menuButton?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', isOpen);
    menuButton.textContent = isOpen ? '×' : '☰';
  });

  const searchButton = document.querySelector('[data-search-toggle]');
  const header = document.querySelector('.header');
  const searchForm = document.querySelector('.site-search');

  searchButton?.addEventListener('click', () => {
    header.classList.toggle('search-open');
    if (header.classList.contains('search-open')) {
      searchForm.querySelector('input').focus();
    }
  });

  document.querySelectorAll('[data-top-search]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = form.querySelector('input').value.trim();
      location.href = 'shop.html' + (query ? '?q=' + encodeURIComponent(query) : '');
    });
  });

  const cart = JSON.parse(localStorage.getItem('ember-cart') || '[]');
  document.querySelectorAll('[data-cart-count]').forEach((badge) => {
    badge.textContent = cart.reduce((count, item) => count + item.qty, 0);
  });

  const backToTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('show', scrollY > 500);
  });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
