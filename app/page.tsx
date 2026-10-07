import { HomeView } from "@/components/home/HomeView"
import { SiteFooter } from "@/components/SiteFooter"
import { getClubOverview, getRecentResults } from "@/lib/eafc/adapter"
import { pickSync } from "@/lib/eafc/types"

export default async function HomePage() {
  const [overview, results] = await Promise.all([getClubOverview(), getRecentResults()])
  const sync = pickSync([overview, results])

  return (
    <>
      <main className="page-enter flex-1">
        <HomeView overview={overview.data} results={results.data} />
      </main>
      <SiteFooter lastUpdated={sync.lastUpdated} />
    </>
  )
}
