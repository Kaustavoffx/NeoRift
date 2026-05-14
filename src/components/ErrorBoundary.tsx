import React from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in development, send to analytics in production
    console.error('Error caught by boundary:', error, info)
    
    if (typeof window !== 'undefined' && window.__HARDCODED_STACKS__?.analytics) {
      window.__HARDCODED_STACKS__.analytics.trackError(error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'radial-gradient(circle, #1a1a2e 0%, #05070d 100%)',
            fontFamily: 'monospace',
            color: '#00ff00',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div>
              <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
                ◆ STACK CORRUPTION DETECTED ◆
              </h1>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                The game layer encountered an error and cannot continue.
              </p>
              <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '10px' }}>
                {this.state.error?.message || 'Unknown error'}
              </p>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  marginTop: '30px',
                  padding: '12px 24px',
                  background: '#00ff00',
                  color: '#05070d',
                  border: '2px solid #00ff00',
                  borderRadius: '2px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#05070d'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#00ff00'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#00ff00'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#05070d'
                }}
              >
                RESTART PROTOCOL
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// Type augmentation for global analytics
declare global {
  interface Window {
    __HARDCODED_STACKS__?: {
      analytics?: {
        trackError: (error: Error, info: React.ErrorInfo) => void
      }
    }
  }
}
