import React from 'react';
import { X, Award, Shield, Sparkles } from 'lucide-react';
import { sounds } from '../audio';
import { SlinkChampion, SlinkSpeedy, SoundBurst } from './RetroCartoonCharacters';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  callsign: string;
  setCallsign: (val: string) => void;
  score: number;
  kills: number;
}

const BADGES = [
  { name: 'BIG APPLE BITER', desc: 'Ate 100+ apples in a single run', icon: '🍎', unlocked: true },
  { name: 'SUPER SPEEDSTER', desc: 'Maintained turbo sprint for 10s', icon: '⚡', unlocked: true },
  { name: 'STAR LOOTER', desc: 'Harvested 1,000+ stars from poofed worms', icon: '⭐', unlocked: true },
  { name: 'MEADOW CHAMP', desc: 'Reached the #1 spot on Sunday leaderboard', icon: '👑', unlocked: false },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  callsign,
  setCallsign,
  score,
  kills,
}) => {
  if (!isOpen) return null;

  const pilotRank =
    score >= 15000
      ? 'GRAND WORM EMPEROR'
      : score >= 9000
        ? 'MEADOW VIPER'
        : score >= 5000
          ? 'BUSY FORAGER'
          : 'SUNNY NOVICE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B18]/60 backdrop-blur-sm">
      <div className="comic-card bg-[#FFFDF8] w-full max-w-md p-6 sm:p-7 flex flex-col gap-5 border-4 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18] relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E1B18] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FA824C] border-2 border-[#1E1B18] text-white">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#1E1B18]">
              WORM PILOT DOSSIER
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="p-1 rounded-lg bg-[#FFF8ED] hover:bg-[#FFE066] border-2 border-[#1E1B18] text-[#1E1B18] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot & Callsign */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFF8ED] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
          <div className="p-2 rounded-xl bg-[#FFD13B] border-2 border-[#1E1B18] shrink-0">
            <SlinkChampion size={60} />
          </div>
          <div className="flex-1">
            <span className="font-comic text-[10px] uppercase text-[#FA824C] tracking-wider block">
              CALLSIGN &amp; IDENTITY
            </span>
            <input
              type="text"
              value={callsign}
              maxLength={16}
              onChange={(e) => setCallsign(e.target.value.toUpperCase())}
              className="comic-input w-full py-1 px-2 font-comic text-lg uppercase text-[#1E1B18] mt-1"
            />
            <span className="font-comic text-xs text-[#70A288] mt-1 block">
              RANK: {pilotRank}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#FFF8ED] border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
            <span className="font-body text-[10px] font-bold text-[#5C3D2E] uppercase block">BEST MASS</span>
            <span className="font-comic text-xl text-[#FA824C]">{score.toLocaleString()} PTS</span>
          </div>
          <div className="p-3 rounded-lg bg-[#FFF8ED] border-2 border-[#1E1B18] text-center shadow-[1px_1px_0px_#1E1B18]">
            <span className="font-body text-[10px] font-bold text-[#5C3D2E] uppercase block">TOTAL CHOMPS</span>
            <span className="font-comic text-xl text-[#E63946]">{kills} TAKEDOWNS</span>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="flex flex-col gap-2">
          <span className="font-comic text-xs uppercase text-[#1E1B18]">
            COMIC BADGES COLLECTED:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {BADGES.map((b) => (
              <div
                key={b.name}
                className={`p-2.5 rounded-lg border-2 border-[#1E1B18] flex items-center gap-2 ${
                  b.unlocked ? 'bg-[#FFD13B]/40' : 'bg-gray-100 opacity-60'
                }`}
              >
                <span className="text-xl">{b.icon}</span>
                <div>
                  <span className="font-comic text-xs uppercase text-[#1E1B18] block leading-tight">
                    {b.name}
                  </span>
                  <span className="font-body text-[10px] text-[#5C3D2E]">
                    {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playBeep(640);
            onClose();
          }}
          className="comic-btn w-full bg-[#FFD13B] hover:bg-[#FFE066] text-[#1E1B18] text-base uppercase py-3 mt-2"
        >
          SAVE &amp; CLOSE
        </button>
      </div>
    </div>
  );
};
