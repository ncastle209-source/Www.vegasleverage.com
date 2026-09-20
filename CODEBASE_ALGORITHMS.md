# VegasLeverage — algorithms and data graph

## Layout

- **API / backend:** `artifacts/api-server` — Express routes, provider clients, analytics, persistence, workers, alerts, settlement.
- **Primary web terminal:** `artifacts/vegas-leverage-app` — React/Vite sports terminal, matrix board, live feed, game detail, analytics, wagers.
- **Lock screen:** `artifacts/dual-pane-lock-screen`.
- **Preview:** `artifacts/mockup-sandbox`.
- **Shared libs:** `lib/*` and workspace packages under `artifacts/*`.

## End-to-end execution graph

1. **Odds, tickets, handle, model lines enter from odds-cascade.**
   - Worker repo: `ncastle209-source/odds-cascade` (GitHub Actions every 30 minutes).
   - Publish repo: `ncastle209-source/Www.vegasleverage.com` → `public/data/`.
   - Files the app must read first:
     - `public/data/gamecards.json` (full game)
     - `public/data/gamecards_2h.json` (2H)
     - `public/data/audit.json`
     - `public/data/ratings.json`
     - `public/data/handle_report.json`
   - **The Odds API is not primary.** Do not call it in the Odds Pipeline workflow.
   - ESPN, CFBD, MLB Stats API stay for box scores / season stats / SP+ only.
   - Gemini is analysis-only, never the line source.

2. Provider adapters validate and normalize those JSON cards onto the internal game contract (`gameId`, `matchup`, `currentSpread`, `ticketPct`, `handlePct`, `modelSpread`, `modelEdge`, `fairSpread`).

3. Named engines score each card (`src/namedAlgos.js`):
   - Doggies
   - Market Deficiency
   - Public Trap Guardrail / Bear Trap
   - Sharp Trap FG / 2H (T1–T5)
   - VIP = guardrail clear AND (Doggies or Deficiency or Sharp)
   - Model play = `|modelEdge| >= 2.5`

4. API server exposes the scored slate to the web terminal. No second odds scrape on Replit.

5. Alerts (Telegram) fire from `odds-cascade` (`telegram_alerts.py`), not from Replit.

6. Settlement / CLV writes back through `data/audit.json`.

## Replit Odds Pipeline workflow

One sequential shell task only:

```bash
git pull origin main
```

or, if this Repl is not the publish repo:

```bash
mkdir -p public/data artifacts/vegas-leverage-app/public/data
for f in gamecards.json gamecards_2h.json audit.json ratings.json handle_report.json extras.json; do
  curl -fsSL -o "public/data/$f" "https://raw.githubusercontent.com/ncastle209-source/Www.vegasleverage.com/main/public/data/$f" || true
  cp -f "public/data/$f" "artifacts/vegas-leverage-app/public/data/$f" || true
done
```

Do **not** run `pnpm --filter @workspace/api-server` as the odds job.
Do **not** run `cascade.py` on Replit.

## App read path

```js
import { loadOddsPipeline } from './src/oddsPipeline.js';
import { evaluateNamedAlgos } from './src/namedAlgos.js';

const slate = await loadOddsPipeline();
const plays = slate.games.map((g) => ({ ...g, algos: evaluateNamedAlgos(g) }));
```

`loadOddsPipeline` fetches `/data/gamecards.json` and `/data/gamecards_2h.json`.
