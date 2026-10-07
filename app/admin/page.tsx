import type { Metadata } from "next"
import { AdminView } from "@/components/admin/AdminView"
import { SiteFooter } from "@/components/SiteFooter"
import { getSquad } from "@/lib/eafc/adapter"

export const metadata: Metadata = {
  title: "Admin",
}

export default async function AdminPage() {
  const squad = await getSquad()

  return (
    <>
      <main className="page-enter flex-1">
        <AdminView players={squad.data} />
      </main>
      <SiteFooter lastUpdated={squad.lastUpdated} />
    </>
  )
}
