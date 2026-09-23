import React, { useState } from 'react';
import { Coins, Copy, Check, ShieldCheck, Flame, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../audio';
import { WalletState } from '../types';

interface TokenRewardsProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
}

const CONTRACT_ADDRESS = 'SL1NKvP3rG9zReap4UjT7kZ9sY2cSol8vQmW3aXpump';

export const TokenRewardsView: React.FC<TokenRewardsProps> = ({ wallet, onOpenWalletModal }) => {
  const [copied, setCopied] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('500');
  const [stakeSuccessMessage, setStakeSuccessMessage] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard?.writeText(CONTRACT_ADDRESS);
    sounds.playBeep(880);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStake = () => {
    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }

    sounds.playBeep(880);
    setStakeSuccessMessage(`Successfully staked ${stakeAmount} $SLINK in the Slink Staking Vault!`);
    setTimeout(() => setStakeSuccessMessage(null), 4000);
  };

  const availableBalance = wallet.slinkBalance ?? wallet.narkyBalance ?? 3200;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 mx-auto shadow-[0_0_20px_rgba(0,245,212,0.15)]">
          <Coins className="w-3.5 h-3.5 text-[#00f5d4]" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            SLINK ECOSYSTEM &amp; REWARDS
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase font-black text-white tracking-tight">
          $SLINK TOKENOMICS &amp; VAULT
        </h1>
        <p className="font-mono text-sm text-slate-300 leading-relaxed">
          The native utility asset of the SLINK cyber arena. Earn $SLINK through arena takedowns,
          climbing the Apex leaderboard, and protocol yield staking.
        </p>
      </div>

      {/* Contract Verification Banner */}
      <div className="rounded-2xl p-5 sm:p-6 bg-[#0c1026]/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-[#00f5d4] shrink-0 shadow-[0_0_15px_rgba(0,245,212,0.3)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#00f5d4] font-bold uppercase tracking-wider">
                AUDITED SOLANA PROGRAM ID
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono font-bold">
                MAINNET-VERIFIED
              </span>
            </div>
            <span className="font-mono text-xs sm:text-sm text-white font-bold break-all mt-0.5 block">
              {CONTRACT_ADDRESS}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-[#00f5d4] font-mono text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer hover:scale-105"
        >
          {copied ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'COPIED!' : 'COPY ID'}</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0c1026]/90 border border-cyan-500/25 flex flex-col gap-2 shadow-xl hover:-translate-y-1 transition-transform">
          <span className="font-mono text-xs text-slate-400 uppercase font-bold">TOTAL ARENA VALUE (TVL)</span>
          <span className="font-display text-4xl font-black text-[#00f5d4]">$2,450,800</span>
          <span className="font-mono text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            +24.6% active volume past 24h
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1026]/90 border border-amber-500/25 flex flex-col gap-2 shadow-xl hover:-translate-y-1 transition-transform">
          <span className="font-mono text-xs text-slate-400 uppercase font-bold">STAKING VAULT APR</span>
          <span className="font-display text-4xl font-black text-amber-400">28.4% APY</span>
          <span className="font-mono text-xs text-amber-300 mt-1 flex items-center gap-1 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Fueled by arena combat fees
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1026]/90 border border-pink-500/25 flex flex-col gap-2 shadow-xl hover:-translate-y-1 transition-transform">
          <span className="font-mono text-xs text-slate-400 uppercase font-bold">TOTAL RIVALS SHATTERED</span>
          <span className="font-display text-4xl font-black text-pink-400">64,280,100</span>
          <span className="font-mono text-xs text-pink-300 mt-1 font-semibold">
            Star loot harvested by active worms
          </span>
        </div>
      </div>

      {/* Staking / Rewards Terminal */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0c1026]/95 border border-cyan-500/40 shadow-2xl flex flex-col lg:flex-row gap-8 justify-between items-center">
        <div className="flex flex-col gap-4 max-w-lg w-full">
          <div>
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
              SLINK YIELD VAULT
            </span>
            <h3 className="font-display text-3xl uppercase font-black text-white mt-1">
              STAKE $SLINK · REAP COMBAT YIELD
            </h3>
            <p className="font-mono text-xs text-slate-300 mt-1.5 leading-relaxed">
              Lock $SLINK to generate daily protocol distributions funded by match wager pools and loot bounties.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-bold">STAKE AMOUNT ($SLINK)</span>
              <span className="text-cyan-300 font-bold">
                AVAILABLE: {wallet.isConnected ? `${availableBalance} $SLINK` : '0 $SLINK'}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full px-4 py-3 bg-[#060814] text-white font-mono text-base font-bold rounded-xl border border-white/20 focus:border-[#00f5d4] outline-none shadow-inner"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-400 font-black">
                $SLINK
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-xs flex flex-col gap-3.5 font-mono text-xs bg-[#060814] p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">EST. DAILY REWARD:</span>
            <span className="text-amber-400 font-bold text-sm">
              +{((Number(stakeAmount) || 0) * 0.00078).toFixed(2)} SOL
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">LOCKUP PERIOD:</span>
            <span className="text-white font-bold">FLEXIBLE (0 DAYS)</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-slate-400">PROTOCOL REWARD:</span>
            <span className="text-[#00ff88] font-bold text-sm">+28.4% APY</span>
          </div>

          <button
            type="button"
            onClick={handleStake}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-display text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,170,0,0.4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            {wallet.isConnected ? 'CONFIRM VAULT STAKE' : 'CONNECT WALLET TO STAKE'}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {stakeSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl bg-[#0c1026] border border-emerald-400 text-white shadow-[0_0_30px_rgba(0,255,136,0.4)] animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-[#00ff88]" />
          <span className="font-mono text-xs font-bold text-emerald-200">{stakeSuccessMessage}</span>
        </div>
      )}
    </div>
  );
};
