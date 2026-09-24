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

      {/* 3 Physical Comic Strip Panels */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* PANEL 1 — CHOMP APPLES */}
        <div
          onMouseEnter={() => sounds.playBeep(660)}
          className="group comic-card bg-[#FFFDF8] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Comic Panel Number Stamp */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1B18]/15">
            <span className="font-comic text-sm uppercase text-[#FA824C] tracking-wider">
              EPISODE 01
            </span>
            <SoundBurst text="CHOMP!" color="#FFD13B" className="text-xs" />
          </div>

          <div className="my-5 flex flex-col items-center text-center">
            <div className="p-3 bg-[#FFF0D6] rounded-2xl border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] mb-4 group-hover:scale-105 transition-transform">
              <SlinkHungry size={70} />
            </div>

            <h3 className="font-comic text-2xl uppercase tracking-wide text-[#1E1B18] mb-2">
              1. CHOMP &amp; GROW!
            </h3>

            <p className="font-body text-xs sm:text-sm leading-relaxed text-[#5C3D2E]">
              Slither across the soil gobbling juicy red apples, sweet oranges, strawberries, and velvety plums. Every fruit adds a plump segment to your wiggly body!
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#1E1B18] bg-[#FFF8ED] p-3 text-center shadow-[2px_2px_0px_#1E1B18]">
            <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
              FRUIT HARVEST: <strong className="text-[#FA824C]">+35 TO +65 PTS</strong>
            </span>
          </div>
        </div>

        {/* PANEL 2 — ZOOM & TRAP */}
        <div
          onMouseEnter={() => sounds.playBeep(720)}
          className="group comic-card bg-[#78C0E0] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1B18]/25">
            <span className="font-comic text-sm uppercase text-[#1E1B18] tracking-wider">
              EPISODE 02
            </span>
            <SoundBurst text="ZOOM!" color="#FA824C" className="text-xs" />
          </div>

          <div className="my-5 flex flex-col items-center text-center">
            <div className="p-3 bg-white rounded-2xl border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] mb-4 group-hover:scale-105 transition-transform">
              <SlinkSpeedy size={70} />
            </div>

            <h3 className="font-comic text-2xl uppercase tracking-wide text-[#1E1B18] mb-2">
              2. CUT &amp; COIL!
            </h3>

            <p className="font-body text-xs sm:text-sm leading-relaxed text-[#1E1B18] font-medium">
              Hold space or tap boost to spurt ahead of fast centipedes, sneaky snakes, and chubby slugs! If their head bumps into your tail, they poof into a heap of ripe fruits!
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#1E1B18] bg-white p-3 text-center shadow-[2px_2px_0px_#1E1B18]">
            <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
              TAKEDOWN BURST: <strong className="text-[#E63946]">+500 PTS</strong>
            </span>
          </div>
        </div>

        {/* PANEL 3 — BECOME THE CHAMP */}
        <div
          onMouseEnter={() => sounds.playBeep(800)}
          className="group comic-card bg-[#FFD13B] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1B18]/25">
            <span className="font-comic text-sm uppercase text-[#1E1B18] tracking-wider">
              EPISODE 03
            </span>
            <SoundBurst text="HOORAY!" color="#70A288" className="text-xs" />
          </div>

          <div className="my-5 flex flex-col items-center text-center">
            <div className="p-3 bg-[#FFFDF8] rounded-2xl border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] mb-4 group-hover:scale-105 transition-transform">
              <SlinkChampion size={70} />
            </div>

            <h3 className="font-comic text-2xl uppercase tracking-wide text-[#1E1B18] mb-2">
              3. WEAR THE CROWN!
            </h3>

            <p className="font-body text-xs sm:text-sm leading-relaxed text-[#1E1B18] font-medium">
              Reach the top of the Meadow Leaderboard! Earn glossy winner ribbons, funny cartoon trophies, and bounties of tasty $SLINK tokens!
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#1E1B18] bg-white p-3 text-center shadow-[2px_2px_0px_#1E1B18]">
            <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
              TOP PRIZE: <strong className="text-[#FA824C]">GOLDEN CROWN &amp; TOKENS</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
