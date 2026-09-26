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
    <div className="fixed inset-0 z-50 bg-[#E8E2D2] flex flex-col">
      {/* Top Thin HUD Command Bar */}
      <div className="h-11 sm:h-12 w-full bg-[#F4EEDF] border-b-2 sm:border-b-3 border-[#111111] px-3 sm:px-6 flex items-center justify-between z-20 shadow-[0_2px_0px_#111111]">
        {/* Top Left: Logo & SLINK */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border-2 border-[#111111] shadow-[1.5px_1.5px_0px_#111111] bg-[#B4F000] flex-shrink-0 flex items-center justify-center">
            <img
              src={slinkLogo}
              alt="SLINK Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-comic text-xl sm:text-2xl text-[#111111] font-black tracking-wide select-none leading-none">
            SLINK
          </span>
        </div>

        {/* Top Right: Sound & Exit Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundMuted ? 'Unmute sound' : 'Mute sound'}
            className="p-1.5 sm:p-2 rounded-xl bg-white text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#B4F000] transition-colors cursor-pointer"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-[#FF5D8F]" /> : <Volume2 className="w-4 h-4 text-[#111111]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#FF5D8F] hover:bg-[#ff75a0] text-white border-2 border-[#111111] font-comic text-xs sm:text-sm uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#111111] font-black"
          >
            <X className="w-4 h-4" />
            <span>EXIT</span>
            <span className="hidden sm:inline text-[11px] opacity-80">(ESC)</span>
          </button>
        </div>
      </div>

      {/* Main Full-Size Arena Area */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#E8E2D2]">
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
