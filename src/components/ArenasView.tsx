import React, { useState } from 'react';
import { ArrowRight, Trophy, Sparkles, MapPin } from 'lucide-react';
import { sounds } from '../audio';
import {
  SlinkHungry,
  SlinkSpeedy,
  SlinkChampion,
  SoundBurst,
} from './RetroCartoonCharacters';

interface ArenasViewProps {
  onSelectArena: (mode: 'free' | 'staked') => void;
}

const ARENA_SECTORS = [
  {
    id: 'sunny-meadow',
    name: 'MEADOW 01: SUNNY ORCHARD',
    badge: 'SUNDAY CLASSIC',
    badgeColor: '#70A288',
    type: 'free' as const,
    worms: 1420,
    snackRating: 'APPLE FEAST',
    entryFee: 'FREE (0 TOKENS)',
    respawn: 'INSTANT (<1s)',
    description: 'The beloved classic sunny meadow! Crisp Honeycrisp apples, soft green dandelion patches, and friendly bots. Ideal for wiggling, growing long, and having a blast.',
    rules: ['100% Free — no wallet needed', 'Instant one-tap respawn', 'Active goodies: Magnets, Bubble Shields, Nitro Rockets'],
    component: SlinkHungry,
  },
  {
    id: 'bounty-bowl',
    name: 'MEADOW 02: THE BOUNTY BOWL',
    badge: 'BIG PRIZES',
    badgeColor: '#FA824C',
    type: 'staked' as const,
    worms: 685,
    snackRating: 'STAR LOOT',
    entryFee: '50 $SLINK',
    respawn: 'RE-ENTRY PASS',
    description: 'The premier tournament stage for skilled wrigglers! Worms stake $SLINK tokens and drop glittering Star Loot upon poofing. Top worms take home the prize pot!',
    rules: ['50 $SLINK entry stake', 'Winner reaps 85% of target bounty', 'Giant Golden Star drops on every pop'],
    component: SlinkChampion,
  },
  {
    id: 'wobble-woods',
    name: 'MEADOW 03: WOBBLY WOODS',
    badge: 'SILLY CHAOS',
    badgeColor: '#78C0E0',
    type: 'free' as const,
    worms: 410,
    snackRating: 'BERRY BLITZ',
    entryFee: 'FREE (0 TOKENS)',
    respawn: 'INSTANT (<1s)',
    description: 'A rambunctious forest patch filled with bouncy mushrooms, winding hedge fences, and double-speed berries! Pure cartoon mayhem from start to finish.',
    rules: ['+50% more berry snacks', 'Bouncy mushroom bumpers', 'Double turbo boost pads'],
    component: SlinkSpeedy,
  },
];

export const ArenasView: React.FC<ArenasViewProps> = ({ onSelectArena }) => {
  const [selectedId, setSelectedId] = useState('sunny-meadow');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] mx-auto">
          <MapPin className="h-4 w-4 text-[#1E1B18]" />
          <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
            CHOOSE YOUR PLAYGROUND
          </span>
        </div>

        <h1 className="font-comic text-4xl sm:text-6xl uppercase text-[#1E1B18] tracking-wide">
          SLINK MEADOW LOCATIONS
        </h1>

        <p className="font-body text-base text-[#5C3D2E] font-medium leading-relaxed">
          From peaceful apple orchards to high-energy prize arenas, pick your favorite comic backdrop and start slithering!
        </p>
      </div>

      {/* Grid of Arenas Styled like Comic Collector Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {ARENA_SECTORS.map((sector) => {
          const isSelected = selectedId === sector.id;
          const CharacterComponent = sector.component;

          return (
            <div
              key={sector.id}
              onClick={() => {
                setSelectedId(sector.id);
                sounds.playBeep(640);
              }}
              className={`comic-card bg-[#FFFDF8] p-6 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 ${
                isSelected
                  ? 'border-4 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18] ring-4 ring-[#FFD13B]'
                  : 'border-3 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18]'
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span
                    style={{ backgroundColor: sector.badgeColor }}
                    className="font-comic text-xs uppercase text-white px-2.5 py-1 rounded border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18]"
                  >
                    {sector.badge}
                  </span>

                  <span className="font-comic text-xs text-[#1E1B18] bg-[#FFF8ED] px-2 py-0.5 rounded border border-[#1E1B18]">
                    {sector.worms} WORMS IN PLAY
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FFF8ED] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                    <CharacterComponent size={56} />
                  </div>
                  <div>
                    <h3 className="font-comic text-2xl uppercase text-[#1E1B18] tracking-wide leading-tight">
                      {sector.name}
                    </h3>
                    <span className="font-comic text-xs text-[#FA824C]">
                      {sector.snackRating}
                    </span>
                  </div>
                </div>

                <p className="font-body text-xs sm:text-sm text-[#5C3D2E] leading-relaxed">
                  {sector.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2 bg-[#FFF8ED] rounded border-2 border-[#1E1B18] text-center">
                    <span className="font-body text-[10px] font-bold text-[#5C3D2E] uppercase block">ENTRY</span>
                    <span className="font-comic text-sm text-[#1E1B18]">{sector.entryFee}</span>
                  </div>
                  <div className="p-2 bg-[#FFF8ED] rounded border-2 border-[#1E1B18] text-center">
                    <span className="font-body text-[10px] font-bold text-[#5C3D2E] uppercase block">RESPAWN</span>
                    <span className="font-comic text-sm text-[#70A288]">{sector.respawn}</span>
                  </div>
                </div>

                {/* Rules List */}
                <div className="flex flex-col gap-1.5 pt-2 border-t-2 border-[#1E1B18]/15">
                  <span className="font-comic text-xs uppercase text-[#1E1B18]">MEADOW PERKS:</span>
                  {sector.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-body text-xs text-[#1E1B18]">
                      <span className="w-2 h-2 rounded-full bg-[#FA824C] border border-[#1E1B18]" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-[#1E1B18]/15">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playBoostSound();
                    onSelectArena(sector.type);
                  }}
                  className={`comic-btn w-full uppercase text-base py-3 ${
                    sector.type === 'free'
                      ? 'bg-[#FFD13B] hover:bg-[#FFE066] text-[#1E1B18]'
                      : 'bg-[#FA824C] hover:bg-[#FF9666] text-white'
                  }`}
                >
                  <span>ENTER THIS MEADOW</span>
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
