"use client"

import { createContext, useCallback, useContext, useLayoutEffect, useSyncExternalStore } from "react"
import { clubs, defaultClubId, type ClubTheme } from "@/config/clubs"

const STORAGE_KEY = "venari-club"
const CHANGE_EVENT = "venari-club-change"

type ClubContextValue = {
  club: ClubTheme
  setClubId: (id: string) => void
}

const ClubContext = createContext<ClubContextValue | null>(null)

function findClub(id: string) {
  return clubs.find((club) => club.id === id) ?? clubs[0]
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange)
  window.addEventListener("storage", onStoreChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

function getSnapshot() {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved && clubs.some((club) => club.id === saved) ? saved : defaultClubId
}

function getServerSnapshot() {
  return defaultClubId
}

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const clubId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const club = findClub(clubId)

  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--club-primary", club.primary)
    document.documentElement.style.setProperty("--club-accent", club.accent)
  }, [club])

  const setClubId = useCallback((id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return <ClubContext.Provider value={{ club, setClubId }}>{children}</ClubContext.Provider>
}

export function useClub() {
  const value = useContext(ClubContext)
  if (!value) {
    throw new Error("useClub must be used within ClubProvider")
  }
  return value
}
