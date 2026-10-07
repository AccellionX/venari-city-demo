export type DataSource = "live" | "cached"

export type AdapterResult<T> = {
  data: T
  lastUpdated: string
  source: DataSource
}

export type Position = "GK" | "DEF" | "MID" | "ATT"

export type Player = {
  id: string
  number: number
  gamertag: string
  position: Position
  appearances: number
  goals: number
  assists: number
  memberSince: string
  ratings: number[]
}

export type ClubOverview = {
  status: "online" | "offline"
  league: string
  season: string
  position: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  winRate: number
  twitch: string
  socials: { label: string; href: string }[]
  topScorer: Leader
  topAssister: Leader
  nextEvent: ClubEvent | null
}

export type Leader = {
  id: string
  gamertag: string
  position: Position
  number: number
  value: number
}

export type ClubEvent = {
  id: string
  title: string
  type: string
  startsAt: string
}

export type MatchResult = {
  id: string
  playedAt: string
  opponent: string
  venue: "Home" | "Away"
  goalsFor: number
  goalsAgainst: number
  competition: string
  outcome: "W" | "D" | "L"
}

export function pickSync(
  snapshots: Pick<AdapterResult<unknown>, "lastUpdated" | "source">[],
): { lastUpdated: string; source: DataSource } {
  const lastUpdated = snapshots.reduce(
    (oldest, item) =>
      Date.parse(item.lastUpdated) < Date.parse(oldest) ? item.lastUpdated : oldest,
    snapshots[0]?.lastUpdated ?? new Date(0).toISOString(),
  )

  return {
    lastUpdated,
    source: snapshots.some((item) => item.source === "cached") ? "cached" : "live",
  }
}
