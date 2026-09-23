import React from 'react';
import { sounds } from '../audio';
import { Sparkles, ExternalLink } from 'lucide-react';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#04060f] border-t border-cyan-500/20 py-12 relative">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <img
              src={slinkLogo}
              alt="SLINK Logo"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-cyan-400/30 shadow-[0_0_15px_rgba(0,245,212,0.3)]"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl uppercase bg-gradient-to-r from-[#00f5d4] via-[#ff007f] to-[#ffaa00] bg-clip-text text-transparent font-black tracking-tight">
                  SLINK
                </span>
                <span className="font-mono text-[9px] bg-white/10 border border-white/10 px-2 py-0.5 rounded text-cyan-300 font-bold">
                  v3.0-PROD
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                VIBRANT CYBER-WORM ARENA · REAL-TIME MULTIPLAYER
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/play_slink"
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playBeep(600)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1026] hover:bg-[#121838] border border-cyan-400/20 hover:border-cyan-400/60 text-slate-300 hover:text-[#00f5d4] transition-all font-mono text-xs tracking-wider"
            >
              <span>FOLLOW ON X</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 bg-[#0c1026] border border-white/10 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
            <span className="text-slate-300 text-[10px] font-bold">
              GLOBAL VECTOR ENGINE · 60 FPS · 0% LATENCY
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="hover:text-cyan-300 transition-colors cursor-pointer">
              Rules of the Arena
            </span>
            <span>•</span>
            <span className="hover:text-cyan-300 transition-colors cursor-pointer">
              Combat Protocol
            </span>
            <span>•</span>
            <span className="hover:text-cyan-300 transition-colors cursor-pointer">
              $SLINK Tokenomics
            </span>
          </div>

          <span className="text-slate-500 text-[11px] text-center md:text-right font-medium">
            © 2026 SLINK PROTOCOL. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
};
