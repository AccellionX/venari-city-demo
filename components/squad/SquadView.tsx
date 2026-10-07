"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { Player, Position } from "@/lib/eafc/types"

const positions: Array<"ALL" | Position> = ["ALL", "GK", "DEF", "MID", "ATT"]

const sorts = [
  { id: "appearances", label: "Apps" },
  { id: "goals", label: "Goals" },
  { id: "assists", label: "Assists" },
] as const

type SortKey = (typeof sorts)[number]["id"]

export function SquadView({ players }: { players: Player[] }) {
  const [position, setPosition] = useState<(typeof positions)[number]>("ALL")
  const [sort, setSort] = useState<SortKey>("appearances")

  const visible = useMemo(() => {
    return players
      .filter((player) => position === "ALL" || player.position === position)
      .slice()
      .sort((a, b) => b[sort] - a[sort] || a.number - b.number)
  }, [players, position, sort])

  return (
    <div className="mx-auto max-w-[1120px] px-5 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Pro Clubs</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-6xl uppercase leading-none tracking-wide sm:text-7xl">Squad</h1>
        <p className="text-sm uppercase tracking-[0.16em] text-muted">
          {visible.length} {visible.length === 1 ? "player" : "players"}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by position">
          {positions.map((item) => {
            const selected = item === position
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => setPosition(item)}
                className={`px-3 py-1.5 font-display text-lg uppercase tracking-[0.12em] transition-colors ${
                  selected ? "bg-accent text-club" : "text-muted hover:text-ink"
                }`}
              >
                {item === "ALL" ? "All" : item}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Sort squad">
          <span className="mr-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted">Sort</span>
          {sorts.map((item) => {
            const selected = item.id === sort
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setSort(item.id)}
                className={`px-3 py-1.5 font-display text-lg uppercase tracking-[0.12em] transition-colors ${
                  selected ? "bg-accent text-club" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-muted">No players in this group.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((player) => (
            <li key={player.id} className="min-w-0">
              <Link
                href={`/squad/${player.id}`}
                className="flex h-full flex-col border border-line bg-white/[0.03] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-accent"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-5xl leading-none text-accent tabular-nums">
                    {player.number}
                  </span>
                  <span className="border border-line px-2 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                    {player.position}
                  </span>
                </span>
                <span className="mt-6 truncate font-display text-3xl uppercase leading-none tracking-wide">
                  {player.gamertag}
                </span>
                <span className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-sm">
                  <Stat label="Apps" value={player.appearances} />
                  <Stat label="Goals" value={player.goals} />
                  <Stat label="Assists" value={player.assists} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <span className="block font-display text-2xl leading-none tabular-nums">{value}</span>
      <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.14em] text-muted">{label}</span>
    </span>
  )
}
