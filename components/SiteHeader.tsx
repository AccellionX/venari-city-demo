"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clubs } from "@/config/clubs"
import { useClub } from "@/components/ClubProvider"

const links = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squad" },
  { href: "/admin", label: "Admin" },
]

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const { club, setClubId } = useClub()

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-club/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
        <Link href="/" className="mr-auto flex items-center gap-3 sm:mr-0">
          <Image src={club.crest} alt="" width={40} height={48} className="h-10 w-auto" />
          <span className="font-display text-2xl uppercase leading-none tracking-wide">
            {club.shortName}
          </span>
        </Link>

        <nav className="order-last flex w-full gap-5 sm:order-none sm:w-auto">
          {links.map((link) => {
            const current = isCurrent(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`border-b-2 pb-0.5 font-display text-lg uppercase tracking-[0.14em] transition-colors ${
                  current
                    ? "border-accent text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div
          className="flex items-center gap-1 sm:ml-auto"
          role="group"
          aria-label="Choose club"
        >
          {clubs.map((item) => {
            const selected = item.id === club.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setClubId(item.id)}
                className={`px-2.5 py-1 font-display text-sm uppercase tracking-[0.14em] transition-colors ${
                  selected
                    ? "bg-accent text-club"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.shortName}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
