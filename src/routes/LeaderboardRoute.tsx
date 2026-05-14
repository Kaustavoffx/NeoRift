import { useEffect, useState } from 'react'
import { loadLeaderboard, submitLeaderboardScore, type LeaderboardEntry } from '../lib/leaderboard'

export default function LeaderboardRoute() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [name, setName] = useState('Pilot')
  const [score, setScore] = useState(720)
  const [status, setStatus] = useState('ready to sync')

  const refresh = async () => {
    try {
      setStatus('syncing edge leaderboard')
      setEntries(await loadLeaderboard())
      setStatus('synced')
    } catch {
      setStatus('using local fallback feed')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await refresh()
    }
    loadData().catch(() => {
      // Error handled in refresh function
    })
  }, [])

  return (
    <main className="leaderboard-shell">
      <section className="leaderboard-panel">
        <div className="leaderboard-meta">
          <p className="eyebrow">serverless-ready scoreboard</p>
          <p className="microcopy">manual sync, flexible backend, no corporate gloss</p>
        </div>
        <h1>leaderboard</h1>
        <p className="landing-copy">
          The API can proxy to any external backend through environment variables, which
          keeps the deployment edge-compatible while leaving the storage layer flexible.
        </p>

        <form
          className="leaderboard-form"
          onSubmit={async (event) => {
            event.preventDefault()

            try {
              setStatus('submitting score')
              const entry = await submitLeaderboardScore({ name, score })
              setEntries((current) => [entry, ...current].slice(0, 10))
              setStatus('score posted')
            } catch {
              setStatus('submission failed')
            }
          }}
        >
          <label>
            pilot name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={24} />
          </label>
          <label>
            score
            <input
              type="number"
              min={0}
              value={score}
              onChange={(event) => setScore(Number(event.target.value))}
            />
          </label>
          <button type="submit" className="primary-button">
            submit score
          </button>
        </form>

        <div className="leaderboard-statusline">
          <p className="microcopy">{status}</p>
          <span className="status-chip">top 10 live feed</span>
        </div>

        <div className="leaderboard-list">
          {entries.map((entry, index) => (
            <article className="leaderboard-row" key={`${entry.name}-${index}`}>
              <strong>
                #{String(index + 1).padStart(2, '0')} {entry.name}
              </strong>
              <span>{entry.score}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}