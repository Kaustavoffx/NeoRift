import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SuspenseFallback } from './components/SuspenseFallback'
import { getAnalytics } from './lib/analytics'
import './App.css'

const LandingRoute = lazy(() => import('./routes/LandingRoute'))
const MenuSystemRoute = lazy(() => import('./routes/MenuSystemRoute'))
const PlayRoute = lazy(() => import('./routes/PlayRoute'))
const LeaderboardRoute = lazy(() => import('./routes/LeaderboardRoute'))
const NotFoundRoute = lazy(() => import('./routes/NotFoundRoute'))

function App() {
  useEffect(() => {
    // Initialize analytics
    const analytics = getAnalytics()
    analytics.trackPageView('HARDCODED STACKS', window.location.pathname)

    // Track route changes
    const handleRouteChange = () => {
      analytics.trackPageView('HARDCODED STACKS', window.location.pathname)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-shell">
          <header className="app-shell__bar">
            <NavLink className="app-brand" to="/">
              HARDCODED STACKS
            </NavLink>

            <nav className="app-nav" aria-label="Primary">
              <NavLink to="/">landing</NavLink>
              <NavLink to="/menus">menus</NavLink>
              <NavLink to="/play">play</NavLink>
              <NavLink to="/leaderboard">leaderboard</NavLink>
            </nav>
          </header>

          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<LandingRoute />} />
              <Route path="/menus" element={<MenuSystemRoute />} />
              <Route path="/play" element={<PlayRoute />} />
              <Route path="/leaderboard" element={<LeaderboardRoute />} />
              <Route path="*" element={<NotFoundRoute />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
