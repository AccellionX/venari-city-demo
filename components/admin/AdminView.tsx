"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { Player, Position } from "@/lib/eafc/types"

const tabs = ["Players", "News", "Events", "Trials", "History", "Shop"] as const
type Tab = (typeof tabs)[number]
const positions: Position[] = ["GK", "DEF", "MID", "ATT"]

type Editor = {
  mode: "add" | "edit"
  id: string | null
  gamertag: string
  number: string
  position: Position
  appearances: string
  goals: string
  assists: string
}

type TrialStatus = "pending" | "accepted" | "declined"

const trials = [
  {
    id: "box-mo",
    gamertag: "BoxToBox_Mo",
    position: "MID",
    applied: "6 Oct 2026",
    note: "Two seasons in Division 3, prefers a 6 or an 8.",
  },
  {
    id: "keeper-ken",
    gamertag: "KeeperKen",
    position: "GK",
    applied: "5 Oct 2026",
    note: "Available weeknights. Can cover if nightshift. is out.",
  },
  {
    id: "rae",
    gamertag: "WingbackRae",
    position: "DEF",
    applied: "4 Oct 2026",
    note: "Left back, high overlap, wants a starting role.",
  },
  {
    id: "nine-lives",
    gamertag: "NineLives",
    position: "ATT",
    applied: "2 Oct 2026",
    note: "Striker looking for a club after Redline folded.",
  },
]

const emptyEditor = (): Editor => ({
  mode: "add",
  id: null,
  gamertag: "",
  number: "",
  position: "MID",
  appearances: "0",
  goals: "0",
  assists: "0",
})

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return slug || "player"
}

