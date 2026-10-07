import type { DataSource } from "@/lib/eafc/types"

/** A response newer than this was just read, so the badge can say "live". */
const LIVE_WINDOW_MS = 2000

export function sourceFor(lastUpdated: string, now = Date.now()): DataSource {
  const ageMs = now - Date.parse(lastUpdated)
  return ageMs < LIVE_WINDOW_MS ? "live" : "cached"
}

export function syncedLabel(lastUpdated: string, now = Date.now()): string {
  const minutes = Math.floor((now - Date.parse(lastUpdated)) / 60_000)
  if (minutes <= 0) return "just now"
  if (minutes === 1) return "1 min ago"
  return `${minutes} min ago`
}
