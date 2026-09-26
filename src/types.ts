declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      publicKey?: {
        toString: () => string;
      } | null;
      isConnected?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey?: { toString: () => string } } | void>;
      disconnect?: () => Promise<void>;
    };
  }
}

export type NavTab =
  | 'play-now'
  | 'arenas'
  | 'arenas-and-modes'
  | 'how-it-works'
  | 'leaderboard'
  | 'token-rewards'
  | 'token-and-rewards';

export type ArenaMode = 'free' | 'staked';

export interface WormSkin {
  id: string;
  name: string;
  color: string;
  coreColor: string;
  accentColor: string;
  pattern: 'neon' | 'cyber' | 'plasma' | 'solar' | 'radioactive' | 'void';
  description: string;
}

export interface LeaderboardPilot {
  rank: string;
  rankNum: number;
  callsign: string;
  tag?: string;
  isPlayer?: boolean;
  mass: number;
  kills: number;
  bountySol: number;
  status: 'DOMINATING' | 'HUNTING' | 'EXTRACTING' | 'ACTIVE' | 'IN COMBAT';
  color: string;
}

export interface TelemetryLogItem {
  id: string;
  killer: string;
  victim: string;
  method: string;
  lumensReaped: number;
  timeAgo: string;
  isKillerPlayer?: boolean;
}

export interface WalletState {
  isConnected: boolean;
  walletName: string | null;
  address: string | null;
  solBalance: number;
  slinkBalance: number;
  narkyBalance?: number;
  userEmail?: string | null;
  userId?: string | null;
}

export interface GameStats {
  score: number;
  kills: number;
  bestScore: number;
  mass: number;
  boostLevel: number;
}
