import { readFile } from "node:fs/promises"
import path from "node:path"
import { cacheLife } from "next/cache"
import type {
  AdapterResult,
  ClubEvent,
  ClubOverview,
  Leader,
  MatchResult,
  Player,
} from "@/lib/eafc/types"

/**
 * Club data boundary.
 *
 * Pages call the exported getters only. Those getters are cached for five
 * minutes (`cacheLife("eafc")` in next.config.ts). Today `readClubFile`
 * loads /data/*.json. To point the site at a live EA FC feed, replace the
 * body of `readClubFile` and leave the getters, pages, and cache as they are.
 */

const DATA_DIR = path.join(process.cwd(), "data")

type Snapshot<T> = {
  data: T
  lastUpdated: string
}

type ClubFile = {
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
  twitch: string
  socials: { label: string; href: string }[]
}

type ResultFile = {
  id: string
  playedAt: string
  opponent: string
  home: boolean
  goalsFor: number
  goalsAgainst: number
  competition: string
}

type EventFile = {
  id: string
  title: string
  type: string
  startsAt: string
}

async function readClubFile<T>(file: string): Promise<T> {
  // Live swap (not called today):
  // const response = await fetch(`${process.env.EAFC_API_BASE}/${file}`)
  // if (!response.ok) throw new Error(`EA FC ${file} failed: ${response.status}`)
  // return response.json() as Promise<T>
  const raw = await readFile(path.join(DATA_DIR, file), "utf8")
  return JSON.parse(raw) as T
}

function stamp<T>(data: T): Snapshot<T> {
  return { data, lastUpdated: new Date().toISOString() }
}

const freshAt = new Map<string, string>()

function withSource<T>(key: string, snapshot: Snapshot<T>): AdapterResult<T> {
  const source = freshAt.get(key) === snapshot.lastUpdated ? "cached" : "live"
  freshAt.set(key, snapshot.lastUpdated)
  return { ...snapshot, source }
}

function pickLeader(players: Player[], stat: "goals" | "assists"): Leader {
  const leader = players.reduce((best, player) => {
    if (player[stat] !== best[stat]) return player[stat] > best[stat] ? player : best
    if (player.appearances !== best.appearances) {
      return player.appearances > best.appearances ? player : best
    }
    return player.gamertag.localeCompare(best.gamertag) < 0 ? player : best
  })

  return {
    id: leader.id,
    gamertag: leader.gamertag,
    position: leader.position,
    number: leader.number,
    value: leader[stat],
  }
}

function pickNextEvent(events: EventFile[], now: number): ClubEvent | null {
  const upcoming = events
    .filter((event) => Date.parse(event.startsAt) > now)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))

  const next = upcoming[0]
  if (!next) return null

  return {
    id: next.id,
    title: next.title,
    type: next.type,
    startsAt: next.startsAt,
  }
}

async function loadClubOverview(): Promise<Snapshot<ClubOverview>> {
  "use cache"
  cacheLife("eafc")

  const [club, squad, events] = await Promise.all([
    readClubFile<ClubFile>("club.json"),
    readClubFile<Player[]>("squad.json"),
    readClubFile<EventFile[]>("events.json"),
  ])

  const played = club.played
  const overview: ClubOverview = {
    status: club.status,
    league: club.league,
    season: club.season,
    position: club.position,
    played,
    wins: club.wins,
    draws: club.draws,
    losses: club.losses,
    goalsFor: club.goalsFor,
    goalsAgainst: club.goalsAgainst,
    winRate: played === 0 ? 0 : Math.round((club.wins / played) * 100),
    twitch: club.twitch,
    socials: club.socials,
    topScorer: pickLeader(squad, "goals"),
    topAssister: pickLeader(squad, "assists"),
    nextEvent: pickNextEvent(events, Date.now()),
  }

  return stamp(overview)
}

async function loadRecentResults(): Promise<Snapshot<MatchResult[]>> {
  "use cache"
  cacheLife("eafc")

  const results = await readClubFile<ResultFile[]>("results.json")
  const recent = results
    .slice()
    .sort((a, b) => Date.parse(b.playedAt) - Date.parse(a.playedAt))
    .slice(0, 5)
    .map((match) => {
      const outcome =
        match.goalsFor > match.goalsAgainst
          ? "W"
          : match.goalsFor < match.goalsAgainst
            ? "L"
            : "D"

      return {
        id: match.id,
        playedAt: match.playedAt,
        opponent: match.opponent,
        venue: match.home ? "Home" : "Away",
        goalsFor: match.goalsFor,
        goalsAgainst: match.goalsAgainst,
        competition: match.competition,
        outcome,
      } satisfies MatchResult
    })

  return stamp(recent)
}

async function loadSquad(): Promise<Snapshot<Player[]>> {
  "use cache"
  cacheLife("eafc")

  const squad = await readClubFile<Player[]>("squad.json")
  const ordered = squad.slice().sort((a, b) => a.number - b.number)
  return stamp(ordered)
}

export async function getClubOverview(): Promise<AdapterResult<ClubOverview>> {
  return withSource("overview", await loadClubOverview())
}

export async function getRecentResults(): Promise<AdapterResult<MatchResult[]>> {
  return withSource("results", await loadRecentResults())
}

export async function getSquad(): Promise<AdapterResult<Player[]>> {
  return withSource("squad", await loadSquad())
}

export async function getPlayer(id: string): Promise<AdapterResult<Player | null>> {
  const squad = await getSquad()
  return {
    data: squad.data.find((player) => player.id === id) ?? null,
    lastUpdated: squad.lastUpdated,
    source: squad.source,
  }
}
