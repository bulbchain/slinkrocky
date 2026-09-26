import React from 'react';
import retroComicImg from '../assets/images/slink_retro_comic_1790187474829.jpg';
import { ComicSoundBurst } from './RetroCartoonCharacters';

export const NarkyIntroBanner: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
      {/* Retro Comic Strip Splash Card */}
      <div className="relative overflow-hidden rounded-2xl border-3 border-[#111111] bg-halftone-blue shadow-[8px_8px_0px_#111111] p-6 sm:p-8 lg:p-10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Punchy Comic Typography & Humor */}
          <div className="lg:col-span-8 flex flex-col gap-4 text-left">
            {/* Top Comic Issue Stamp */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-comic text-xs px-3 py-1 bg-[#B4F000] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] uppercase tracking-wider font-bold -rotate-1">
                SUNDAY COMIC ISSUE #01
              </span>
              <span className="font-comic text-xs px-2.5 py-1 bg-white text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-bold">
                100% ORGANIC WOBBLE · 0% BORING
              </span>
            </div>

            {/* Giant Title */}
            <h1 className="font-comic text-5xl sm:text-7xl lg:text-8xl text-white tracking-wide leading-none drop-shadow-[5px_5px_0px_#111111] uppercase">
              SLITHER. <span className="text-[#B4F000] drop-shadow-[5px_5px_0px_#111111]">CHOMP.</span> REPEAT.
            </h1>

            {/* Subtitle with humor */}
            <p className="font-body text-base sm:text-lg font-bold text-[#111111] leading-snug max-w-2xl bg-white border-3 border-[#111111] p-4 rounded-xl shadow-[4px_4px_0px_#111111]">
              Slither across the soil, gobble cartoon orchard fruits, cut off rival crawlers, and become the undisputed giant of the funny pages!
            </p>

            {/* Neo-brutalist 3 cards strip (cyan, pink, yellow cards like reference) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-[#55B3F3] border-3 border-[#111111] rounded-xl shadow-[4px_4px_0px_#111111] text-[#111111]">
                <div className="font-comic text-xs uppercase font-bold text-[#111111]/70">01 / TACTIC</div>
                <div className="font-comic text-xl text-[#111111] leading-none mt-1">PERMA-CHOMP</div>
                <div className="font-body text-xs text-[#111111] font-semibold mt-1">
                  Oranges, berries, plums &amp; apples stack your body mass.
                </div>
              </div>

              <div className="p-3.5 bg-[#FF5D8F] border-3 border-[#111111] rounded-xl shadow-[4px_4px_0px_#111111] text-[#111111]">
                <div className="font-comic text-xs uppercase font-bold text-[#111111]/70">02 / COMBAT</div>
                <div className="font-comic text-xl text-[#111111] leading-none mt-1">TAIL CUTS</div>
                <div className="font-body text-xs text-[#111111] font-semibold mt-1">
                  Dash across enemy heads to explode them into fresh fruit loot!
                </div>
              </div>

              <div className="p-3.5 bg-[#FFD13B] border-3 border-[#111111] rounded-xl shadow-[4px_4px_0px_#111111] text-[#111111]">
                <div className="font-comic text-xs uppercase font-bold text-[#111111]/70">03 / POWER</div>
                <div className="font-comic text-xl text-[#111111] leading-none mt-1">HIGH LIQUIDITY</div>
                <div className="font-body text-xs text-[#111111] font-semibold mt-1">
                  Vacuum magnets, bubble shields &amp; turbo chili sprint boosts.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vintage Comic Art with Pink Halo Backdrop (just like Wetcat) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            {/* Action burst badge */}
            <div className="absolute -top-3 -right-1 z-20">
              <ComicSoundBurst sound="SLURP!" color="#B4F000" rotate="8deg" />
            </div>

            {/* Pink circular background disc behind mascot */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#FF5D8F] border-4 border-[#111111] shadow-[6px_6px_0px_#111111]" />

              <div className="relative z-10 p-2.5 bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl rotate-2 group hover:rotate-0 transition-transform">
                <img
                  src={retroComicImg}
                  alt="Slink The Retro Comic Worm"
                  className="w-full max-w-[240px] sm:max-w-[260px] rounded-xl border-2 border-[#111111] object-cover"
                />
                <div className="font-comic text-xs font-bold text-center text-[#111111] pt-2 uppercase tracking-wide">
                  ★ "PROBABLY THE LONGEST WORM" ★
                </div>
              </div>
            </div>

            {/* Bottom sound effect */}
            <div className="absolute -bottom-3 -left-1 z-20">
              <ComicSoundBurst sound="BOOM!" color="#FFD13B" rotate="-6deg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
