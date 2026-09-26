import React from 'react';
import { sounds } from '../audio';
import { ExternalLink } from 'lucide-react';
import logo from '../assets/images/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] text-[#F4EEDF] border-t-4 border-[#111111] py-10 relative">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Dramatically increased logo size container without background box */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
              <img
                src={logo}
                alt="Slink logo"
                className="w-full h-full object-contain scale-125 filter drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-comic text-2xl uppercase text-[#B4F000] tracking-wide font-bold">
                  SLINK!
                </span>
                <span className="font-comic text-[11px] bg-[#FF5D8F] border border-white px-2 py-0.5 rounded text-white font-bold">
                  SUNDAY EDITION
                </span>
              </div>
              <p className="font-body text-xs text-[#F4EEDF]/80 font-semibold">
                Vibrant Retro Cartoon Worm Arena &middot; Slither, Chomp &amp; Grow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/playslink"
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playBeep(600)}
              className="comic-btn bg-[#B4F000] hover:bg-[#9DE000] text-[#111111] text-sm py-2.5 px-5 font-bold shadow-[3px_3px_0px_white]"
            >
              <span>FOLLOW ON X</span>
              <ExternalLink className="w-4 h-4 ml-1.5 inline" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/20 text-xs font-body font-medium">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eff5dc]" />
            <span className="text-[#F4EEDF] text-xs font-comic font-bold">
              60 FPS CARTOON VECTOR ENGINE &middot; 100% WOBBLY FUN
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#F4EEDF]/70 text-xs font-semibold">
            <span className="hover:text-[#B4F000] transition-colors cursor-pointer">
              Meadow Rules
            </span>
            <span>&bull;</span>
            <span className="hover:text-[#B4F000] transition-colors cursor-pointer">
              Fruit Nutrition Facts
            </span>
            <span>&bull;</span>
            <span className="hover:text-[#B4F000] transition-colors cursor-pointer">
              $SLINK Token
            </span>
          </div>

          <span className="text-[#F4EEDF]/60 text-xs text-center md:text-right font-medium">
            &copy; 2026 SLINK MEADOWS. WETCAT-INSPIRED NEO-BRUTALIST VIBES.
          </span>
        </div>
      </div>
    </footer>
  );
};