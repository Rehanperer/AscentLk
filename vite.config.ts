import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import prerender from '@prerenderer/rollup-plugin';
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    prerender({
      routes: [
        '/',
        '/register',
        '/tickets',
        '/rulebook',
        '/support',
        '/refund-policy',
        '/privacy-policy',
        '/terms-of-service'
      ],
      renderer: new PuppeteerRenderer({
        maxConcurrentRoutes: 1,
        renderAfterTime: 2000,
        injectProperty: '__PRERENDER_INJECTED',
        inject: { isPrerendering: true },
        executablePath: process.env.CI ? undefined : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      }),
      postProcess (renderedRoute) {
        renderedRoute.html = renderedRoute.html.replace(
          /(<script[^>]*id="__VITE_PRELOAD__"[^>]*>)[^<]*(<\/script>)/,
          ''
        );
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ASCENT 2026',
        short_name: 'ASCENT',
        description: 'The Biggest Student-Led Esports Tournament in Sri Lanka',
        theme_color: '#0f1923',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: ['animejs']
  },
  build: {
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion', 'animejs'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
});
