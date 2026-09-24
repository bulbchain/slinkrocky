import React from 'react';
import { sounds } from '../audio';
import { ExternalLink, Heart } from 'lucide-react';
import { SlinkPeeking } from './RetroCartoonCharacters';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1E1B18] text-[#FFF8ED] border-t-4 border-[#1E1B18] py-10 relative">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-1 bg-[#FFD13B] rounded-xl border-2 border-white shadow-[2px_2px_0px_white]">
              <SlinkPeeking size={40} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-comic text-2xl uppercase text-[#FFD13B] tracking-wide">
                  SLINK!
                </span>
                <span className="font-comic text-[11px] bg-[#FA824C] border border-white px-2 py-0.5 rounded text-white">
                  SUNDAY EDITION
                </span>
              </div>
              <p className="font-body text-xs text-[#FFF8ED]/80 font-medium">
                Vibrant Retro Cartoon Worm Arena · Eat, Boost &amp; Grow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/play_slink"
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playBeep(600)}
              className="comic-btn bg-[#FFD13B] hover:bg-[#FFE066] text-[#1E1B18] text-sm py-2 px-4 shadow-[3px_3px_0px_white]"
            >
              <span>FOLLOW ON X</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 inline" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/20 text-xs font-body font-medium">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#70A288]" />
            <span className="text-[#FFF8ED] text-xs font-comic">
              60 FPS CARTOON VECTOR ENGINE · 100% WOBBLY FUN
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#FFF8ED]/70 text-xs">
            <span className="hover:text-[#FFD13B] transition-colors cursor-pointer">
              Meadow Rules
            </span>
            <span>•</span>
            <span className="hover:text-[#FFD13B] transition-colors cursor-pointer">
              Apple Nutrition Facts
            </span>
            <span>•</span>
            <span className="hover:text-[#FFD13B] transition-colors cursor-pointer">
              $SLINK Token
            </span>
          </div>

          <span className="text-[#FFF8ED]/60 text-xs text-center md:text-right">
            © 2026 SLINK MEADOWS. HAND-DRAWN WITH HUMOR &amp; LOVE.
          </span>
        </div>
      </div>
    </footer>
  );
};
