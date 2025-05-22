// src/scripts/navbar.ts
import { authService } from '../lib/auth';

interface SectionMeta {
  title: string;
  description: string;
  keywords: string;
}

interface WindowWithSectionMeta extends Window {
  sectionMeta?: Record<string, SectionMeta>;
  openAuthModal?: (modalType: 'login' | 'register' | 'recover') => void;
  NavbarManager?: typeof NavbarManager;
}

declare const window: WindowWithSectionMeta;

class NavbarManager {
  private navbar: HTMLElement | null;
  private mobileMenuButton: HTMLElement | null;
  private mobileMenu: HTMLElement | null;
  private loginButton: HTMLElement | null;
  private sections: NodeListOf<HTMLElement>;
  private navLinks: NodeListOf<HTMLElement>;
  private mobileNavLinks: NodeListOf<HTMLElement>;
  private lastScrollY: number;
  private isScrolling: boolean;
  private scrollTimeout: ReturnType<typeof setTimeout> | null;

  constructor() {
    this.navbar = document.getElementById('navbar');
    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.loginButton = document.getElementById('login-button');
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    this.lastScrollY = window.scrollY;
    this.isScrolling = false;
    this.scrollTimeout = null;

    this.init();
  }

  private init(): void {
    this.bindEvents();
    this.updateActiveLink();
    this.updateUserInterface();
  }

