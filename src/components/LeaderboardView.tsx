import React, { useState } from 'react';
import { Trophy, Search, Flame, Zap, Crown, Award, Medal } from 'lucide-react';
import { sounds } from '../audio';

interface LeaderboardViewProps {
  playerCallsign: string;
  playerScore: number;
  playerKills: number;
}

interface FullPilot {
  rank: number;
  callsign: string;
  tag?: string;
  isPlayer?: boolean;
  tier: 'free' | 'staked';
  mass: number;
  kills: number;
  bountySol: number;
  skinColor: string;
  winRate: string;
  status: 'DOMINATING' | 'HUNTING' | 'EXTRACTING' | 'ACTIVE' | 'IN COMBAT';
}

const LEADERBOARD_DATA: FullPilot[] = [
  {
    rank: 1,
    callsign: 'VIPER_PRIME',
    tag: 'APEX SLINK',
    tier: 'staked',
    mass: 18450,
    kills: 24,
    bountySol: 4.85,
    skinColor: '#ff007f',
    winRate: '88%',
    status: 'DOMINATING',
  },
  {
    rank: 2,
    callsign: 'NEON_HYDRA',
    tag: 'LEGEND',
    tier: 'staked',
    mass: 15200,
    kills: 19,
    bountySol: 3.20,
    skinColor: '#00ff88',
    winRate: '82%',
    status: 'HUNTING',
  },
  {
    rank: 3,
    callsign: 'SOLAR_COIL',
    tag: 'ELITE',
    tier: 'staked',
    mass: 12900,
    kills: 15,
    bountySol: 2.10,
    skinColor: '#ffaa00',
    winRate: '76%',
    status: 'EXTRACTING',
  },
  {
    rank: 4,
    callsign: 'VOID_REAPER',
    tier: 'free',
    mass: 9850,
    kills: 12,
    bountySol: 1.40,
    skinColor: '#a855f7',
    winRate: '71%',
    status: 'ACTIVE',
  },
  {
    rank: 5,
    callsign: 'CYBER_SLINK',
    tier: 'free',
    mass: 8420,
    kills: 10,
    bountySol: 0.95,
    skinColor: '#38bdf8',
    winRate: '68%',
    status: 'ACTIVE',
  },
  {
    rank: 6,
    callsign: 'LASER_FANG',
    tier: 'staked',
    mass: 7650,
    kills: 8,
    bountySol: 0.75,
    skinColor: '#00f5d4',
    winRate: '65%',
    status: 'ACTIVE',
  },
  {
    rank: 7,
    callsign: 'TURBO_VIPER',
    tier: 'free',
    mass: 6920,
    kills: 7,
    bountySol: 0.60,
    skinColor: '#ff0055',
    winRate: '62%',
    status: 'ACTIVE',
  },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  playerCallsign,
  playerScore,
  playerKills,
}) => {
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'staked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPilots = LEADERBOARD_DATA.filter((p) => {
    if (filterTier !== 'all' && p.tier !== filterTier) return false;
    if (searchQuery && !p.callsign.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const podium = LEADERBOARD_DATA.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              SLINK GLOBAL ARENA HIERARCHY
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase font-black text-white tracking-tight">
            HALL OF APEX WORMS
          </h1>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH CALLSIGN..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#0c1026] text-white font-mono text-xs rounded-xl border border-white/15 focus:border-[#00f5d4] outline-none uppercase placeholder:text-slate-500 shadow-inner"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-[#0c1026] border border-white/15">
            {(['all', 'free', 'staked'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  sounds.playBeep(640);
                  setFilterTier(t);
                }}
                className={`px-3 py-1.5 font-mono text-xs uppercase font-bold rounded-lg transition-all cursor-pointer ${
                  filterTier === t
                    ? 'bg-gradient-to-r from-[#00f5d4] to-[#00ff88] text-[#002820] shadow-[0_0_15px_rgba(0,245,212,0.4)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RANK 2 */}
        <div className="order-2 md:order-1 rounded-2xl bg-[#0c1026]/90 border border-slate-400/40 p-6 flex flex-col items-center text-center relative overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
          <div className="absolute top-3 right-3 text-slate-400 font-mono text-xs font-bold">
            SILVER #02
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-500/20 border border-slate-400/50 flex items-center justify-center text-slate-200 mb-3 shadow-[0_0_20px_rgba(148,163,184,0.3)]">
            <Medal className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl font-bold uppercase text-white">
            {podium[1].callsign}
          </h3>
          <span className="font-mono text-xs text-[#00ff88] font-bold mt-1">
            {podium[1].mass.toLocaleString()} LENGTH
          </span>
          <div className="mt-4 flex items-center justify-around w-full border-t border-white/10 pt-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">TAKEDOWNS</span>
              <span className="text-white font-bold">{podium[1].kills} KILLS</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">BOUNTY</span>
              <span className="text-amber-300 font-bold">{podium[1].bountySol} SOL</span>
            </div>
          </div>
        </div>

        {/* RANK 1 - GOLD */}
        <div className="order-1 md:order-2 rounded-2xl bg-[#0c1026]/95 border-2 border-amber-400 p-7 flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(255,170,0,0.25)] -translate-y-2 hover:-translate-y-3 transition-transform">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-amber-400 font-mono text-xs font-extrabold uppercase">
            <Crown className="w-3.5 h-3.5" /> APEX #01
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_30px_rgba(255,170,0,0.5)]">
            <Crown className="w-9 h-9" />
          </div>
          <h3 className="font-display text-2xl font-black uppercase text-white tracking-wide">
            {podium[0].callsign}
          </h3>
          <span className="font-mono text-sm text-amber-300 font-black mt-1">
            {podium[0].mass.toLocaleString()} LENGTH
          </span>
          <div className="mt-5 flex items-center justify-around w-full border-t border-white/10 pt-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">TAKEDOWNS</span>
              <span className="text-pink-400 font-black">{podium[0].kills} KILLS</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL BOUNTY</span>
              <span className="text-amber-400 font-black">{podium[0].bountySol} SOL</span>
            </div>
          </div>
        </div>

        {/* RANK 3 */}
        <div className="order-3 rounded-2xl bg-[#0c1026]/90 border border-amber-700/50 p-6 flex flex-col items-center text-center relative overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
          <div className="absolute top-3 right-3 text-amber-600 font-mono text-xs font-bold">
            BRONZE #03
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-700/20 border border-amber-600/50 flex items-center justify-center text-amber-500 mb-3 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl font-bold uppercase text-white">
            {podium[2].callsign}
          </h3>
          <span className="font-mono text-xs text-amber-400 font-bold mt-1">
            {podium[2].mass.toLocaleString()} LENGTH
          </span>
          <div className="mt-4 flex items-center justify-around w-full border-t border-white/10 pt-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">TAKEDOWNS</span>
              <span className="text-white font-bold">{podium[2].kills} KILLS</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">BOUNTY</span>
              <span className="text-amber-300 font-bold">{podium[2].bountySol} SOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl bg-[#0c1026]/90 border border-cyan-500/25 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#060814]/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <th className="p-4">RANK</th>
                <th className="p-4">WORM CALLSIGN</th>
                <th className="p-4">ZONE</th>
                <th className="p-4">LENGTH / MASS</th>
                <th className="p-4">SHATTERS</th>
                <th className="p-4">BOUNTY REAPED</th>
                <th className="p-4">WIN RATE</th>
                <th className="p-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Player Row */}
              <tr className="bg-cyan-500/10 border-y-2 border-cyan-400/50">
                <td className="p-4 font-black text-[#00f5d4]">#05</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]" />
                    <span className="font-extrabold text-[#00f5d4]">{playerCallsign || 'SLINK_VIPER'}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-cyan-950 text-[#00f5d4] rounded-md border border-cyan-400/40 font-bold">
                      YOU
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                    FREE ARCADE
                  </span>
                </td>
                <td className="p-4 font-black text-[#00f5d4]">{playerScore.toLocaleString()}</td>
                <td className="p-4 font-black text-pink-400">{playerKills} KILLS</td>
                <td className="p-4 font-black text-amber-300">0.85 SOL</td>
                <td className="p-4 font-bold text-white">74%</td>
                <td className="p-4 text-right">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-[#00f5d4] border border-cyan-400/50 text-[10px] font-black uppercase">
                    SLITHERING
                  </span>
                </td>
              </tr>

              {/* Pilots */}
              {filteredPilots.map((pilot) => (
                <tr key={pilot.rank} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-slate-400">
                    {pilot.rank === 1 ? (
                      <span className="text-amber-400 font-black">#01</span>
                    ) : (
                      `#${pilot.rank.toString().padStart(2, '0')}`
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: pilot.skinColor }}
                      />
                      <span className="font-bold text-white">{pilot.callsign}</span>
                      {pilot.tag && (
                        <span className="text-[9px] px-2 py-0.5 bg-[#060814] text-pink-400 rounded-md border border-pink-500/30 font-bold">
                          {pilot.tag}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md uppercase font-bold border ${
                        pilot.tier === 'staked'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-[#060814] text-slate-300 border-white/10'
                      }`}
                    >
                      {pilot.tier}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">{pilot.mass.toLocaleString()}</td>
                  <td className="p-4 font-bold text-pink-400">{pilot.kills} KILLS</td>
                  <td className="p-4 font-bold text-amber-300">{pilot.bountySol.toFixed(2)} SOL</td>
                  <td className="p-4 text-slate-300">{pilot.winRate}</td>
                  <td className="p-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        pilot.status === 'DOMINATING'
                          ? 'bg-pink-500/20 text-[#ff007f] border border-pink-500/40'
                          : pilot.status === 'HUNTING'
                          ? 'bg-cyan-500/20 text-[#00f5d4] border border-cyan-400/40'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      {pilot.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
