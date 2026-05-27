# Football Barta (ফুটবলবার্তা)

A bilingual (Bengali + English) football news and live data website built with Next.js 15.

Live football news, scores, standings, top scorers, match detail, player/team profiles, and search — with full Bengali/English language switching.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| State | Redux Toolkit |
| i18n | next-intl (bn / en) |
| News | RSS aggregation (BBC, ESPN, Guardian, Sky Sports, 90min) |
| Football Data | API-Football CMS proxy (server-side, no exposed keys) |
| Articles | MDX / Markdown content |

## Architecture

```
Browser → Redux → lib/api/*.ts → POST /api/* → lib/football-api.ts → lib/api-football-cms.ts → CMS proxy
News:    Browser → Redux → lib/api/news.ts → POST /api/news → lib/rss.ts + lib/mdx.ts
```

## Project Structure

```
├── app/
│   ├── [locale]/              # Localized pages (bn default, en prefixed)
│   │   ├── page.tsx           # Homepage
│   │   ├── news/              # News listing & article detail
│   │   ├── matches/           # Match centre + /matches/[id] detail
│   │   ├── players/           # Top scorers + /players/[id] profile
│   │   ├── teams/[id]/        # Team profile (squad, fixtures)
│   │   ├── standings/         # League tables
│   │   ├── search/            # News search
│   │   ├── country/[id]/      # Bangladesh & India hubs
│   │   └── world-cup/         # World Cup news hub
│   └── api/                   # SSR-safe API routes
│       ├── news/              # RSS + MDX news aggregation
│       ├── matches/           # Live & upcoming fixtures (+ /[id])
│       ├── rankings/          # Standings + top scorers
│       ├── players/[id]/      # Player profile
│       └── teams/[id]/        # Team profile
├── components/
│   ├── home/                  # MatchOfDay, UpcomingMatches, News cards
│   ├── layout/                # Header, Footer, Ticker, HeaderSearch
│   ├── sidebar/               # Live scores, standings, top scorers, HomeSidebarData
│   ├── matches/               # MatchesClient, MatchDetailClient, MatchCardRow
│   ├── players/               # TopScorersPageClient, PlayerDetailClient
│   ├── teams/                 # TeamDetailClient
│   ├── search/                # SearchClient
│   └── ui/                    # Tabs, Button, Tag, Badge, Skeleton
├── lib/
│   ├── api-football-cms.ts    # CMS fetch + failover
│   ├── football-api.ts        # Orchestration (matches, rankings, detail payloads)
│   ├── football-endpoints.ts  # API path constants
│   ├── country-leagues.ts     # Country → leagueId/season mapping
│   ├── football-proxy.ts      # Legacy proxy (uses cmsFetch)
│   ├── rss.ts                 # RSS feed aggregation & filtering
│   └── api/                   # Client-side API abstraction
├── store/                     # Redux store & slices
├── messages/                  # i18n translation files (bn.json, en.json)
├── i18n/                      # next-intl routing config
├── content/articles/          # MDX/Markdown articles
├── data/                      # Static JSON (countries with leagueId/season)
└── types/                     # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/ankur1touch/bengaliwebsite.git
cd bengaliwebsite
npm install
```

### Environment

Copy the example env file and fill in optional values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `FOOTBALL_API_BASE_URL` | No | Primary CMS proxy base URL |
| `FOOTBALL_API_SEASON` | No | Default season year (e.g. `2025`) |
| `FOOTBALL_DATA_TOKEN` | No | football-data.org API key (fallback if CMS unavailable) |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL for SEO/sitemap |

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Bengali (default)  
Open [http://localhost:3000/en](http://localhost:3000/en) — English

### Production build

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — match of day, upcoming fixtures, news, sidebar widgets |
| `/news` | Filterable news listing (league, transfers, world cup, etc.) |
| `/news/[slug]` | Article detail (MDX + RSS) |
| `/matches` | Live, upcoming, and finished fixtures |
| `/matches/[id]` | Match detail — events, lineups, stats, H2H |
| `/players` | Full top scorers table |
| `/players/[id]` | Player profile |
| `/teams/[id]` | Team profile — squad, fixtures, league position |
| `/standings` | League table + top scorers |
| `/search?q=` | Client-side news search |
| `/country/[id]` | Country hub — news + country-scoped football data |
| `/world-cup` | World Cup news filter |

All routes are prefixed with `/en` for English (e.g. `/en/matches/12345`).

## Features

- **Bilingual UI** — Full Bengali/English switch via header toggle
- **Live News Ticker** — Scrolling breaking headlines from RSS feeds
- **Match of the Day** — Featured live or upcoming match with countdown
- **Match Detail** — Events, lineups, stats, and head-to-head tabs
- **Player & Team Profiles** — Linked from standings, scorers, and match cards
- **Header Search** — Quick news search from any page
- **Upcoming Matches Strip** — Horizontal scroll of fixtures with team crests
- **Live Scores Widget** — Real-time scores in sidebar
- **La Liga Standings & Top Scorers** — Live league table and goal charts
- **Country Hubs** — Bangladesh & India football sections with scoped data
- **Football-only News Filter** — No cricket/boxing content
- **SSR-safe API Routes** — All external API calls proxied server-side
- **Newsletter CTA** — Footer signup UI (no backend)

## API Routes

All routes accept `GET` (defaults) and `POST` (with JSON body) for SSR-safe data fetching:

| Route | Body params | Data |
|-------|-------------|------|
| `/api/news` | `{ category? }` | Aggregated RSS + MDX news |
| `/api/matches` | `{ tab?, countryId? }` | Live, upcoming, or finished fixtures |
| `/api/matches/[id]` | — | Match detail (events, lineups, stats, H2H) |
| `/api/rankings` | `{ countryId?, leagueId? }` | Standings + top scorers |
| `/api/players/[id]` | — | Player profile |
| `/api/teams/[id]` | — | Team profile (squad, fixtures) |
| `/api/countries` | — | Country list |
| `/api/country/[id]` | — | Single country metadata |

## Deployment (AWS Amplify)

1. Connect this repo in [AWS Amplify Console](https://console.aws.amazon.com/amplify/) (branch: `main`).
2. Amplify uses `amplify.yml` — build: `npm ci` → `npm run build` (Next.js SSR / WEB_COMPUTE).
3. Set **Environment variables** in Amplify → App settings → Environment variables:

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your Amplify URL or custom domain (no trailing slash) |
| `FOOTBALL_API_BASE_URL` | Yes | CMS football proxy base URL |
| `FOOTBALL_API_SEASON` | Yes | e.g. `2025` |
| `CMS_API_TOKEN` | Yes | Secret for `POST /api/articles` (n8n publish) |
| `MONGODB_URI` | Yes (prod) | Published articles storage (Amplify has no writable disk) |
| `MONGODB_DB` | Optional | Default: `football_barta` |
| `FOOTBALL_DATA_TOKEN` | Optional | Football-Data.org fallback |

4. In **n8n**, set `CMS_API_URL=https://your-domain.com/api/articles` and the same `CMS_API_TOKEN`.
5. Push to `main` to trigger a deploy.

See `.env.example` for all keys.

## License

Private project — all rights reserved.
