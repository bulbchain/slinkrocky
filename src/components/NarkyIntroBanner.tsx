import React from 'react';
import {
  Swords,
  Users2,
  Zap,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import slinkHero from '../assets/images/slink_arena_hero_1790168852962.jpg';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';

const highlights = [
  {
    label: 'Instant 60FPS Free-for-All',
    icon: Users2,
    color: 'text-[#00f5d4]',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    label: 'Kinetic Boost & Cut Combat',
    icon: Swords,
    color: 'text-[#ff007f]',
    bg: 'bg-pink-500/10 border-pink-500/30',
  },
  {
    label: 'Chain Multi-Kill Bounties',
    icon: Flame,
    color: 'text-[#ffaa00]',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  {
    label: 'Climb Apex Worm Leaderboard',
    icon: Award,
    color: 'text-[#a855f7]',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
];

export const NarkyIntroBanner: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#080b1e]/90 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,245,212,0.06)]">
        {/* Background glow layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(0,245,212,0.18),_transparent_40%),radial-gradient(circle_at_80%_80%,_rgba(255,0,127,0.15),_transparent_40%),radial-gradient(circle_at_50%_100%,_rgba(168,85,247,0.15),_transparent_45%)]" />

        {/* Ambient hero art overlay */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-screen pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url(${slinkHero})` }}
        />

        {/* Cyber grid lines */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,212,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,0,127,1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
          {/* Top Live Beacon */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-[#0c122c]/80 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,245,212,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#00f5d4]">
              LIVE MULTIPLAYER CYBER-WORM ARENA
            </span>
            <span className="text-white/20">·</span>
            <span className="font-mono text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> SEASON 1
            </span>
          </div>

          {/* Main Title with Mascot Creature Emblem */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="relative shrink-0 group">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#00f5d4] via-[#ff007f] to-[#ffaa00] opacity-80 blur-md group-hover:opacity-100 transition-opacity" />
                <img
                  src={slinkLogo}
                  alt="SLINK Mascot Creature"
                  referrerPolicy="no-referrer"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-2 border-white/40 shadow-[0_0_30px_rgba(0,245,212,0.5)] transform group-hover:scale-105 transition-transform"
                />
              </div>

              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none text-center sm:text-left">
                <span className="bg-gradient-to-r from-[#00f5d4] via-[#ff007f] to-[#ffaa00] bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(0,245,212,0.4)]">
                  SLINK
                </span>
              </h1>
            </div>

            <p className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wide text-transparent bg-gradient-to-r from-cyan-200 via-white to-pink-200 bg-clip-text">
              FEED ON LIGHT. CUT RIVAL TRAILS. DOMINATE THE ARENA.
            </p>
          </div>

          {/* Subtitle Description */}
          <p className="max-w-2xl font-mono text-sm sm:text-base leading-relaxed text-slate-300">
            Steer your neon worm across a relentless cyber grid. Gobble luminous energy orbs,
            trap opponents with your radiant light trail, and collect massive star bounties to crown the leaderboard.
          </p>

          {/* Interactive Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 w-full pt-2">
            {highlights.map(({ label, icon: Icon, color, bg }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 p-3 rounded-xl border backdrop-blur-md transition-all hover:scale-[1.02] ${bg}`}
              >
                <div className={`p-2 rounded-lg bg-black/40 ${color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-[11px] font-bold text-left text-slate-200 leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Status strip */}
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#00f5d4]" />
              Zero Lag Vector Physics
            </span>
            <span className="text-white/20">·</span>
            <span className="text-pink-300 font-semibold">High-Stakes Multipliers</span>
            <span className="text-white/20">·</span>
            <span className="text-amber-300 font-semibold">Free to Play</span>
          </div>
        </div>
      </div>
    </section>
  );
};
