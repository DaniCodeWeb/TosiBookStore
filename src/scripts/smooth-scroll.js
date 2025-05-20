// src/scripts/smooth-scroll.js
import AOS from 'aos';

document.addEventListener('DOMContentLoaded', () => {
  // Función para scroll suave con offset
  function smoothScroll(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
      const navbarHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Forzar refresh de AOS después del scroll
      setTimeout(() => {
        AOS.refresh();
      }, 800);
    }
  }

  // Configurar event listeners para todos los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        smoothScroll(targetId);
        history.pushState(null, null, targetId);
      }
    });
  });
});
