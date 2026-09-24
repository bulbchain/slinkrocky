import React from 'react';
import { NavTab, WalletState } from '../types';
import { sounds } from '../audio';
import { Wallet, User, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onOpenProfileModal: () => void;
  callsign: string;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onOpenWalletModal,
  onOpenProfileModal,
  callsign,
  soundMuted,
  onToggleSound,
}) => {
  const navItems: { id: NavTab; label: string; tag?: string }[] = [
    { id: 'play-now', label: 'PLAY GAME' },
    { id: 'arenas', label: 'ARENAS' },
    { id: 'how-it-works', label: 'HOW TO PLAY' },
    { id: 'leaderboard', label: 'LEADERBOARD' },
    { id: 'token-rewards', label: '$SLINK TOKEN', tag: 'NEW!' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FFF8ED] border-b-3 border-[#1E1B18] shadow-[0_4px_0px_#1E1B18]">
      <div className="w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <button
            onClick={() => {
              sounds.playBeep(600);
              setActiveTab('play-now');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            {/* Hand-drawn mini Slink face SVG */}
            <div className="w-10 h-10 rounded-lg bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] flex items-center justify-center group-hover:-rotate-6 transition-transform">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" fill="#FA824C" stroke="#1E1B18" strokeWidth="2.5" />
                <circle cx="15" cy="16" r="4.5" fill="#FFFFFF" stroke="#1E1B18" strokeWidth="2" />
                <circle cx="16" cy="16" r="2" fill="#1E1B18" />
                <circle cx="25" cy="16" r="4.5" fill="#FFFFFF" stroke="#1E1B18" strokeWidth="2" />
                <circle cx="24" cy="16" r="2" fill="#1E1B18" />
                <path d="M14 24C16 28 24 28 26 24" stroke="#1E1B18" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="12" cy="21" rx="2" ry="1" fill="#FF5964" />
                <ellipse cx="28" cy="21" rx="2" ry="1" fill="#FF5964" />
              </svg>
            </div>

            <div className="flex flex-col -space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-comic text-2xl sm:text-3xl tracking-wide text-[#FA824C] drop-shadow-[2px_2px_0px_#1E1B18]">
                  SLINK!
                </span>
                <span className="px-1.5 py-0.5 font-comic text-xs uppercase bg-[#78C0E0] text-[#1E1B18] border border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18] rotate-3">
                  WORM
                </span>
              </div>
              <span className="font-hand text-[11px] font-bold text-[#5C3D2E] tracking-tight hidden sm:block">
                The Retro Cartoon Arena
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playBeep(720);
                    setActiveTab(item.id);
                  }}
                  className={`font-comic text-base tracking-wider px-3 py-1.5 rounded-lg transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-[#FFD13B] text-[#1E1B18] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] -rotate-1'
                      : 'text-[#1E1B18] hover:bg-[#FFE066]/50 border-2 border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.tag && (
                      <span className="bg-[#FA824C] text-white text-[10px] px-1 py-0.2 rounded border border-[#1E1B18] font-bold">
                        {item.tag}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Sound, Pilot, Wallet */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sounds.playBeep(520);
            }}
            title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-lg bg-white border-2 border-[#1E1B18] text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#FFD13B] transition-all cursor-pointer"
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-[#FA824C]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#1E1B18]" />
            )}
          </button>

          {/* Pilot Badge */}
          <button
            onClick={() => {
              sounds.playBeep(640);
              onOpenProfileModal();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#78C0E0]/30 transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#78C0E0] border border-[#1E1B18] flex items-center justify-center text-[#1E1B18]">
              <User className="w-3 h-3" />
            </div>
            <span className="font-comic text-sm text-[#1E1B18] uppercase">
              {callsign || 'SLINKY'}
            </span>
          </button>

          {/* Connect / Wallet Button */}
          <button
            onClick={() => {
              sounds.playBeep(780);
              onOpenWalletModal();
            }}
            className={`comic-btn px-4 py-1.5 text-base tracking-wider transition-all cursor-pointer ${
              wallet.isConnected
                ? 'bg-[#70A288] text-white hover:bg-[#588157]'
                : 'bg-[#FA824C] text-[#FFF8ED] hover:bg-[#FF7A30]'
            }`}
          >
            <Wallet className="w-4 h-4 mr-1.5" />
            <span>
              {wallet.isConnected
                ? `${wallet.solBalance} SOL`
                : 'CONNECT'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0D6] border-t-2 border-[#1E1B18] overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playBeep(720);
                setActiveTab(item.id);
              }}
              className={`font-comic text-xs px-2.5 py-1 whitespace-nowrap rounded border-2 cursor-pointer ${
                isActive
                  ? 'bg-[#FFD13B] text-[#1E1B18] border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]'
                  : 'bg-white text-[#1E1B18] border-[#1E1B18]/40'
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
