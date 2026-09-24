import React, { useState } from 'react';
import { Sparkles, Trophy, Zap, Shield, Magnet, Flame, HelpCircle } from 'lucide-react';
import { sounds } from '../audio';
import {
  SlinkHungry,
  SlinkSpeedy,
  SlinkOops,
  SlinkChampion,
  SoundBurst,
} from './RetroCartoonCharacters';

export const HowItWorksView: React.FC = () => {
  const [appleCount, setAppleCount] = useState(18);
  const [isBoosting, setIsBoosting] = useState(false);

  // Dynamic calculations for the fun interactive preview
  const estimatedSegments = 6 + Math.floor(appleCount * 1.5);
  const wiggleSpeed = isBoosting ? 'TURBO (9.5 MPH)' : 'CRUISING (4.2 MPH)';
  const tummyStatus = appleCount > 35 ? 'SUPER CHUBBY!' : appleCount > 15 ? 'SATISFIED' : 'PECKISH';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] mx-auto">
          <HelpCircle className="w-4 h-4 text-[#1E1B18]" />
          <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
            THE SUNDAY COMIC FIELD GUIDE
          </span>
        </div>

        <h1 className="font-comic text-4xl sm:text-6xl uppercase text-[#1E1B18] tracking-wide">
          HOW TO PLAY &amp; WIN IN SLINK!
        </h1>

        <p className="font-body text-base text-[#5C3D2E] font-medium leading-relaxed max-w-2xl mx-auto">
          Wobble your way around the meadow, snap up juicy red apples, trick greedy rival worms, and build the longest wobbly tail ever printed!
        </p>
      </div>

      {/* 3 CORE RULES: COMIC STRIP STYLE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="comic-card bg-[#FFFDF8] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#1E1B18]/15 mb-3">
              <span className="font-comic text-xs uppercase text-[#70A288]">STEP 01</span>
              <SoundBurst text="CHOMP!" color="#FFD13B" className="text-[10px]" />
            </div>
            <div className="p-3 bg-[#FFF8ED] rounded-xl border-2 border-[#1E1B18] mb-3 inline-block">
              <SlinkHungry size={56} />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#1E1B18]">
              CHOMP CRISP FRUITS
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#5C3D2E] mt-2 leading-relaxed">
              Steer with your mouse or finger. Roll over juicy oranges, strawberries, plums, and apples. With every bite, your worm sprouts an extra segment!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#1E1B18]/15 text-xs font-comic text-[#1E1B18]">
            TIP: FRUITS = WEIGHT &amp; GLORY
          </div>
        </div>

        <div className="comic-card bg-[#FFFDF8] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#1E1B18]/15 mb-3">
              <span className="font-comic text-xs uppercase text-[#FA824C]">STEP 02</span>
              <SoundBurst text="ZOOM!" color="#FA824C" className="text-[10px]" />
            </div>
            <div className="p-3 bg-[#FFF8ED] rounded-xl border-2 border-[#1E1B18] mb-3 inline-block">
              <SlinkSpeedy size={56} />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#1E1B18]">
              OUT-WIGGLE CREATURES
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#5C3D2E] mt-2 leading-relaxed">
              Hold the boost key (or click and hold) to burst ahead of fast centipedes, swift snakes, and slugs! If a creature smacks their nose into your side or tail, they pop!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#1E1B18]/15 text-xs font-comic text-[#1E1B18]">
            TIP: NEVER BUMP YOUR OWN NOSE!
          </div>
        </div>

        <div className="comic-card bg-[#FFFDF8] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#1E1B18]/15 mb-3">
              <span className="font-comic text-xs uppercase text-[#78C0E0]">STEP 03</span>
              <SoundBurst text="HOORAY!" color="#78C0E0" className="text-[10px]" />
            </div>
            <div className="p-3 bg-[#FFF8ED] rounded-xl border-2 border-[#1E1B18] mb-3 inline-block">
              <SlinkChampion size={56} />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#1E1B18]">
              FEAST ON RIPE FRUITS
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#5C3D2E] mt-2 leading-relaxed">
              Poofed rivals burst into heaps of juicy Strawberries, Oranges, and Plums. Vacuum them all up to climb straight to #1 on the leaderboard!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#1E1B18]/15 text-xs font-comic text-[#1E1B18]">
            TIP: LUSCIOUS FRUITS = +50 TO +65 PTS EACH
          </div>
        </div>
      </div>

      {/* INTERACTIVE WOBBLE & MASS CALCULATOR */}
      <div className="comic-card bg-[#FFFDF8] p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1E1B18] pb-4">
          <div>
            <span className="font-comic text-xs uppercase text-[#FA824C] tracking-wider">
              INTERACTIVE MEADOW LAB
            </span>
            <h2 className="font-comic text-3xl uppercase text-[#1E1B18]">
              TEST YOUR WORM'S WIGGLE STATS!
            </h2>
          </div>
          <div className="font-comic text-base bg-[#FFD13B] px-3 py-1 rounded border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
            APPLES EATEN: <strong className="text-[#1E1B18] text-xl">{appleCount}</strong>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex flex-col gap-4">
          <label className="font-comic text-sm uppercase text-[#5C3D2E] flex justify-between">
            <span>SLIDE TO FEED YOUR WORM APPLES:</span>
            <span className="text-[#FA824C] font-bold">{appleCount} APPLES</span>
          </label>
          <input
            type="range"
            min="1"
            max="60"
            value={appleCount}
            onChange={(e) => {
              setAppleCount(Number(e.target.value));
              sounds.playBeep(400 + Number(e.target.value) * 10);
            }}
            className="w-full accent-[#FA824C] h-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] cursor-pointer"
          />

          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => {
                setIsBoosting(!isBoosting);
                sounds.playBoostSound();
              }}
              className={`comic-btn py-2 px-5 text-sm uppercase ${
                isBoosting ? 'bg-[#FA824C] text-white' : 'bg-[#FFD13B] text-[#1E1B18]'
              }`}
            >
              {isBoosting ? 'TURBO BOOST ON (ACTIVE!)' : 'HOLD BOOST TO TEST'}
            </button>
            <span className="font-body text-xs text-[#5C3D2E]">
              Speed consumes a tiny bit of tail length while zooming!
            </span>
          </div>
        </div>

        {/* Dynamic Result Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[2px_2px_0px_#1E1B18]">
            <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">LENGTH</span>
            <span className="font-comic text-xl text-[#1E1B18]">{estimatedSegments} NODES</span>
          </div>

          <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[2px_2px_0px_#1E1B18]">
            <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">VELOCITY</span>
            <span className="font-comic text-xl text-[#FA824C]">{wiggleSpeed}</span>
          </div>

          <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[2px_2px_0px_#1E1B18]">
            <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">TUMMY STATUS</span>
            <span className="font-comic text-lg text-[#70A288]">{tummyStatus}</span>
          </div>

          <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[2px_2px_0px_#1E1B18]">
            <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">MEADOW DANGER</span>
            <span className="font-comic text-xl text-[#E63946]">{appleCount > 30 ? 'HIGH THREAT' : 'PLAYFUL'}</span>
          </div>
        </div>
      </div>

      {/* POWER-UPS SHOWCASE */}
      <div className="flex flex-col gap-6">
        <h2 className="font-comic text-3xl uppercase text-[#1E1B18] text-center">
          CARTOON POWER-UPS YOU CAN GRAB
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="comic-card bg-[#FFFDF8] p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              <Magnet className="w-8 h-8 text-[#1E1B18]" />
            </div>
            <div>
              <h3 className="font-comic text-xl uppercase text-[#1E1B18]">
                APPLE MAGNET
              </h3>
              <p className="font-body text-xs text-[#5C3D2E] mt-1">
                Draws in all surrounding fruit and stars automatically for 8 hilarious seconds!
              </p>
            </div>
          </div>

          <div className="comic-card bg-[#FFFDF8] p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#78C0E0] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              <Shield className="w-8 h-8 text-[#1E1B18]" />
            </div>
            <div>
              <h3 className="font-comic text-xl uppercase text-[#1E1B18]">
                BUBBLE SHIELD
              </h3>
              <p className="font-body text-xs text-[#5C3D2E] mt-1">
                A giant soap bubble protects your head from one accidental bump or wall collision!
              </p>
            </div>
          </div>

          <div className="comic-card bg-[#FFFDF8] p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#FA824C] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-comic text-xl uppercase text-[#1E1B18]">
                NITRO ROCKET
              </h3>
              <p className="font-body text-xs text-[#5C3D2E] mt-1">
                Gives your worm super-charged propulsion without losing any body length!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
