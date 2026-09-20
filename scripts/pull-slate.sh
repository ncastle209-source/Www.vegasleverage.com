#!/bin/bash
set -e
mkdir -p public/data artifacts/vegas-leverage-app/public/data
BASE=https://raw.githubusercontent.com/ncastle209-source/Www.vegasleverage.com/main/public/data
for f in gamecards.json gamecards_2h.json audit.json ratings.json handle_report.json extras.json extras_report.json team_stats.json season_stats.json; do
  if curl -fsSL -o "public/data/$f" "$BASE/$f"; then
    echo "ok $f"
  else
    echo "fail $f"
  fi
done
cp -f public/data/*.json artifacts/vegas-leverage-app/public/data/ 2>/dev/null || true
ls -lh public/data
