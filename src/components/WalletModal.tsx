import React from 'react';
import { X, Wallet, PlusCircle } from 'lucide-react';
import { WalletState } from '../types';
import { sounds } from '../audio';

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
    color: '#ab9ff2',
    description: 'Solana & Multi-chain Cyber Wallet',
  },
  {
    name: 'Solflare',
    icon: '🟠',
    color: '#fc8024',
    description: 'High-security Web3 Vault',
  },
  {
    name: 'Backpack',
    icon: '🎒',
    color: '#e54245',
    description: 'xNFT & Slink Protocol Client',
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

  const slinkBal = wallet.slinkBalance ?? wallet.narkyBalance ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c1026] border border-cyan-400/40 p-6 shadow-[0_0_50px_rgba(0,245,212,0.3)] flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-[#00f5d4]">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg uppercase font-bold text-white">
              {wallet.isConnected ? 'CONNECTED CYBER WALLET' : 'CONNECT WEB3 WALLET'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {wallet.isConnected ? (
          /* Connected State */
          <div className="flex flex-col gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#060814] border border-cyan-500/30 flex flex-col gap-2.5 shadow-inner">
              <div className="flex items-center justify-between text-slate-400">
                <span>WALLET PROVIDER:</span>
                <span className="text-[#00f5d4] font-bold">{wallet.walletName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>ADDRESS:</span>
                <span className="text-white font-bold">
                  {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-8)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-white/10">
                <span>SOL BALANCE:</span>
                <span className="text-amber-400 font-bold text-sm">{wallet.solBalance} SOL</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>$SLINK BALANCE:</span>
                <span className="text-[#00ff88] font-bold text-sm">{slinkBal} $SLINK</span>
              </div>
            </div>

            {/* Test Faucet Trigger */}
            <button
              type="button"
              onClick={() => {
                sounds.playBeep(780);
                onAddTestSol();
              }}
              className="py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 flex items-center justify-center gap-2 transition-all font-bold uppercase cursor-pointer hover:scale-[1.01]"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>TEST FAUCET (+0.5 SOL &amp; +500 $SLINK)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playBeep(520);
                onDisconnect();
              }}
              className="py-3 px-4 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 transition-colors uppercase font-bold cursor-pointer"
            >
              DISCONNECT WALLET
            </button>
          </div>
        ) : (
          /* Disconnected Option List */
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-slate-300">
              Select your Solana wallet to connect to the SLINK Arena:
            </span>

            {WALLET_OPTIONS.map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => {
                  sounds.playBeep(720);
                  onConnect(opt.name);
                }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#060814] hover:bg-[#0f1430] border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <span className="font-display text-sm font-bold uppercase text-white group-hover:text-[#00f5d4] transition-colors block">
                      {opt.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      {opt.description}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                  CONNECT →
                </span>
              </button>
            ))}

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] leading-relaxed">
              💡 Connecting a wallet allows you to stake $SLINK tokens, save custom worm skins, and compete in high-stakes bounty matches.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
