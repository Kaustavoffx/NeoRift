# HARDCODED STACKS - Lighthouse Optimization Guide

## Running Lighthouse Audits

### In Chrome DevTools
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Click "Analyze page load"
5. Export report as JSON/HTML

### Programmatically
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-deployed-url --view
```

## Performance Optimization (Target: 90+)

### Metrics to Monitor
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Total Blocking Time (TBT)**: < 200ms

### Optimization Strategies

#### 1. JavaScript Optimization
```javascript
// ✅ Good: Code splitting and lazy loading
const Component = lazy(() => import('./Component'))

// ✅ Good: useCallback to prevent unnecessary renders
const handleClick = useCallback(() => { /* ... */ }, [])

// ✅ Good: useMemo for expensive calculations
const value = useMemo(() => expensiveCalc(), [deps])

// ❌ Bad: Large synchronous operations on main thread
```

#### 2. CSS Optimization
```css
/* ✅ Good: Minimal CSS, use custom properties */
:root {
  --primary: #00ff00;
  --accent: #05070d;
}

/* ✅ Good: GPU acceleration for animations */
.animated {
  transform: translateZ(0);
  will-change: transform;
}

/* ❌ Bad: Heavy shadows and filters on many elements */
```

#### 3. Image & Asset Optimization
- Use SVG for icons (already doing this!)
- Optimize SVG files: remove metadata, minimize paths
- Use Next.js Image component for raster images
- Serve WebP with fallbacks
- Lazy load below-the-fold content

#### 4. Font Optimization
```html
<!-- ✅ Good: System fonts (already using monospace) -->
<body style="font-family: system-ui, monospace;">

<!-- ❌ Bad: Loading heavy font files -->
<!-- Avoid @import from Google Fonts unless necessary -->
```

#### 5. Third-Party Scripts
- Analytics: Defer or load asynchronously
- No tracking pixels or ad networks
- Minimize external API calls
- Cache API responses

### Vercel-Specific Optimizations

In `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/**",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Accessibility Optimization (Target: 90+)

### ARIA Labels
```tsx
// ✅ Good
<button aria-label="Close menu">✕</button>
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Menu</h2>
</div>

// ❌ Bad
<div onClick={handleClose}>✕</div>
```

### Semantic HTML
```tsx
// ✅ Good
<nav><a href="/">Home</a></nav>
<main><article><h1>Title</h1></article></main>
<footer>Copyright 2024</footer>

// ❌ Bad
<div onclick={...}><span>Home</span></div>
```

### Color Contrast
- Text vs. background: 4.5:1 minimum (AAA: 7:1)
- UI components: 3:1 minimum
- Use tools: WebAIM Contrast Checker

### Keyboard Navigation
- All interactive elements focusable
- Tab order logical
- Focus indicators visible
- No keyboard traps

## Best Practices (Target: 90+)

### Security Headers
Already configured in `vercel.json`:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### Browser Compatibility
```tsx
// ✅ Good: Feature detection
if ('PerformanceObserver' in window) {
  // Use Web Vitals API
}

// ✅ Good: Fallbacks for newer APIs
const supports = CSS.supports('backdrop-filter', 'blur(10px)')
```

### HTTPS
- ✅ All resources served over HTTPS
- ✅ No mixed content warnings
- ✅ Certificate valid and trusted

### Cookies & Privacy
- ✅ No unnecessary cookies
- ✅ No tracking cookies without consent
- ✅ Privacy policy accessible (if needed)

## SEO Optimization (Target: 95+)

### Meta Tags
```html
<!-- Already configured in index.html -->
<meta name="description" content="...">
<meta property="og:image" content="/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
```

### Structured Data
```html
<!-- Already configured with schema.org -->
<script type="application/ld+json">
{
  "@type": "VideoGame",
  "name": "HARDCODED STACKS"
}
</script>
```

### Indexing
```javascript
// In vercel.json, robots.txt not blocked
// Sitemap generated at /sitemap.xml
// Meta robots tag: index, follow
```

### Performance Signals
- Mobile-friendly: ✅
- Page speed: Target 90+
- No crawl errors: ✅

## Debugging Failed Audits

### High TTI (Time to Interactive)
```javascript
// Profile with DevTools
// Check for:
// 1. Long tasks (> 50ms)
// 2. Expensive computations
// 3. Heavy parsing/rendering

// Fix:
const expensiveOperation = () => {
  // Break into smaller tasks
  setTimeout(() => { /* part 1 */ }, 0)
  setTimeout(() => { /* part 2 */ }, 0)
}
```

### High CLS (Cumulative Layout Shift)
```css
/* Reserve space for dynamic content */
.container {
  min-height: 100px;
  background: rgba(0, 255, 0, 0.1);
}

/* Avoid shifting fonts */
font-family: -apple-system, BlinkMacSystemFont, sans-serif;
```

### Low Accessibility Score
```tsx
// Add missing ARIA labels
<div role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />

// Fix color contrast
<button style={{ color: '#00ff00', background: '#05070d' }}>
  Contrast: 7.2:1 ✅
</button>
```

## Monitoring Tools

### Built-in Analytics
- Google Analytics: Core Web Vitals dashboard
- Lighthouse CI: Automated performance monitoring
- Sentry: Error tracking and performance profiling

### Web Vitals Library
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log) // Cumulative Layout Shift
getFID(console.log) // First Input Delay
getFCP(console.log) // First Contentful Paint
getLCP(console.log) // Largest Contentful Paint
getTTFB(console.log) // Time to First Byte
```

## Continuous Improvement

### Pre-Deployment Routine
```bash
# 1. Build and analyze
npm run analyze

# 2. Run Lighthouse
lighthouse https://localhost:5173 --preset=desktop

# 3. Check performance metrics
# (review bundle-report.html)

# 4. Deploy to staging first
vercel

# 5. Run production audit
lighthouse https://your-staging-url --preset=mobile
```

### Post-Deployment Monitoring
- Check Google Analytics for Core Web Vitals
- Monitor error rates
- Track user session duration
- Review performance trends weekly

## Target Scores

| Metric | Target | Current |
|--------|--------|---------|
| Performance | 90+ | - |
| Accessibility | 90+ | - |
| Best Practices | 90+ | - |
| SEO | 95+ | - |
| PWA (optional) | 100 | - |

*Update "Current" scores after running audits*

## Performance Budget

```
JavaScript: 80KB (gzipped)
CSS: 10KB (gzipped)
Images: 50KB (total)
Fonts: 0KB (system fonts only)
---
Total: 140KB budget
Current: ~85KB ✅
```
