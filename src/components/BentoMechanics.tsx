import React from 'react';
import { sounds } from '../audio';
import {
  SlinkHungry,
  SlinkSpeedy,
  SlinkChampion,
  SoundBurst,
} from './RetroCartoonCharacters';
import { Zap, Sparkles, Award } from 'lucide-react';

export const BentoMechanics: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Styled as Comic Strip Intro */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b-3 border-[#1E1B18] pb-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
            <Zap className="h-4 w-4 text-[#1E1B18]" />
            <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
              3 EASY RULES OF THE MEADOW
            </span>
          </div>

          <h2 className="font-comic text-4xl sm:text-5xl uppercase tracking-wide text-[#1E1B18] drop-shadow-[2px_2px_0px_rgba(250,130,76,0.3)]">
            HOW TO BE A TOP WORM
          </h2>
        </div>

        <p className="max-w-md font-body text-sm sm:text-base leading-relaxed text-[#5C3D2E] font-medium">
          Chomp shiny apples, zip around your rivals, and watch your wobbly tail grow longer than a garden hose!
        </p>
      </div>

      {/* 3 Physical Comic Strip Panels (Matching Wetcat card color trio: Cyan, Hot Pink, Lime) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* PANEL 1 — CHOMP FRUIT (CYAN) */}
        <div
          onMouseEnter={() => sounds.playBeep(660)}
          className="group comic-card bg-[#55B3F3] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden rounded-2xl"
        >
          {/* Comic Panel Number Stamp */}
          <div className="flex items-center justify-between pb-3 border-b-3 border-[#111111]/30">
            <span className="font-comic text-sm uppercase text-[#111111] tracking-wider font-bold">
              EPISODE 01
            </span>
            <SoundBurst text="CHOMP!" color="#FFD13B" className="text-xs" />
          </div>

          <div className="my-5 flex flex-col items-center text-center">
            <div className="p-3.5 bg-white rounded-2xl border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mb-4 group-hover:scale-105 transition-transform">
              <SlinkHungry size={70} />
            </div>

            <h3 className="font-comic text-3xl uppercase tracking-wide text-[#111111] mb-2 font-bold drop-shadow-[1px_1px_0px_white]">
              1. CHOMP &amp; GROW!
            </h3>

            <p className="font-body text-xs sm:text-sm leading-relaxed text-[#111111] font-semibold">
              Slither across the soil gobbling juicy red apples, sweet oranges, strawberries, and velvety plums. Every fruit adds a plump segment to your wiggly body!
            </p>
          </div>

          <div className="rounded-xl border-3 border-[#111111] bg-white p-3 text-center shadow-[3px_3px_0px_#111111]">
            <span className="font-comic text-xs uppercase tracking-wider text-[#111111] font-bold">
              FRUIT HARVEST: <strong className="text-[#FF5D8F]">+35 TO +65 PTS</strong>
            </span>
          </div>
        </div>

        {/* PANEL 2 — ZOOM & TRAP (HOT PINK) */}
        <div
          onMouseEnter={() => sounds.playBeep(720)}
          className="group comic-card bg-[#FF5D8F] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b-3 border-[#111111]/30">
            <span className="font-comic text-sm uppercase text-[#111111] tracking-wider font-bold">
              EPISODE 02
            </span>
            <SoundBurst text="ZOOM!" color="#B4F000" className="text-xs" />
          </div>

          <div className="my-5 flex flex-col items-center text-center">
            <div className="p-3.5 bg-white rounded-2xl border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mb-4 group-hover:scale-105 transition-transform">
              <SlinkSpeedy size={70} />
            </div>

            <h3 className="font-comic text-3xl uppercase tracking-wide text-[#111111] mb-2 font-bold drop-shadow-[1px_1px_0px_white]">
              2. CUT &amp; COIL!
            </h3>

            <p className="font-body text-xs sm:text-sm leading-relaxed text-[#111111] font-semibold">
              Hold space or tap boost to spurt ahead of fast centipedes, sneaky snakes, and chubby slugs! If their head bumps into your tail, they poof into a heap of ripe fruits!
            </p>
          </div>

          <div className="rounded-xl border-3 border-[#111111] bg-white p-3 text-center shadow-[3px_3px_0px_#111111]">
            <span className="font-comic text-xs uppercase tracking-wider text-[#111111] font-bold">
              TAKEDOWN BURST: <strong className="text-[#B4F000] drop-shadow-[1px_1px_0px_#111111]">+500 PTS</strong>
            </span>
          </div>
        </div>

        {/* PANEL 3 — BECOME THE CHAMP (LIME GREEN) */}
        <div
          onMouseEnter={() => sounds.playBeep(800)}
          className="group comic-card bg-[#B4F000] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b-3 border-[#111111]/30">
            <span className="font-comic text-sm uppercase text-[#111111] tracking-wider font-bold">
              EPISODE 03
            </span>
            <SoundBurst text="HOORAY!" color="#FF5D8F" className="text-xs" />
          </div>

          <div className="my-5 flex flex-col items-center text-center">
            <div className="p-3.5 bg-white rounded-2xl border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mb-4 group-hover:scale-105 transition-transform">
              <SlinkChampion size={70} />
            </div>

            <h3 className="font-comic text-3xl uppercase tracking-wide text-[#111111] mb-2 font-bold drop-shadow-[1px_1px_0px_white]">
              3. WEAR THE CROWN!
            </h3>

            <p className="font-body text-xs sm:text-sm leading-relaxed text-[#111111] font-semibold">
              Reach the top of the Meadow Leaderboard! Earn glossy winner ribbons, funny cartoon trophies, and bounties of tasty $SLINK tokens!
            </p>
          </div>

          <div className="rounded-xl border-3 border-[#111111] bg-white p-3 text-center shadow-[3px_3px_0px_#111111]">
            <span className="font-comic text-xs uppercase tracking-wider text-[#111111] font-bold">
              TOP PRIZE: <strong className="text-[#FF5D8F]">GOLDEN CROWN &amp; TOKENS</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
