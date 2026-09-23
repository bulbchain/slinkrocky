import React, { useState } from 'react';
import { Gamepad2, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { sounds } from '../audio';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';

interface ReadyToDriftCTAProps {
  onLaunchNow: () => void;
}

export const ReadyToDriftCTA: React.FC<ReadyToDriftCTAProps> = ({ onLaunchNow }) => {
  const [copied, setCopied] = useState(false);

  const SLINK_CONTRACT = 'SL1NKvP3rG9zReap4UjT7kZ9sY2cSol8vQmW3aXpump';

  const handleCopyContract = async () => {
    try {
      await navigator.clipboard.writeText(SLINK_CONTRACT);
      setCopied(true);
      sounds.playBeep(800);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy contract address:', error);
    }
  };

  return (
    <section className="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Ambient Arena Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_center,_rgba(0,245,212,0.25)_0%,_rgba(255,0,127,0.15)_40%,_transparent_75%)] blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Status */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c1026] border border-cyan-400/40 text-[#00f5d4] shadow-[0_0_20px_rgba(0,245,212,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
          <span className="font-mono text-[11px] tracking-widest uppercase font-bold">
            SLINK ARENA · SEASON 1 LIVE
          </span>
        </div>

        {/* Main heading */}
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase text-white font-black tracking-tight leading-none">
          READY TO <span className="bg-gradient-to-r from-[#00f5d4] via-[#ff007f] to-[#ffaa00] bg-clip-text text-transparent">SLINK?</span>
        </h2>

        <p className="font-mono text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Slither into the matrix. Consume radiant energy, outmaneuver rival worms with blistering speed boosts,
          and harvest their star bounties to reign the global leaderboard.
        </p>

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
          {/* Launch Game */}
          <button
            type="button"
            onClick={() => {
              sounds.playBoostSound();
              onLaunchNow();
            }}
            className="w-full sm:w-auto px-10 py-4.5 rounded-xl bg-gradient-to-r from-[#00f5d4] via-[#00ff88] to-[#00f5d4] text-[#002820] font-display text-base font-black tracking-widest uppercase shadow-[0_0_35px_rgba(0,245,212,0.7)] hover:shadow-[0_0_50px_rgba(0,245,212,1)] hover:scale-105 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>ENTER THE ARENA NOW</span>
          </button>

          {/* X / Twitter */}
          <a
            href="https://x.com/play_slink"
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.playBeep(640)}
            className="w-full sm:w-auto px-6 py-4.5 rounded-xl bg-[#0c1026] hover:bg-[#121838] border border-cyan-400/30 text-white hover:text-[#00f5d4] hover:border-cyan-400 font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          >
            <span>FOLLOW @PLAY_SLINK</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Token Contract Strip */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            OFFICIAL $SLINK TOKEN CONTRACT
          </span>

          <div className="flex items-center gap-2 rounded-xl bg-[#0c1026]/90 border border-white/10 px-4 py-2 shadow-inner">
            <img src={slinkLogo} alt="SLINK" referrerPolicy="no-referrer" className="w-5 h-5 rounded-md object-cover" />
            <span className="font-mono text-xs text-slate-300 font-bold tracking-wider">
              {SLINK_CONTRACT.slice(0, 8)}...{SLINK_CONTRACT.slice(-8)}
            </span>
            <button
              onClick={handleCopyContract}
              title="Copy Contract Address"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-[#00f5d4] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {copied && (
            <span className="font-mono text-[10px] text-[#00ff88] font-bold animate-pulse">
              COPIED TO CLIPBOARD
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
