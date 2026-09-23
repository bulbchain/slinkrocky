import React, { useState, useEffect } from 'react';
import { TelemetryLogItem } from '../types';
import { Radio, Crosshair, Flame, Sparkles } from 'lucide-react';
import { sounds } from '../audio';

interface LiveTelemetryProps {
  playerCallsign: string;
  playerScore: number;
  playerKills: number;
}

const INITIAL_LOGS: TelemetryLogItem[] = [
  {
    id: '1',
    killer: 'VIPER_PRIME',
    victim: 'ZEPHYR_COIL',
    method: 'with a lethal trail cut',
    lumensReaped: 820,
    timeAgo: '3s AGO',
  },
  {
    id: '2',
    killer: 'NEON_HYDRA',
    victim: 'KRONOS_WORM',
    method: 'with a high-speed coil trap',
    lumensReaped: 1240,
    timeAgo: '12s AGO',
  },
  {
    id: '3',
    killer: 'SOLAR_COIL',
    victim: 'NEO_VECTOR',
    method: 'pinned on the energy wall',
    lumensReaped: 1650,
    timeAgo: '24s AGO',
  },
];

const MOCK_KILLERS = [
  'VIPER_PRIME',
  'NEON_HYDRA',
  'SOLAR_COIL',
  'VOID_REAPER',
  'CYBER_SLINK',
  'LASER_FANG',
  'TURBO_VIPER',
];

const MOCK_VICTIMS = [
  'AERO_COIL',
  'DRIFT_PUP',
  'GLOW_FANG',
  'NEXUS_9',
  'GLITCH_WORM',
  'VORTEX_TAIL',
];

const MOCK_METHODS = [
  'with a high-speed vector cut',
  'after an aggressive head-to-body clash',
  'with an inescapable perimeter coil',
  'during an overcharged nitro sprint',
  'inside a tight light barrier snare',
];

export const LiveTelemetry: React.FC<LiveTelemetryProps> = ({
  playerCallsign,
  playerScore,
  playerKills,
}) => {
  const [logs, setLogs] = useState<TelemetryLogItem[]>(INITIAL_LOGS);
  const [aggregateLumens, setAggregateLumens] = useState(1284920);

  useEffect(() => {
    const timer = setInterval(() => {
      const killer = MOCK_KILLERS[Math.floor(Math.random() * MOCK_KILLERS.length)];
      const victim = MOCK_VICTIMS[Math.floor(Math.random() * MOCK_VICTIMS.length)];
      const method = MOCK_METHODS[Math.floor(Math.random() * MOCK_METHODS.length)];
      const reaped = Math.floor(Math.random() * 900) + 300;

      const newEntry: TelemetryLogItem = {
        id: Date.now().toString(),
        killer,
        victim,
        method,
        lumensReaped: reaped,
        timeAgo: 'JUST NOW',
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 3)]);
      setAggregateLumens((prev) => prev + reaped);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00f5d4] uppercase tracking-widest font-bold">
            LIVE ARENA COMBAT TELEMETRY
          </span>

          <h2 className="font-display text-3xl sm:text-4xl uppercase text-white font-black tracking-tight mt-1">
            REAL-TIME SLINK ACTIVITY
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
          <span className="font-mono text-xs text-slate-300 font-semibold">
            SYNCHRONIZED FEED · 60 FPS
          </span>
        </div>
      </div>

      {/* Leaderboard + Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* WORM LEADERBOARD */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0c1026]/90 border border-cyan-500/25 overflow-hidden shadow-2xl">
          <div className="p-4 bg-[#080d22] border-b border-white/10 flex items-center justify-between">
            <span className="font-mono text-xs text-[#00f5d4] tracking-wider uppercase font-bold">
              TOP WORMS IN CURRENT MATCH
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              GLOBAL SECTOR #1
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#060814]/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <th className="p-4">RANK</th>
                  <th className="p-4">WORM</th>
                  <th className="p-4">LENGTH</th>
                  <th className="p-4">TAKEDOWNS</th>
                  <th className="p-4">BOUNTY</th>
                  <th className="p-4 text-right">STATUS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {/* Row 1 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-black text-amber-400">#01</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff007f] shadow-[0_0_8px_#ff007f]" />
                      <span className="font-bold text-white">VIPER_PRIME</span>
                      <span className="text-[9px] px-2 py-0.5 bg-[#060814] text-pink-400 rounded border border-pink-500/30 font-bold">
                        APEX
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">18,450</td>
                  <td className="p-4 font-black text-pink-400">24 KILLS</td>
                  <td className="p-4 text-amber-300 font-bold">4.85 SOL</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-[#ff007f] border border-pink-500/40 text-[10px] font-bold uppercase">
                      DOMINATING
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-slate-400">#02</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
                      <span className="font-bold text-white">NEON_HYDRA</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">15,200</td>
                  <td className="p-4 font-black text-pink-400">19 KILLS</td>
                  <td className="p-4 text-amber-300 font-bold">3.20 SOL</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#00ff88] border border-emerald-500/40 text-[10px] font-bold uppercase">
                      HUNTING
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-slate-400">#03</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffaa00]" />
                      <span className="font-bold text-white">SOLAR_COIL</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">12,900</td>
                  <td className="p-4 font-black text-pink-400">15 KILLS</td>
                  <td className="p-4 text-amber-300 font-bold">2.10 SOL</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                      ACTIVE
                    </span>
                  </td>
                </tr>

                {/* Player Row */}
                <tr className="bg-cyan-500/10 border-y border-cyan-400/40">
                  <td className="p-4 font-black text-[#00f5d4]">#05</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]" />
                      <span className="font-black text-[#00f5d4]">{playerCallsign || 'SLINK_VIPER'}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-cyan-950 text-[#00f5d4] rounded border border-cyan-400/40 font-bold">
                        YOU
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-black text-[#00f5d4]">{playerScore.toLocaleString()}</td>
                  <td className="p-4 font-black text-pink-400">{playerKills} KILLS</td>
                  <td className="p-4 text-amber-300 font-bold">0.85 SOL</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[#00f5d4] border border-cyan-400/40 text-[10px] font-black uppercase">
                      SLITHERING
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* LIVE COMBAT KILL FEED */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0c1026]/90 border border-pink-500/25 p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-pink-400">
              <Crosshair className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                COMBAT KILL FEED
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">LIVE FEED</span>
          </div>

          <div className="flex flex-col gap-3 font-mono text-xs">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#060814] border border-white/10 flex flex-col gap-1.5 transition-all hover:border-pink-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{log.killer}</span>
                  <span className="text-[10px] text-slate-500">{log.timeAgo}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  shattered <strong className="text-pink-400">{log.victim}</strong> {log.method}
                </p>
                <div className="flex items-center justify-between text-[10px] text-amber-300 pt-1 border-t border-white/5">
                  <span>Star Loot Harvested:</span>
                  <span className="font-bold">+{log.lumensReaped} MASS</span>
                </div>
              </div>
            ))}
          </div>

          {/* Aggregate Tally */}
          <div className="mt-2 p-3.5 rounded-xl bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border border-white/10 flex items-center justify-between font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">TOTAL HARVESTED:</span>
            <span className="text-sm font-black text-white">{aggregateLumens.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
