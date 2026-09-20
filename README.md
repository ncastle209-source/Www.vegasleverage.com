# VegasLeverage

Replit / site repo. Odds come from [odds-cascade](https://github.com/ncastle209-source/odds-cascade) every 30 minutes.

## Pipeline

```js
import { loadOddsPipeline } from './src/oddsPipeline.js';
import { evaluateNamedAlgos } from './src/namedAlgos.js';

const slate = await loadOddsPipeline();
const plays = slate.games.map((g) => ({ ...g, ...evaluateNamedAlgos(g) }));
```

## Data

- `public/data/gamecards.json` — full game
- `public/data/gamecards_2h.json` — 2H
- `public/data/audit.json` — logged fires
- `public/data/ratings.json` — SP+ / run-diff
- `public/data/handle_report.json` — split fill report
