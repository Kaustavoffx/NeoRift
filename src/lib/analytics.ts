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

interface GTagFunction {
  (command: string, action: string, config: Record<string, unknown>): void
}

interface WindowWithGtag extends Window {
  dataLayer?: unknown[]
  gtag?: GTagFunction
  __HARDCODED_STACKS__?: { analytics?: Analytics }
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

  private initializeGoogleAnalytics(): void {
    if (!this.gaId) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`
    document.head.appendChild(script)

    const windowData = window as WindowWithGtag
    const dataLayer: unknown[] = windowData.dataLayer || []
    windowData.dataLayer = dataLayer

    const gtag: GTagFunction = (command: string, action: string, config: Record<string, unknown>) => {
      dataLayer.push({ command, action, ...config })
    }

    windowData.gtag = gtag
    gtag('js', '', { timestamp: new Date().toISOString() })
    gtag('config', this.gaId || '', {
      page_path: window.location.pathname,
      page_title: document.title,
    })
  }

  /**
   * Track custom event
   */
  trackEvent(category: string, action: string, label?: string, value?: number): void {
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
    const windowData = window as WindowWithGtag
    if (windowData.gtag) {
      windowData.gtag('event', action, {
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
  trackPageView(title: string, path: string): void {
    this.trackEvent('navigation', 'pageview', path)

    const windowData = window as WindowWithGtag
    if (windowData.gtag) {
      windowData.gtag('config', this.gaId || '', {
        page_path: path,
        page_title: title,
      })
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(target: string, action: string, metadata?: Record<string, unknown>): void {
    this.trackEvent('interaction', action, target)

    const windowData = window as WindowWithGtag
    if (metadata && windowData.gtag) {
      windowData.gtag('event', 'interaction', {
        interaction_target: target,
        interaction_action: action,
        ...metadata,
      })
    }
  }

  /**
   * Track error event
   */
  trackError(error: Error, info?: React.ErrorInfo | Record<string, unknown>): void {
    this.trackEvent('error', 'exception', error.message)

    const windowData = window as WindowWithGtag
    if (windowData.gtag) {
      windowData.gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      })
    }

    console.error('[Analytics] Error tracked:', error, info)
  }

  /**
   * Track performance metrics using Web Vitals API
   */
  private captureWebVitals(): void {
    // Capture Core Web Vitals using PerformanceObserver
    if ('PerformanceObserver' in window) {
      try {
        // Measure Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          const entries = 'getEntries' in list ? list.getEntries() : (list as unknown as { entries: PerformanceEntry[] }).entries
          for (const entry of entries) {
            const layoutEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
            if (layoutEntry.hadRecentInput) continue
            const cls = layoutEntry.value || 0
            this.trackEvent('performance', 'cls', undefined, cls)
          }
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true })

        // Measure Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = 'getEntries' in list ? list.getEntries() : (list as unknown as { entries: PerformanceEntry[] }).entries
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
          const lcp = (lastEntry?.renderTime || lastEntry?.loadTime || 0) as number
          this.trackEvent('performance', 'lcp', undefined, lcp)
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

        // Measure First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = 'getEntries' in list ? list.getEntries() : (list as unknown as { entries: PerformanceEntry[] }).entries
          for (const entry of entries) {
            const fidEntry = entry as PerformanceEntry & { processingDuration?: number }
            const fid = fidEntry.processingDuration || 0
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
  sendSessionData(): void {
    if (!this.enabled) return

    const sessionDuration = this.getSessionDuration()
    this.trackEvent('session', 'end', undefined, sessionDuration)

    const windowData = window as WindowWithGtag
    if (windowData.gtag) {
      windowData.gtag('event', 'session_end', {
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
  const windowData = window as WindowWithGtag
  windowData.__HARDCODED_STACKS__ = windowData.__HARDCODED_STACKS__ || {}
  windowData.__HARDCODED_STACKS__.analytics = getAnalytics()
}

export type { AnalyticsEvent, PerformanceMetrics }
