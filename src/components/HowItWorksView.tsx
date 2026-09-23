import React, { useState } from 'react';
import {
  Zap,
  Flame,
  ShieldAlert,
  Cpu,
  Sparkles,
  Skull,
  CircleDot,
  Crosshair,
  Shield,
  Magnet,
} from 'lucide-react';
import { sounds } from '../audio';

export const HowItWorksView: React.FC = () => {
  const [testMass, setTestMass] = useState(6500);
  const [boostEngaged, setBoostEngaged] = useState(false);

  // SLINK dynamic physics simulation values
  const speed = boostEngaged ? 5.2 : 2.8;
  const trailSegments = Math.floor(24 + testMass / 120);
  const turnRate = Math.max(0.04, 0.12 - (testMass / 22000) * 0.05).toFixed(3);
  const massBleed = Math.floor(testMass * 0.025);
  const powerLevel = Math.min(99, Math.floor(40 + testMass / 400));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#0c1026] border border-cyan-400/30 text-cyan-300 mx-auto shadow-[0_0_20px_rgba(0,245,212,0.15)]">
          <Cpu className="w-3.5 h-3.5 text-[#00f5d4]" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            SLINK SURVIVAL &amp; COMBAT PROTOCOL
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl uppercase font-black text-white tracking-tight">
          HOW TO PLAY &amp; WIN
        </h1>

        <p className="font-mono text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Scale your cyber worm. Master kinetic vector physics. Intercept rivals and convert
          their star loot into unstoppable mass.
        </p>
      </div>

      {/* GAMEPLAY FLOW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group p-6 rounded-2xl bg-[#0c1026]/90 border border-cyan-500/30 hover:border-cyan-400 transition-all hover:-translate-y-1 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-[#00f5d4]">
              <CircleDot className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest text-[#00f5d4]">
              01 · HARVEST
            </span>
          </div>

          <h3 className="font-display text-xl uppercase font-bold text-white">
            Collect Neon Biomass
          </h3>

          <p className="font-mono text-xs text-slate-300 mt-2 leading-relaxed">
            Vacuum luminous energy orbs strewn across the cyber grid to extend your segmented body,
            increasing your turning leverage and lethal footprint.
          </p>
        </div>

        <div className="group p-6 rounded-2xl bg-[#0c1026]/90 border border-pink-500/30 hover:border-pink-400 transition-all hover:-translate-y-1 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-400/40 flex items-center justify-center text-[#ff007f]">
              <Crosshair className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest text-[#ff007f]">
              02 · CUT &amp; TRAP
            </span>
          </div>

          <h3 className="font-display text-xl uppercase font-bold text-white">
            Intercept Rival Lines
          </h3>

          <p className="font-mono text-xs text-slate-300 mt-2 leading-relaxed">
            Dash in front of rival worms so their head collides with your trailing body.
            A successful cut shatters them instantly into massive star loot piles!
          </p>
        </div>

        <div className="group p-6 rounded-2xl bg-[#0c1026]/90 border border-amber-500/30 hover:border-amber-400 transition-all hover:-translate-y-1 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Skull className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest text-amber-400">
              03 · APEX CROWN
            </span>
          </div>

          <h3 className="font-display text-xl uppercase font-bold text-white">
            Dominate The Leaderboard
          </h3>

          <p className="font-mono text-xs text-slate-300 mt-2 leading-relaxed">
            Coil around trapped worms to eliminate them one by one. Maintain your mass and claim
            the #1 Apex position on the real-time global podium.
          </p>
        </div>
      </div>

      {/* INTERACTIVE TELEMETRY SIMULATOR */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0c1026]/95 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,245,212,0.12)]">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT: CONTROLS */}
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-pulse" />
                  <span className="font-mono text-xs text-cyan-300 uppercase tracking-widest font-bold">
                    INTERACTIVE SLINK LAB
                  </span>
                </div>

                <h2 className="font-display text-3xl uppercase font-black text-white">
                  WORM PHYSICS SIMULATOR
                </h2>

                <p className="font-mono text-xs text-slate-300 mt-2 leading-relaxed">
                  Adjust the mass slider below to observe how size dynamically affects speed,
                  segment count, turning radius, and kinetic drag in the SLINK vector engine.
                </p>
              </div>

              {/* MASS SLIDER */}
              <div className="p-5 rounded-2xl bg-[#060814] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider font-bold">
                    WORM MASS:
                  </span>
                  <span className="font-mono text-base font-black text-[#00f5d4]">
                    {testMass.toLocaleString()} MASS
                  </span>
                </div>

                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="250"
                  value={testMass}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    sounds.playBeep(450 + value / 50, 0.03);
                    setTestMass(value);
                  }}
                  className="w-full accent-[#00f5d4] cursor-pointer"
                />

                <div className="flex justify-between mt-2 font-mono text-[10px] text-slate-500 font-bold">
                  <span>AGILE SEEDLING (500)</span>
                  <span>COLOSSAL APEX (25,000)</span>
                </div>
              </div>

              {/* BOOST TOGGLE */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#060814] border border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      boostEngaged
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,170,0,0.5)]'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white uppercase">
                      NITRO BOOST DRIVE
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      Speed: {speed.toFixed(1)}x · Bleed: ~{massBleed}/s
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playBoostSound();
                    setBoostEngaged(!boostEngaged);
                  }}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    boostEngaged
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-[#1a0f00] shadow-[0_0_15px_rgba(255,170,0,0.5)]'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {boostEngaged ? 'ENGAGED' : 'DISENGAGED'}
                </button>
              </div>
            </div>

            {/* RIGHT: LIVE TELEMETRY DISPLAY */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#060814] border border-cyan-500/30 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                  SPEED VELOCITY
                </span>
                <span className="font-display text-3xl font-black text-[#00f5d4] my-2">
                  {speed.toFixed(1)} <span className="text-sm font-mono text-slate-400">PTS/F</span>
                </span>
                <span className="font-mono text-[10px] text-cyan-300">
                  {boostEngaged ? 'SUPERCHARGED DASH' : 'CRUISE VELOCITY'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#060814] border border-pink-500/30 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                  TRAIL SEGMENTS
                </span>
                <span className="font-display text-3xl font-black text-[#ff007f] my-2">
                  {trailSegments} <span className="text-sm font-mono text-slate-400">SEGS</span>
                </span>
                <span className="font-mono text-[10px] text-pink-300">
                  LETHAL BODY SPAN
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#060814] border border-amber-500/30 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                  TURN RATE
                </span>
                <span className="font-display text-3xl font-black text-amber-400 my-2">
                  {turnRate} <span className="text-sm font-mono text-slate-400">RAD/F</span>
                </span>
                <span className="font-mono text-[10px] text-amber-300">
                  {testMass > 15000 ? 'HEAVY ROTATION' : 'AGILE VECTORING'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#060814] border border-purple-500/30 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                  ARENA THREAT LEVEL
                </span>
                <span className="font-display text-3xl font-black text-purple-400 my-2">
                  {powerLevel}%
                </span>
                <span className="font-mono text-[10px] text-purple-300">
                  DOMINANCE INDEX
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POWER-UP GUIDE */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl uppercase font-black text-white mb-6">
          TACTICAL POWER-UPS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c1026]/90 border border-purple-500/30 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Magnet className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg uppercase font-bold text-white">MAGNET</h3>
            <p className="font-mono text-xs text-slate-300 leading-relaxed">
              Pulls all nearby food and Star Loot within 260px toward your head via luminous tractor beams.
              Lasts for 7 seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1026]/90 border border-cyan-500/30 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg uppercase font-bold text-white">PHASE SHIELD</h3>
            <p className="font-mono text-xs text-slate-300 leading-relaxed">
              Grants an impervious kinetic energy barrier that prevents death when touching rival bodies.
              Lasts for 7 seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1026]/90 border border-amber-500/30 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,170,0,0.3)]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg uppercase font-bold text-white">OVERCLOCK</h3>
            <p className="font-mono text-xs text-slate-300 leading-relaxed">
              Supercharges your speed by 130% without burning any mass score! Perfect for hunting down agile worms.
              Lasts for 7 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* THE GOLDEN RULE */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0c1026] border border-pink-500/40 p-8 text-center shadow-xl">
        <ShieldAlert className="w-10 h-10 text-pink-400 mx-auto mb-3 animate-pulse" />
        <span className="font-mono text-xs text-pink-400 uppercase tracking-widest font-bold">
          THE GOLDEN LAW OF THE ARENA
        </span>
        <h2 className="font-display text-3xl sm:text-5xl uppercase font-black text-white mt-2">
          PROTECT YOUR HEAD AT ALL COSTS.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
          Your body and trail are indestructible weapons — but your head is fragile.
          Trap rivals into colliding with your flanks and feast upon their starlit remains.
        </p>
      </div>
    </div>
  );
};
