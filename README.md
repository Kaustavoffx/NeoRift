# HARDCODED STACKS

> A high-performance, cinematic React + Vite web game optimized for serverless deployment, offline play, and cinematic storytelling across 8 immersive worlds.

## 🎮 About

**HARDCODED STACKS** is a browser-based narrative-driven game that blends atmospheric worldbuilding with interactive gameplay. Players traverse eight distinct realities—from neon-lit collapsing cities to recursive infinite stacks—each with unique mechanics, soundscapes, and visual themes. Built for lightning-fast cold starts, full offline capability, and mobile accessibility.

**Development Note:** This project was created with AI assistance (GitHub Copilot), integrating modern development best practices for production-grade web applications.

## ✨ Features

- **8 Immersive Worlds** – Each with unique mechanics, atmosphere, and lore
- **Serverless Ready** – Edge-compatible Vercel deployment with zero backend overhead
- **Offline First** – Service Worker with Workbox for full offline capability
- **Mobile Optimized** – Responsive design with touch controls and PWA installability
- **Performance Focused** – Code splitting, Brotli/gzip compression, and optimized chunks
- **Live Leaderboard** – Flexible backend integration for global score tracking
- **Cinematic Design** – Particle effects, shader blooms, and atmospheric UI

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | React 19 + React Router v7 |
| **Build** | Vite 8 + TypeScript 6 |
| **Compression** | Brotli + Gzip (automatic) |
| **PWA** | Workbox + vite-plugin-pwa |
| **Code Quality** | ESLint + TypeScript strict mode |
| **Hosting** | Vercel (Edge Functions) |

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type check
npm run type-check
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Analyze bundle sizes
npm run analyze

# Full production check (type-check + build + analyze)
npm run deploy:dry-run
```

## 📦 Project Structure

```
neo-game/
├── src/
│   ├── components/         # Reusable React components
│   ├── routes/             # Route components with code splitting
│   ├── worlds/             # World definitions and interactions
│   ├── lib/                # Utilities (audio, analytics, leaderboard)
│   ├── styles/             # CSS modules and global styles
│   ├── App.tsx             # Main app shell
│   └── main.tsx            # Entry point
├── api/                    # Serverless API endpoints
│   └── leaderboard.ts      # Leaderboard endpoint
├── public/                 # Static assets (robots.txt, sitemap.xml)
├── dist/                   # Production build output
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

## 🌐 Deployment to Internet

### Option 1: Vercel (Recommended)

**1. Connect Repository:**
```bash
npm install -g vercel
vercel login
vercel link
```

**2. Configure Deployment:**
- Vercel auto-detects `vercel.json` configuration
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

**3. Deploy:**
```bash
# Production deployment
npm run deploy

# Or via Vercel CLI
vercel --prod
```

**4. Verify Deployment:**
- Visit your Vercel project URL
- Check `/play` route works (SPA routing)
- Test `/leaderboard` endpoint
- Validate PWA install prompt on mobile

### Option 2: GitHub Pages (Static Only)

```bash
# Build production assets
npm run build

# Deploy dist folder to GitHub Pages
# See your GitHub repository Settings > Pages > Deploy from branch
```

### Option 3: Docker / Self-Hosted

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## ⚙️ Environment Variables

Client-side variables must use the `VITE_` prefix (automatically exposed to frontend):

```env
# .env.local (development)
VITE_LEADERBOARD_ENDPOINT=http://localhost:3000/api/leaderboard
VITE_ENABLE_ANALYTICS=false

# .env.production (production)
VITE_LEADERBOARD_ENDPOINT=https://your-domain.com/api/leaderboard
VITE_GOOGLE_ANALYTICS_ID=G_XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
VITE_SITE_URL=https://your-domain.com
```

Set in Vercel:
1. Go to **Settings > Environment Variables**
2. Add `VITE_*` variables (automatically injected at build time)

## 📊 Performance & Optimization

### Bundle Sizes (Production)
- **Main JS:** ~41 KB (gzip)
- **React Vendor:** ~76 KB (gzip)
- **Routes CSS:** ~6.7 KB (gzip)
- **Total:** ~348 KB (precached PWA)

### Optimization Techniques
- **Code Splitting:** Route-level lazy loading via React Router
- **Asset Compression:** Automatic Brotli + gzip at build time
- **Caching Headers:** Immutable cache for hashed assets (1 year)
- **Service Worker:** Precaching critical assets, network-first for API
- **Tree Shaking:** Dead code elimination via Vite/Rollup
- **Type Safety:** Full TypeScript strict mode

### Monitoring
```bash
# Generate visual bundle analysis
npm run analyze
# Opens visualization in dist/

# Lighthouse audit (in production)
# Desktop: Target 90+ across all metrics
# Mobile: Target 80+ Performance, 90+ other metrics
```

## 🔄 CI/CD Pipeline

### Pre-deployment Checklist

```bash
# 1. Run full quality checks
npm run prod:build

# 2. Verify all environments
npm run type-check
npm run lint
npm run build

# 3. Analyze before shipping large updates
npm run analyze

# 4. Test routes locally
npm run preview
# Visit: http://localhost:4173
# Test: / → /play → /leaderboard → /notfound
```

