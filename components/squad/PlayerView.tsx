import Link from "next/link"
import type { Player, Position } from "@/lib/eafc/types"

const positionName: Record<Position, string> = {
  GK: "Goalkeeper",
  DEF: "Defender",
  MID: "Midfielder",
  ATT: "Attacker",
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatMemberSince(iso: string) {
  const [year, month, day] = iso.split("-")
  const monthName = months[Number(month) - 1] ?? month
  return `${Number(day)} ${monthName} ${year}`
}

export function PlayerView({ player }: { player: Player }) {
  const perGame = player.appearances === 0 ? 0 : player.goals / player.appearances
  const ratingsLabel = player.ratings.map((rating) => rating.toFixed(1)).join(", ")

  return (
    <div className="mx-auto max-w-[1120px] px-5 py-12 sm:py-16">
      <Link
        href="/squad"
        className="text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
      >
        Squad
      </Link>
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-accent">
        {positionName[player.position]} · {player.position}
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-6xl uppercase leading-[0.85] tracking-wide sm:text-8xl">
          {player.gamertag}
        </h1>
        <p className="font-display text-7xl leading-none text-accent tabular-nums sm:text-8xl">
          {player.number}
        </p>
      </div>
      <p className="mt-4 text-sm text-muted">Member since {formatMemberSince(player.memberSince)}</p>

      <dl className="mt-10 grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {[
          { label: "Appearances", value: String(player.appearances) },
          { label: "Goals", value: String(player.goals) },
          { label: "Assists", value: String(player.assists) },
          { label: "Goals per game", value: perGame.toFixed(2) },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={`py-6 ${index % 2 === 1 ? "border-l border-line pl-4" : ""} ${
              index < 2 ? "border-b border-line lg:border-b-0" : ""
            } ${index > 0 ? "lg:border-l lg:border-line lg:pl-4" : ""}`}
          >
            <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">{stat.label}</dt>
            <dd className="mt-2 font-display text-5xl leading-none text-accent tabular-nums sm:text-6xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-12 max-w-xl">
        <h2 className="font-display text-3xl uppercase leading-none tracking-wide">Last five ratings</h2>
        <div
          className="mt-6 flex h-44 items-end gap-3"
          role="img"
          aria-label={`Last five match ratings: ${ratingsLabel}`}
        >
          {player.ratings.map((rating, index) => (
            <div key={`${player.id}-${index}`} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="flex h-32 items-end bg-white/[0.04]">
                <div
                  className="w-full bg-accent"
                  style={{ height: `${Math.max(8, (rating / 10) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-center font-display text-xl leading-none tabular-nums">
                {rating.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
