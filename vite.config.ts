import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(() => {
  const analyze = process.env.ANALYZE === 'true'

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script',
        includeAssets: ['favicon.svg', 'og-image.svg'],
        manifest: {
          name: 'HARDCODED STACKS',
          short_name: 'Stacks',
          description:
            'A cinematic indie-tech game shell optimized for Vercel deployment.',
          theme_color: '#05070d',
          background_color: '#05070d',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,ico,webmanifest}'],
          navigateFallback: '/index.html',
        },
      }),
      compression({
        algorithms: ['brotliCompress'],
        exclude: [/\.map$/],
      }),
      compression({
        algorithms: ['gzip'],
        exclude: [/\.map$/],
      }),
      ...(analyze
        ? [
            visualizer({
              filename: 'dist/bundle-report.html',
              template: 'treemap',
              gzipSize: true,
              brotliSize: true,
              open: false,
            }),
          ]
        : []),
    ],
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild',
      modulePreload: {
        polyfill: false,
      },
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router-dom')) {
                return 'router'
              }

              if (id.includes('react-dom') || id.includes('react')) {
                return 'react-vendor'
              }

              return 'vendor'
            }

            if (id.includes('/src/routes/')) {
              return 'routes'
            }

            if (id.includes('/src/worlds/')) {
              return 'worlds'
            }

            if (id.includes('/src/lib/audio')) {
              return 'audio'
            }
          },
        },
      },
    },
  }
})
