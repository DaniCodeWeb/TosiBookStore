import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import path from 'path';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Configura tu URL del sitio - IMPORTANTE para SEO y URLs absolutas
  site: 'http://localhost:3000', // Cambia esto por tu dominio real

  build: {
    format: 'file',
    // Optimizaciones adicionales para SEO
    inlineStylesheets: 'auto',
  },

  markdown: {
    shikiConfig: {
      theme: 'dark-plus'
    }
  },

  integrations: [mdx(), tailwind(), react()],

  // Se elimina srcDir para usar la ruta estándar ./src
  cacheDir: './dist/pages',
  outDir: './dist/pages',

  // Configuración adicional para SEO
  compressHTML: true,

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@assets': path.resolve('./src/assets'),
        '@lib': path.resolve('./src/lib')
      }
    },
    server: {
      watch: {
        ignored: ['!**/dist/**'],
      },
      // Puerto personalizado (opcional)
      port: 3000,
      host: true
    },
    build: {
      // Optimizaciones para producción
      cssMinify: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          // Organizar archivos de build para mejor cache
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    }
  }
});