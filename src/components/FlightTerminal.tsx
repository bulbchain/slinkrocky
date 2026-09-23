import React, { useState } from 'react';
import { ArenaMode } from '../types';
import { sounds } from '../audio';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';
import {
  Shuffle,
  Rocket,
  ShieldCheck,
  Flame,
  Lock,
  Zap,
  Palette,
  Sparkles,
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
  glowClass: string;
  badge: string;
}

export const SLINK_SKINS: SlinkSkin[] = [
  {
    id: 'neon-viper',
    name: 'Neon Viper',
    color: '#00f5d4',
    coreColor: '#ffffff',
    glowClass: 'shadow-[0_0_15px_#00f5d4]',
    badge: 'CYBER',
  },
  {
    id: 'cyber-dragon',
    name: 'Cyber Dragon',
    color: '#ff007f',
    coreColor: '#ffbbdd',
    glowClass: 'shadow-[0_0_15px_#ff007f]',
    badge: 'HOT',
  },
  {
    id: 'acid-serpent',
    name: 'Acid Serpent',
    color: '#00ff88',
    coreColor: '#e0ffe8',
    glowClass: 'shadow-[0_0_15px_#00ff88]',
    badge: 'TOXIC',
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    color: '#ffaa00',
    coreColor: '#fff5cc',
    glowClass: 'shadow-[0_0_15px_#ffaa00]',
    badge: 'BLAZE',
  },
  {
    id: 'void-phantom',
    name: 'Void Phantom',
    color: '#a855f7',
    coreColor: '#f3e8ff',
    glowClass: 'shadow-[0_0_15px_#a855f7]',
    badge: 'MYSTIC',
  },
  {
    id: 'glacier-coil',
    name: 'Glacier Coil',
    color: '#38bdf8',
    coreColor: '#ffffff',
    glowClass: 'shadow-[0_0_15px_#38bdf8]',
    badge: 'FROST',
  },
];

const RANDOM_NAMES = [
  'SLINK_VIPER',
  'NEON_DRIFTER',
  'HYPER_COIL',
  'LASER_FANG',
  'CYBER_SLINK',
  'APEX_DEVOURER',
  'PLASMA_WORM',
  'QUANTUM_SLINK',
  'TURBO_VIPER',
  'GHOST_CRAWLER',
  'OMEGA_SLINK',
  'VORTEX_NIB',
];

