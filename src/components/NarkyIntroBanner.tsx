import React from 'react';
import retroComicImg from '../assets/images/slink_retro_comic_1790187474829.jpg';
import { ComicSoundBurst } from './RetroCartoonCharacters';

export const NarkyIntroBanner: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
      {/* Retro Comic Strip Splash Card */}
      <div className="relative overflow-hidden rounded-xl border-3 border-[#1E1B18] bg-[#78C0E0] shadow-[6px_6px_0px_#1E1B18] p-5 sm:p-8 lg:p-10">
        {/* Subtle halftone comic dot pattern */}
        <div className="absolute inset-0 bg-comic-dots opacity-10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Punchy Comic Typography & Humor */}
          <div className="lg:col-span-8 flex flex-col gap-3 text-left">
            {/* Top Comic Issue Stamp */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-comic text-xs px-2.5 py-0.5 bg-[#FFD13B] text-[#1E1B18] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] uppercase tracking-wider -rotate-2">
                SUNDAY COMIC ISSUE #01
              </span>
              <span className="font-hand text-xs font-bold text-[#1E1B18]">
                100% ORGANIC RETRO FUN · NO ROBOTS ALLOWED!
              </span>
            </div>

            {/* Giant Title */}
            <h1 className="font-comic text-5xl sm:text-7xl lg:text-8xl text-[#FFF8ED] tracking-wide leading-none drop-shadow-[4px_4px_0px_#1E1B18] uppercase">
              THE SILLY WORLD OF <span className="text-[#FFD13B]">SLINK!</span>
            </h1>

            {/* Subtitle with humor */}
            <p className="font-body text-base sm:text-xl font-semibold text-[#1E1B18] leading-snug max-w-2xl bg-[#FFF8ED] border-2 border-[#1E1B18] p-3 rounded-lg shadow-[3px_3px_0px_#1E1B18] rotate-0.5">
              Slither around the meadow, gobble crunchy cartoon apples, trick rival worms into bumping your flank, and grow longer than the page margins!
            </p>

            {/* Comic Highlights Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#FFFDF8] border-2 border-[#1E1B18] rounded-lg shadow-[2px_2px_0px_#1E1B18]">
                <div className="font-comic text-lg text-[#FA824C] leading-none">01. CHOMP FOOD</div>
                <div className="font-body text-xs text-[#5C3D2E] font-medium mt-1">
                  Apples, berries &amp; stars give maximum belly mass.
                </div>
              </div>

              <div className="p-3 bg-[#FFFDF8] border-2 border-[#1E1B18] rounded-lg shadow-[2px_2px_0px_#1E1B18]">
                <div className="font-comic text-lg text-[#FF7A30] leading-none">02. CUT &amp; POOF!</div>
                <div className="font-body text-xs text-[#5C3D2E] font-medium mt-1">
                  Dash in front of rivals so their nose bumps your tail.
                </div>
              </div>

              <div className="p-3 bg-[#FFFDF8] border-2 border-[#1E1B18] rounded-lg shadow-[2px_2px_0px_#1E1B18]">
                <div className="font-comic text-lg text-[#70A288] leading-none">03. GRAB POWER-UPS</div>
                <div className="font-body text-xs text-[#5C3D2E] font-medium mt-1">
                  Magnets, bubble shields, and turbo chili peppers!
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vintage Sunday Comic Cover Art */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            {/* Action burst badge */}
            <div className="absolute -top-4 -right-2 z-20">
              <ComicSoundBurst sound="SLURP!" color="#FFD13B" rotate="8deg" />
            </div>

            <div className="relative p-2 bg-[#FFF8ED] border-3 border-[#1E1B18] shadow-[5px_5px_0px_#1E1B18] rounded-xl rotate-1 group hover:rotate-0 transition-transform">
              <img
                src={retroComicImg}
                alt="Slink The Retro Comic Worm"
                className="w-full max-w-[260px] sm:max-w-[280px] rounded-lg border-2 border-[#1E1B18] object-cover"
              />
              <div className="font-hand text-xs font-bold text-center text-[#5C3D2E] pt-2">
                ★ "THE LONGEST WORM IN TOWN!" ★
              </div>
            </div>

            {/* Bottom sound effect */}
            <div className="absolute -bottom-3 -left-2 z-20">
              <ComicSoundBurst sound="ZOOM!" color="#FA824C" rotate="-6deg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
