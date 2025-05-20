// src/scripts/aos-init.js
// Solución con importación de módulo
import AOS from 'aos';

document.addEventListener('DOMContentLoaded', () => {
  // Espera a que todos los recursos estén listos
  const initAOS = () => {
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
  };

  initAOS();

  // Prevenir desplazamiento horizontal
  function preventHorizontalScroll() {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  }

  // Verificar y corregir posición horizontal cada 200ms
  setInterval(preventHorizontalScroll, 200);
});
