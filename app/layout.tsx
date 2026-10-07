import type { Metadata } from "next"
import { Barlow_Condensed, Outfit } from "next/font/google"
import { ClubProvider } from "@/components/ClubProvider"
import { SiteHeader } from "@/components/SiteHeader"
import "./globals.css"

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
})

const sans = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: {
    default: "Venari City FC",
    template: "%s · Venari City FC",
  },
  description: "Pro Clubs home for Venari City FC.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ClubProvider>
          <div className="h-1 bg-accent" />
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
        </ClubProvider>
      </body>
    </html>
  )
}
