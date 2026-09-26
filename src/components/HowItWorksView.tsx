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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mx-auto">
          <HelpCircle className="w-4 h-4 text-[#111111]" />
          <span className="font-comic text-xs uppercase tracking-wider text-[#111111] font-black">
            THE COMIC FIELD GUIDE
          </span>
        </div>

        <h1 className="font-comic text-4xl sm:text-6xl uppercase text-[#111111] tracking-wide">
          HOW TO PLAY &amp; WIN IN SLINK!
        </h1>

        <p className="font-body text-base text-[#555555] font-semibold leading-relaxed max-w-2xl mx-auto">
          Wobble your way around the meadow, snap up ripe fruits, trick greedy rivals, and build the longest creature tail ever printed!
        </p>
      </div>

      {/* 3 CORE RULES: COMIC STRIP STYLE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="comic-card bg-white border-3 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]/15 mb-3">
              <span className="font-comic text-xs uppercase text-[#55B3F3] font-black">STEP 01</span>
              <SoundBurst text="CHOMP!" color="#B4F000" className="text-[10px]" />
            </div>
            <div className="p-3 bg-[#F4EEDF] rounded-2xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-3 inline-block">
              <SlinkHungry size={56} />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] font-black">
              CHOMP CRISP FRUITS
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#444444] font-medium mt-2 leading-relaxed">
              Steer with your mouse or finger. Roll over juicy oranges, strawberries, plums, and apples. With every bite, your creature sprouts an extra segment!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111]/15 text-xs font-comic text-[#111111] font-black">
            TIP: FRUITS = WEIGHT &amp; GLORY
          </div>
        </div>

        <div className="comic-card bg-white border-3 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]/15 mb-3">
              <span className="font-comic text-xs uppercase text-[#FF5D8F] font-black">STEP 02</span>
              <SoundBurst text="ZOOM!" color="#FF5D8F" className="text-[10px]" />
            </div>
            <div className="p-3 bg-[#F4EEDF] rounded-2xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-3 inline-block">
              <SlinkSpeedy size={56} />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] font-black">
              OUT-WIGGLE CREATURES
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#444444] font-medium mt-2 leading-relaxed">
              Hold the boost key to burst ahead of fast centipedes, swift snakes, and slugs! If a creature smacks their head into your body, they pop!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111]/15 text-xs font-comic text-[#111111] font-black">
            TIP: NEVER BUMP YOUR OWN NOSE!
          </div>
        </div>

        <div className="comic-card bg-white border-3 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]/15 mb-3">
              <span className="font-comic text-xs uppercase text-[#55B3F3] font-black">STEP 03</span>
              <SoundBurst text="HOORAY!" color="#55B3F3" className="text-[10px]" />
            </div>
            <div className="p-3 bg-[#F4EEDF] rounded-2xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-3 inline-block">
              <SlinkChampion size={56} />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] font-black">
              FEAST ON RIPE FRUITS
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#444444] font-medium mt-2 leading-relaxed">
              Poofed rivals burst into heaps of juicy Strawberries, Oranges, and Plums. Vacuum them all up to climb straight to #1 on the leaderboard!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#111111]/15 text-xs font-comic text-[#111111] font-black">
            TIP: LUSCIOUS FRUITS = BONUS PTS
          </div>
        </div>
      </div>

      {/* INTERACTIVE WOBBLE & MASS CALCULATOR */}
      <div className="comic-card bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#111111] pb-4">
          <div>
            <span className="font-comic text-xs uppercase text-[#FF5D8F] tracking-wider font-black">
              INTERACTIVE MEADOW LAB
            </span>
            <h2 className="font-comic text-3xl uppercase text-[#111111] font-black">
              TEST YOUR CREATURE'S WIGGLE STATS!
            </h2>
          </div>
          <div className="font-comic text-base bg-[#B4F000] text-[#111111] px-4 py-1.5 rounded-full border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-black">
            APPLES EATEN: <strong className="text-[#111111] text-xl font-black">{appleCount}</strong>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex flex-col gap-4">
          <label className="font-comic text-sm uppercase text-[#111111] font-black flex justify-between">
            <span>SLIDE TO FEED YOUR WORM APPLES:</span>
            <span className="text-[#FF5D8F] font-black">{appleCount} APPLES</span>
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
            className="w-full accent-[#FF5D8F] h-3 bg-[#F4EEDF] rounded-lg border-2 border-[#111111] cursor-pointer"
          />

          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => {
                setIsBoosting(!isBoosting);
                sounds.playBoostSound();
              }}
              className={`comic-btn py-2 px-5 text-sm uppercase rounded-xl border-2 border-[#111111] font-black ${
                isBoosting ? 'bg-[#FF5D8F] text-white' : 'bg-[#B4F000] text-[#111111]'
              }`}
            >
              {isBoosting ? 'TURBO BOOST ON (ACTIVE!)' : 'HOLD BOOST TO TEST'}
            </button>
            <span className="font-body text-xs text-[#555555] font-semibold">
              Speed consumes a tiny bit of tail length while zooming!
            </span>
          </div>
        </div>

        {/* Dynamic Result Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
            <span className="font-body text-[10px] uppercase font-black text-[#555555] block">LENGTH</span>
            <span className="font-comic text-xl text-[#111111] font-black">{estimatedSegments} NODES</span>
          </div>

          <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
            <span className="font-body text-[10px] uppercase font-black text-[#555555] block">VELOCITY</span>
            <span className="font-comic text-xl text-[#55B3F3] font-black">{wiggleSpeed}</span>
          </div>

          <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
            <span className="font-body text-[10px] uppercase font-black text-[#555555] block">TUMMY STATUS</span>
            <span className="font-comic text-lg text-[#B4F000] drop-shadow-[1px_1px_0px_#111111] font-black">{tummyStatus}</span>
          </div>

          <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
            <span className="font-body text-[10px] uppercase font-black text-[#555555] block">MEADOW DANGER</span>
            <span className="font-comic text-xl text-[#FF5D8F] font-black">{appleCount > 30 ? 'HIGH THREAT' : 'PLAYFUL'}</span>
          </div>
        </div>
      </div>

      {/* POWER-UPS SHOWCASE */}
      <div className="flex flex-col gap-6">
        <h2 className="font-comic text-3xl uppercase text-[#111111] text-center font-black">
          CARTOON POWER-UPS YOU CAN GRAB
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="comic-card bg-white border-3 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <Magnet className="w-8 h-8 text-[#111111]" />
            </div>
            <div>
              <h3 className="font-comic text-xl uppercase text-[#111111] font-black">
                APPLE MAGNET
              </h3>
              <p className="font-body text-xs text-[#444444] font-medium mt-1">
                Draws in all surrounding fruit droplets automatically for 8 seconds!
              </p>
            </div>
          </div>

          <div className="comic-card bg-white border-3 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#55B3F3] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <Shield className="w-8 h-8 text-[#111111]" />
            </div>
            <div>
              <h3 className="font-comic text-xl uppercase text-[#111111] font-black">
                BUBBLE SHIELD
              </h3>
              <p className="font-body text-xs text-[#444444] font-medium mt-1">
                A giant soap bubble protects your head from one accidental bump or wall collision!
              </p>
            </div>
          </div>

          <div className="comic-card bg-white border-3 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#FF5D8F] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-comic text-xl uppercase text-[#111111] font-black">
                NITRO ROCKET
              </h3>
              <p className="font-body text-xs text-[#444444] font-medium mt-1">
                Gives your creature super-charged propulsion without losing any body length!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
