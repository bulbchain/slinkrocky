import React, { useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-[#FFF8ED] flex flex-col">
      {/* Top Thin HUD Command Bar */}
      <div className="h-11 sm:h-12 w-full bg-[#FFFDF8] border-b-2 sm:border-b-3 border-[#1E1B18] px-3 sm:px-6 flex items-center justify-between z-20 shadow-[0_2px_0px_#1E1B18]">
        {/* Top Left: Logo & SLINK */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border-2 border-[#1E1B18] shadow-[1.5px_1.5px_0px_#1E1B18] bg-[#FFD13B] flex-shrink-0 flex items-center justify-center">
            <img
              src={slinkLogo}
              alt="SLINK Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-comic text-xl sm:text-2xl text-[#FA824C] tracking-wide drop-shadow-[1.5px_1.5px_0px_#1E1B18] select-none leading-none">
            SLINK
          </span>
        </div>

        {/* Top Right: Sound & Exit Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundMuted ? 'Unmute sound' : 'Mute sound'}
            className="p-1.5 sm:p-2 rounded-lg bg-white text-[#1E1B18] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#FFD13B] transition-colors cursor-pointer"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-[#E63946]" /> : <Volume2 className="w-4 h-4 text-[#70A288]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-[#E63946] hover:bg-[#D62839] text-white border-2 border-[#1E1B18] font-comic text-xs sm:text-sm uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1E1B18]"
          >
            <X className="w-4 h-4" />
            <span>EXIT</span>
            <span className="hidden sm:inline text-[11px] opacity-80">(ESC)</span>
          </button>
        </div>
      </div>

      {/* Main Full-Size Arena Area */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#FFF8ED]">
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
