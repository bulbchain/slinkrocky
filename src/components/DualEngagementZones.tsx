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
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#FA824C] border-y-3 border-[#1E1B18] relative overflow-hidden">
      {/* Background Comic Halftone Details */}
      <div className="absolute inset-0 opacity-10 bg-comic-dots pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-[#1E1B18] font-comic text-xs uppercase tracking-wider mb-2 -rotate-1">
            ★ STEP RIGHT UP! PICK YOUR STAGE ★
          </div>

          <h2 className="font-comic text-4xl sm:text-5xl uppercase text-[#FFF8ED] tracking-wide drop-shadow-[3px_3px_0px_#1E1B18]">
            CHOOSE YOUR SLINK ARENA!
          </h2>

          <p className="font-body text-base text-[#1E1B18] font-semibold mt-2">
            Practice for fun in the Sunny Meadow or enter the high-stakes Bounty Bowl for sweet $SLINK token loot!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
          {/* CARD 1: SUNNY MEADOW (FREE ARCADE) */}
          <div className="comic-card bg-[#FFFDF8] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-comic text-xs uppercase px-2.5 py-1 rounded bg-[#70A288] text-[#FFF8ED] border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18]">
                  ZONE 01 · PRACTICE FIELD
                </span>

                <span className="flex items-center gap-1.5 font-comic text-xs text-[#1E1B18] bg-[#FFD13B] px-2 py-0.5 rounded border border-[#1E1B18]">
                  <Sparkles className="w-3.5 h-3.5" />
                  INSTANT RESPAWN
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-[#78C0E0] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                  <SlinkSpeedy size={54} />
                </div>
                <div>
                  <h3 className="font-comic text-3xl uppercase text-[#1E1B18] tracking-wide leading-tight">
                    SUNNY MEADOW
                  </h3>
                  <p className="font-body text-xs font-bold text-[#5C3D2E]">
                    Endless Slither · 100% Free · No Wallet Needed
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-[#1E1B18] leading-relaxed">
                Hop in anytime! Devour juicy red apples, grow ridiculously long, outmaneuver silly bot worms, and climb the public Sunday comic leaderboard!
              </p>

              {/* Stats Comic Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">ENTRY</span>
                  <span className="font-comic text-base text-[#70A288]">FREE</span>
                </div>
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">RESPAWN</span>
                  <span className="font-comic text-base text-[#1E1B18]">INSTANT</span>
                </div>
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">TICKS</span>
                  <span className="font-comic text-base text-[#FA824C]">60 FPS</span>
                </div>
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">SNACKS</span>
                  <span className="font-comic text-base text-[#E63946]">APPLES</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#1E1B18]/15">
              <button
                type="button"
                onClick={() => {
                  sounds.playBoostSound();
                  onSelectFree();
                }}
                className="comic-btn w-full bg-[#FFD13B] hover:bg-[#FFE066] text-[#1E1B18] text-lg uppercase py-3"
              >
                <span>SLITHER INTO SUNNY MEADOW</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* CARD 2: BOUNTY BOWL (STAKED PRIZES) */}
          <div className="comic-card bg-[#FFFDF8] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-comic text-xs uppercase px-2.5 py-1 rounded bg-[#FA824C] text-[#FFF8ED] border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18]">
                  ZONE 02 · PRIZE TOURNAMENT
                </span>

                <span className="flex items-center gap-1.5 font-comic text-xs text-[#1E1B18] bg-[#78C0E0] px-2 py-0.5 rounded border border-[#1E1B18]">
                  <Trophy className="w-3.5 h-3.5 text-[#FFD13B]" />
                  $SLINK POOL
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                  <SlinkChampion size={54} />
                </div>
                <div>
                  <h3 className="font-comic text-3xl uppercase text-[#1E1B18] tracking-wide leading-tight">
                    BOUNTY BOWL
                  </h3>
                  <p className="font-body text-xs font-bold text-[#5C3D2E]">
                    Real Stake · Winner Takes The Sweet Pot
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-[#1E1B18] leading-relaxed">
                Ready for the big leagues? Stake your $SLINK tokens, cut rival worms with precision tail maneuvers, and harvest their pooled bounty when they pop!
              </p>

              {/* Stats Comic Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">BUY-IN</span>
                  <span className="font-comic text-base text-[#FA824C]">100 $SLINK</span>
                </div>
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">PAYOUT</span>
                  <span className="font-comic text-base text-[#70A288]">INSTANT</span>
                </div>
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">SECURITY</span>
                  <span className="font-comic text-base text-[#1E1B18]">SOLANA</span>
                </div>
                <div className="p-2.5 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
                  <span className="font-body text-[10px] uppercase font-bold text-[#5C3D2E] block">PRIZE</span>
                  <span className="font-comic text-base text-[#FFD13B]">JACKPOT</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#1E1B18]/15">
              <button
                type="button"
                onClick={() => {
                  sounds.playBoostSound();
                  onSelectStaked();
                }}
                className="comic-btn w-full bg-[#78C0E0] hover:bg-[#59B4D1] text-[#1E1B18] text-lg uppercase py-3"
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
