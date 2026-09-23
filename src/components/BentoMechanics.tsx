import React from 'react';
import {
  CircleDot,
  Swords,
  Trophy,
  Zap,
  Flame,
  Magnet,
} from 'lucide-react';
import { sounds } from '../audio';

export const BentoMechanics: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-white/10 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-400">
            <Zap className="h-4 w-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f5d4]">
              SLINK SURVIVAL DYNAMICS
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            DOMINATE THE CYBER GRID
          </h2>
        </div>

        <p className="max-w-md font-mono text-sm leading-relaxed text-slate-300">
          Eat glowing orbs, execute sharp kinetic cuts against rival trails, and absorb
          their cosmic remains to become the apex cyber worm in the arena.
        </p>
      </div>

      {/* 3 Core Mechanics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* CARD 1 — CONSUME & SCALE */}
        <div
          onMouseEnter={() => sounds.playBeep(660)}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0c1026]/80 p-6 shadow-xl transition-all hover:border-cyan-400 hover:bg-[#101633] hover:-translate-y-1 sm:p-8"
        >
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#00f5d4]/15 blur-3xl transition-all group-hover:bg-[#00f5d4]/30" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-950/70 text-[#00f5d4] shadow-[0_0_20px_rgba(0,245,212,0.3)]">
              <CircleDot className="h-6 w-6" />
            </div>

            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#00f5d4]">
              01. BIOMASS HARVEST
            </span>

            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              EAT &amp; SCALE UP
            </h3>

            <p className="font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
              Start lean and agile. Slither across the grid devouring luminous energy orbs.
              Each bite extends your segmented trail, turning your body into an inescapable obstacle for rivals.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-xl border border-cyan-500/20 bg-[#060814]/80 p-3.5">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              PRIMARY TACTIC
            </span>
            <span className="font-mono text-xs font-bold text-[#00f5d4]">
              COLLECT ENERGY ORBS
            </span>
          </div>
        </div>

        {/* CARD 2 — KINETIC CUT & TRAP */}
        <div
          onMouseEnter={() => sounds.playBeep(720)}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-pink-500/30 bg-[#0c1026]/80 p-6 shadow-xl transition-all hover:border-pink-400 hover:bg-[#101633] hover:-translate-y-1 sm:p-8"
        >
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#ff007f]/15 blur-3xl transition-all group-hover:bg-[#ff007f]/30" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-pink-400/40 bg-pink-950/70 text-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.3)]">
              <Swords className="h-6 w-6" />
            </div>

            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#ff007f]">
              02. KINETIC INTERCEPTION
            </span>

            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              CUT &amp; TRAP RIVALS
            </h3>

            <p className="font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
              Hold boost to dash across the path of oncoming worms. When their head crashes into your
              glowing tail, they shatter into high-value Star Loot orbs for you to feast upon.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-xl border border-pink-500/20 bg-[#060814]/80 p-3.5">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              COMBAT RULE
            </span>
            <span className="font-mono text-xs font-bold text-[#ff007f]">
              HEAD-TO-TAIL SHATTER
            </span>
          </div>
        </div>

        {/* CARD 3 — APEX DOMINATION */}
        <div
          onMouseEnter={() => sounds.playBeep(780)}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0c1026]/80 p-6 shadow-xl transition-all hover:border-amber-400 hover:bg-[#101633] hover:-translate-y-1 sm:p-8"
        >
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#ffaa00]/15 blur-3xl transition-all group-hover:bg-[#ffaa00]/30" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-950/70 text-amber-400 shadow-[0_0_20px_rgba(255,170,0,0.3)]">
              <Trophy className="h-6 w-6" />
            </div>

            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-400">
              03. LEADERBOARD REIGN
            </span>

            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              APEX DOMINATION
            </h3>

            <p className="font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
              Coil around smaller worms to enclose them, pick up Magnet and Overclock power-ups,
              and maintain your score to reign as the supreme titan of the SLINK arena.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-xl border border-amber-500/20 bg-[#060814]/80 p-3.5">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              ENDGAME GOAL
            </span>
            <span className="font-mono text-xs font-bold text-amber-400">
              RANK #1 ON LEADERBOARD
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
