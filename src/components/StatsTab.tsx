import React from 'react';
import { MatchStats, PlayerRanking } from '../types';

interface StatsTabProps {
  stats: MatchStats;
}

const RankingColumn: React.FC<{ title: string; rows: PlayerRanking[]; accent: string }> = ({ title, rows, accent }) => (
  <section className="border-4 border-black bg-white text-black shadow-[6px_6px_0px_0px_#000000]">
    <h2 className={`border-b-4 border-black p-4 text-lg font-black uppercase text-black ${accent}`}>{title}</h2>
    {rows.length === 0 ? (
      <p className="p-5 text-sm font-bold uppercase">No records yet</p>
    ) : (
      <ol>
        {rows.map((row, index) => (
          <li key={row.playerId} className="flex items-center justify-between gap-3 border-b-2 border-black p-4 last:border-b-0">
            <span className="flex min-w-0 items-center gap-3">
              <span className="w-6 shrink-0 text-lg font-black">{index + 1}</span>
              <span className="truncate font-black uppercase">{row.name}</span>
            </span>
            <span className="shrink-0 border-2 border-black bg-zinc-100 px-2 py-1 text-lg font-black">{row.count}</span>
          </li>
        ))}
      </ol>
    )}
  </section>
);

export const StatsTab: React.FC<StatsTabProps> = ({ stats }) => (
  <div className="mx-auto max-w-7xl space-y-8 py-8">
    <div className="border-4 border-black bg-[#CCFF00] p-6 shadow-[8px_8px_0px_0px_#000000]">
      <h1 className="text-4xl font-black uppercase">PLAYER STATS</h1>
      <p className="mt-2 text-sm font-bold uppercase">{stats.matches} matches recorded</p>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <RankingColumn title="Goals" rows={stats.goalsRanking} accent="bg-[#00F0FF]" />
      <RankingColumn title="Assists" rows={stats.assistsRanking} accent="bg-[#CCFF00]" />
      <RankingColumn title="Appearances" rows={stats.appearancesRanking} accent="bg-[#00FF66]" />
    </div>
  </div>
);
