import React from 'react';
import { UserCheck, Infinity as InfinityIcon, Trophy, Sparkles } from 'lucide-react';
import { sounds } from '../audio';

export const EngagementLoop: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="font-mono text-xs text-[#00f5d4] uppercase tracking-widest font-bold">
          SLINK TACTICAL PROTOCOL
        </span>

        <h2 className="font-display text-3xl sm:text-4xl uppercase text-white font-black mt-2 tracking-tight">
          THE 3-STEP ASCENSION LOOP
        </h2>

        <p className="font-mono text-sm text-slate-300 mt-2">
          From a tiny glowing seedling to the apex cyber titan dominating the perimeter.
        </p>
      </div>

      {/* 3-Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* STEP 1 */}
        <div
          onMouseEnter={() => sounds.playBeep(580)}
          className="p-6 sm:p-8 rounded-2xl bg-[#0c1026]/90 border border-cyan-500/25 flex flex-col gap-4 shadow-xl hover:bg-[#111736] hover:border-cyan-400 transition-all hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.3)]">
              <UserCheck className="w-6 h-6" />
            </div>

            <span className="font-display text-3xl text-cyan-400/30 font-black">
              01
            </span>
          </div>

          <div>
            <h3 className="font-display text-xl uppercase text-white font-bold tracking-wide">
              CUSTOMIZE &amp; DROP
            </h3>

            <p className="font-mono text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Equip your preferred vibrant skin, name your worm, and drop into the matrix.
              Every Slink starts agile and fast — keep moving to secure your first food territory.
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div
          onMouseEnter={() => sounds.playBeep(680)}
          className="p-6 sm:p-8 rounded-2xl bg-[#0c1026]/90 border border-pink-500/25 flex flex-col gap-4 shadow-xl hover:bg-[#111736] hover:border-pink-400 transition-all hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-pink-950/80 border border-pink-400/40 flex items-center justify-center text-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.3)]">
              <InfinityIcon className="w-6 h-6" />
            </div>

            <span className="font-display text-3xl text-pink-400/30 font-black">
              02
            </span>
          </div>

          <div>
            <h3 className="font-display text-xl uppercase text-white font-bold tracking-wide">
              CONSUME &amp; EXPAND
            </h3>

            <p className="font-mono text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Vacuum radiant neon energy clusters. With each segment added, your radius expands,
              turning your trailing body into a lethal kinetic wall.
            </p>
          </div>
        </div>

        {/* STEP 3 */}
        <div
          onMouseEnter={() => sounds.playBeep(780)}
          className="p-6 sm:p-8 rounded-2xl bg-[#0c1026]/90 border border-amber-500/25 flex flex-col gap-4 shadow-xl hover:bg-[#111736] hover:border-amber-400 transition-all hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,170,0,0.3)]">
              <Trophy className="w-6 h-6" />
            </div>

            <span className="font-display text-3xl text-amber-400/30 font-black">
              03
            </span>
          </div>

          <div>
            <h3 className="font-display text-xl uppercase text-white font-bold tracking-wide">
              INTERCEPT &amp; CONQUER
            </h3>

            <p className="font-mono text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Use tactical boost cuts to force rival worms into your tail. Absorb their Star Loot
              and reign undefeated on the global Slink podium.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
