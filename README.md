# Football Barta (ফুটবলবার্তা)

A bilingual (Bengali + English) football news and live data website built with Next.js 15.

Live football news, scores, standings, top scorers, and match schedules — with full Bengali/English language switching.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| State | Redux Toolkit |
| i18n | next-intl (bn / en) |
| News | RSS aggregation (BBC, ESPN, Guardian, Sky Sports, 90min) |
| Football Data | API-Football proxy (server-side, no exposed keys) |
| Articles | MDX / Markdown content |

## Project Structure

```
├── app/
│   ├── [locale]/          # Localized pages (bn default, en prefixed)
│   │   ├── page.tsx       # Homepage
│   │   ├── news/          # News listing & article detail
│   │   ├── matches/       # Match centre
│   │   ├── standings/     # League tables
│   │   ├── country/       # Bangladesh & India hubs
│   │   └── ...
│   └── api/               # SSR-safe POST API routes
│       ├── news/          # RSS + MDX news aggregation
│       ├── matches/       # Live & upcoming fixtures
│       ├── rankings/      # Standings + top scorers
│       └── ...
├── components/
│   ├── home/              # MatchOfDay, UpcomingMatches, News cards
│   ├── layout/            # Header, Footer, Ticker, LocaleSwitcher
│   ├── sidebar/           # Live scores, standings, top scorers widgets
│   ├── matches/           # Match listing client
│   └── ui/                # Shared UI primitives
├── lib/
│   ├── football-proxy.ts  # API-Football proxy client
│   ├── rss.ts             # RSS feed aggregation & filtering
│   └── api/               # Client-side API abstraction
├── store/                 # Redux store & slices
├── messages/              # i18n translation files (bn.json, en.json)
├── i18n/                  # next-intl routing config
├── content/articles/      # MDX/Markdown articles
├── data/                  # Static JSON fallback data
└── types/                 # Shared TypeScript types
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
| `FOOTBALL_DATA_TOKEN` | No | football-data.org API key (fallback proxy used if empty) |
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

## Features

- **Bilingual UI** — Full Bengali/English switch via header toggle
- **Live News Ticker** — Scrolling breaking headlines from RSS feeds
- **Match of the Day** — Featured live or upcoming match with countdown
- **Upcoming Matches Strip** — Horizontal scroll of fixtures with team crests
- **Live Scores Widget** — Real-time scores in sidebar
- **La Liga Standings & Top Scorers** — Live league table and goal charts
- **Country Hubs** — Bangladesh & India football sections
- **Football-only News Filter** — No cricket/boxing content
- **SSR-safe API Routes** — All external API calls proxied server-side

## API Routes

All routes use `POST` for SSR-safe data fetching:

| Route | Data |
|-------|------|
| `/api/news` | Aggregated RSS + MDX news |
| `/api/matches` | Live & upcoming fixtures |
| `/api/rankings` | Standings + top scorers |
| `/api/fixtures` | Fixtures by league/team |
| `/api/match-detail` | Match events, lineups, stats |

## Deployment

Configured for [Vercel](https://vercel.com) via `vercel.json`. Push to `main` branch to deploy.

## License

Private project — all rights reserved.
