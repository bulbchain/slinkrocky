import React from 'react';
import { NavTab, WalletState } from '../types';
import { sounds } from '../audio';
import { Wallet, User, Volume2, VolumeX, LogOut, ShieldCheck } from 'lucide-react';
import logo from '../asset/logo.png';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onOpenProfileModal: () => void;
  callsign: string;
  soundMuted: boolean;
  onToggleSound: () => void;
  onSignOut?: () => void;
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
  onSignOut,
}) => {
  const navItems: { id: NavTab; label: string; tag?: string }[] = [
    { id: 'play-now', label: 'PLAY GAME' },
    { id: 'arenas', label: 'ARENAS' },
    { id: 'how-it-works', label: 'HOW TO PLAY' },
    { id: 'leaderboard', label: 'LEADERBOARD' },
    { id: 'token-rewards', label: '$SLINK TOKEN', tag: 'NEW!' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F4EEDF] border-b-3 border-[#111111] shadow-[0_4px_0px_#111111]">
      <div className="w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <button
            onClick={() => {
              sounds.playBeep(600);
              setActiveTab('play-now');
            }}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            {/* Dramatically increased logo size container for both mobile & desktop */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center group-hover:-rotate-6 transition-transform shrink-0">
              <img
                src={logo}
                alt="Slink logo"
                className="w-full h-full object-contain scale-125 drop-shadow-[2px_2px_0px_#111111]"
              />
            </div>

            <div className="flex flex-col -space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-comic text-2xl sm:text-3xl tracking-wide text-[#111111] drop-shadow-[2px_2px_0px_#B4F000]">
                  SLINK!
                </span>
                <span className="px-1.5 py-0.5 font-comic text-xs uppercase bg-[#55B3F3] text-[#111111] border border-[#111111] shadow-[1px_1px_0px_#111111] rotate-3 font-bold">
                  WORM
                </span>
              </div>
              <span className="font-hand text-[11px] font-bold text-[#111111]/70 tracking-tight hidden sm:block">
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
                  className={`font-comic text-base tracking-wider px-3.5 py-1.5 rounded-lg transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-[#B4F000] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] -rotate-1 font-bold'
                      : 'text-[#111111] hover:bg-[#FFFFFF] border-2 border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-1.5 relative">
                    {item.label}
                    {item.tag && (
                      <span className="absolute -top-3.5 -right-3 bg-[#FF5D8F] text-white text-[9px] px-1.5 py-0.5 rounded border border-[#111111] font-bold shadow-[1px_1px_0px_#111111] rotate-6 animate-pulse">
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
            className="p-2 rounded-lg bg-white border-2 border-[#111111] text-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#B4F000] transition-all cursor-pointer"
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-[#FF5D8F]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#111111]" />
            )}
          </button>

          {/* Pilot Badge */}
          <button
            onClick={() => {
              sounds.playBeep(640);
              onOpenProfileModal();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#55B3F3]/20 transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#55B3F3] border border-[#111111] flex items-center justify-center text-[#111111]">
              <User className="w-3 h-3" />
            </div>
            <span className="font-comic text-sm text-[#111111] uppercase font-bold">
              {callsign || 'SLINKY'}
            </span>
          </button>

          {/* Connect / Wallet / Account Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                sounds.playBeep(780);
                onOpenWalletModal();
              }}
              title={
                wallet.isConnected
                  ? `Phantom Wallet: ${wallet.solBalance} SOL`
                  : wallet.userEmail
                  ? `Logged in as ${wallet.userEmail} · Click to manage account`
                  : 'Connect Account or Wallet'
              }
              className={`comic-btn px-3 sm:px-4 py-1.5 text-xs sm:text-sm tracking-wider transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                wallet.isConnected || wallet.userEmail
                  ? 'bg-[#B4F000] text-[#111111] hover:bg-[#cbf738]'
                  : 'bg-[#FFD13B] text-[#111111] hover:bg-[#FFE066]'
              }`}
            >
              {wallet.userEmail ? (
                <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
              ) : (
                <Wallet className="w-4 h-4 text-[#111111] shrink-0" />
              )}
              <span className="font-comic font-black">
                {wallet.isConnected
                  ? `${wallet.solBalance} SOL`
                  : wallet.userEmail
                  ? wallet.userEmail.split('@')[0]
                  : 'CONNECT WALLET'}
              </span>
            </button>

            {/* Direct Quick Sign Out button if user is authenticated with email or wallet */}
            {(wallet.userEmail || wallet.isConnected) && onSignOut && (
              <button
                type="type"
                onClick={(e) => {
                  e.stopPropagation();
                  onSignOut();
                }}
                title="Sign out of account"
                className="comic-btn px-2 sm:px-3 py-1.5 bg-[#FF5D8F] hover:bg-[#ff75a0] text-white rounded-lg border-2 border-[#111111] flex items-center gap-1 font-comic text-xs font-black shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">SIGN OUT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#E8E2D2] border-t-2 border-[#111111] overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playBeep(720);
                setActiveTab(item.id);
              }}
              className={`font-comic text-xs px-2.5 py-1 whitespace-nowrap rounded border-2 cursor-pointer font-bold relative ${
                isActive
                  ? 'bg-[#B4F000] text-[#111111] border-[#111111] shadow-[2px_2px_0px_#111111]'
                  : 'bg-white text-[#111111] border-[#111111]/40'
              }`}
            >
              <span className="flex items-center gap-1">
                {item.label}
                {item.tag && (
                  <span className="bg-[#FF5D8F] text-white text-[8px] px-1 py-0 rounded border border-[#111111] font-bold">
                    {item.tag}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};