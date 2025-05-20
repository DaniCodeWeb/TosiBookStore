// src/components/scripts/navbar.js

class NavbarManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    this.lastScrollY = window.scrollY;
    this.isScrolling = false;
    this.scrollTimeout = null;

    this.init();
  }

  init() {
    this.bindEvents();
    // this.updateNavbarVisibility();
    this.updateActiveLink();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on links
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Scroll events with throttling
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Window resize
    window.addEventListener('resize', () => this.handleResize());

    // Hash change
    window.addEventListener('hashchange', () => this.updateActiveLink());

    // Page visibility change (for better performance)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActiveLink();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  // Determinar si estamos en una página específica
  isSpecificPage() {
    const path = window.location.pathname;
    // Si estamos en la raíz o index.html, es la página principal
    if (path === '/' || path === '/index.html' || path.endsWith('/')) {
      return false;
    }
    // Cualquier otra ruta es una página específica
    return true;
  }

  // Actualizar visibilidad del navbar basado en la página
  updateNavbarVisibility() {
    if (!this.navbar) return;

    if (this.isSpecificPage()) {
      // En páginas específicas, ocultar el navbar
      this.navbar.classList.add('hidden-on-page');
    } else {
      // En la página principal, mostrar el navbar
      this.navbar.classList.remove('hidden-on-page');
    }
  }

  // Manejar scroll con throttling mejorado
  handleScroll() {
    if (!this.isScrolling) {
      window.requestAnimationFrame(() => {
        this.updateActiveLink();
        this.isScrolling = false;
      });
      this.isScrolling = true;
    }

    // Clear timeout if exists
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set timeout to handle scroll end
    this.scrollTimeout = setTimeout(() => {
      this.updateActiveLink();
    }, 100);

    this.lastScrollY = window.scrollY;
  }

  // Actualizar enlace activo basado en scroll spy
  updateActiveLink() {
    // Solo hacer scroll spy en la página principal
    if (this.isSpecificPage()) return;

    const scrollPosition = window.scrollY + 100; // Offset para mejor UX
    let currentSection = '';

    // Encontrar la sección actual
    this.sections.forEach(section => {
      if (!section.id) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.id;
      }
    });

    // Actualizar enlaces activos
    this.navLinks.forEach(link => {
      link.classList.remove('active');

      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');

        // Actualizar meta tags dinámicamente (opcional)
        this.updateMetaTags(currentSection);
      }
    });
  }

  // Actualizar meta tags dinámicamente (opcional para SPA behavior)
  updateMetaTags(sectionId) {
    // Esta función es opcional, útil para comportamiento SPA
    if (typeof window !== 'undefined' && window.sectionMeta && window.sectionMeta[sectionId]) {
      const meta = window.sectionMeta[sectionId];

      // Actualizar title
      document.title = meta.title;

      // Actualizar meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', meta.description);
      }

      // Actualizar meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', meta.keywords);
      }
    }
  }

  // Toggle mobile menu
  toggleMobileMenu() {
    if (!this.mobileMenu || !this.mobileMenuButton) return;

    const isOpen = this.mobileMenu.classList.contains('open');

    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenu.classList.remove('hidden');
    this.mobileMenu.classList.add('open');
    this.mobileMenuButton.classList.add('open');
    this.mobileMenuButton.setAttribute('aria-expanded', 'true');

    // Focus management
    const firstLink = this.mobileMenu.querySelector('.mobile-nav-link');
    if (firstLink) firstLink.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.mobileMenu.classList.remove('open');
    this.mobileMenu.classList.add('hidden');
    this.mobileMenuButton.classList.remove('open');
    this.mobileMenuButton.setAttribute('aria-expanded', 'false');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  // Handle clicks outside mobile menu
  handleOutsideClick(e) {
    if (!this.mobileMenu || !this.mobileMenu.classList.contains('open')) return;

    if (!this.mobileMenu.contains(e.target) && !this.mobileMenuButton.contains(e.target)) {
      this.closeMobileMenu();
    }
  }

  // Handle keyboard navigation
  handleKeyboard(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && this.mobileMenu && this.mobileMenu.classList.contains('open')) {
      this.closeMobileMenu();
      this.mobileMenuButton.focus();
    }
  }

  // Handle window resize
  handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth >= 1024 && this.mobileMenu && this.mobileMenu.classList.contains('open')) {
      this.closeMobileMenu();
    }

    // Recalculate active link on resize
    this.updateActiveLink();
  }

  // Smooth scroll to sections (opcional)
  smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const navbar = this.navbar;
    const offset = navbar ? navbar.offsetHeight : 0;

    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  }

  // Public method to refresh navbar state
  refresh() {
    this.updateNavbarVisibility();
    this.updateActiveLink();
  }
}

// Performance optimizations
const initNavbar = () => {
  // Check if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NavbarManager());
  } else {
    new NavbarManager();
  }
};

// Initialize when script loads
initNavbar();

// Export for potential external use
if (typeof window !== 'undefined') {
  window.NavbarManager = NavbarManager;
}

// Module export for build systems
export default NavbarManager;
