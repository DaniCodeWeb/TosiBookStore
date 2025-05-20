// src/data/navbarData.js

export const navbarData = {
  sectionLinks: [
    {
      href: '#libros',
      label: 'Libros',
      iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      isSection: true
    },
    {
      href: '#novedades',
      label: 'Novedades',
      iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      isSection: true
    },
    {
      href: '#categorias',
      label: 'Categorías',
      iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      isSection: true
    },
    {
      href: '#preventas',
      label: 'Preventas',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      isSection: true
    },
    {
      href: '#testimonios',
      label: 'Testimonios',
      iconPath: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      isSection: true
    },
    {
      href: '#contactos',
      label: 'Contáctanos',
      iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      isSection: true
    }
  ],
  pageLinks: [
    {
      href: '/',
      label: 'Inicio',
      iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      isSection: false
    },
    {
      href: 'javascript:history.back()',
      label: 'Volver',
      iconPath: 'M10 19l-7-7m0 0l7-7m-7 7h18',
      isSection: false
    }
  ]
};

// Configuración de SEO y meta tags para diferentes secciones
export const sectionMeta = {
  libros: {
    title: 'Libros - TOSI',
    description: 'Descubre nuestra amplia colección de libros en TOSI. Encuentra los mejores títulos y novedades literarias.',
    keywords: 'libros, literatura, TOSI, librería, comprar libros'
  },
  novedades: {
    title: 'Novedades - TOSI',
    description: 'Las últimas novedades en libros y literatura. Mantente al día con los lanzamientos más recientes.',
    keywords: 'novedades, nuevos libros, lanzamientos, TOSI'
  },
  categorias: {
    title: 'Categorías - TOSI',
    description: 'Explora nuestras categorías de libros organizadas por género, tema y autor.',
    keywords: 'categorías, géneros literarios, clasificación de libros, TOSI'
  },
  preventas: {
    title: 'Preventas - TOSI',
    description: 'Asegura tu copia con nuestras preventas exclusivas. Obtén acceso anticipado a los mejores títulos.',
    keywords: 'preventas, pre-order, reservas de libros, TOSI'
  },
  testimonios: {
    title: 'Testimonios - TOSI',
    description: 'Lee lo que dicen nuestros clientes sobre su experiencia con TOSI.',
    keywords: 'testimonios, reseñas, opiniones, clientes satisfechos, TOSI'
  },
  contactos: {
    title: 'Contacto - TOSI',
    description: 'Ponte en contacto con TOSI. Estamos aquí para ayudarte con todas tus necesidades literarias.',
    keywords: 'contacto, atención al cliente, TOSI, comunicación'
  }
};
