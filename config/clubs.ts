export type ClubTheme = {
  id: string
  name: string
  shortName: string
  crest: string
  primary: string
  accent: string
}

export const clubs: ClubTheme[] = [
  {
    id: "venari",
    name: "Venari City FC",
    shortName: "VEN",
    crest: "/crests/venari.svg",
    primary: "#0C1F17",
    accent: "#D6FF3C",
  },
  {
    id: "goytre",
    name: "Goytre FC",
    shortName: "GOY",
    crest: "/crests/goytre.svg",
    primary: "#12151C",
    accent: "#4C8DFF",
  },
  {
    id: "aeternum",
    name: "Aeternum",
    shortName: "AET",
    crest: "/crests/aeternum.svg",
    primary: "#1A1214",
    accent: "#E23B3B",
  },
]

export const defaultClubId = "venari"
