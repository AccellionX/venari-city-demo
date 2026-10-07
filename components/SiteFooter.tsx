"use client"

import { useEffect, useState } from "react"
import { useClub } from "@/components/ClubProvider"
import { sourceFor, syncedLabel } from "@/lib/eafc/freshness"
import type { DataSource } from "@/lib/eafc/types"

export function SiteFooter({ lastUpdated }: { lastUpdated: string }) {
  const { club } = useClub()
  const [sync, setSync] = useState<{ label: string; source: DataSource } | null>(null)

  useEffect(() => {
    const update = () => {
      setSync({
        label: syncedLabel(lastUpdated),
        source: sourceFor(lastUpdated),
      })
    }

    update()
    const id = window.setInterval(update, 15_000)
    return () => window.clearInterval(id)
  }, [lastUpdated])

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="font-display text-xl uppercase leading-none tracking-wide">{club.name}</p>
        <p className={`text-xs uppercase tracking-[0.16em] text-muted ${sync ? "" : "invisible"}`}>
          Data last synced {sync?.label ?? "just now"}
          <span className="ml-3 border border-current px-2 py-0.5 text-accent">
            {sync?.source ?? "live"}
          </span>
        </p>
      </div>
    </footer>
  )
}
