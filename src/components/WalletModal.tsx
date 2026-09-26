import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  PlusCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { WalletState } from '../types';
import { sounds } from '../audio';
import { PhantomLogo } from './PhantomLogo';
import { supabaseAuth, isSupabaseConfigured, AppUser } from '../lib/supabase';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: (walletName: string) => Promise<boolean | void> | void;
  onDisconnect: () => void;
  onAddTestSol: () => void;
  onUserAuthChange?: (user: AppUser | null) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect,
  onAddTestSol,
  onUserAuthChange,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectingPhantom, setIsConnectingPhantom] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [phantomNotDetected, setPhantomNotDetected] = useState(false);

  // Check current auth status on open
  useEffect(() => {
    if (isOpen) {
      supabaseAuth.getCurrentUser().then((user) => {
        setCurrentUser(user);
        if (user && onUserAuthChange) {
          onUserAuthChange(user);
        }
      });
      setErrorMsg(null);
      setSuccessMsg(null);
      setPhantomNotDetected(false);
      setIsConnectingPhantom(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const slinkBal = wallet.slinkBalance ?? 0;
  const isPhantomInstalled = typeof window !== 'undefined' && Boolean(window.solana?.isPhantom);

  const handlePhantomConnect = async () => {
    sounds.playBoostSound();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!isPhantomInstalled) {
      setPhantomNotDetected(true);
    }
    setIsConnectingPhantom(true);
    try {
      const res = await onConnect('Phantom');
      if (res === false) {
        setErrorMsg('Phantom connection was cancelled or declined.');
      }
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.includes('User rejected')) {
        setErrorMsg('Phantom connection request declined.');
      } else {
        setErrorMsg(err?.message || 'Could not connect to Phantom wallet.');
      }
    } finally {
      setIsConnectingPhantom(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      sounds.playBeep(320);
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'magic') {
        const res = await supabaseAuth.signInWithOtp(email);
        if (res.error) {
          setErrorMsg(res.error);
          sounds.playBeep(320);
        } else {
          setSuccessMsg(res.message || 'Check your email for the magic login link!');
          sounds.playBeep(880);
          const user = await supabaseAuth.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            if (onUserAuthChange) onUserAuthChange(user);
          }
        }
      } else if (authMode === 'signup') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          sounds.playBeep(320);
          setIsLoading(false);
          return;
        }
        const res = await supabaseAuth.signUpWithEmail(email, password);
        if (res.error) {
          setErrorMsg(res.error);
          sounds.playBeep(320);
        } else {
          setCurrentUser(res.user);
          if (onUserAuthChange) onUserAuthChange(res.user);
          setSuccessMsg(res.message || `Welcome to Slink! Account created as ${email}.`);
          sounds.playBeep(880);
          setPassword('');
        }
      } else {
        // Sign In
        if (!password) {
          setErrorMsg('Please enter your password.');
          sounds.playBeep(320);
          setIsLoading(false);
          return;
        }
        const res = await supabaseAuth.signInWithEmail(email, password);
        if (res.error) {
          setErrorMsg(res.error);
          sounds.playBeep(320);
        } else {
          setCurrentUser(res.user);
          if (onUserAuthChange) onUserAuthChange(res.user);
          setSuccessMsg(`Signed in successfully as ${email}!`);
          sounds.playBeep(880);
          setPassword('');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutUser = async () => {
    sounds.playBeep(520);
    setIsLoading(true);
    await supabaseAuth.signOut();
    setCurrentUser(null);
    if (onUserAuthChange) onUserAuthChange(null);
    setSuccessMsg('Signed out of Supabase account.');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#111111]/75 backdrop-blur-sm overflow-y-auto">
      <div className="comic-card bg-white w-full max-w-lg my-6 p-5 sm:p-7 flex flex-col gap-4.5 border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFD13B] border-2 border-[#111111] text-[#111111]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comic text-2xl uppercase text-[#111111] font-black leading-tight">
                {wallet.isConnected || currentUser ? 'CONNECTED ACCOUNT' : 'CONNECT WALLET'}
              </h3>
              <p className="font-body text-[11px] text-[#666666] font-semibold">
                Phantom Solana Wallet &amp; Supabase Authentication
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playBeep(520);
              onClose();
            }}
            className="p-1.5 rounded-xl bg-[#F4EEDF] hover:bg-[#FFD13B] border-2 border-[#111111] text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FFE5EC] border-2 border-[#111111] text-[#B80036] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-[#E8F8EA] border-2 border-[#111111] text-[#0E7A2A] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SECTION 1: Phantom Wallet (If Connected) */}
        {wallet.isConnected && (
          <div className="p-4 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <PhantomLogo size={28} />
                <div>
                  <span className="font-comic text-xs uppercase text-[#555555] font-black block">
                    ACTIVE SOLANA WALLET
                  </span>
                  <span className="font-comic text-sm text-[#111111] font-black">
                    ● Phantom Connected
                  </span>
                </div>
              </div>
              <span className="font-comic text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#B4F000] border-2 border-[#111111] font-black text-[#111111]">
                ONLINE
              </span>
            </div>

            <span className="font-mono text-xs font-bold text-[#111111] bg-white px-2.5 py-1.5 rounded-lg border-2 border-[#111111] break-all">
              {wallet.address}
            </span>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#FFD13B] border-2 border-[#111111] text-center shadow-[1px_1px_0px_#111111]">
                <span className="font-comic text-[10px] uppercase text-[#111111] font-black block">SOLANA BALANCE</span>
                <span className="font-comic text-xl text-[#111111] font-black">{wallet.solBalance} SOL</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FF5D8F] border-2 border-[#111111] text-center text-white shadow-[1px_1px_0px_#111111]">
                <span className="font-comic text-[10px] uppercase text-white font-black block">$SLINK TOKENS</span>
                <span className="font-comic text-xl text-white font-black">{slinkBal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(880);
                  onAddTestSol();
                }}
                className="comic-btn flex-1 bg-[#55B3F3] hover:bg-[#43a1e2] text-[#111111] text-xs uppercase py-2.5 rounded-xl border-2 border-[#111111] flex items-center justify-center gap-1.5 font-black shadow-[2px_2px_0px_#111111]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+0.5 SOL TESTNET</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(520);
                  onDisconnect();
                }}
                className="comic-btn px-4 bg-[#FF5D8F] hover:bg-[#ff75a0] text-white text-xs uppercase py-2.5 rounded-xl border-2 border-[#111111] font-black shadow-[2px_2px_0px_#111111]"
              >
                DISCONNECT
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: Phantom Wallet Option (If not connected) */}
        {!wallet.isConnected && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-comic text-xs uppercase text-[#111111] font-black tracking-wider">
                1. SOLANA WEB3 WALLET
              </span>
              <span className="font-comic text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#AB9FF2]/30 border border-[#111111] font-bold text-[#111111]">
                SOLANA OFFICIAL
              </span>
            </div>

            {/* ONLY PHANTOM OPTION */}
            <div
              onClick={handlePhantomConnect}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4EEDF] hover:bg-[#AB9FF2]/30 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <PhantomLogo size={42} />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-comic text-lg uppercase text-[#111111] block leading-tight font-black">
                      Phantom Wallet
                    </span>
                    <span className="font-comic text-[9px] uppercase px-1.5 py-0.5 bg-[#AB9FF2] text-[#111111] border border-[#111111] rounded font-bold">
                      ONLY
                    </span>
                  </div>
                  <span className="font-body text-xs text-[#555555] font-medium block">
                    {isPhantomInstalled
                      ? 'Phantom Extension Detected'
                      : 'Solana Comic Wallet · One-Tap Connect'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                disabled={isConnectingPhantom}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePhantomConnect();
                }}
                className="comic-btn font-comic text-xs uppercase px-3.5 py-1.5 rounded-full bg-[#FFD13B] group-hover:bg-[#FFE066] border-2 border-[#111111] font-black shadow-[1px_1px_0px_#111111] flex items-center gap-1.5"
              >
                {isConnectingPhantom ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>CONNECTING...</span>
                  </>
                ) : (
                  <span>CONNECT</span>
                )}
              </button>
            </div>

            {/* If Phantom is not detected, provide friendly helper */}
            {phantomNotDetected && !isPhantomInstalled && (
              <div className="p-3 rounded-xl bg-[#FFF9E6] border-2 border-[#111111] text-[#111111] text-xs flex flex-col gap-2 shadow-[1px_1px_0px_#111111]">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <p className="font-body text-xs font-semibold leading-relaxed">
                    Phantom extension was not detected in this browser session. You can install Phantom or try the testnet sandbox wallet:
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href="https://phantom.app"
                    target="_blank"
                    rel="noreferrer"
                    className="comic-btn inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-[#111111] border-2 border-[#111111] rounded-lg font-comic text-[11px] font-black hover:bg-[#AB9FF2]/30"
                  >
                    <span>Get Phantom</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playBoostSound();
                      onConnect('Phantom Demo Sandbox');
                    }}
                    className="comic-btn px-2.5 py-1 bg-[#B4F000] text-[#111111] border-2 border-[#111111] rounded-lg font-comic text-[11px] font-black hover:bg-[#cbf738]"
                  >
                    Use Demo Solana Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RETRO COMIC DIVIDER */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t-2 border-[#111111]" />
          <span className="flex-shrink mx-3 px-3 py-0.5 bg-[#FFD13B] rounded-full border-2 border-[#111111] font-comic text-[11px] uppercase font-black text-[#111111] shadow-[1px_1px_0px_#111111] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>EMAIL &amp; SUPABASE LOGIN</span>
          </span>
          <div className="flex-grow border-t-2 border-[#111111]" />
        </div>

        {/* SECTION 3: Supabase Email Auth */}
        {currentUser ? (
          /* User is signed in with Supabase */
          <div className="p-4 rounded-xl bg-[#EBF5FB] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#3ECF8E] text-white border-2 border-[#111111]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-comic text-[10px] uppercase text-[#555555] font-black block">
                    SUPABASE ACCOUNT
                  </span>
                  <span className="font-comic text-xs text-[#111111] font-black">
                    {currentUser.isMock ? 'Sandbox Session Active' : 'Live Supabase Verified'}
                  </span>
                </div>
              </div>
              <span className="font-comic text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#3ECF8E] text-white border border-[#111111] font-black">
                SIGNED IN
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border-2 border-[#111111]">
              <span className="font-body text-xs font-bold text-[#555555] block">EMAIL:</span>
              <span className="font-mono text-sm font-black text-[#111111]">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#666666] font-semibold px-1">
              <span>Cloud Sync: Enabled</span>
              <span>User ID: {currentUser.id.slice(0, 10)}...</span>
            </div>

            <button
              type="button"
              onClick={handleSignOutUser}
              disabled={isLoading}
              className="comic-btn w-full bg-[#FF5D8F] hover:bg-[#ff75a0] text-white text-xs uppercase py-2.5 rounded-xl border-2 border-[#111111] font-black shadow-[2px_2px_0px_#111111] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>SIGN OUT OF SUPABASE EMAIL</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* User is NOT signed in with Email -> Form */
          <div className="flex flex-col gap-3">
            {/* Tabs: Sign In / Create Account / Magic Link */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4EEDF] rounded-xl border-2 border-[#111111]">
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(440);
                  setAuthMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-1.5 text-xs font-comic font-black rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-[#FFD13B] text-[#111111] border-2 border-[#111111] shadow-[1px_1px_0px_#111111]'
                    : 'text-[#555555] hover:text-[#111111]'
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(440);
                  setAuthMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-1.5 text-xs font-comic font-black rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#FFD13B] text-[#111111] border-2 border-[#111111] shadow-[1px_1px_0px_#111111]'
                    : 'text-[#555555] hover:text-[#111111]'
                }`}
              >
                NEW ACCOUNT
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(440);
                  setAuthMode('magic');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-1.5 text-xs font-comic font-black rounded-lg transition-all ${
                  authMode === 'magic'
                    ? 'bg-[#FFD13B] text-[#111111] border-2 border-[#111111] shadow-[1px_1px_0px_#111111]'
                    : 'text-[#555555] hover:text-[#111111]'
                }`}
              >
                MAGIC LINK
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-2.5">
              {/* Email Input */}
              <div>
                <label className="font-comic text-[11px] uppercase font-black text-[#111111] block mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555555]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pilot@slither.io"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-xl border-2 border-[#111111] font-mono font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD13B] shadow-[2px_2px_0px_#111111]"
                  />
                </div>
              </div>

              {/* Password Input (if not magic link) */}
              {authMode !== 'magic' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-comic text-[11px] uppercase font-black text-[#111111]">
                      {authMode === 'signup' ? 'CREATE PASSWORD (MIN 6 CHARS)' : 'PASSWORD'}
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555555]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 text-sm bg-white rounded-xl border-2 border-[#111111] font-mono font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD13B] shadow-[2px_2px_0px_#111111]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555555] hover:text-[#111111] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="comic-btn w-full mt-1 bg-[#3ECF8E] hover:bg-[#34b87d] text-white text-sm uppercase py-2.5 rounded-xl border-2 border-[#111111] font-comic font-black shadow-[2px_2px_0px_#111111] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING SUPABASE...</span>
                  </>
                ) : authMode === 'signup' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>CREATE SUPABASE ACCOUNT</span>
                  </>
                ) : authMode === 'magic' ? (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>SEND MAGIC LOGIN LINK</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>SIGN IN WITH EMAIL</span>
                  </>
                )}
              </button>
            </form>

            {/* Supabase backend status footer indicator */}
            <div className="flex items-center justify-between text-[10px] text-[#777777] font-semibold pt-1 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSupabaseConfigured ? 'bg-[#3ECF8E]' : 'bg-[#FFD13B]'
                  }`}
                />
                <span>
                  Supabase Auth: {isSupabaseConfigured ? 'Live Cloud Connected' : 'Local Sandbox Mode'}
                </span>
              </div>
              <span className="font-comic uppercase">Secure Auth</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
