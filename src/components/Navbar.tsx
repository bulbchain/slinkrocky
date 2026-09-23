import React, { useEffect, useState } from 'react';
import { NavTab, WalletState } from '../types';
import { sounds } from '../audio';
import { Zap, Wallet, User, Volume2, VolumeX, Sparkles } from 'lucide-react';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onOpenProfileModal: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  callsign?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onOpenWalletModal,
  onOpenProfileModal,
  soundMuted,
  onToggleSound,
  callsign = 'SLINK_VIPER',
}) => {
  const [pilotsCount, setPilotsCount] = useState(1482);
  const [ping, setPing] = useState(24);

  // Realistic telemetry fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setPilotsCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(1400, Math.min(1600, prev + delta));
      });
      setPing((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(16, Math.min(28, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: NavTab; label: string; highlight?: boolean }[] = [
    { id: 'play-now', label: 'ARENA' },
    { id: 'how-it-works', label: 'HOW TO PLAY' },
    { id: 'leaderboard', label: 'LEADERBOARD' },
    { id: 'token-and-rewards', label: '$SLINK TOKEN', highlight: true },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060814]/90 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      <div className="w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3.5">
        {/* Brand & Navigation */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0 flex-1">
          {/* Slink Logo & Name */}
          <button
            onClick={() => {
              sounds.playBeep(600);
              setActiveTab('play-now');
            }}
            className="flex items-center gap-3 text-left group focus:outline-none min-w-0"
          >
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#00f5d4] via-[#ff007f] to-[#8b5cf6] opacity-75 blur-sm group-hover:opacity-100 transition-opacity" />
              <img
                alt="SLINK Logo"
                className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-lg object-cover border border-white/20 shadow-md group-hover:scale-105 transition-transform"
                src={slinkLogo}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tighter bg-gradient-to-r from-[#00f5d4] via-[#ff007f] to-[#ffaa00] bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                  SLINK
                </span>
                <span className="px-1.5 py-0.2 font-mono text-[9px] font-extrabold uppercase rounded bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] text-white shadow-[0_0_10px_rgba(255,0,127,0.5)]">
                  IO
                </span>
              </div>
              <span className="hidden sm:block font-mono text-[9px] tracking-widest uppercase text-cyan-300/70 -mt-1 font-semibold">
                CYBER-WORM ARENA
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playBeep(720);
                    setActiveTab(item.id);
                  }}
                  className={`font-mono text-[11px] font-bold tracking-wider px-3.5 py-2 rounded-lg transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-pink-500/15 text-[#00f5d4] border border-cyan-400/40 shadow-[0_0_15px_rgba(0,245,212,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.highlight && (
                      <Sparkles className="w-3 h-3 text-[#ff007f] animate-pulse" />
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Live Telemetry & Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sounds.playBeep(520);
            }}
            title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-lg bg-[#0e1226] text-slate-300 hover:text-[#00f5d4] hover:bg-[#151c38] border border-white/10 transition-colors shadow-inner"
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-pink-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#00f5d4]" />
            )}
          </button>

          {/* Live Online Ticker */}
          <div className="hidden md:flex items-center gap-3 bg-[#0e1226]/90 border border-cyan-500/20 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
              </span>
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#d7fff3]">
                {pilotsCount.toLocaleString()} WORMS
              </span>
            </div>
            <span className="text-white/20 font-mono text-[10px]">·</span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{ping}ms</span>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <button
            onClick={() => {
              sounds.playBeep(840);
              onOpenWalletModal();
            }}
            className="font-display text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-[#00f5d4] via-[#00ff88] to-[#00f5d4] bg-[length:200%_auto] hover:bg-right text-[#002b22] rounded-lg shadow-[0_0_20px_rgba(0,245,212,0.45)] hover:shadow-[0_0_30px_rgba(0,245,212,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer font-extrabold"
          >
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">
              {wallet.isConnected && wallet.address
                ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)} (${wallet.solBalance} SOL)`
                : 'CONNECT'}
            </span>
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => {
              sounds.playBeep(640);
              onOpenProfileModal();
            }}
            title="Worm Profile & Loadout"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center hover:border-[#ff007f] hover:scale-105 text-pink-300 hover:text-white transition-all shadow-[0_0_12px_rgba(255,0,127,0.25)] shrink-0 cursor-pointer"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-start overflow-x-auto gap-2 px-3 py-2 bg-[#060814]/95 border-t border-white/5 text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playBeep(720);
                setActiveTab(item.id);
              }}
              className={`font-mono text-[10px] font-bold whitespace-nowrap px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-[#00f5d4] border border-cyan-400/40 shadow-[0_0_10px_rgba(0,245,212,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
