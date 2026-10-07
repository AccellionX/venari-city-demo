"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useClub } from "@/components/ClubProvider"
import type { ClubOverview, MatchResult } from "@/lib/eafc/types"

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
})

const kickoffFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
  hourCycle: "h23",
})

function ordinalParts(position: number) {
  const mod100 = position % 100
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : position % 10 === 1
        ? "st"
        : position % 10 === 2
          ? "nd"
          : position % 10 === 3
            ? "rd"
            : "th"
  return { position, suffix }
}

function outcomeClass(outcome: MatchResult["outcome"]) {
  if (outcome === "W") return "bg-accent text-club"
  if (outcome === "L") return "bg-loss text-club"
  return "border border-draw text-draw"
}

function Countdown({ startsAt }: { startsAt: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setNow(Date.now())
    update()
    const id = window.setInterval(update, 1000)
    return () => window.clearInterval(id)
  }, [])

  const target = Date.parse(startsAt)
  const remaining = Math.max(0, target - (now ?? target))
  const totalSeconds = Math.floor(remaining / 1000)
  const units = [
    { label: "Days", value: Math.floor(totalSeconds / 86_400) },
    { label: "Hrs", value: Math.floor((totalSeconds % 86_400) / 3_600) },
    { label: "Min", value: Math.floor((totalSeconds % 3_600) / 60) },
    { label: "Sec", value: totalSeconds % 60 },
  ]

  return (
    <div className={`mt-6 grid grid-cols-4 gap-3 ${now === null ? "invisible" : ""}`}>
      {units.map((unit) => (
        <div key={unit.label}>
          <p className="font-display text-4xl leading-none tabular-nums sm:text-5xl">
            {String(unit.value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-muted">{unit.label}</p>
        </div>
      ))}
    </div>
  )
}

function Figure({
  value,
  suffix,
}: {
  value: number
  suffix?: string
}) {
  return (
    <p className="font-display text-5xl leading-none text-accent tabular-nums sm:text-6xl">
      {value}
      {suffix ? <span className="text-[0.45em]">{suffix}</span> : null}
    </p>
  )
}

export function HomeView({
  overview,
  results,
}: {
  overview: ClubOverview
  results: MatchResult[]
}) {
  const { club } = useClub()
  const place = ordinalParts(overview.position)

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <p
          aria-hidden
          className="pointer-events-none absolute -right-2 bottom-[-0.12em] font-display text-[clamp(7rem,34vw,16rem)] leading-none text-transparent [paint-order:stroke] [-webkit-text-stroke:1px_color-mix(in_srgb,var(--club-accent)_45%,transparent)]"
        >
          {club.shortName}
        </p>
        <div className="relative mx-auto grid max-w-[1120px] items-end gap-6 px-5 py-12 sm:py-16 md:grid-cols-[auto_1fr] md:gap-10">
          <Image
            src={club.crest}
            alt=""
            width={140}
            height={168}
            priority
            className="h-28 w-auto sm:h-36"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">
              Pro Clubs · {overview.league}
            </p>
            <h1 className="mt-3 max-w-[9ch] font-display text-[clamp(4.25rem,16vw,7.5rem)] uppercase leading-[0.82] tracking-[-0.03em]">
              {club.name}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 border border-line px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em]">
                <span
                  className={`h-2 w-2 rounded-full ${
                    overview.status === "online" ? "bg-accent" : "bg-muted"
                  }`}
                />
                {overview.status}
              </span>
              <p className="text-sm text-muted">Season {overview.season}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <dl className="mx-auto grid max-w-[1120px] grid-cols-2 px-5 lg:grid-cols-5">
          {[
            { label: "Position", value: place.position, suffix: place.suffix },
            { label: "Played", value: overview.played },
            { label: "Wins", value: overview.wins },
            { label: "Goals for", value: overview.goalsFor },
            { label: "Win rate", value: overview.winRate, suffix: "%" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`py-6 ${
                index === 4
                  ? "col-span-2 lg:col-span-1"
                  : "border-b border-line lg:border-b-0"
              } ${index % 2 === 1 ? "border-l border-line pl-4" : ""} ${
                index > 0 ? "lg:border-l lg:border-line lg:pl-4" : ""
              }`}
            >
              <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">{stat.label}</dt>
              <dd className="mt-2">
                <Figure value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto max-w-[1120px] px-5 py-12 sm:py-16">
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">
              Last five
            </h2>
            <p className="flex gap-2 font-display text-2xl leading-none" aria-hidden>
              {results.map((match) => (
                <span
                  key={match.id}
                  className={
                    match.outcome === "W"
                      ? "text-accent"
                      : match.outcome === "L"
                        ? "text-loss"
                        : "text-draw"
                  }
                >
                  {match.outcome}
                </span>
              ))}
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {results.map((match) => (
              <li key={match.id} className="min-w-0">
                <article className="flex items-center gap-4 border border-line bg-white/[0.03] px-4 py-3 transition duration-150 hover:-translate-y-0.5 hover:border-accent lg:block lg:px-4 lg:py-5">
                  <p
                    className={`grid h-10 w-10 shrink-0 place-items-center font-display text-xl leading-none ${outcomeClass(match.outcome)}`}
                  >
                    <span className="sr-only">
                      {match.outcome === "W" ? "Win" : match.outcome === "L" ? "Loss" : "Draw"}
                    </span>
                    <span aria-hidden>{match.outcome}</span>
                  </p>
                  <div className="min-w-0 flex-1 lg:mt-4">
                    <p className="font-display text-3xl leading-none tabular-nums">
                      {match.goalsFor}
                      <span className="text-muted">–</span>
                      {match.goalsAgainst}
                    </p>
                    <p className="mt-1 truncate text-sm">{match.opponent}</p>
                  </div>
                  <p className="text-right text-[0.65rem] uppercase tracking-[0.14em] text-muted lg:mt-4 lg:text-left">
                    {match.venue}
                    <span className="mt-1 block">
                      {match.competition} · {dayFormat.format(new Date(match.playedAt))}
                    </span>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 grid gap-3 lg:grid-cols-2">
          <LeaderCard label="Top scorer" stat="goals" leader={overview.topScorer} />
          <LeaderCard label="Top assister" stat="assists" leader={overview.topAssister} />
        </section>

        <section className="mt-3 border border-line border-l-4 border-l-accent bg-white/[0.03] p-5 sm:p-6">
          {overview.nextEvent ? (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                Next · {overview.nextEvent.type}
              </p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">
                {overview.nextEvent.title}
              </h2>
              <p className="mt-3 text-sm text-muted">
                {kickoffFormat.format(new Date(overview.nextEvent.startsAt))} UTC
              </p>
              <Countdown startsAt={overview.nextEvent.startsAt} />
            </>
          ) : (
            <>
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">Next</p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-none">No fixture scheduled</h2>
            </>
          )}
        </section>

        <section className="mt-14 border-t border-line pt-6">
          <h2 className="sr-only">Social</h2>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm uppercase tracking-[0.16em]">
            <li>
              <a
                href={overview.twitch}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition-colors hover:text-ink"
              >
                Twitch
              </a>
            </li>
            {overview.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function LeaderCard({
  label,
  stat,
  leader,
}: {
  label: string
  stat: string
  leader: ClubOverview["topScorer"]
}) {
  return (
    <Link
      href={`/squad/${leader.id}`}
      className="flex items-end justify-between gap-4 border border-line bg-white/[0.03] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-accent"
    >
      <span>
        <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-accent">{label}</span>
        <span className="mt-3 block font-display text-4xl uppercase leading-none tracking-wide">
          {leader.gamertag}
        </span>
        <span className="mt-2 block text-sm text-muted">
          {leader.position} · #{leader.number}
        </span>
      </span>
      <span className="text-right">
        <span className="block font-display text-6xl leading-none text-accent tabular-nums">
          {leader.value}
        </span>
        <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.16em] text-muted">{stat}</span>
      </span>
    </Link>
  )
}
