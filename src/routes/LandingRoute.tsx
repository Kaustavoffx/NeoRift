import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LandingParticles from '../components/LandingParticles'
import '../styles/landing.css'

const bullets = [
  'Vite tuned for tiny cold-starts',
  'Route-based lazy worlds',
  'PWA shell • offline-first assets',
  'Edge-friendly leaderboard API',
]

export default function LandingRoute() {
  const [secretVisible, setSecretVisible] = useState(false)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '`') setSecretVisible((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main className="landing-shell cinematic">
      <div className="overlay-noise" aria-hidden />
      <div className="chrom-aber" aria-hidden />

      <LandingParticles />

      <section className="landing-hero">
        <div className="hero-frame brutalist">
          <div className="topbar">
            <div className="brand handwritten">neo • rift</div>
            <div className="meta terminal small">built late at night • v0.9-alpha</div>
          </div>

          <p className="eyebrow handwritten">high-energy indie build • obsessive prototype</p>
          <h1 className="title glitch" data-text="NEO RIFT">NEO RIFT</h1>
          <p className="landing-copy">
            A legendary student passion project—hand-sketched systems, late-night fixes,
            and a stubborn belief that small experiments become worlds.
          </p>

          <div className="landing-actions">
            <Link className="primary-button rusty" to="/menus">ENTER MENUS</Link>
            <Link className="secondary-button" to="/leaderboard">DEV-LOG</Link>
          </div>

          <div className={`boot-sequence ${booted ? 'ready' : ''}`} aria-hidden>
            <code className="term-line">booting: kernel patched • shaders warm</code>
            <code className="term-line">init: audio context — deferred</code>
            <code className="term-line">net: offline-first sw registered</code>
          </div>

          <div className="handwritten-note" aria-hidden>
            <div className="note">prototype sketch — try the hidden corners</div>
          </div>

          <button
            className="secret-button"
            onClick={() => setSecretVisible((s) => !s)}
            aria-label="toggle creator note"
          >
            ≋
          </button>

          <div className={`secret-snippet ${secretVisible ? 'visible' : ''}`}>
            <pre>
{`// creator: if you read this, thank you.
// late-night commits: the real engine.
// reach out: hello@neo.example
`}
            </pre>
          </div>
        </div>
      </section>

      <section className="landing-grid" aria-label="developer notes">
        <aside className="dev-log">
          <h3>dev-log</h3>
          <ul>
            <li><strong>2026-05-12</strong> — particles prototype, low-overhead shaders</li>
            <li><strong>2026-05-05</strong> — PWA + route-splitting experiments</li>
            <li><strong>2026-04-20</strong> — audio-first prototyping</li>
          </ul>
        </aside>

        {bullets.map((b) => (
          <article className="landing-card" key={b}>
            <span className="panel-label handwritten small">note</span>
            <p>{b}</p>
          </article>
        ))}
      </section>

      <footer className="landing-foot">
        <div className="terminal mini">
          <span className="cmd">~$</span>
          <span className="out"> last build: ephemeral • size: ~tiny</span>
        </div>
      </footer>
    </main>
  )
}