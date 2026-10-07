# Venari City FC

Concept demo for an EA FC Pro Clubs team site. Home, squad, and an admin preview. No database, auth, or payments.

Requires Node 20.9 or newer.

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The header switcher (VEN / GOY / AET) changes the club name, crest, and colours. Match and squad data stay on the shared mock set.

Deploy by importing the repo into Vercel. No extra config.

## Live EA FC data

Pages only call `lib/eafc/adapter.ts`: `getClubOverview()`, `getRecentResults()`, `getSquad()`, and `getPlayer(id)`. Each result includes `lastUpdated` and `source` (`live` or `cached`).

Those getters are cached for five minutes via the `eafc` profile in `next.config.ts` (`stale`, `revalidate`, and `expire`). The footer badge reads `lastUpdated`.

`readClubFile()` is the only function that knows the data is local JSON in `/data`. To use a live feed, replace that function with a fetch to the EA FC endpoint and return the same JSON shapes (`club.json`, `results.json`, `squad.json`, `events.json`). Leave the getters, the cache, and the pages as they are.
