import React, { useState, useEffect } from 'react';
import { ArenaMode } from '../types';
import { sounds } from '../audio';
import { SlinkHungry, SlinkSpeedy } from './RetroCartoonCharacters';
import {
  Shuffle,
  Rocket,
  ShieldCheck,
  Flame,
  Lock,
  Zap,
  Palette,
  MousePointer,
} from 'lucide-react';

interface FlightTerminalProps {
  callsign: string;
  setCallsign: (val: string) => void;
  wormColor?: string;
  setWormColor?: (color: string) => void;
  arenaMode: ArenaMode;
  setArenaMode: (mode: ArenaMode) => void;
  onEnterArena: () => void;
}

export interface SlinkSkin {
  id: string;
  name: string;
  color: string;
  coreColor: string;
  badge: string;
}

export const SLINK_SKINS: SlinkSkin[] = [
  {
    id: 'tangerine',
    name: 'Earth Slink',
    color: '#FA824C',
    coreColor: '#FFFDF8',
    badge: '🪱 WORM',
  },
  {
    id: 'sunny',
    name: 'Banana Slug',
    color: '#FFD13B',
    coreColor: '#5C3D2E',
    badge: '🐌 SLUG',
  },
  {
    id: 'clover',
    name: 'Jade Viper',
    color: '#70A288',
    coreColor: '#FFD13B',
    badge: '🐍 SNAKE',
  },
  {
    id: 'cherry',
    name: 'Red Centipede',
    color: '#E63946',
    coreColor: '#FA824C',
    badge: '🐛 CENTI',
  },
  {
    id: 'plum',
    name: 'Velvet Plum',
    color: '#7B2CBF',
    coreColor: '#FFFDF8',
    badge: '🫐 PLUM',
  },
  {
    id: 'cocoa',
    name: 'Soil Crawler',
    color: '#5C3D2E',
    coreColor: '#FA824C',
    badge: '🪱 EARTH',
  },
];

const RANDOM_NAMES = [
  'WOBBLY_JOE',
  'BARNABY_BOB',
  'SPEEDY_SAM',
  'CURLY_PETE',
  'SLINKY_SUE',
  'APPLE_CHOMPER',
  'ZIGGY_ZAG',
  'WORMINGTON',
  'NOODLE_NICK',
  'CAPTAIN_COIL',
  'CHUBBY_CHEX',
  'DIZZY_DAN',
];

