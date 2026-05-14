export type LeaderboardEntry = {
  name: string
  score: number
  updatedAt: string
}

type LeaderboardResponse = {
  ok: boolean
  entries: LeaderboardEntry[]
}

const endpoint = import.meta.env.VITE_LEADERBOARD_ENDPOINT ?? '/api/leaderboard'

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error('Unable to load leaderboard')
  }

  const data = (await response.json()) as Partial<LeaderboardResponse>

  return Array.isArray(data.entries) ? data.entries : []
}

export async function submitLeaderboardScore(payload: {
  name: string
  score: number
}): Promise<LeaderboardEntry> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Unable to submit leaderboard score')
  }

  const data = (await response.json()) as { entry?: LeaderboardEntry }

  if (!data.entry) {
    throw new Error('Leaderboard response missing entry')
  }

  return data.entry
}