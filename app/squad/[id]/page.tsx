import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { PlayerView } from "@/components/squad/PlayerView"
import { SiteFooter } from "@/components/SiteFooter"
import { getPlayer, getSquad } from "@/lib/eafc/adapter"

type PlayerPageProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const squad = await getSquad()
  return squad.data.map((player) => ({ id: player.id }))
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { id } = await params
  const player = await getPlayer(id)
  return { title: player.data?.gamertag ?? "Player" }
}

export default function PlayerPage({ params }: PlayerPageProps) {
  return (
    <Suspense fallback={<PlayerFallback />}>
      <PlayerContent params={params} />
    </Suspense>
  )
}

async function PlayerContent({ params }: PlayerPageProps) {
  const { id } = await params
  const player = await getPlayer(id)
  if (!player.data) notFound()

  return (
    <>
      <main className="page-enter flex-1">
        <PlayerView player={player.data} />
      </main>
      <SiteFooter lastUpdated={player.lastUpdated} />
    </>
  )
}

function PlayerFallback() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1120px] px-5 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Loading player</p>
      </div>
    </main>
  )
}
