import React, { useState } from 'react';
import { Compass, Flame, Shield, Users, ArrowRight, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { sounds } from '../audio';

interface ArenasViewProps {
  onSelectArena: (mode: 'free' | 'staked') => void;
}

const ARENA_SECTORS = [
  {
    id: 'cyber-matrix',
    name: 'GRID 01: CYBER MATRIX',
    badge: 'FLAGSHIP ARENA',
    badgeColor: '#00f5d4',
    type: 'free' as const,
    pilots: 1420,
    hazardRating: 'BALANCED (TIER 1)',
    entryFee: '0.00 SOL (FREE)',
    respawn: 'INSTANT (<1s)',
    description: 'The primary battleground for all cyber worms. Radiant biomass spawns continuously with low friction kinetic physics and full power-up availability.',
    rules: ['Free-to-play with 0 gas fees', 'Instant one-click respawn', 'Power-ups: Magnet, Shield, Overclock active'],
    active: true,
  },
  {
    id: 'bounty-crucible',
    name: 'GRID 02: BOUNTY CRUCIBLE',
    badge: 'HIGH STAKES',
    badgeColor: '#ffaa00',
    type: 'staked' as const,
    pilots: 685,
    hazardRating: 'LETHAL (TIER 5)',
    entryFee: '50 $SLINK',
    respawn: 'RE-BUY REQUIRED',
    description: 'Ruthless competitive arena where defeated worms forfeit their staked token bounty pool directly to the victor. Extra large Star Loot drops.',
    rules: ['50 $SLINK entry stake', '85% direct killer bounty payout', 'Rare Star Loot drops on every shatter'],
    active: true,
  },
  {
    id: 'neon-singularity',
    name: 'GRID 03: NEON SINGULARITY',
    badge: 'WARP ANOMALY',
    badgeColor: '#ff007f',
    type: 'free' as const,
    pilots: 410,
    hazardRating: 'CHAOTIC (TIER 3)',
    entryFee: '0.00 SOL (FREE)',
    respawn: 'INSTANT (<1s)',
    description: 'A gravitational singularity pulses in the arena center, sucking nearby mass towards the epicenter while orbiting worms battle for dominance.',
    rules: ['Central gravitational pull', '+50% food cluster density', 'Perimeter magnetic repulsion fields'],
    active: true,
  },
];

export const ArenasView: React.FC<ArenasViewProps> = ({ onSelectArena }) => {
  const [selectedId, setSelectedId] = useState('cyber-matrix');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 mx-auto shadow-[0_0_20px_rgba(0,245,212,0.15)]">
          <Compass className="w-3.5 h-3.5 text-[#00f5d4]" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            SLINK SECTOR NAVIGATION MATRIX
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase font-black text-white tracking-tight">
          CHOOSE COMBAT GRID
        </h1>
        <p className="font-mono text-sm text-slate-300 leading-relaxed">
          Select your battlefield. Each sector features unique gravitational mechanics, hazard ratings, and loot distributions.
        </p>
      </div>

      {/* Grid of Sectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ARENA_SECTORS.map((sector) => {
          const isSelected = selectedId === sector.id;
          return (
            <div
              key={sector.id}
              onClick={() => {
                sounds.playBeep(640);
                setSelectedId(sector.id);
              }}
              className={`relative rounded-2xl p-6 sm:p-7 bg-[#0c1026]/90 border flex flex-col justify-between transition-all cursor-pointer shadow-xl ${
                isSelected
                  ? 'border-cyan-400 shadow-[0_0_35px_rgba(0,245,212,0.25)] bg-[#101633]'
                  : 'border-white/10 hover:border-cyan-400/40 hover:bg-[#0f1430]'
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] px-3 py-1 rounded-md border tracking-wider font-bold uppercase"
                    style={{
                      borderColor: sector.badgeColor + '60',
                      color: sector.badgeColor,
                      backgroundColor: '#060814',
                    }}
                  >
                    {sector.badge}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300 font-bold">
                    <Users className="w-3.5 h-3.5 text-[#00ff88]" />
                    <span>{sector.pilots} WORMS</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-2xl uppercase font-black text-white tracking-tight">
                    {sector.name}
                  </h3>
                  <p className="font-mono text-xs text-slate-300 mt-2 leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">ENTRY FEE</span>
                    <span className="text-[#00f5d4] font-black mt-0.5">{sector.entryFee}</span>
                  </div>
                  <div className="p-3 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">HAZARD TIER</span>
                    <span className="text-amber-400 font-black mt-0.5">{sector.hazardRating}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    ZONE PROTOCOLS:
                  </span>
                  {sector.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-mono text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playBoostSound();
                    onSelectArena(sector.type);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f5d4] to-[#00ff88] text-[#002820] font-display text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,212,0.4)] hover:shadow-[0_0_30px_rgba(0,245,212,0.8)] cursor-pointer hover:scale-[1.01]"
                >
                  <span>SLITHER INTO GRID</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
