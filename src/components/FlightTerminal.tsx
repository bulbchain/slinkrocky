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
    id: 'cyber-green',
    name: 'Neon Lime',
    color: '#B4F000',
    coreColor: '#111111',
    badge: '⚡ VIPER',
  },
  {
    id: 'coral-pink',
    name: 'Hot Coral',
    color: '#FF5D8F',
    coreColor: '#FFFFFF',
    badge: '🪱 CANDY',
  },
  {
    id: 'cyan-pulse',
    name: 'Electric Cyan',
    color: '#00F5D4',
    coreColor: '#111111',
    badge: '🐍 NITRO',
  },
  {
    id: 'solar-flare',
    name: 'Solar Blaze',
    color: '#FF7700',
    coreColor: '#FFDD00',
    badge: '🐛 MAGMA',
  },
  {
    id: 'ultra-violet',
    name: 'Ultra Violet',
    color: '#8338EC',
    coreColor: '#00F5D4',
    badge: '🐌 COSMO',
  },
  {
    id: 'sky-azure',
    name: 'Azure Frost',
    color: '#55B3F3',
    coreColor: '#B4F000',
    badge: '🪱 FROST',
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
    return 'cyber-green';
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
    <div className="flex h-full flex-col justify-between comic-card p-5 sm:p-6 bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111]">
      <div className="flex flex-col gap-4">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b-3 border-[#111111] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-comic text-2xl text-[#111111] tracking-wide">
              WORM WORKSHOP
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#B4F000] border-2 border-[#111111] text-[#111111] shadow-[2px_2px_0px_#111111]">
            <span className="font-comic text-xs uppercase tracking-wider font-bold">
              ONLINE &amp; HUNGRY
            </span>
          </div>
        </div>

        {/* Live Worm Mascot Preview Box */}
        <div className="relative overflow-hidden rounded-xl border-3 border-[#111111] bg-[#F4EEDF] p-3.5 flex items-center justify-between shadow-[3px_3px_0px_#111111]">
          <div className="flex items-center gap-3">
            {/* Dynamic Hand-drawn Character Preview */}
            <div className="p-1 bg-[#55B3F3] rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              {selectedSkinId === 'sunny' || selectedSkinId === 'cocoa' ? (
                <SlinkSpeedy size={54} color={currentSkin.color} />
              ) : (
                <SlinkHungry size={54} color={currentSkin.color} />
              )}
            </div>

            <div>
              <div className="font-comic text-xl uppercase text-[#111111] flex items-center gap-1.5 leading-none">
                <span>{callsign || 'WOBBLY_JOE'}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-body text-xs font-bold text-[#111111]/70">
                  Color: <strong className="text-[#111111]">{currentSkin.name}</strong>
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block border-2 border-[#111111] shadow-[1px_1px_0px_#111111]"
                  style={{ backgroundColor: currentSkin.color }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomize}
            title="Randomize Worm Name & Skin"
            className="flex items-center gap-1.5 rounded-lg border-2 border-[#111111] bg-[#FFD13B] px-3 py-1.5 font-comic text-sm text-[#111111] font-bold shadow-[2px_2px_0px_#111111] hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>REROLL</span>
          </button>
        </div>

        {/* Worm Callsign Input */}
        <div className="flex flex-col gap-1">
          <label className="font-comic text-sm uppercase tracking-wide text-[#111111] font-bold flex justify-between">
            <span>WORM NICKNAME</span>
            <span className="font-body text-[11px] text-[#111111]/70 font-bold">MAX 14 CHARS</span>
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
            className="w-full rounded-xl border-3 border-[#111111] bg-white px-3.5 py-2.5 font-comic text-lg uppercase text-[#111111] outline-none shadow-[3px_3px_0px_#111111] transition-all placeholder:text-[#111111]/40 focus:bg-[#F4EEDF] focus:border-[#111111]"
          />
        </div>

        {/* Vibrant Skin Palette Selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-comic text-sm uppercase tracking-wide text-[#111111] font-bold flex items-center gap-1.5">
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
                  className={`group relative flex flex-col items-center gap-1 rounded-xl p-2 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#111111] bg-[#B4F000] shadow-[3px_3px_0px_#111111] -translate-y-0.5'
                      : 'border-[#111111]/30 bg-[#F4EEDF] hover:border-[#111111] hover:bg-white'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-[#111111] shadow-[1px_1px_0px_#111111] transition-transform group-hover:scale-110"
                    style={{ backgroundColor: skin.color }}
                  />
                  <span className="font-comic text-xs uppercase truncate w-full text-center text-[#111111] font-bold">
                    {skin.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-comic text-sm uppercase tracking-wide text-[#111111] font-bold">
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
              className={`flex flex-col rounded-xl p-2.5 text-left border-3 transition-all cursor-pointer ${
                arenaMode === 'free'
                  ? 'border-[#111111] bg-[#55B3F3] shadow-[3px_3px_0px_#111111]'
                  : 'border-[#111111]/30 bg-[#F4EEDF] hover:border-[#111111]'
              }`}
            >
              <span className="font-comic text-base uppercase text-[#111111] font-bold">
                SUNNY MEADOW
              </span>
              <span className="font-body text-[11px] leading-tight text-[#111111] font-semibold">
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
              className={`flex flex-col rounded-xl p-2.5 text-left border-3 transition-all cursor-pointer ${
                arenaMode === 'staked'
                  ? 'border-[#111111] bg-[#FF5D8F] text-[#111111] shadow-[3px_3px_0px_#111111]'
                  : 'border-[#111111]/30 bg-[#F4EEDF] hover:border-[#111111]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-comic text-base uppercase font-bold">
                  BOUNTY BOWL
                </span>
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="font-body text-[11px] leading-tight font-semibold">
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
          className="comic-btn w-full py-4 bg-[#B4F000] hover:bg-[#9DE000] text-[#111111] text-2xl uppercase tracking-wider shadow-[5px_5px_0px_#111111] mt-1 cursor-pointer font-bold"
        >
          <Rocket className="h-6 w-6 mr-2" />
          <span>START SLITHERING!</span>
        </button>
      </div>

      {/* QUICK CONTROLS BAR */}
      <div className="mt-4 flex items-center justify-between rounded-xl border-3 border-[#111111] bg-[#F4EEDF] px-3.5 py-2.5 shadow-[3px_3px_0px_#111111]">
        <div className="flex items-center gap-1.5 font-comic text-xs text-[#111111] font-bold">
          <MousePointer className="w-3.5 h-3.5 text-[#FA824C]" />
          <span>MOUSE / TOUCH TO STEER</span>
        </div>
        <span className="font-comic text-xs text-[#111111]">·</span>
        <div className="font-comic text-xs text-[#111111] font-bold">
          HOLD SPACE TO <span className="text-[#FA824C]">BOOST!</span>
        </div>
      </div>
    </div>
  );
};