export function AdminView({ players: initialPlayers }: { players: Player[] }) {
  const [tab, setTab] = useState<Tab>("Players")
  const [players, setPlayers] = useState(initialPlayers)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [trialStatus, setTrialStatus] = useState<Record<string, TrialStatus>>({})
  const titleId = useId()
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editor) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    nameRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditor(null)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [editor])

  function openAdd() {
    setFormError(null)
    setEditor(emptyEditor())
  }

  function openEdit(player: Player) {
    setFormError(null)
    setEditor({
      mode: "edit",
      id: player.id,
      gamertag: player.gamertag,
      number: String(player.number),
      position: player.position,
      appearances: String(player.appearances),
      goals: String(player.goals),
      assists: String(player.assists),
    })
  }

  function savePlayer() {
    if (!editor) return
    const gamertag = editor.gamertag.trim()
    const number = Number(editor.number)
    const appearances = Number(editor.appearances)
    const goals = Number(editor.goals)
    const assists = Number(editor.assists)
    const whole = [number, appearances, goals, assists].every((value) => Number.isInteger(value) && value >= 0)

    if (!gamertag) {
      setFormError("Gamertag is required.")
      return
    }
    if (!whole || number < 1 || number > 99) {
      setFormError("Number must be 1–99. Apps, goals, and assists must be whole numbers.")
      return
    }

    if (editor.mode === "edit" && editor.id) {
      setPlayers((current) =>
        current.map((player) =>
          player.id === editor.id
            ? { ...player, gamertag, number, position: editor.position, appearances, goals, assists }
            : player,
        ),
      )
    } else {
      const base = slugify(gamertag)
      const id = players.some((player) => player.id === base) ? `${base}-${number}` : base
      setPlayers((current) => [
        ...current,
        {
          id,
          gamertag,
          number,
          position: editor.position,
          appearances,
          goals,
          assists,
          memberSince: "2026-10-07",
          ratings: [7, 7, 7, 7, 7],
        },
      ])
    }

    setEditor(null)
  }

  return (
    <div>
      <p className="bg-accent px-5 py-3 text-center font-display text-xl uppercase tracking-[0.16em] text-club sm:text-2xl">
        Admin preview — concept only
      </p>
      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-8 lg:grid-cols-[200px_1fr] lg:py-12">
        <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((item) => {
            const selected = item === tab
            return (
              <button
                key={item}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => setTab(item)}
                className={`shrink-0 px-3 py-2 text-left font-display text-xl uppercase tracking-[0.12em] transition-colors ${
                  selected ? "bg-accent text-club" : "text-muted hover:text-ink"
                }`}
              >
                {item}
              </button>
            )
          })}
        </nav>

        <div className="min-w-0">
          {tab === "Players" ? (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="font-display text-5xl uppercase leading-none">Players</h1>
                <button
                  type="button"
                  onClick={openAdd}
                  className="bg-accent px-4 py-2 font-display text-lg uppercase tracking-[0.12em] text-club"
                >
                  Add player
                </button>
              </div>
              <div className="mt-6 overflow-x-auto border border-line">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 font-medium">No.</th>
                      <th className="px-4 py-3 font-medium">Gamertag</th>
                      <th className="px-4 py-3 font-medium">Pos</th>
                      <th className="px-4 py-3 font-medium">Apps</th>
                      <th className="px-4 py-3 font-medium">Goals</th>
                      <th className="px-4 py-3 font-medium">Assists</th>
                      <th className="px-4 py-3 font-medium">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {players
                      .slice()
                      .sort((a, b) => a.number - b.number)
                      .map((player) => (
                        <tr key={player.id} className="border-b border-line last:border-b-0">
                          <td className="px-4 py-3 font-display text-xl tabular-nums text-accent">{player.number}</td>
                          <td className="px-4 py-3">{player.gamertag}</td>
                          <td className="px-4 py-3">{player.position}</td>
                          <td className="px-4 py-3 tabular-nums">{player.appearances}</td>
                          <td className="px-4 py-3 tabular-nums">{player.goals}</td>
                          <td className="px-4 py-3 tabular-nums">{player.assists}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => openEdit(player)}
                              className="mr-3 uppercase tracking-[0.12em] text-muted hover:text-ink"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setPlayers((current) => current.filter((item) => item.id !== player.id))}
                              className="uppercase tracking-[0.12em] text-loss hover:text-ink"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {tab === "News" ? (
            <StaticTable
              title="News"
              columns={["Title", "Date", "Status"]}
              rows={[
                ["Northbank match report", "5 Oct 2026", "Published"],
                ["Attacker trials open", "1 Oct 2026", "Published"],
                ["Cup draw: Redline Esports", "28 Sep 2026", "Draft"],
                ["VOD night announced", "20 Sep 2026", "Published"],
              ]}
            />
          ) : null}

          {tab === "Events" ? (
            <StaticTable
              title="Events"
              columns={["Event", "Type", "When"]}
              rows={[
                ["vs Harbor Athletic", "League match", "Sat 10 Oct, 19:00 UTC"],
                ["Attacker trials", "Trials", "Wed 14 Oct, 18:30 UTC"],
                ["vs Redline Esports", "Cup", "Wed 21 Oct, 19:00 UTC"],
                ["VOD review", "Community", "Mon 2 Nov, 18:00 UTC"],
              ]}
            />
          ) : null}

          {tab === "Trials" ? (
            <section>
              <h1 className="font-display text-5xl uppercase leading-none">Trials</h1>
              <p className="mt-3 text-sm text-muted">Four open applications. Decisions stay in this browser until refresh.</p>
              <ul className="mt-6 divide-y divide-line border border-line">
                {trials.map((trial) => {
                  const status = trialStatus[trial.id] ?? "pending"
                  return (
                    <li key={trial.id} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-display text-2xl uppercase leading-none">{trial.gamertag}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
                          {trial.position} · Applied {trial.applied}
                        </p>
                        <p className="mt-2 text-sm text-muted">{trial.note}</p>
                      </div>
                      {status === "pending" ? (
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => setTrialStatus((current) => ({ ...current, [trial.id]: "accepted" }))}
                            className="bg-accent px-3 py-2 font-display uppercase tracking-[0.12em] text-club"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrialStatus((current) => ({ ...current, [trial.id]: "declined" }))}
                            className="border border-line px-3 py-2 font-display uppercase tracking-[0.12em] text-ink"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <p
                          className={`font-display text-xl uppercase ${
                            status === "accepted" ? "text-accent" : "text-loss"
                          }`}
                        >
                          {status}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          {tab === "History" ? (
            <StaticTable
              title="History"
              columns={["Season", "Division", "Finish", "Record"]}
              rows={[
                ["2026", "Division 1", "2nd", "27-8-7"],
                ["2025", "Division 2", "1st", "31-4-5"],
                ["2024", "Division 3", "3rd", "22-6-12"],
                ["2023", "Division 4", "1st", "28-3-5"],
              ]}
            />
          ) : null}

          {tab === "Shop" ? (
            <section>
              <StaticTable
                title="Shop"
                columns={["Item", "Price"]}
                rows={[
                  ["Home shirt 2026", "£45"],
                  ["Away shirt 2026", "£45"],
                  ["Third shirt", "£45"],
                  ["Scarves", "£18"],
                ]}
              />
              <p className="mt-4 text-sm text-muted">Catalogue preview. Nothing here can be bought.</p>
            </section>
          ) : null}
        </div>
      </div>

      {editor ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/70 px-5" onClick={() => setEditor(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md border border-line bg-club p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="font-display text-4xl uppercase leading-none">
              {editor.mode === "add" ? "Add player" : "Edit player"}
            </h2>
            <form
              className="mt-6 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                savePlayer()
              }}
            >
              <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-muted">
                Gamertag
                <input
                  ref={nameRef}
                  value={editor.gamertag}
                  onChange={(event) => setEditor({ ...editor, gamertag: event.target.value })}
                  className="border border-line bg-transparent px-3 py-2 text-base normal-case tracking-normal text-ink"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-muted">
                  Number
                  <input
                    inputMode="numeric"
                    value={editor.number}
                    onChange={(event) => setEditor({ ...editor, number: event.target.value })}
                    className="border border-line bg-transparent px-3 py-2 text-base normal-case tracking-normal text-ink"
                  />
                </label>
                <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-muted">
                  Position
                  <select
                    value={editor.position}
                    onChange={(event) => setEditor({ ...editor, position: event.target.value as Position })}
                    className="border border-line bg-club px-3 py-2 text-base normal-case tracking-normal text-ink"
                  >
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["appearances", "Apps"],
                    ["goals", "Goals"],
                    ["assists", "Assists"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="grid gap-1 text-xs uppercase tracking-[0.16em] text-muted">
                    {label}
                    <input
                      inputMode="numeric"
                      value={editor[key]}
                      onChange={(event) => setEditor({ ...editor, [key]: event.target.value })}
                      className="border border-line bg-transparent px-3 py-2 text-base normal-case tracking-normal text-ink"
                    />
                  </label>
                ))}
              </div>
              {formError ? <p className="text-sm text-loss">{formError}</p> : null}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditor(null)}
                  className="px-4 py-2 font-display text-lg uppercase tracking-[0.12em] text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent px-4 py-2 font-display text-lg uppercase tracking-[0.12em] text-club"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StaticTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <section>
      <h1 className="font-display text-5xl uppercase leading-none">{title}</h1>
      <div className="mt-6 overflow-x-auto border border-line">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            <tr className="border-b border-line">
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")} className="border-b border-line last:border-b-0">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
