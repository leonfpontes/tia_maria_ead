/**
 * Interações básicas para a home do Terreiro Tia Maria e Cabocla Jupira.
 * - Atualiza automaticamente o ano corrente no rodapé.
 * - Controla a abertura e o fechamento do menu de navegação mobile.
 */
(function () {
  'use strict';

  const footerYear = document.querySelector('[data-current-year]');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
  }

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  if (!menuToggle || !menu) {
    return;
  }

  const toggleMenu = () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    const nextState = !isOpen;
    menuToggle.setAttribute('aria-expanded', String(nextState));
    menu.classList.toggle('hidden', !nextState);
  };

  menuToggle.addEventListener('click', toggleMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu();
      menuToggle.focus();
    }
  });
})();