export const FlightTerminal: React.FC<FlightTerminalProps> = ({
  callsign,
  setCallsign,
  wormColor = '#00f5d4',
  setWormColor,
  arenaMode,
  setArenaMode,
  onEnterArena,
}) => {
  const [selectedSkinId, setSelectedSkinId] = useState<string>('neon-viper');

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
    <div className="flex h-full flex-col justify-between rounded-2xl border border-cyan-500/30 bg-[#0c1026]/90 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_0_20px_rgba(0,245,212,0.04)] backdrop-blur-2xl">
      <div className="flex flex-col gap-4">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 text-[#00f5d4]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-white">
                SLINK CUSTOMIZER
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-400">
                Worm Loadout v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#00ff88]">
              ARENA ONLINE
            </span>
          </div>
        </div>

        {/* Live Worm Mascot Preview Box */}
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-[#060814] p-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <img
              src={slinkLogo}
              alt="SLINK Creature Mascot"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40 shadow-[0_0_12px_rgba(0,245,212,0.3)] shrink-0"
            />

            <div>
              <div className="font-display text-xs font-bold uppercase text-white flex items-center gap-1.5">
                <span>{callsign || 'SLINK_VIPER'}</span>
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-cyan-300">
                  {currentSkin.badge}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[10px] text-slate-400">
                  Skin: <span className="text-white font-semibold">{currentSkin.name}</span>
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-white/30"
                  style={{ backgroundColor: currentSkin.color, boxShadow: `0 0 8px ${currentSkin.color}` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomize}
            title="Randomize Worm Name & Skin"
            className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs font-bold text-[#00f5d4] hover:bg-[#00f5d4] hover:text-[#002820] transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span className="text-[10px]">RND</span>
          </button>
        </div>

        {/* Worm Callsign Input */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300 flex justify-between">
            <span>WORM CALLSIGN</span>
            <span className="text-slate-500">MAX 14 CHARS</span>
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
            placeholder="NAME YOUR SLINK..."
            className="w-full rounded-xl border border-white/15 bg-[#070a1a] px-4 py-2.5 font-mono text-sm uppercase text-[#d7fff3] outline-none shadow-inner transition-all placeholder:text-slate-600 focus:border-[#00f5d4] focus:ring-1 focus:ring-[#00f5d4]"
          />
        </div>

        {/* Vibrant Skin Palette Selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-cyan-400" />
              <span>SELECT WORM SKIN</span>
            </label>
            <span className="font-mono text-[9px] text-cyan-400 font-semibold">
              6 VIBRANT SKINS
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SLINK_SKINS.map((skin) => {
              const isSelected = selectedSkinId === skin.id;
              return (
                <button
                  key={skin.id}
                  type="button"
                  onClick={() => handleSelectSkin(skin)}
                  className={`group relative flex flex-col items-center gap-1 rounded-xl p-2 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105'
                      : 'border-white/10 bg-[#080d20] hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full transition-transform group-hover:scale-110 ${skin.glowClass}`}
                    style={{ backgroundColor: skin.color }}
                  />
                  <span className="font-mono text-[8px] font-bold uppercase truncate w-full text-center text-slate-300">
                    {skin.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">
            ARENA MODE
          </label>

          <div className="grid grid-cols-2 gap-2">
            {/* FREE ARENA */}
            <button
              type="button"
              onClick={() => {
                sounds.playBeep(640);
                setArenaMode('free');
              }}
              className={`flex flex-col rounded-xl p-3 text-left transition-all cursor-pointer ${
                arenaMode === 'free'
                  ? 'border border-cyan-400 bg-cyan-500/15 text-white shadow-[0_0_15px_rgba(0,245,212,0.2)]'
                  : 'border border-white/10 bg-[#080d20] text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-display text-xs font-bold uppercase text-[#00f5d4]">
                  FREE ARENA
                </span>
                <span className="h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
              </div>
              <span className="mt-1 font-mono text-[9px] leading-tight text-slate-300">
                Instant Play · 0 Gas · Endless Grow
              </span>
            </button>

            {/* STAKED BOUNTY RUN */}
            <button
              type="button"
              onClick={() => {
                sounds.playBeep(680);
                setArenaMode('staked');
              }}
              className={`relative flex flex-col rounded-xl p-3 text-left transition-all cursor-pointer ${
                arenaMode === 'staked'
                  ? 'border border-amber-400 bg-amber-500/15 text-white shadow-[0_0_15px_rgba(255,170,0,0.2)]'
                  : 'border border-white/10 bg-[#080d20] hover:border-amber-400/40 text-slate-400'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-display text-xs font-bold uppercase text-amber-400">
                  PRO BOUNTY
                </span>
                <Lock className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <span className="mt-1 font-mono text-[9px] leading-tight text-slate-300">
                $SLINK Staked Battles
              </span>
              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.2 font-mono text-[8px] font-bold uppercase text-amber-300">
                <Zap className="h-2 w-2" /> SOON
              </span>
            </button>
          </div>
        </div>

        {/* Mode Information Card */}
        <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-[#060814]/80 p-3 font-mono text-xs text-slate-300">
          {arenaMode === 'free' ? (
            <>
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff88]" />
              <span className="text-[11px] leading-relaxed">
                Slither into the open grid. Eat food, boost to cut off rivals, harvest their glowing remains, and scale up.
              </span>
            </>
          ) : (
            <>
              <Flame className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span className="text-[11px] leading-relaxed text-amber-200">
                $SLINK token wagers, competitive tournaments, and prize pools unlock in the next protocol upgrade.
              </span>
            </>
          )}
        </div>

        {/* LAUNCH BUTTON */}
        <button
          type="button"
          onClick={() => {
            sounds.playBoostSound();
            onEnterArena();
          }}
          className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00f5d4] via-[#00ff88] to-[#00f5d4] bg-[length:200%_auto] hover:bg-right py-4 font-display text-base font-extrabold uppercase tracking-widest text-[#002820] shadow-[0_0_35px_rgba(0,245,212,0.65)] hover:shadow-[0_0_50px_rgba(0,245,212,0.9)] hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <Rocket className="h-5 w-5" />
          <span>LAUNCH SLINK · ENTER ARENA</span>
        </button>
      </div>

      {/* QUICK CONTROLS BAR */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-[#060814]/60 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[10px] text-slate-300">
            Steer: <strong className="text-white">Mouse / Touch</strong>
          </span>
        </div>
        <span className="text-white/20">·</span>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300">
          <span>Boost:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-bold text-[9px]">
            Hold Click / Space
          </kbd>
        </div>
      </div>
    </div>
  );
};
