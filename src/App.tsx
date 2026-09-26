/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useCallback, useState, useEffect } from 'react';
import { NavTab, ArenaMode, WalletState } from './types';
import { Navbar } from './components/Navbar';
import { FlightTerminal } from './components/FlightTerminal';
import { ArenaCanvas } from './components/ArenaCanvas';
import { BentoMechanics } from './components/BentoMechanics';
import { DualEngagementZones } from './components/DualEngagementZones';
import { LiveTelemetry } from './components/LiveTelemetry';
import { EngagementLoop } from './components/EngagementLoop';
import { ReadyToDriftCTA } from './components/ReadyToDriftCTA';
import { Footer } from './components/Footer';
import { ArenasView } from './components/ArenasView';
import { HowItWorksView } from './components/HowItWorksView';
import { LeaderboardView } from './components/LeaderboardView';
import { TokenRewardsView } from './components/TokenRewardsView';
import { WalletModal } from './components/WalletModal';
import { ProfileModal } from './components/ProfileModal';
import { FullscreenArenaModal } from './components/FullscreenArenaModal';
import { NarkyIntroBanner } from './components/NarkyIntroBanner';
import { sounds } from './audio';
import { supabaseAuth, AppUser } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('play-now');
  const [callsign, setCallsign] = useState<string>('WOBBLY_JOE');
  const [wormColor, setWormColor] = useState<string>('#B4F000');
  const [arenaMode, setArenaMode] = useState<ArenaMode>('free');

  // Real-time telemetry tracking from game canvas
  const [playerScore, setPlayerScore] = useState<number>(3420);
  const [playerKills, setPlayerKills] = useState<number>(3);

  // Sound state
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Modals state
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isFullscreenArenaOpen, setIsFullscreenArenaOpen] = useState<boolean>(false);

  // Web3 Wallet & Auth state
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    solBalance: 0,
    slinkBalance: 0,
    narkyBalance: 0,
    walletName: null,
    userEmail: null,
    userId: null,
  });

  // Sync Supabase Auth state on mount & state change
  useEffect(() => {
    supabaseAuth.getCurrentUser().then((user) => {
      if (user) {
        setWallet((prev) => ({
          ...prev,
          userEmail: user.email,
          userId: user.id,
        }));
      }
    });

    const unsubscribe = supabaseAuth.onAuthStateChange((user: AppUser | null) => {
      setWallet((prev) => ({
        ...prev,
        userEmail: user?.email ?? null,
        userId: user?.id ?? null,
      }));
    });

    return () => unsubscribe();
  }, []);

  const handleToggleSound = () => {
    const nextMuted = sounds.toggleMute();
    setSoundMuted(nextMuted);
  };

  const connectPhantomWallet = useCallback(async (): Promise<boolean> => {
    const provider = window.solana;

    if (!provider || !provider.isPhantom) {
      setIsWalletModalOpen(true);
      return false;
    }

    try {
      await provider.connect({ onlyIfTrusted: false });

      const address = provider.publicKey?.toString() ?? null;

      setWallet((prev) => ({
        ...prev,
        address,
        isConnected: true,
        solBalance: 0,
        slinkBalance: 0,
        narkyBalance: 0,
        walletName: 'Phantom',
      }));

      setIsWalletModalOpen(false);
      return true;
    } catch (error: any) {
      // User rejecting or closing the popup is expected user choice, not an unhandled runtime exception
      const isUserRejected =
        error?.code === 4001 ||
        error?.message?.includes('User rejected') ||
        error?.name === 'WalletSignTransactionError';

      if (!isUserRejected) {
        console.warn('Phantom connection not completed:', error?.message || error);
      }
      return false;
    }
  }, []);

  const handleConnectWallet = async (walletName: string): Promise<boolean> => {
    if (walletName === 'Phantom') {
      const provider = window.solana;
      if (provider && provider.isPhantom) {
        return await connectPhantomWallet();
      }
      // Demo Phantom fallback if extension not installed in browser session
      setWallet((prev) => ({
        ...prev,
        address: '7xKpSL1nKvP3rG9zReap4UjT7kZ9sY2cSol8vQmW3aX',
        isConnected: true,
        solBalance: 2.45,
        slinkBalance: 3200,
        narkyBalance: 3200,
        walletName: 'Phantom',
      }));
      setIsWalletModalOpen(false);
      return true;
    }

    setWallet((prev) => ({
      ...prev,
      address: '7xKpSL1nKvP3rG9zReap4UjT7kZ9sY2cSol8vQmW3aX',
      isConnected: true,
      solBalance: 2.45,
      slinkBalance: 3200,
      narkyBalance: 3200,
      walletName: 'Phantom',
    }));
    setIsWalletModalOpen(false);
    return true;
  };

  const handleDisconnectWallet = async () => {
    const provider = window.solana;

    try {
      if (provider?.disconnect) {
        await provider.disconnect();
      }
    } catch (error) {
      console.warn('Phantom wallet disconnect:', error);
    }

    setWallet({
      address: null,
      isConnected: false,
      solBalance: 0,
      slinkBalance: 0,
      narkyBalance: 0,
      walletName: null,
    });
    setIsWalletModalOpen(false);
  };

  const handleAddTestSol = () => {
    setWallet((prev) => ({
      ...prev,
      solBalance: Number((prev.solBalance + 0.5).toFixed(2)),
      slinkBalance: (prev.slinkBalance ?? 0) + 500,
      narkyBalance: (prev.narkyBalance ?? 0) + 500,
    }));
  };

  const handleKillsUpdate = useCallback((nextKills: number) => {
    setPlayerKills(nextKills);
  }, []);

  const handleScoreUpdate = useCallback((nextScore: number) => {
    setPlayerScore(nextScore);
  }, []);

  const handleLaunchArena = () => {
    setIsFullscreenArenaOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E8E2D2] text-[#111111] flex flex-col selection:bg-[#B4F000] selection:text-[#111111] overflow-x-hidden">
      {/* Top Tactical Navigation & Telemetry Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        onOpenWalletModal={() => {
          if (!wallet.isConnected) {
            void connectPhantomWallet();
            return;
          }
          setIsWalletModalOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        callsign={callsign}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col pt-32 md:pt-32 xl:pt-24">
        {activeTab === 'play-now' && (
          <div className="flex flex-col">
            <NarkyIntroBanner />

            {/* HERO SECTION: Flight Terminal (Left) + Interactive Vector Arena (Right) */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left: Flight Terminal Controls Card (5 cols) */}
                <div className="lg:col-span-5 flex h-full flex-col">
                  <FlightTerminal
                    callsign={callsign}
                    setCallsign={setCallsign}
                    wormColor={wormColor}
                    setWormColor={setWormColor}
                    arenaMode={arenaMode}
                    setArenaMode={setArenaMode}
                    onEnterArena={handleLaunchArena}
                  />
                </div>

                {/* Right: Interactive 60FPS Live Vector Arena Canvas (7 cols) */}
                <div className="lg:col-span-7 flex h-full flex-col min-h-[460px] lg:min-h-[540px]">
                  <ArenaCanvas
                    callsign={callsign}
                    wormColor={wormColor}
                    onKillsUpdate={handleKillsUpdate}
                    onScoreUpdate={handleScoreUpdate}
                    onToggleFullscreen={handleLaunchArena}
                  />
                </div>
              </div>
            </section>

            {/* Bento Grid: 3 Core Tactical Dynamics */}
            <BentoMechanics />

            {/* Dual Engagement Zones: Free Arena vs Staked Run */}
            <DualEngagementZones
              onSelectFree={() => {
                setArenaMode('free');
                handleLaunchArena();
              }}
              onSelectStaked={() => {
                setArenaMode('staked');
                if (!wallet.isConnected) {
                  setIsWalletModalOpen(true);
                } else {
                  handleLaunchArena();
                }
              }}
            />

            {/* Live Arena Telemetry: Pilot Hierarchy & Combat Kill Feed */}
            <LiveTelemetry
              playerCallsign={callsign}
              playerScore={playerScore}
              playerKills={playerKills}
            />

            {/* 3-Step Engagement Directive Loop */}
            <EngagementLoop />

            {/* High Converting Conversion Call To Action */}
            <ReadyToDriftCTA onLaunchNow={handleLaunchArena} />
          </div>
        )}

        {activeTab === 'arenas' && (
          <ArenasView
            onSelectArena={(mode) => {
              setArenaMode(mode);
              setActiveTab('play-now');
              handleLaunchArena();
            }}
          />
        )}

        {activeTab === 'how-it-works' && <HowItWorksView />}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            playerCallsign={callsign}
            playerScore={playerScore}
            playerKills={playerKills}
          />
        )}

        {activeTab === 'token-rewards' && (
          <TokenRewardsView
            wallet={wallet}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
          />
        )}
      </main>

      {/* Tactical Cyber Footer */}
      <Footer />

      {/* Web3 Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        onAddTestSol={handleAddTestSol}
        onUserAuthChange={(user) => {
          setWallet((prev) => ({
            ...prev,
            userEmail: user?.email ?? null,
            userId: user?.id ?? null,
          }));
        }}
      />

      {/* Pilot Profile & Badges Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        callsign={callsign}
        setCallsign={setCallsign}
        score={playerScore}
        kills={playerKills}
      />

      {/* Fullscreen Immersive Vector Arena Modal */}
      <FullscreenArenaModal
        isOpen={isFullscreenArenaOpen}
        onClose={() => setIsFullscreenArenaOpen(false)}
        callsign={callsign}
        wormColor={wormColor}
        onKillsUpdate={handleKillsUpdate}
        onScoreUpdate={handleScoreUpdate}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />
    </div>
  );
}
