export async function loadOddsPipeline() {
  const [fg, tw, audit, ratings] = await Promise.all([
    fetch('/data/gamecards.json', { cache: 'no-store' }).then((r) => r.json()),
    fetch('/data/gamecards_2h.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : { games: [] })),
    fetch('/data/audit.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : { plays: [] })),
    fetch('/data/ratings.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : {})),
  ]);
  return {
    source: 'odds-cascade',
    pulled_at: fg.pulled_at,
    games: [...(fg.games || []), ...(tw.games || [])],
    audit,
    ratings,
  };
}
