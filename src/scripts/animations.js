// src/scripts/animations.js
import AOS from 'aos';
import 'aos/dist/aos.css';

// Configuración y inicialización de AOS
export function initializeAOS() {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out-back',
    once: true,
    mirror: false,
    offset: 120,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });

  // Refresh después de 1s para componentes dinámicos
  setTimeout(() => AOS.refresh(), 1000);

  // Añadir refresh adicional en caso de cambio de tamaño de ventana
  window.addEventListener('resize', () => {
    setTimeout(() => AOS.refresh(), 100);
  });
}

// Prevenir desplazamiento horizontal
export function preventHorizontalScroll() {
  if (window.scrollX !== 0) {
    window.scrollTo(0, window.scrollY);
  }
}

// Configuración de desplazamiento suave
export function setupSmoothScroll() {
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
}

// Función para desplazamiento suave con offset
export function smoothScroll(targetId) {
  const target = document.querySelector(targetId);
  if (target) {
    const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
    const targetPosition = target.offsetTop - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Forzar refresh de AOS después del scroll
    setTimeout(() => AOS.refresh(), 800);
  }
}

// Inicialización cuando el DOM esté listo
export function initializeAnimations() {
  initializeAOS();
  setupSmoothScroll();

  // Configurar prevención de desplazamiento horizontal
  setInterval(preventHorizontalScroll, 200);
}

// Autoconfiguración cuando se carga el script
document.addEventListener('DOMContentLoaded', initializeAnimations);
