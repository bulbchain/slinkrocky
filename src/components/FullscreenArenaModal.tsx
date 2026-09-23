import React, { useEffect } from 'react';
import { X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ArenaCanvas } from './ArenaCanvas';
import { sounds } from '../audio';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';

interface FullscreenArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  callsign: string;
  wormColor?: string;
  onKillsUpdate?: (k: number) => void;
  onScoreUpdate?: (s: number) => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const FullscreenArenaModal: React.FC<FullscreenArenaModalProps> = ({
  isOpen,
  onClose,
  callsign,
  wormColor,
  onKillsUpdate,
  onScoreUpdate,
  soundMuted,
  onToggleSound,
}) => {
  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060814] flex flex-col">
      {/* Top Thin HUD Command Bar */}
      <div className="h-14 w-full bg-[#080c1e]/95 border-b border-cyan-500/25 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 opacity-70 blur-xs" />
            <img
              src={slinkLogo}
              alt="SLINK logo"
              referrerPolicy="no-referrer"
              className="relative h-9 w-9 rounded-lg object-cover border border-white/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-base uppercase bg-gradient-to-r from-[#00f5d4] via-[#ff007f] to-[#ffaa00] bg-clip-text text-transparent">
              SLINK ARENA
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-bold">
              FULL IMMERSION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundMuted ? 'Unmute sound' : 'Mute sound'}
            className="p-2 rounded-lg bg-[#0c1026] text-slate-300 hover:text-[#00f5d4] border border-white/10 transition-colors cursor-pointer"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-pink-400" /> : <Volume2 className="w-4 h-4 text-[#00f5d4]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 border border-pink-500/40 font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <X className="w-4 h-4" />
            <span>EXIT (ESC)</span>
          </button>
        </div>
      </div>

      {/* Main Full-Size Arena Area */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#060814]">
        <ArenaCanvas
          callsign={callsign}
          wormColor={wormColor}
          onKillsUpdate={onKillsUpdate}
          onScoreUpdate={onScoreUpdate}
          isFullscreen={true}
          onToggleFullscreen={onClose}
        />
      </div>
    </div>
  );
};
