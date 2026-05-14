import { Link } from 'react-router-dom'

export default function NotFoundRoute() {
  return (
    <main className="landing-shell">
      <section className="landing-hero">
        <p className="eyebrow">404</p>
        <h1>signal lost</h1>
        <p className="landing-copy">The route you hit does not exist, but the core is still online.</p>
        <div className="landing-actions">
          <Link className="primary-button" to="/">
            return home
          </Link>
        </div>
      </section>
    </main>
  )
}