import React from 'react';
import { ArrowRight, Lock, Sparkles, Trophy, Zap, ShieldCheck } from 'lucide-react';
import { sounds } from '../audio';
import { SlinkSpeedy, SlinkChampion } from './RetroCartoonCharacters';

interface DualEngagementZonesProps {
  onSelectFree: () => void;
  onSelectStaked: () => void;
}

export const DualEngagementZones: React.FC<DualEngagementZonesProps> = ({
  onSelectFree,
  onSelectStaked,
}) => {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-halftone-dark text-white border-y-3 border-[#111111] relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] text-[#111111] font-comic text-xs uppercase tracking-wider mb-2 font-bold -rotate-1">
            ★ STEP RIGHT UP! PICK YOUR STAGE ★
          </div>

          <h2 className="font-comic text-4xl sm:text-6xl uppercase text-white tracking-wide drop-shadow-[3px_3px_0px_#111111]">
            CHOOSE YOUR <span className="text-[#B4F000]">SLINK ARENA!</span>
          </h2>

          <p className="font-body text-base text-[#F4EEDF] font-semibold mt-2">
            Practice for fun in the Sunny Meadow or enter the high-stakes Bounty Bowl for sweet $SLINK token loot!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
          {/* CARD 1: SUNNY MEADOW (FREE ARCADE) */}
          <div className="comic-card bg-white text-[#111111] border-3 border-[#111111] shadow-[6px_6px_0px_#B4F000] p-6 sm:p-8 flex flex-col justify-between rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-comic text-xs uppercase px-3 py-1 rounded bg-[#55B3F3] text-[#111111] border-2 border-[#111111] shadow-[1px_1px_0px_#111111] font-bold">
                  ZONE 01 · PRACTICE FIELD
                </span>

                <span className="flex items-center gap-1.5 font-comic text-xs text-[#111111] bg-[#B4F000] px-2.5 py-1 rounded border-2 border-[#111111] font-bold shadow-[1px_1px_0px_#111111]">
                  <Sparkles className="w-3.5 h-3.5" />
                  INSTANT RESPAWN
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-[#55B3F3] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                  <SlinkSpeedy size={54} />
                </div>
                <div>
                  <h3 className="font-comic text-3xl uppercase text-[#111111] tracking-wide leading-tight font-bold">
                    SUNNY MEADOW
                  </h3>
                  <p className="font-body text-xs font-bold text-[#111111]/70">
                    Endless Slither · 100% Free · No Wallet Needed
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-[#111111] leading-relaxed font-semibold">
                Hop in anytime! Devour juicy red apples, grow ridiculously long, outmaneuver silly bot worms, and climb the public Sunday comic leaderboard!
              </p>

              {/* Stats Comic Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">ENTRY</span>
                  <span className="font-comic text-base text-[#111111] font-bold">FREE</span>
                </div>
                <div className="p-2.5 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">RESPAWN</span>
                  <span className="font-comic text-base text-[#111111] font-bold">INSTANT</span>
                </div>
                <div className="p-2.5 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">TICKS</span>
                  <span className="font-comic text-base text-[#111111] font-bold">60 FPS</span>
                </div>
                <div className="p-2.5 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">SNACKS</span>
                  <span className="font-comic text-base text-[#FF5D8F] font-bold">FRUITS</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-3 border-[#111111]/20">
              <button
                type="button"
                onClick={() => {
                  sounds.playBoostSound();
                  onSelectFree();
                }}
                className="comic-btn w-full bg-[#B4F000] hover:bg-[#9DE000] text-[#111111] text-lg uppercase py-3.5 font-bold shadow-[4px_4px_0px_#111111]"
              >
                <span>SLITHER INTO SUNNY MEADOW</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* CARD 2: BOUNTY BOWL (STAKED PRIZES) */}
          <div className="comic-card bg-[#FF5D8F] text-[#111111] border-3 border-[#111111] shadow-[6px_6px_0px_#55B3F3] p-6 sm:p-8 flex flex-col justify-between rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-comic text-xs uppercase px-3 py-1 rounded bg-[#B4F000] text-[#111111] border-2 border-[#111111] shadow-[1px_1px_0px_#111111] font-bold">
                  ZONE 02 · PRIZE TOURNAMENT
                </span>

                <span className="flex items-center gap-1.5 font-comic text-xs text-[#111111] bg-white px-2.5 py-1 rounded border-2 border-[#111111] font-bold shadow-[1px_1px_0px_#111111]">
                  <Trophy className="w-3.5 h-3.5 text-[#FFD13B]" />
                  $SLINK POOL
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                  <SlinkChampion size={54} />
                </div>
                <div>
                  <h3 className="font-comic text-3xl uppercase text-[#111111] tracking-wide leading-tight font-bold">
                    BOUNTY BOWL
                  </h3>
                  <p className="font-body text-xs font-bold text-[#111111]/80">
                    Real Stake · Winner Takes The Sweet Pot
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-[#111111] leading-relaxed font-semibold">
                Ready for the big leagues? Stake your $SLINK tokens, cut rival worms with precision tail maneuvers, and harvest their pooled bounty when they pop!
              </p>

              {/* Stats Comic Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 bg-white rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">BUY-IN</span>
                  <span className="font-comic text-base text-[#111111] font-bold">100 $SLINK</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">PAYOUT</span>
                  <span className="font-comic text-base text-[#111111] font-bold">INSTANT</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">SECURITY</span>
                  <span className="font-comic text-base text-[#111111] font-bold">SOLANA</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#111111]/70 block">PRIZE</span>
                  <span className="font-comic text-base text-[#B4F000] font-bold">JACKPOT</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-3 border-[#111111]/20">
              <button
                type="button"
                onClick={() => {
                  sounds.playBoostSound();
                  onSelectStaked();
                }}
                className="comic-btn w-full bg-[#111111] hover:bg-[#252525] text-white text-lg uppercase py-3.5 font-bold shadow-[4px_4px_0px_white]"
              >
                <span>ENTER BOUNTY BOWL</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
