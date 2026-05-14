/**
 * Analytics Integration for HARDCODED STACKS
 * Tracks user interactions, errors, and performance metrics
 */

interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
  timestamp: number
}

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  cls?: number // Cumulative Layout Shift
  fid?: number // First Input Delay
  ttfb?: number // Time to First Byte
}

class Analytics {
  private enabled: boolean
  private gaId: string | null
  private events: AnalyticsEvent[] = []
  private sessionStart: number

  constructor() {
    this.enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
    this.gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || null
    this.sessionStart = Date.now()

    if (this.enabled && this.gaId) {
      this.initializeGoogleAnalytics()
    }

    // Track performance metrics
    this.captureWebVitals()
  }

  private initializeGoogleAnalytics() {
    if (!this.gaId) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`
    document.head.appendChild(script)

    const dataLayer = ((window as any).dataLayer || []) as Array<Record<string, unknown>>
    ;(window as any).dataLayer = dataLayer

    const gtag = function (...args: unknown[]) {
      dataLayer.push(...(args as Array<Record<string, unknown>>))
    }

    ;(window as any).gtag = gtag
    ;(window as any).gtag('js', new Date())
    ;(window as any).gtag('config', this.gaId, {
      page_path: window.location.pathname,
      page_title: document.title,
    })
  }

  /**
   * Track custom event
   */
  trackEvent(category: string, action: string, label?: string, value?: number) {
    if (!this.enabled) return

    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
    }

    this.events.push(event)

    // Send to Google Analytics if available
    if ((window as any).gtag) {
      ;(window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }

    console.debug('[Analytics]', event)
  }

  /**
   * Track page view
   */
  trackPageView(title: string, path: string) {
    this.trackEvent('navigation', 'pageview', path)

    if ((window as any).gtag) {
      ;(window as any).gtag('config', this.gaId, {
        page_path: path,
        page_title: title,
      })
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(target: string, action: string, metadata?: Record<string, unknown>) {
    this.trackEvent('interaction', action, target)

    const gtag = (window as any).gtag as Function | undefined
    if (metadata && gtag) {
      gtag('event', 'interaction', {
        interaction_target: target,
        interaction_action: action,
        ...metadata,
      })
    }
  }

  /**
   * Track error event
   */
  trackError(error: Error, info?: React.ErrorInfo | Record<string, unknown>) {
    this.trackEvent('error', 'exception', error.message)

    const gtag = (window as any).gtag as Function | undefined
    if (gtag) {
      gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      })
    }

    console.error('[Analytics] Error tracked:', error, info)
  }

  /**
   * Track performance metrics using Web Vitals API
   */
  private captureWebVitals() {
    // Capture Core Web Vitals using PerformanceObserver
    if ('PerformanceObserver' in window) {
      try {
        // Measure Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue
            const cls = (entry as any).value
            this.trackEvent('performance', 'cls', undefined, cls)
          }
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true })

        // Measure Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          const lcp = (lastEntry as any).renderTime || (lastEntry as any).loadTime
          this.trackEvent('performance', 'lcp', undefined, lcp)
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

        // Measure First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = (entry as any).processingDuration
            this.trackEvent('performance', 'fid', undefined, fid)
          }
        })
        fidObserver.observe({ type: 'first-input', buffered: true })
      } catch (e) {
        console.warn('[Analytics] Web Vitals capture failed:', e)
      }
    }

    // Capture navigation timing
    window.addEventListener('load', () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing
        const ttfb = timing.responseStart - timing.navigationStart
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart
        const domInteractiveTime = timing.domInteractive - timing.navigationStart

        this.trackEvent('performance', 'ttfb', undefined, ttfb)
        this.trackEvent('performance', 'page_load', undefined, pageLoadTime)
        this.trackEvent('performance', 'dom_interactive', undefined, domInteractiveTime)
      }
    })
  }

  /**
   * Get session duration
   */
  getSessionDuration(): number {
    return Date.now() - this.sessionStart
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  /**
   * Send session data (e.g., on page unload)
   */
  sendSessionData() {
    if (!this.enabled) return

    const sessionDuration = this.getSessionDuration()
    this.trackEvent('session', 'end', undefined, sessionDuration)

    if ((window as any).gtag) {
      ;(window as any).gtag('event', 'session_end', {
        session_duration: sessionDuration,
        event_count: this.events.length,
      })
    }
  }
}

// Singleton instance
let analyticsInstance: Analytics | null = null

export const getAnalytics = (): Analytics => {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics()
    
    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      analyticsInstance?.sendSessionData()
    })
  }
  return analyticsInstance
}

// Make available globally for error boundary
if (typeof window !== 'undefined') {
  ;(window as any).__HARDCODED_STACKS__ = (window as any).__HARDCODED_STACKS__ || {}
  ;(window as any).__HARDCODED_STACKS__.analytics = getAnalytics()
}

export type { AnalyticsEvent, PerformanceMetrics }

interface WindowWithGtag extends Window {
  dataLayer?: unknown[]
  gtag?: (command: string, ...args: unknown[]) => void
  __HARDCODED_STACKS__?: { analytics?: Analytics }
}

class Analytics {
