type LeaderboardEntry = {
  name: string
  score: number
  updatedAt: string
}

const fallbackEntries: LeaderboardEntry[] = [
  { name: 'Mira', score: 1240, updatedAt: new Date().toISOString() },
  { name: 'Atlas', score: 980, updatedAt: new Date().toISOString() },
  { name: 'Nova', score: 840, updatedAt: new Date().toISOString() },
]

const json = (payload: unknown, init: ResponseInit = {}) =>
  Response.json(payload, {
    headers: {
      'Cache-Control': 'no-store',
      ...init.headers,
    },
    ...init,
  })

async function proxyToBackend(request: Request) {
  const backendUrl = process.env.LEADERBOARD_BACKEND_URL

  if (!backendUrl) {
    return null
  }

  const url = new URL(request.url)
  const upstream = new URL(backendUrl)
  upstream.search = url.search

  const init: RequestInit = {
    method: request.method,
    headers: {
      'content-type': request.headers.get('content-type') ?? 'application/json',
      authorization: process.env.LEADERBOARD_BACKEND_TOKEN
        ? `Bearer ${process.env.LEADERBOARD_BACKEND_TOKEN}`
        : '',
    },
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text()
  }

  const response = await fetch(upstream, init)

  return new Response(response.body, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  })
}

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    })
  }

  const proxied = await proxyToBackend(request)

  if (proxied) {
    return proxied
  }

  if (request.method === 'POST') {
    const body = (await request.json().catch(() => null)) as { name?: string; score?: number } | null
    const name = body?.name?.trim().slice(0, 24) || 'Pilot'
    const score = Number.isFinite(body?.score) ? Math.max(0, Number(body?.score)) : 0

    return json({
      ok: true,
      entry: {
        name,
        score,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  return json({
    ok: true,
    entries: fallbackEntries,
    architecture: 'edge-compatible proxy with external backend support',
  })
}