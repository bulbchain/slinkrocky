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
        <div className="inline-block px-3 py-1 rounded-full bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] text-[#111111] font-comic text-xs uppercase tracking-wider mb-2 font-black">
          THE ROAD TO GLORY
        </div>

        <h2 className="font-comic text-4xl sm:text-5xl uppercase text-[#111111] tracking-wide">
          THE 3-STEP ASCENSION LOOP
        </h2>

        <p className="font-body text-base text-[#555555] font-semibold mt-1">
          From a tiny hungry wiggle to the undisputed king of the funny pages!
        </p>
      </div>

      {/* 3-Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* STEP 1 */}
        <div
          onMouseEnter={() => sounds.playBeep(580)}
          className="comic-card bg-white p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#55B3F3] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <SlinkPeeking size={46} />
            </div>

            <span className="font-comic text-4xl text-[#55B3F3] select-none font-black">
              01
            </span>
          </div>

          <div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] tracking-wide">
              1. PICK A SILLY LOOK
            </h3>

            <p className="font-body text-xs sm:text-sm text-[#444444] mt-2 leading-relaxed font-medium">
              Name your creature something hilarious, select bright pop colors, and wriggle straight onto the arena field!
            </p>
          </div>

          <div className="mt-auto pt-3 border-t-2 border-[#111111]/15 flex items-center justify-between">
            <span className="font-comic text-xs text-[#111111] font-bold">STEP: START</span>
            <SoundBurst text="READY!" color="#B4F000" className="text-xs" />
          </div>
        </div>

        {/* STEP 2 */}
        <div
          onMouseEnter={() => sounds.playBeep(680)}
          className="comic-card bg-white p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#FF5D8F] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <SlinkHungry size={46} />
            </div>

            <span className="font-comic text-4xl text-[#FF5D8F] select-none font-black">
              02
            </span>
          </div>

          <div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] tracking-wide">
              2. MUNCH &amp; GROW!
            </h3>

            <p className="font-body text-xs sm:text-sm text-[#444444] mt-2 leading-relaxed font-medium">
              Snack on juicy fruit orbs, catch bubbly power-ups, and cut off rivals with tactical boost trajectories!
            </p>
          </div>

          <div className="mt-auto pt-3 border-t-2 border-[#111111]/15 flex items-center justify-between">
            <span className="font-comic text-xs text-[#111111] font-bold">STEP: FEAST</span>
            <SoundBurst text="CHOMP!" color="#FF5D8F" className="text-xs" />
          </div>
        </div>

        {/* STEP 3 */}
        <div
          onMouseEnter={() => sounds.playBeep(780)}
          className="comic-card bg-white p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <SlinkChampion size={46} />
            </div>

            <span className="font-comic text-4xl text-[#B4F000] select-none font-black">
              03
            </span>
          </div>

          <div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] tracking-wide">
              3. CLAIM THE PRIZE
            </h3>

            <p className="font-body text-xs sm:text-sm text-[#444444] mt-2 leading-relaxed font-medium">
              Conquer the #1 spot on the leaderboard! Earn shiny ribbons and climb the live high score rankings!
            </p>
          </div>

          <div className="mt-auto pt-3 border-t-2 border-[#111111]/15 flex items-center justify-between">
            <span className="font-comic text-xs text-[#111111] font-bold">STEP: VICTORY</span>
            <SoundBurst text="HOORAY!" color="#B4F000" className="text-xs" />
          </div>
        </div>
      </div>
    </section>
  );
};
