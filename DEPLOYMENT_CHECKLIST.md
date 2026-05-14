# HARDCODED STACKS - Final Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] No console warnings in development build
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] All unused variables and imports removed
- [ ] Code formatted consistently

### Build & Assets
- [ ] Production build completes without errors (`npm run prod:build`)
- [ ] Asset compression working (gzip + brotli)
- [ ] Bundle analysis run (`npm run analyze`) - check bundle-report.html
- [ ] Total bundle size < 300KB (gzipped)
- [ ] Critical assets under 50KB

### Performance Metrics
- [ ] Lighthouse score >= 90 on all metrics
  - [ ] Performance >= 90
  - [ ] Accessibility >= 90
  - [ ] Best Practices >= 90
  - [ ] SEO >= 95
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s

### Mobile & Responsive
- [ ] Mobile layout tested (iOS Safari, Chrome Mobile)
- [ ] Tablet layout tested
- [ ] Touch interactions working smoothly
- [ ] Performance on 4G network acceptable
- [ ] Viewport meta tags correct

### PWA & Service Worker
- [ ] Service worker generates without errors
- [ ] Manifest.webmanifest valid and serving correctly
- [ ] PWA installable on mobile
- [ ] Offline fallback working
- [ ] Icons display correctly on home screen
- [ ] 16+ assets precached successfully

### Security
- [ ] HTTPS enforced in vercel.json headers
- [ ] Security headers configured (X-Content-Type-Options, CSP, etc.)
- [ ] No sensitive data in client code
- [ ] Analytics respects user privacy (no personal data tracked)
- [ ] External resources HTTPS-only

### SEO & Metadata
- [ ] Meta description present and compelling
- [ ] Open Graph tags configured correctly
- [ ] Twitter Card tags present
- [ ] Schema.org structured data valid
- [ ] Favicon displays correctly
- [ ] Sitemap.xml generated and serving
- [ ] robots.txt configured appropriately

### Analytics & Monitoring
- [ ] Google Analytics integrated and tracking
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Session tracking working
- [ ] Web Vitals measurements enabled

### Error Handling
- [ ] Error boundary wraps all routes
- [ ] Custom error fallback UI looks good
- [ ] 404 page functional and styled
- [ ] Loading fallback UI displays correctly
- [ ] Error logging sends to analytics

### Deployment Configuration
- [ ] .env.example file present with all required variables
- [ ] Environment variables set in Vercel dashboard
  - [ ] VITE_GOOGLE_ANALYTICS_ID
  - [ ] VITE_ENABLE_ANALYTICS=true
  - [ ] VITE_ENABLE_PERFORMANCE_MONITORING=true
- [ ] vercel.json properly configured with:
  - [ ] Cache headers for static assets
  - [ ] Service worker cache settings
  - [ ] Security headers
  - [ ] Rewrite rules for SPA routing
- [ ] Build command configured: `npm run build`
- [ ] Output directory set: `dist`

### Testing Checklist
- [ ] Landing page loads and renders
- [ ] Navigation between all routes works
- [ ] Menu system fully functional
- [ ] World selection interactive
- [ ] Atmosphere animations smooth (60fps)
- [ ] Audio triggers working (if enabled)
- [ ] Particle systems rendering correctly
- [ ] No memory leaks on extended play
- [ ] Mobile touch interactions responsive

### Performance Optimization
- [ ] Images optimized (SVG preferred)
- [ ] CSS animations use GPU acceleration
- [ ] JavaScript debounced/throttled appropriately
- [ ] Lazy loading implemented for routes
- [ ] Web fonts optimized (system fonts preferred)
- [ ] Canvas rendering efficient

### Final Checks
- [ ] Dry run deployment successful (`npm run deploy:dry-run`)
- [ ] Visual inspection looks premium and polished
- [ ] All text formatting correct (no typos)
- [ ] Animations smooth and intentional
- [ ] Transitions feel cinematic
- [ ] User experience feels unforgettable

## Deployment to Vercel

### Pre-Deployment
```bash
# Run all checks
npm run type-check
npm run lint
npm run deploy:dry-run

# Review bundle analysis
open dist/bundle-report.html
```

### Deploy
```bash
# One-time: Link to Vercel
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Or use: npm run deploy
```

### Post-Deployment
- [ ] Production URL loads without errors
- [ ] All routes accessible
- [ ] Performance metrics checked in production
- [ ] Google Analytics tracking working
- [ ] Error boundaries tested
- [ ] Service worker installed and caching
- [ ] Share on social media

## Performance Optimization Targets

### Bundle Size
- HTML: < 3KB
- JS (gzipped): < 80KB
- CSS (gzipped): < 10KB
- Total: < 150KB gzipped

### Runtime Performance
- First Paint: < 500ms
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Smooth 60fps interactions

### Mobile Performance
- 4G load: < 3s for interactive
- Touch response: < 100ms
- Smooth scrolling: 60fps
- Battery efficient

## Rollback Plan

If deployment has issues:
```bash
# Revert to previous version
vercel rollback

# Or redeploy from git
git revert <commit-hash>
vercel --prod
```

## Monitoring Post-Launch

### Daily Checks
- [ ] No errors in analytics
- [ ] Performance metrics stable
- [ ] User session times reasonable
- [ ] No crashes reported

### Weekly Checks
- [ ] Analytics trends analyzed
- [ ] Performance baseline maintained
- [ ] User feedback reviewed
- [ ] Error logs reviewed

### Ongoing
- [ ] Lighthouse scores maintained >= 90
- [ ] Security headers verified
- [ ] Dependencies kept updated
- [ ] PWA functionality maintained
