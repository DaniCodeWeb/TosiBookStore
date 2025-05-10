import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  build: {
    format: 'file'
  },
  markdown: {
    shikiConfig: {
      theme: 'dark-plus'
    }
  },
  integrations: [
    mdx(),
    tailwind()
  ],
  // Se elimina srcDir para usar la ruta estándar ./src
  cacheDir: './dist/pages',
  outDir: './dist/pages',
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
      }
    }
  }
});
