import React from 'react';
import { X, Wallet, PlusCircle, Check } from 'lucide-react';
import { WalletState } from '../types';
import { sounds } from '../audio';
import { SlinkChampion, SoundBurst } from './RetroCartoonCharacters';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: (walletName: string) => void;
  onDisconnect: () => void;
  onAddTestSol: () => void;
}

const WALLET_OPTIONS = [
  {
    name: 'Phantom',
    icon: '🟣',
    color: '#FFD13B',
    description: 'Solana Comic Wallet',
  },
  {
    name: 'Solflare',
    icon: '🟠',
    color: '#FA824C',
    description: 'Meadow Vault Client',
  },
  {
    name: 'Backpack',
    icon: '🎒',
    color: '#78C0E0',
    description: 'xNFT & Slink Bag',
  },
];

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect,
  onAddTestSol,
}) => {
  if (!isOpen) return null;

  const slinkBal = wallet.slinkBalance ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-sm">
      <div className="comic-card bg-white w-full max-w-md p-6 sm:p-7 flex flex-col gap-5 border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#B4F000] border-2 border-[#111111] text-[#111111]">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-comic text-2xl uppercase text-[#111111] font-black">
              {wallet.isConnected ? 'CONNECTED WALLET' : 'CONNECT WALLET'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="p-1.5 rounded-xl bg-[#F4EEDF] hover:bg-[#B4F000] border-2 border-[#111111] text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {wallet.isConnected ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <span className="font-comic text-xs uppercase text-[#555555] font-black block">
                ACTIVE MEADOW WALLET
              </span>
              <span className="font-mono text-xs font-bold text-[#111111] break-all block mt-1">
                {wallet.address}
              </span>
              <span className="font-comic text-xs text-[#111111] font-black mt-1 inline-block">
                ● CONNECTED ({wallet.walletName})
              </span>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#B4F000] border-2 border-[#111111] text-center shadow-[2px_2px_0px_#111111]">
                <span className="font-comic text-[11px] uppercase text-[#111111] font-black block">SOLANA BALANCE</span>
                <span className="font-comic text-2xl text-[#111111] font-black">{wallet.solBalance} SOL</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FF5D8F] border-2 border-[#111111] text-center text-white shadow-[2px_2px_0px_#111111]">
                <span className="font-comic text-[11px] uppercase text-white font-black block">$SLINK TOKENS</span>
                <span className="font-comic text-2xl text-white font-black">{slinkBal.toLocaleString()}</span>
              </div>
            </div>

            {/* Add Test Tokens */}
            <button
              type="button"
              onClick={() => {
                sounds.playBeep(880);
                onAddTestSol();
              }}
              className="comic-btn w-full bg-[#55B3F3] hover:bg-[#43a1e2] text-[#111111] text-sm uppercase py-3 rounded-xl border-2 border-[#111111] flex items-center justify-center gap-2 font-black shadow-[2px_2px_0px_#111111]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>TESTNET REFILL (+0.5 SOL &amp; +500 $SLINK)</span>
            </button>

            {/* Disconnect */}
            <button
              type="button"
              onClick={() => {
                sounds.playBeep(520);
                onDisconnect();
              }}
              className="comic-btn w-full bg-[#FF5D8F] hover:bg-[#ff75a0] text-white text-sm uppercase py-3 rounded-xl border-2 border-[#111111] font-black shadow-[2px_2px_0px_#111111]"
            >
              DISCONNECT WALLET
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-body text-xs text-[#555555] font-semibold leading-relaxed">
              Connect your Solana wallet to enter the Bounty Bowl, harvest star bounties, and stake tokens in the Piggy Bank!
            </p>

            <div className="flex flex-col gap-2.5 mt-1">
              {WALLET_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => {
                    sounds.playBoostSound();
                    onConnect(opt.name);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4EEDF] hover:bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="text-left">
                      <span className="font-comic text-lg uppercase text-[#111111] block leading-tight font-black">
                        {opt.name}
                      </span>
                      <span className="font-body text-xs text-[#555555] font-medium">
                        {opt.description}
                      </span>
                    </div>
                  </div>
                  <span className="font-comic text-xs uppercase px-3 py-1 rounded-full bg-white border-2 border-[#111111] font-black">
                    CONNECT
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
