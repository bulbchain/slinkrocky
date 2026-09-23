import React from 'react';
import { X, User, Award, Shield, Zap, Sparkles } from 'lucide-react';
import { sounds } from '../audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  callsign: string;
  setCallsign: (val: string) => void;
  score: number;
  kills: number;
}

const BADGES = [
  { name: 'APEX SLINK', desc: '10+ arena takedowns in single run', icon: '⚡', unlocked: true },
  { name: 'STAR HARVESTER', desc: 'Absorbed 10,000+ luminous mass orbs', icon: '✨', unlocked: true },
  { name: 'HYPER DASH', desc: 'Maintained 5.2x boost sprint for 10s', icon: '🚀', unlocked: true },
  { name: 'BOUNTY LORD', desc: 'Extracted with 2.5+ SOL in bounty pool', icon: '👑', unlocked: false },
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
      ? 'APEX TITAN'
      : score >= 9000
        ? 'VIPER COMMANDER'
        : score >= 5000
          ? 'GRID PREDATOR'
          : 'NOVICE SLINK';

  const pilotLevel = Math.min(99, 5 + Math.floor(kills / 2) + Math.floor(score / 2000));
  const boostEfficiency = Math.min(99.9, 72 + kills * 2.5 + score / 600).toFixed(1);
  const escapeRate = Math.min(99.9, 65 + kills * 2.8 + score / 800).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c1026] border border-cyan-400/40 p-6 shadow-[0_0_50px_rgba(0,245,212,0.3)] flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-[#00f5d4]">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg uppercase font-bold text-white">
              SLINK PILOT DOSSIER
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity & Rank */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#060814] border border-cyan-500/30 shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-pink-500 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.4)]">
            <div className="w-full h-full bg-[#0c1026] rounded-2xl flex items-center justify-center text-[#00f5d4]">
              <User className="w-7 h-7" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">WORM CALLSIGN</span>
            <span className="font-display text-2xl font-black text-white uppercase tracking-tight">
              {callsign || 'SLINK_VIPER'}
            </span>
            <span className="font-mono text-xs text-amber-300 font-bold mt-0.5">
              RANK: {pilotRank} (LVL {pilotLevel})
            </span>
          </div>
        </div>

        {/* Lifetime Stats */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
            <span className="text-slate-400 text-[9px] uppercase font-bold">LIFETIME TAKEDOWNS</span>
            <span className="text-pink-400 text-lg font-black mt-0.5">{kills} KILLS</span>
          </div>
          <div className="p-3.5 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
            <span className="text-slate-400 text-[9px] uppercase font-bold">PEAK WORM LENGTH</span>
            <span className="text-[#00f5d4] text-lg font-black mt-0.5">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
            <span className="text-slate-400 text-[9px] uppercase font-bold">BOOST EFFICIENCY</span>
            <span className="text-amber-400 text-lg font-black mt-0.5">{boostEfficiency}%</span>
          </div>
          <div className="p-3.5 bg-[#060814] rounded-xl border border-white/10 flex flex-col">
            <span className="text-slate-400 text-[9px] uppercase font-bold">GRID SURVIVAL RATE</span>
            <span className="text-[#00ff88] text-lg font-black mt-0.5">{escapeRate}%</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">HONOR MEDALS</span>
          <div className="grid grid-cols-2 gap-2">
            {BADGES.map((b) => (
              <div
                key={b.name}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                  b.unlocked
                    ? 'bg-[#060814] border-cyan-500/30 text-white'
                    : 'bg-[#060814]/40 border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <span className="text-xl">{b.icon}</span>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-display text-xs font-bold truncate uppercase">{b.name}</span>
                  <span className="font-mono text-[9px] text-slate-400 truncate">{b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