### Automated Checks

- **Pre-commit:** Type check + lint (via git hooks recommended)
- **PR:** Full build + type-check required
- **Deploy:** Production build must pass all checks

## 📝 Leaderboard API

### Endpoint: `/api/leaderboard`

**GET** – Fetch top 10 scores:
```json
[
  { "name": "Pilot", "score": 9200, "timestamp": 1715784000 },
  { "name": "Runner", "score": 8100, "timestamp": 1715783900 }
]
```

**POST** – Submit score:
```json
{
  "name": "Your Pilot Name",
  "score": 7500
}
```

**Flexible Backend:**
- Default: JSON file in Vercel `/tmp`
- Override: `VITE_LEADERBOARD_ENDPOINT` environment variable
- Custom: Replace `api/leaderboard.ts` with your backend

## 📱 PWA & Mobile

### Features
- **Offline First:** All critical assets precached
- **Install Prompt:** Auto-prompts on iOS/Android
- **Splash Screens:** Custom icons for home screen
- **Background Sync:** Resume game state (optional)

### Testing on Mobile
```bash
# 1. Deploy to Vercel or staging
# 2. Visit on mobile device
# 3. Tap "Install" or "Add to Home Screen"
# 4. Play offline (routes cached)
# 5. Service Worker updates automatically
```

## 🐛 Debugging

### Development Mode
```bash
# Full source maps + hot reload
npm run dev

# Browser DevTools
# - Network: See chunk loading
# - Performance: Profile world loads
# - Application: Inspect Service Worker cache
```

### Production Debug
```bash
# Generate source maps for production debugging
# Uncomment in vite.config.ts: sourcemap: true

npm run build
npm run preview

# Then inspect in browser DevTools
```

## 📚 Documentation

- [Vite Docs](https://vitejs.dev/)
- [React Router Docs](https://reactrouter.com/)
- [Workbox Docs](https://developers.google.com/web/tools/workbox)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Web Vitals](https://web.dev/vitals/)

## 🤝 Contributing

- Follow TypeScript strict mode
- Run `npm run lint:fix` before commits
- Type check: `npm run type-check`
- Test routes: `npm run preview`

## 📄 License

MIT – Build upon this and ship something great.

---

**Built with passion, React, and AI assistance. Ready for production. 🚀**

Server-side variables for the edge API:

- `LEADERBOARD_BACKEND_URL` - Optional external datastore or backend endpoint.
- `LEADERBOARD_BACKEND_TOKEN` - Optional bearer token for the backend endpoint.

## Performance Plan

### Vite Build

- `target: es2022` to avoid unnecessary transpilation.
- `cssCodeSplit: true` so each route gets only the CSS it needs.
- Manual chunking for `react`, router code, game worlds, and audio helpers.
- Brotli and gzip artifacts generated during build.
- Compressed-size analysis available through the visualizer report.

### Code Splitting

- Landing, play, leaderboard, and 404 routes are lazy loaded.
- Audio playback is dynamically imported only after user interaction.
- The heavier game world lives in its own route chunk.

### Minimal Hydration Cost

- This is a client-rendered SPA, so there is no server hydration layer to pay for.
- The first paint stays light: a small router shell, a landing page, and deferred world logic.

### GPU Efficient Animations

- Animations rely mostly on `transform` and `opacity`.
- Large blurred effects are limited and contained.
- Motion is kept inside the game shell instead of spanning the full document.

### Mobile Optimization

- Viewport is configured for mobile scaling and safe-area support.
- Layouts collapse to single-column on smaller screens.
- Buttons are sized for touch and the landing route remains semantically readable.

## Image Optimization

- SVG is used for favicon and social preview assets to keep weight low.
- Social preview and iconography are static, vector-based, and compression friendly.
- If raster art is added later, ship AVIF or WebP first and keep dimensions explicit.

## Audio Optimization

- No packaged audio files are loaded on initial render.
- Sound is generated through Web Audio and loaded only after interaction.
- This keeps the first bundle smaller and avoids shipping large music assets by default.

## SEO Landing Page

- Metadata, Open Graph tags, and JSON-LD are in `index.html`.
- `robots.txt` and `sitemap.xml` are present in `public/`.
- The landing route exposes readable copy, not just a canvas of buttons.

## Bundle Analysis Strategy

1. Run `npm run analyze`.
2. Inspect `dist/bundle-report.html`.
3. Watch for oversized vendor chunks or any route chunk that grows unexpectedly.
4. If the game world starts dominating the bundle, split nonessential subsystems into their own lazy modules.

## Leaderboard Architecture

- Client code talks to `/api/leaderboard` by default.
- The edge function can proxy to an external backend through `LEADERBOARD_BACKEND_URL`.
- This keeps the deployment serverless-friendly while leaving room for Redis, Supabase, or another datastore later.
- If no backend is configured, the API falls back to demo entries so the UI still works.

## Notes

- `vercel.json` configures SPA rewrites and long-lived caching for static assets.
- PWA registration is only loaded in production.
- The current visual language is intentionally cinematic and a little rough around the edges instead of corporate or template-like.
#   N e o R i f t  
 