export const FlightTerminal: React.FC<FlightTerminalProps> = ({
  callsign,
  setCallsign,
  wormColor,
  setWormColor,
  arenaMode,
  setArenaMode,
  onEnterArena,
}) => {
  const [selectedSkinId, setSelectedSkinId] = useState<string>(() => {
    if (wormColor) {
      const match = SLINK_SKINS.find((s) => s.color.toLowerCase() === wormColor.toLowerCase());
      if (match) return match.id;
    }
    return 'tangerine';
  });

  useEffect(() => {
    if (wormColor) {
      const match = SLINK_SKINS.find((s) => s.color.toLowerCase() === wormColor.toLowerCase());
      if (match && match.id !== selectedSkinId) {
        setSelectedSkinId(match.id);
      }
    }
  }, [wormColor, selectedSkinId]);

  const handleSelectSkin = (skin: SlinkSkin) => {
    setSelectedSkinId(skin.id);
    if (setWormColor) {
      setWormColor(skin.color);
    }
    sounds.playBeep(700);
  };

  const handleRandomize = () => {
    sounds.playBeep(800);
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const randomSkin = SLINK_SKINS[Math.floor(Math.random() * SLINK_SKINS.length)];

    setCallsign(randomName);
    setSelectedSkinId(randomSkin.id);
    if (setWormColor) {
      setWormColor(randomSkin.color);
    }
  };

  const currentSkin = SLINK_SKINS.find((s) => s.id === selectedSkinId) || SLINK_SKINS[0];

  return (
    <div className="flex h-full flex-col justify-between comic-card p-5 sm:p-6 bg-[#FFFDF8]">
      <div className="flex flex-col gap-4">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E1B18] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-comic text-2xl text-[#1E1B18] tracking-wide">
              WORM WORKSHOP
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#70A288] border-2 border-[#1E1B18] text-[#FFF8ED] shadow-[1px_1px_0px_#1E1B18]">
            <span className="font-comic text-xs uppercase tracking-wider">
              ONLINE &amp; HUNGRY
            </span>
          </div>
        </div>

        {/* Live Worm Mascot Preview Box */}
        <div className="relative overflow-hidden rounded-lg border-2 border-[#1E1B18] bg-[#FFF8ED] p-3 flex items-center justify-between shadow-[2px_2px_0px_#1E1B18]">
          <div className="flex items-center gap-3">
            {/* Dynamic Hand-drawn Character Preview */}
            <div className="p-1 bg-[#78C0E0] rounded-lg border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18]">
              {selectedSkinId === 'sunny' || selectedSkinId === 'cocoa' ? (
                <SlinkSpeedy size={54} color={currentSkin.color} />
              ) : (
                <SlinkHungry size={54} color={currentSkin.color} />
              )}
            </div>

            <div>
              <div className="font-comic text-lg uppercase text-[#1E1B18] flex items-center gap-1.5 leading-none">
                <span>{callsign || 'WOBBLY_JOE'}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-body text-xs font-semibold text-[#5C3D2E]">
                  Color: <strong className="text-[#1E1B18]">{currentSkin.name}</strong>
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18]"
                  style={{ backgroundColor: currentSkin.color }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomize}
            title="Randomize Worm Name & Skin"
            className="flex items-center gap-1 rounded-md border-2 border-[#1E1B18] bg-[#FFD13B] px-2.5 py-1.5 font-comic text-sm text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>REROLL</span>
          </button>
        </div>

        {/* Worm Callsign Input */}
        <div className="flex flex-col gap-1">
          <label className="font-comic text-sm uppercase tracking-wide text-[#1E1B18] flex justify-between">
            <span>WORM NICKNAME</span>
            <span className="font-body text-[11px] text-[#5C3D2E] font-bold">MAX 14 CHARS</span>
          </label>
          <input
            type="text"
            maxLength={14}
            value={callsign}
            onChange={(e) =>
              setCallsign(
                e.target.value.toUpperCase().replace(/\s+/g, '_')
              )
            }
            placeholder="TYPE A SILLY NAME..."
            className="w-full rounded-lg border-2 border-[#1E1B18] bg-white px-3.5 py-2 font-comic text-lg uppercase text-[#1E1B18] outline-none shadow-[2px_2px_0px_#1E1B18] transition-all placeholder:text-[#1E1B18]/40 focus:bg-[#FFFDF8] focus:border-[#FA824C]"
          />
        </div>

        {/* Vibrant Skin Palette Selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-comic text-sm uppercase tracking-wide text-[#1E1B18] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#FA824C]" />
              <span>PICK A CARTOON COLOR</span>
            </label>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SLINK_SKINS.map((skin) => {
              const isSelected = selectedSkinId === skin.id;
              return (
                <button
                  key={skin.id}
                  type="button"
                  onClick={() => handleSelectSkin(skin)}
                  className={`group relative flex flex-col items-center gap-1 rounded-lg p-2 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1E1B18] bg-[#FFD13B] shadow-[3px_3px_0px_#1E1B18] -translate-y-0.5'
                      : 'border-[#1E1B18]/40 bg-white hover:border-[#1E1B18] hover:bg-[#FFF8ED]'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18] transition-transform group-hover:scale-110"
                    style={{ backgroundColor: skin.color }}
                  />
                  <span className="font-comic text-xs uppercase truncate w-full text-center text-[#1E1B18]">
                    {skin.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-comic text-sm uppercase tracking-wide text-[#1E1B18]">
            CHOOSE ARENA MODE
          </label>

          <div className="grid grid-cols-2 gap-2">
            {/* FREE MEADOW */}
            <button
              type="button"
              onClick={() => {
                sounds.playBeep(640);
                setArenaMode('free');
              }}
              className={`flex flex-col rounded-lg p-2.5 text-left border-2 transition-all cursor-pointer ${
                arenaMode === 'free'
                  ? 'border-[#1E1B18] bg-[#78C0E0] shadow-[3px_3px_0px_#1E1B18]'
                  : 'border-[#1E1B18]/40 bg-white hover:border-[#1E1B18]'
              }`}
            >
              <span className="font-comic text-base uppercase text-[#1E1B18]">
                SUNNY MEADOW
              </span>
              <span className="font-body text-[11px] leading-tight text-[#1E1B18] font-medium">
                Free play · Instant respawn
              </span>
            </button>

            {/* STAKED BOUNTY */}
            <button
              type="button"
              onClick={() => {
                sounds.playBeep(680);
                setArenaMode('staked');
              }}
              className={`flex flex-col rounded-lg p-2.5 text-left border-2 transition-all cursor-pointer ${
                arenaMode === 'staked'
                  ? 'border-[#1E1B18] bg-[#FA824C] text-[#FFF8ED] shadow-[3px_3px_0px_#1E1B18]'
                  : 'border-[#1E1B18]/40 bg-white hover:border-[#1E1B18]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-comic text-base uppercase">
                  BOUNTY BOWL
                </span>
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="font-body text-[11px] leading-tight font-medium opacity-90">
                $SLINK token match
              </span>
            </button>
          </div>
        </div>

        {/* LAUNCH BUTTON */}
        <button
          type="button"
          onClick={() => {
            sounds.playBoostSound();
            onEnterArena();
          }}
          className="comic-btn w-full py-3.5 bg-[#FFD13B] hover:bg-[#FFE066] text-[#1E1B18] text-xl uppercase tracking-wider shadow-[4px_4px_0px_#1E1B18] mt-1 cursor-pointer"
        >
          <Rocket className="h-5 w-5 mr-2" />
          <span>START SLITHERING!</span>
        </button>
      </div>

      {/* QUICK CONTROLS BAR */}
      <div className="mt-4 flex items-center justify-between rounded-lg border-2 border-[#1E1B18] bg-[#FFF8ED] px-3 py-2 shadow-[2px_2px_0px_#1E1B18]">
        <div className="flex items-center gap-1.5 font-comic text-xs text-[#1E1B18]">
          <MousePointer className="w-3.5 h-3.5 text-[#FA824C]" />
          <span>MOUSE / TOUCH TO STEER</span>
        </div>
        <span className="font-comic text-xs text-[#5C3D2E]">·</span>
        <div className="font-comic text-xs text-[#1E1B18]">
          HOLD SPACE TO <span className="text-[#FA824C]">BOOST!</span>
        </div>
      </div>
    </div>
  );
};
