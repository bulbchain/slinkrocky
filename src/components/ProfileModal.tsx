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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-sm">
      <div className="comic-card bg-white w-full max-w-md p-6 sm:p-7 flex flex-col gap-5 border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#B4F000] border-2 border-[#111111] text-[#111111]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] font-black">
              CREATURE PILOT DOSSIER
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="p-1.5 rounded-xl bg-[#F4EEDF] hover:bg-[#B4F000] border-2 border-[#111111] text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot & Callsign */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
          <div className="p-2 rounded-2xl bg-[#55B3F3] border-2 border-[#111111] shrink-0">
            <SlinkChampion size={60} />
          </div>
          <div className="flex-1">
            <span className="font-comic text-[10px] uppercase text-[#FF5D8F] tracking-wider font-black block">
              CALLSIGN &amp; IDENTITY
            </span>
            <input
              type="text"
              value={callsign}
              maxLength={16}
              onChange={(e) => setCallsign(e.target.value.toUpperCase())}
              className="comic-input w-full py-1.5 px-2.5 font-comic text-lg uppercase text-[#111111] rounded-xl border-2 border-[#111111] bg-white mt-1 font-black"
            />
            <span className="font-comic text-xs text-[#111111] font-black mt-1 block">
              RANK: {pilotRank}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] text-center shadow-[1px_1px_0px_#111111]">
            <span className="font-body text-[10px] font-black text-[#555555] uppercase block">BEST MASS</span>
            <span className="font-comic text-xl text-[#FF5D8F] font-black">{score.toLocaleString()} PTS</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] text-center shadow-[1px_1px_0px_#111111]">
            <span className="font-body text-[10px] font-black text-[#555555] uppercase block">TOTAL CHOMPS</span>
            <span className="font-comic text-xl text-[#111111] font-black">{kills} TAKEDOWNS</span>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="flex flex-col gap-2">
          <span className="font-comic text-xs uppercase text-[#111111] font-black">
            COMIC BADGES COLLECTED:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {BADGES.map((b) => (
              <div
                key={b.name}
                className={`p-2.5 rounded-xl border-2 border-[#111111] flex items-center gap-2 ${
                  b.unlocked ? 'bg-[#B4F000]/40' : 'bg-gray-100 opacity-60'
                }`}
              >
                <span className="text-xl">{b.icon}</span>
                <div>
                  <span className="font-comic text-xs uppercase text-[#111111] block leading-tight font-black">
                    {b.name}
                  </span>
                  <span className="font-body text-[10px] text-[#555555] font-bold">
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
          className="comic-btn w-full bg-[#B4F000] hover:bg-[#cbf738] text-[#111111] text-base uppercase py-3.5 rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] font-black mt-2"
        >
          SAVE &amp; CLOSE
        </button>
      </div>
    </div>
  );
};