  private bindEvents(): void {
    // Mobile menu toggle
    this.mobileMenuButton?.addEventListener('click', () => this.toggleMobileMenu());

    // Login button
    this.loginButton?.addEventListener('click', () => this.handleLoginClick());

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

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActiveLink();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e: Event) => this.handleOutsideClick(e));

    // Keyboard navigation
    document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyboard(e));

    // Auth state changes
    this.bindAuthEvents();
  }

  private bindAuthEvents(): void {
    // Listen for auth state changes
    window.addEventListener('storage', () => {
      this.updateUserInterface();
    });

    // Custom event for auth changes
    window.addEventListener('authStateChanged', () => {
      this.updateUserInterface();
    });
  }

  private handleLoginClick(): void {
    if (authService.isAuthenticated()) {
      // Si está autenticado, mostrar menú de usuario o logout
      this.showUserMenu();
    } else {
      // Si no está autenticado, abrir modal de login
      if (window.openAuthModal) {
        window.openAuthModal('login');
      } else {
        console.warn('AuthModal not available');
      }
    }
  }

  private showUserMenu(): void {
    // Crear o mostrar menú desplegable de usuario
    const existingMenu = document.getElementById('user-dropdown');
    
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const userMenu = document.createElement('div');
    userMenu.id = 'user-dropdown';
    userMenu.className = 'absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50';
    userMenu.innerHTML = `
      <div class="px-4 py-2 text-sm text-gray-700 border-b">
        <div class="font-medium">Bienvenido</div>
        <div class="text-gray-500">${authService.getUser()?.email || ''}</div>
      </div>
      <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</a>
      <a href="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mis Pedidos</a>
      <button id="logout-btn" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
    `;

    // Posicionar el menú
    const loginButtonContainer = this.loginButton?.parentElement;
    if (loginButtonContainer) {
      loginButtonContainer.style.position = 'relative';
      loginButtonContainer.appendChild(userMenu);
    }

    // Manejar logout
    const logoutBtn = userMenu.querySelector('#logout-btn');
    logoutBtn?.addEventListener('click', () => this.handleLogout());

    // Cerrar menú al hacer click fuera
    setTimeout(() => {
      document.addEventListener('click', (e: Event) => {
        if (!userMenu.contains(e.target as Node)) {
          userMenu.remove();
        }
      }, { once: true });
    }, 100);
  }

  private async handleLogout(): Promise<void> {
    try {
      const token = authService.getToken();
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      authService.clearAuth();
      this.updateUserInterface();
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      
      // Reload page or redirect
      window.location.reload();
    }
  }

  private updateUserInterface(): void {
    if (!this.loginButton) return;

    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUser();

    if (isAuthenticated && user) {
      // Usuario autenticado
      this.loginButton.textContent = user.nombre || 'Mi Cuenta';
      this.loginButton.className = 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200';
    } else {
      // Usuario no autenticado
      this.loginButton.textContent = 'Mi cuenta';
      this.loginButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200';
    }
  }

  private isSpecificPage(): boolean {
    const path = window.location.pathname;
    return !(path === '/' || path === '/index.html' || path.endsWith('/'));
  }

  private handleScroll(): void {
    if (!this.isScrolling) {
      window.requestAnimationFrame(() => {
        this.updateActiveLink();
        this.isScrolling = false;
      });
      this.isScrolling = true;
    }

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      this.updateActiveLink();
    }, 100);

    this.lastScrollY = window.scrollY;
  }

  private updateActiveLink(): void {
    if (this.isSpecificPage()) return;

    const scrollPosition = window.scrollY + 100;
    let currentSection = '';

    this.sections.forEach(section => {
      if (!section.id) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.id;
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');

      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
        this.updateMetaTags(currentSection);
      }
    });
  }

  private updateMetaTags(sectionId: string): void {
    if (window.sectionMeta && window.sectionMeta[sectionId]) {
      const meta = window.sectionMeta[sectionId];

      document.title = meta.title;

      const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDescription) {
        metaDescription.setAttribute('content', meta.description);
      }

      const metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (metaKeywords) {
        metaKeywords.setAttribute('content', meta.keywords);
      }
    }
  }

  private toggleMobileMenu(): void {
    if (!this.mobileMenu || !this.mobileMenuButton) return;

    const isOpen = this.mobileMenu.classList.contains('open');

    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  private openMobileMenu(): void {
    if (!this.mobileMenu || !this.mobileMenuButton) return;

    this.mobileMenu.classList.remove('hidden');
    this.mobileMenu.classList.add('open');
    this.mobileMenuButton.classList.add('open');
    this.mobileMenuButton.setAttribute('aria-expanded', 'true');

    const firstLink = this.mobileMenu.querySelector('.mobile-nav-link') as HTMLElement;
    firstLink?.focus();

    document.body.style.overflow = 'hidden';
  }

  private closeMobileMenu(): void {
    if (!this.mobileMenu || !this.mobileMenuButton) return;

    this.mobileMenu.classList.remove('open');
    this.mobileMenu.classList.add('hidden');
    this.mobileMenuButton.classList.remove('open');
    this.mobileMenuButton.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';
  }

  private handleOutsideClick(e: Event): void {
    if (!this.mobileMenu || !this.mobileMenu.classList.contains('open')) return;

    const target = e.target as HTMLElement;
    if (!this.mobileMenu.contains(target) && !this.mobileMenuButton?.contains(target)) {
      this.closeMobileMenu();
    }
  }

  private handleKeyboard(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.mobileMenu && this.mobileMenu.classList.contains('open')) {
      this.closeMobileMenu();
      this.mobileMenuButton?.focus();
    }
  }

  private handleResize(): void {
    if (window.innerWidth >= 1024 && this.mobileMenu && this.mobileMenu.classList.contains('open')) {
      this.closeMobileMenu();
    }

    this.updateActiveLink();
  }

  public smoothScrollTo(targetId: string): void {
    const target = document.getElementById(targetId);
    if (!target) return;

    const offset = this.navbar ? this.navbar.offsetHeight : 0;

    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  }

  public refresh(): void {
    this.updateActiveLink();
    this.updateUserInterface();
  }
}

// Initialize navbar
const initNavbar = (): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NavbarManager());
  } else {
    new NavbarManager();
  }
};

// Initialize when script loads
initNavbar();

// Export for external use
if (typeof window !== 'undefined') {
  window.NavbarManager = NavbarManager;
}

export default NavbarManager;