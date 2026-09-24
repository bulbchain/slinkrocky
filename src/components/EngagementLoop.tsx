import React from 'react';
import { sounds } from '../audio';
import {
  SlinkPeeking,
  SlinkHungry,
  SlinkChampion,
  SoundBurst,
} from './RetroCartoonCharacters';

export const EngagementLoop: React.FC = () => {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-block px-3 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-[#1E1B18] font-comic text-xs uppercase tracking-wider mb-2">
          THE ROAD TO GLORY
        </div>

        <h2 className="font-comic text-4xl sm:text-5xl uppercase text-[#1E1B18] tracking-wide">
          THE 3-STEP ASCENSION LOOP
        </h2>

        <p className="font-body text-base text-[#5C3D2E] font-medium mt-1">
          From a tiny hungry wiggle to the undisputed king of the Sunday funny pages!
        </p>
      </div>

      {/* 3-Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* STEP 1 */}
        <div
          onMouseEnter={() => sounds.playBeep(580)}
          className="comic-card bg-[#FFFDF8] p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#78C0E0] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              <SlinkPeeking size={46} />
            </div>

            <span className="font-comic text-4xl text-[#78C0E0] select-none">
              01
            </span>
          </div>

          <div>
            <h3 className="font-comic text-2xl uppercase text-[#1E1B18] tracking-wide">
              1. PICK A SILLY LOOK
            </h3>

            <p className="font-body text-xs sm:text-sm text-[#5C3D2E] mt-2 leading-relaxed">
              Name your worm something hilarious, select bright cartoon colors (Tangerine, Sunny, Sky, Clover), and wriggle straight onto the meadow grass!
            </p>
          </div>

          <div className="mt-auto pt-3 border-t-2 border-[#1E1B18]/15 flex items-center justify-between">
            <span className="font-comic text-xs text-[#1E1B18]">STEP: START</span>
            <SoundBurst text="READY!" color="#FFD13B" className="text-xs" />
          </div>
        </div>

        {/* STEP 2 */}
        <div
          onMouseEnter={() => sounds.playBeep(680)}
          className="comic-card bg-[#FFFDF8] p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#FA824C] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              <SlinkHungry size={46} />
            </div>

            <span className="font-comic text-4xl text-[#FA824C] select-none">
              02
            </span>
          </div>

          <div>
            <h3 className="font-comic text-2xl uppercase text-[#1E1B18] tracking-wide">
              2. MUNCH &amp; GROW!
            </h3>

            <p className="font-body text-xs sm:text-sm text-[#5C3D2E] mt-2 leading-relaxed">
              Snack on juicy Honeycrisp apples, catch bubbly power-ups (Magnets, Bubble Shields, Nitro Rockets), and circle rivals until they get tangled up!
            </p>
          </div>

          <div className="mt-auto pt-3 border-t-2 border-[#1E1B18]/15 flex items-center justify-between">
            <span className="font-comic text-xs text-[#1E1B18]">STEP: FEAST</span>
            <SoundBurst text="CHOMP!" color="#FA824C" className="text-xs" />
          </div>
        </div>

        {/* STEP 3 */}
        <div
          onMouseEnter={() => sounds.playBeep(780)}
          className="comic-card bg-[#FFFDF8] p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              <SlinkChampion size={46} />
            </div>

            <span className="font-comic text-4xl text-[#FFD13B] select-none">
              03
            </span>
          </div>

          <div>
            <h3 className="font-comic text-2xl uppercase text-[#1E1B18] tracking-wide">
              3. CLAIM THE PRIZE
            </h3>

            <p className="font-body text-xs sm:text-sm text-[#5C3D2E] mt-2 leading-relaxed">
              Conquer the #1 spot on the leaderboard! Earn shiny cartoon ribbons, glory in the Daily Slink Gazette, and collect $SLINK token payouts!
            </p>
          </div>

          <div className="mt-auto pt-3 border-t-2 border-[#1E1B18]/15 flex items-center justify-between">
            <span className="font-comic text-xs text-[#1E1B18]">STEP: VICTORY</span>
            <SoundBurst text="HOORAY!" color="#70A288" className="text-xs" />
          </div>
        </div>
      </div>
    </section>
  );
};
