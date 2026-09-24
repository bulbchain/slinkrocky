import React, { useState } from 'react';
import { Coins, Copy, Check, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { sounds } from '../audio';
import { WalletState } from '../types';
import { SlinkChampion, SlinkHungry, SoundBurst } from './RetroCartoonCharacters';

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
    setStakeSuccessMessage(`Hooray! Staked ${stakeAmount} $SLINK in the Meadow Vault!`);
    setTimeout(() => setStakeSuccessMessage(null), 4000);
  };

  const availableBalance = wallet.slinkBalance ?? 3200;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] mx-auto">
          <Coins className="w-4 h-4 text-[#1E1B18]" />
          <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
            THE OFFICIAL MEADOW CURRENCY
          </span>
        </div>
        <h1 className="font-comic text-4xl sm:text-6xl uppercase text-[#1E1B18] tracking-wide">
          $SLINK TOKENOMICS &amp; VAULT
        </h1>
        <p className="font-body text-base text-[#5C3D2E] font-medium leading-relaxed">
          The tastiest token on Solana! Stake tokens to earn daily apple bounties, unlock comic skins, and sponsor meadow tournaments.
        </p>
      </div>

      {/* Contract Verification Banner */}
      <div className="comic-card bg-[#FFD13B] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] shrink-0">
            <Coins className="w-6 h-6 text-[#FA824C]" />
          </div>
          <div>
            <span className="font-comic text-xs uppercase text-[#1E1B18]">
              OFFICIAL SOLANA MINT ADDRESS
            </span>
            <p className="font-mono text-xs sm:text-sm font-bold text-[#1E1B18] tracking-wider break-all">
              {CONTRACT_ADDRESS}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="comic-btn bg-white hover:bg-[#FFF8ED] text-[#1E1B18] text-sm uppercase py-2 px-4 shrink-0"
        >
          {copied ? (
            <span className="flex items-center gap-1.5 text-[#70A288] font-bold">
              <Check className="w-4 h-4" />
              COPIED!
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Copy className="w-4 h-4" />
              COPY ADDRESS
            </span>
          )}
        </button>
      </div>

      {/* 2 Main Cards: Staking Vault + Token Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VAULT STAKING */}
        <div className="comic-card bg-[#FFFDF8] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1B18]/15">
              <span className="font-comic text-xs uppercase px-2.5 py-1 rounded bg-[#70A288] text-white border border-[#1E1B18]">
                ANNUAL YIELD: 32% APY
              </span>
              <SoundBurst text="STAKE!" color="#FFD13B" className="text-xs" />
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFF8ED] rounded-2xl border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                <SlinkChampion size={56} />
              </div>
              <div>
                <h3 className="font-comic text-3xl uppercase text-[#1E1B18]">
                  MEADOW PIGGY BANK
                </h3>
                <p className="font-body text-xs font-semibold text-[#5C3D2E]">
                  Lock up $SLINK tokens to harvest passive apple yields
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] flex items-center justify-between">
              <span className="font-body text-xs font-bold text-[#5C3D2E]">YOUR WALLET BALANCE:</span>
              <span className="font-comic text-lg text-[#FA824C]">
                {availableBalance.toLocaleString()} $SLINK
              </span>
            </div>

            {/* Stake Input Form */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-comic text-xs uppercase text-[#1E1B18]">
                AMOUNT TO STAKE:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="comic-input w-full py-2.5 px-3.5 text-base font-comic text-[#1E1B18]"
                  placeholder="500"
                />
                <button
                  type="button"
                  onClick={() => setStakeAmount(availableBalance.toString())}
                  className="comic-btn bg-[#FFD13B] hover:bg-[#FFE066] text-xs py-2.5 px-3 uppercase text-[#1E1B18] shrink-0"
                >
                  MAX
                </button>
              </div>
            </div>

            {stakeSuccessMessage && (
              <div className="p-3 bg-[#70A288] text-white rounded border-2 border-[#1E1B18] font-comic text-sm">
                {stakeSuccessMessage}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#1E1B18]/15">
            <button
              type="button"
              onClick={handleStake}
              className="comic-btn w-full bg-[#FA824C] hover:bg-[#FF9666] text-white text-lg uppercase py-3"
            >
              {wallet.isConnected ? 'DEPOSIT IN THE VAULT' : 'CONNECT WALLET TO STAKE'}
            </button>
          </div>
        </div>

        {/* TOKENOMICS PIE BREAKDOWN */}
        <div className="comic-card bg-[#FFFDF8] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1B18]/15">
              <span className="font-comic text-xs uppercase px-2.5 py-1 rounded bg-[#78C0E0] text-[#1E1B18] border border-[#1E1B18]">
                SUPPLY: 1,000,000,000 $SLINK
              </span>
              <SoundBurst text="PIE!" color="#FA824C" className="text-xs" />
            </div>

            <h3 className="font-comic text-3xl uppercase text-[#1E1B18]">
              HOW THE PIE IS SLICED
            </h3>

            <div className="flex flex-col gap-3 mt-2">
              <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FA824C] border border-[#1E1B18]" />
                  <span className="font-comic text-sm text-[#1E1B18]">ARENA PRIZE POOLS &amp; APPLES</span>
                </div>
                <span className="font-comic text-base text-[#FA824C]">45%</span>
              </div>

              <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#78C0E0] border border-[#1E1B18]" />
                  <span className="font-comic text-sm text-[#1E1B18]">MEADOW LIQUIDITY POOL</span>
                </div>
                <span className="font-comic text-base text-[#78C0E0]">25%</span>
              </div>

              <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFD13B] border border-[#1E1B18]" />
                  <span className="font-comic text-sm text-[#1E1B18]">COMMUNITY REWARDS &amp; AIRDROPS</span>
                </div>
                <span className="font-comic text-base text-[#1E1B18]">20%</span>
              </div>

              <div className="p-3 bg-[#FFF8ED] rounded-lg border-2 border-[#1E1B18] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#70A288] border border-[#1E1B18]" />
                  <span className="font-comic text-sm text-[#1E1B18]">SUNDAY COMIC CREATORS TREASURY</span>
                </div>
                <span className="font-comic text-base text-[#70A288]">10%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#1E1B18]/15 flex items-center justify-between text-xs font-body font-semibold text-[#5C3D2E]">
            <span>100% FAIR LAUNCH ON PUMP.FUN</span>
            <span>LP BURNT &amp; MINT REVOKED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
