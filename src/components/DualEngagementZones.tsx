import React from 'react';
import { ArrowRight, ShieldCheck, Flame, Zap, Trophy } from 'lucide-react';
import { sounds } from '../audio';

interface DualEngagementZonesProps {
  onSelectFree: () => void;
  onSelectStaked: () => void;
}

export const DualEngagementZones: React.FC<DualEngagementZonesProps> = ({
  onSelectFree,
  onSelectStaked,
}) => {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#060814]/80 border-y border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
            <Zap className="w-3.5 h-3.5" />
            CHOOSE YOUR SLINK ARENA
          </div>

          <h2 className="font-display text-3xl sm:text-4xl uppercase text-white font-black tracking-tight">
            SELECT COMBAT ZONE
          </h2>

          <p className="font-mono text-sm text-slate-300 mt-2">
            Jump into the free-for-all grid to practice slithering maneuvers, or prepare for high-stakes $SLINK bounty runs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
          {/* CARD 1: FREE ARCADE ARENA */}
          <div className="relative rounded-2xl p-6 sm:p-8 bg-[#0c1026]/90 border border-cyan-500/30 backdrop-blur-xl flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)] overflow-hidden group hover:border-cyan-400 transition-all">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00f5d4] via-[#00ff88] to-[#00f5d4] shadow-[0_0_15px_#00f5d4]" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#00f5d4] px-3 py-1 bg-cyan-950/80 rounded-lg border border-cyan-500/30 tracking-wider uppercase">
                  ZONE 01 · ARCADE GRID
                </span>

                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#00ff88]">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
                  INSTANT DROP
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl uppercase text-white font-black tracking-tight">
                  FREE ARCADE ARENA
                </h3>
                <p className="font-mono text-xs text-cyan-300/80 tracking-wider mt-1">
                  Endless Slither · Instant Respawn · 0 Gas Fees
                </p>
              </div>

              <p className="font-mono text-sm text-slate-300 leading-relaxed">
                Enter the global vector grid with no wallet required. Eat glowing biomass, grow your cyber worm,
                trap rivals with your radiant trail, and fight for the #1 spot on the global leaderboard.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono text-xs">
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">ENTRY</span>
                  <span className="text-[#00f5d4] text-sm font-black mt-0.5">FREE</span>
                </div>
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">RESPAWN</span>
                  <span className="text-white text-sm font-black mt-0.5">INSTANT</span>
                </div>
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">TICKS</span>
                  <span className="text-emerald-400 text-sm font-black mt-0.5">60 FPS</span>
                </div>
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">POWERUPS</span>
                  <span className="text-amber-400 text-sm font-black mt-0.5">ALL ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  sounds.playBoostSound();
                  onSelectFree();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#00f5d4] via-[#00ff88] to-[#00f5d4] text-[#002820] font-display font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(0,245,212,0.5)] hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(0,245,212,0.8)] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>SLITHER IN FREE ARENA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2: PRO BOUNTY ARENA */}
          <div className="relative rounded-2xl p-6 sm:p-8 bg-[#0c1026]/90 border border-amber-500/30 backdrop-blur-xl flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)] overflow-hidden group hover:border-amber-400 transition-all">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ffaa00] via-[#fbbf24] to-[#f97316] shadow-[0_0_15px_#ffaa00]" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-amber-300 px-3 py-1 bg-amber-950/80 rounded-lg border border-amber-500/30 tracking-wider uppercase">
                  ZONE 02 · HIGH-STAKES
                </span>

                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  PRO PROTOCOL
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl uppercase text-white font-black tracking-tight">
                  $SLINK BOUNTY RUN
                </h3>
                <p className="font-mono text-xs text-amber-300/80 tracking-wider mt-1">
                  Competitive Wagers · Takedown Bounties · Star Pools
                </p>
              </div>

              <p className="font-mono text-sm text-slate-300 leading-relaxed">
                Put your skills to the test. Stake $SLINK tokens to enter the competitive arena.
                Every rival you shatter transfers their staked bounty pool into your vault.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono text-xs">
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">STAKE</span>
                  <span className="text-amber-400 text-sm font-black mt-0.5">50 $SLINK</span>
                </div>
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">KILL BOUNTY</span>
                  <span className="text-amber-300 text-sm font-black mt-0.5">85% CUT</span>
                </div>
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">STATUS</span>
                  <span className="text-amber-400 text-sm font-black mt-0.5">COMING SOON</span>
                </div>
                <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">POOL</span>
                  <span className="text-cyan-400 text-sm font-black mt-0.5">DYNAMIC</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(680);
                  onSelectStaked();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#1a0f00] font-display font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(255,170,0,0.4)] hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(255,170,0,0.6)] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>ENTER $SLINK BOUNTY ARENA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
