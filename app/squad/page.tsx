import type { Metadata } from "next"
import { SquadView } from "@/components/squad/SquadView"
import { SiteFooter } from "@/components/SiteFooter"
import { getSquad } from "@/lib/eafc/adapter"

export const metadata: Metadata = {
  title: "Squad",
}

export default async function SquadPage() {
  const squad = await getSquad()

  return (
    <>
      <main className="page-enter flex-1">
        <SquadView players={squad.data} />
      </main>
      <SiteFooter lastUpdated={squad.lastUpdated} />
    </>
  )
}
