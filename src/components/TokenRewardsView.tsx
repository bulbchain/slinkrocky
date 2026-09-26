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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mx-auto">
          <Coins className="w-4 h-4 text-[#111111]" />
          <span className="font-comic text-xs uppercase tracking-wider text-[#111111] font-black">
            THE OFFICIAL MEADOW CURRENCY
          </span>
        </div>
        <h1 className="font-comic text-4xl sm:text-6xl uppercase text-[#111111] tracking-wide font-black">
          $SLINK TOKENOMICS &amp; VAULT
        </h1>
        <p className="font-body text-base text-[#555555] font-semibold leading-relaxed">
          The tastiest token on Solana! Stake tokens to earn daily bounties, unlock skins, and sponsor meadow tournaments.
        </p>
      </div>

      {/* Contract Verification Banner */}
      <div className="comic-card bg-[#FF5D8F] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0">
            <Coins className="w-6 h-6 text-[#111111]" />
          </div>
          <div>
            <span className="font-comic text-xs uppercase text-white font-black tracking-wider">
              OFFICIAL SOLANA MINT ADDRESS
            </span>
            <p className="font-mono text-xs sm:text-sm font-black text-white tracking-wider break-all">
              {CONTRACT_ADDRESS}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="comic-btn bg-[#B4F000] hover:bg-[#cbf738] text-[#111111] text-sm uppercase py-2.5 px-5 rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] font-black shrink-0"
        >
          {copied ? (
            <span className="flex items-center gap-1.5 text-[#111111] font-black">
              <Check className="w-4 h-4" />
              COPIED!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-black">
              <Copy className="w-4 h-4" />
              COPY ADDRESS
            </span>
          )}
        </button>
      </div>

      {/* 2 Main Cards: Staking Vault + Token Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VAULT STAKING */}
        <div className="comic-card bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]/15">
              <span className="font-comic text-xs uppercase px-3 py-1 rounded-full bg-[#B4F000] text-[#111111] border-2 border-[#111111] font-black">
                ANNUAL YIELD: 32% APY
              </span>
              <SoundBurst text="STAKE!" color="#55B3F3" className="text-xs" />
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4EEDF] rounded-2xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                <SlinkChampion size={56} />
              </div>
              <div>
                <h3 className="font-comic text-3xl uppercase text-[#111111] font-black">
                  MEADOW PIGGY BANK
                </h3>
                <p className="font-body text-xs font-semibold text-[#555555]">
                  Lock up $SLINK tokens to harvest passive fruit yields
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] flex items-center justify-between">
              <span className="font-body text-xs font-black text-[#555555]">YOUR WALLET BALANCE:</span>
              <span className="font-comic text-lg text-[#FF5D8F] font-black">
                {availableBalance.toLocaleString()} $SLINK
              </span>
            </div>

            {/* Stake Input Form */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-comic text-xs uppercase text-[#111111] font-black">
                AMOUNT TO STAKE:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="comic-input w-full py-2.5 px-3.5 text-base font-comic text-[#111111] rounded-xl border-2 border-[#111111] bg-white font-bold"
                  placeholder="500"
                />
                <button
                  type="button"
                  onClick={() => setStakeAmount(availableBalance.toString())}
                  className="comic-btn bg-[#B4F000] hover:bg-[#cbf738] text-xs py-2.5 px-3.5 rounded-xl border-2 border-[#111111] uppercase text-[#111111] font-black shrink-0 shadow-[2px_2px_0px_#111111]"
                >
                  MAX
                </button>
              </div>
            </div>

            {stakeSuccessMessage && (
              <div className="p-3 bg-[#B4F000] text-[#111111] rounded-xl border-2 border-[#111111] font-comic text-sm font-black">
                {stakeSuccessMessage}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#111111]/15">
            <button
              type="button"
              onClick={handleStake}
              className="comic-btn w-full bg-[#B4F000] hover:bg-[#cbf738] text-[#111111] text-lg uppercase py-3.5 rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] font-black"
            >
              {wallet.isConnected ? 'DEPOSIT IN THE VAULT' : 'CONNECT WALLET TO STAKE'}
            </button>
          </div>
        </div>

        {/* TOKENOMICS PIE BREAKDOWN */}
        <div className="comic-card bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]/15">
              <span className="font-comic text-xs uppercase px-3 py-1 rounded-full bg-[#55B3F3] text-[#111111] border-2 border-[#111111] font-black">
                SUPPLY: 1,000,000,000 $SLINK
              </span>
              <SoundBurst text="PIE!" color="#FF5D8F" className="text-xs" />
            </div>

            <h3 className="font-comic text-3xl uppercase text-[#111111] font-black">
              HOW THE PIE IS SLICED
            </h3>

            <div className="flex flex-col gap-3 mt-2">
              <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF5D8F] border border-[#111111]" />
                  <span className="font-comic text-sm text-[#111111] font-black">ARENA PRIZE POOLS &amp; FRUITS</span>
                </div>
                <span className="font-comic text-base text-[#FF5D8F] font-black">45%</span>
              </div>

              <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#55B3F3] border border-[#111111]" />
                  <span className="font-comic text-sm text-[#111111] font-black">MEADOW LIQUIDITY POOL</span>
                </div>
                <span className="font-comic text-base text-[#55B3F3] font-black">25%</span>
              </div>

              <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#B4F000] border border-[#111111]" />
                  <span className="font-comic text-sm text-[#111111] font-black">COMMUNITY REWARDS &amp; AIRDROPS</span>
                </div>
                <span className="font-comic text-base text-[#111111] font-black">20%</span>
              </div>

              <div className="p-3 bg-[#F4EEDF] rounded-xl border-2 border-[#111111] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#111111] border border-[#111111]" />
                  <span className="font-comic text-sm text-[#111111] font-black">CREATORS TREASURY</span>
                </div>
                <span className="font-comic text-base text-[#111111] font-black">10%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#111111]/15 flex items-center justify-between text-xs font-body font-black text-[#555555]">
            <span>100% FAIR LAUNCH ON PUMP.FUN</span>
            <span>LP BURNT &amp; MINT REVOKED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
