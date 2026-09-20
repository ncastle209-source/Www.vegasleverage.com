import React, { useEffect, useState } from 'react';

export default function AuditBoard() {
  const [audit, setAudit] = useState({ plays: [], pending: 0, wins: 0, losses: 0 });
  useEffect(() => {
    fetch('/data/audit.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (payload) setAudit(payload);
      })
      .catch(() => {});
  }, []);
  const plays = audit.plays || [];
  return (
    <section>
      <h3>Pick audit</h3>
      <div>
        {audit.wins || 0}W - {audit.losses || 0}L · {audit.pending || plays.filter((p) => p.result === 'pending').length} pending
      </div>
      {plays.length === 0 ? (
        <div>No fires logged yet.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Matchup</th>
              <th>Engine</th>
              <th>Tix</th>
              <th>Handle</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {plays.slice(-40).reverse().map((play) => (
              <tr key={(play.gameId || '') + (play.at || '')}>
                <td>{play.matchup}</td>
                <td>{play.engine}</td>
                <td>{play.tickets ?? '—'}</td>
                <td>{play.handle ?? '—'}</td>
                <td>{play.result || 'pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
