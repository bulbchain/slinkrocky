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
  User,
} from 'lucide-react';
import { WalletState } from '../types';
import { sounds } from '../audio';
import { PhantomLogo } from './PhantomLogo';
import { supabaseAuth, isSupabaseConfigured, getStoredLocalUser, AppUser } from '../lib/supabase';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: (walletName: string) => Promise<boolean | void> | void;
  onDisconnect: () => void;
  onAddTestSol: () => void;
  onUserAuthChange?: (user: AppUser | null) => void;
  onSignOut?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect,
  onAddTestSol,
  onUserAuthChange,
  onSignOut,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [connectTab, setConnectTab] = useState<'email' | 'phantom'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectingPhantom, setIsConnectingPhantom] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getStoredLocalUser());
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

  const activeEmail = currentUser?.email || wallet.userEmail;
  const isUserLoggedIn = Boolean(activeEmail);
  const displayName = currentUser?.name || (activeEmail ? activeEmail.split('@')[0] : 'Pilot');

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
    setErrorMsg(null);
    try {
      await supabaseAuth.signOut();
      setCurrentUser(null);
      if (onSignOut) {
        onSignOut();
      }
      if (onUserAuthChange) {
        onUserAuthChange(null);
      }
      setSuccessMsg('Signed out of account successfully.');
    } catch (err: any) {
      console.warn('Sign out issue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#111111]/75 backdrop-blur-sm overflow-y-auto">
      <div className="comic-card bg-white w-full max-w-lg my-6 p-5 sm:p-7 flex flex-col gap-4.5 border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFD13B] border-2 border-[#111111] text-[#111111]">
              {isUserLoggedIn ? <ShieldCheck className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-comic text-2xl uppercase text-[#111111] font-black leading-tight">
                {isUserLoggedIn
                  ? 'PILOT ACCOUNT & WALLET'
                  : wallet.isConnected
                  ? 'SOLANA WALLET'
                  : 'CONNECT TO SLINK'}
              </h3>
              <p className="font-body text-[11px] text-[#666666] font-semibold">
                {isUserLoggedIn
                  ? `Logged in as ${activeEmail}`
                  : 'Supabase Authentication & Phantom Solana Wallet'}
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
          <div className="p-3 rounded-xl bg-[#FFE5EC] border-2 border-[#111111] text-[#B80036] text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[2px_2px_0px_#111111]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B80036]" />
              <span>{errorMsg}</span>
            </div>
            {authMode === 'signin' && errorMsg.includes('NEW ACCOUNT') && (
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(440);
                  setAuthMode('signup');
                  setErrorMsg(null);
                }}
                className="comic-btn px-2.5 py-1 bg-[#FFD13B] text-[#111111] rounded-lg border-2 border-[#111111] text-[11px] font-black uppercase whitespace-nowrap self-start sm:self-auto cursor-pointer shadow-[1px_1px_0px_#111111]"
              >
                Create Account Now
              </button>
            )}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-[#E8F8EA] border-2 border-[#111111] text-[#0E7A2A] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CASE 1: USER IS LOGGED IN VIA EMAIL (PRIMARY ACCOUNT DOSSIER)       */}
        {/* ==================================================================== */}
        {isUserLoggedIn && (
          <div className="flex flex-col gap-4">
            {/* Logged in User Card */}
            <div className="p-4 rounded-xl bg-[#EBF5FB] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#3ECF8E] text-white border-2 border-[#111111] flex items-center justify-center font-comic font-black text-lg shadow-[1px_1px_0px_#111111]">
                    {activeEmail ? activeEmail[0].toUpperCase() : 'P'}
                  </div>
                  <div>
                    <span className="font-comic text-[10px] uppercase text-[#555555] font-black block">
                      AUTHENTICATED PILOT ACCOUNT
                    </span>
                    <span className="font-comic text-base text-[#111111] font-black leading-tight">
                      {displayName}
                    </span>
                  </div>
                </div>
                <span className="font-comic text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#3ECF8E] text-white border border-[#111111] font-black">
                  ONLINE
                </span>
              </div>

              {/* Email details row */}
              <div className="bg-white p-3 rounded-xl border-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="font-comic text-[10px] uppercase font-black text-[#555555] block">
                    EMAIL ADDRESS
                  </span>
                  <span className="font-mono text-sm font-black text-[#111111] break-all">
                    {activeEmail}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#555555] bg-[#F4EEDF] px-2 py-0.5 rounded border border-[#111111]/30 self-start sm:self-center font-semibold">
                  {isSupabaseConfigured ? 'Supabase Live' : 'Supabase Sandbox'}
                </span>
              </div>

              {/* Prominent SIGN OUT button */}
              <button
                type="button"
                onClick={handleSignOutUser}
                disabled={isLoading}
                className="comic-btn w-full bg-[#FF5D8F] hover:bg-[#ff75a0] text-white text-sm uppercase py-2.5 rounded-xl border-2 border-[#111111] font-comic font-black shadow-[2px_2px_0px_#111111] flex items-center justify-center gap-2 cursor-pointer transition-transform"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SIGNING OUT...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>SIGN OUT OF ACCOUNT</span>
                  </>
                )}
              </button>
            </div>

            {/* PHANTOM WALLET SECTION FOR LOGGED-IN USERS */}
            {wallet.isConnected ? (
              /* Phantom is connected */
              <div className="p-4 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PhantomLogo size={28} />
                    <div>
                      <span className="font-comic text-xs uppercase text-[#555555] font-black block">
                        SOLANA PHANTOM WALLET
                      </span>
                      <span className="font-comic text-sm text-[#111111] font-black">
                        ● Phantom Connected
                      </span>
                    </div>
                  </div>
                  <span className="font-comic text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#B4F000] border-2 border-[#111111] font-black text-[#111111]">
                    CONNECTED
                  </span>
                </div>

                <span className="font-mono text-xs font-bold text-[#111111] bg-white px-2.5 py-1.5 rounded-lg border-2 border-[#111111] break-all">
                  {wallet.address}
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2 rounded-xl bg-[#FFD13B] border-2 border-[#111111] text-center shadow-[1px_1px_0px_#111111]">
                    <span className="font-comic text-[10px] uppercase text-[#111111] font-black block">SOLANA BALANCE</span>
                    <span className="font-comic text-lg text-[#111111] font-black">{wallet.solBalance} SOL</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#55B3F3] border-2 border-[#111111] text-center text-[#111111] shadow-[1px_1px_0px_#111111]">
                    <span className="font-comic text-[10px] uppercase text-[#111111] font-black block">$SLINK TOKENS</span>
                    <span className="font-comic text-lg text-[#111111] font-black">{slinkBal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playBeep(880);
                      onAddTestSol();
                    }}
                    className="comic-btn flex-1 bg-[#55B3F3] hover:bg-[#43a1e2] text-[#111111] text-xs uppercase py-2 rounded-xl border-2 border-[#111111] flex items-center justify-center gap-1.5 font-black shadow-[2px_2px_0px_#111111]"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+0.5 TEST SOL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playBeep(520);
                      onDisconnect();
                    }}
                    className="comic-btn px-3 bg-white hover:bg-[#FFE5EC] text-[#111111] text-xs uppercase py-2 rounded-xl border-2 border-[#111111] font-black shadow-[2px_2px_0px_#111111]"
                  >
                    DISCONNECT WALLET
                  </button>
                </div>
              </div>
            ) : (
              /* Phantom is NOT connected -> Secondary OPTIONAL connection */
              <div className="p-4 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhantomLogo size={24} />
                    <span className="font-comic text-xs uppercase text-[#111111] font-black">
                      SOLANA WALLET (OPTIONAL)
                    </span>
                  </div>
                  <span className="font-comic text-[9px] uppercase px-2 py-0.5 rounded bg-white border border-[#111111] text-[#777777] font-bold">
                    NOT LINKED
                  </span>
                </div>

                <p className="font-body text-xs text-[#555555] font-semibold leading-relaxed">
                  You can optionally link a Phantom wallet if you want to enter SOL prize pools or withdraw $SLINK tokens to your personal Solana address.
                </p>

                <button
                  type="button"
                  disabled={isConnectingPhantom}
                  onClick={handlePhantomConnect}
                  className="comic-btn w-full py-2 bg-[#FFD13B] hover:bg-[#FFE066] text-[#111111] text-xs uppercase rounded-xl border-2 border-[#111111] font-comic font-black shadow-[2px_2px_0px_#111111] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isConnectingPhantom ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>CONNECTING PHANTOM...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-3.5 h-3.5" />
                      <span>LINK PHANTOM WALLET</span>
                    </>
                  )}
                </button>

                {phantomNotDetected && !isPhantomInstalled && (
                  <div className="p-2.5 rounded-lg bg-[#FFF9E6] border border-[#111111] text-xs text-[#111111] flex flex-col gap-1.5 mt-1">
                    <span className="font-semibold text-[11px] text-[#777777]">
                      Phantom extension not detected in this browser:
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://phantom.app"
                        target="_blank"
                        rel="noreferrer"
                        className="comic-btn inline-flex items-center gap-1 px-2 py-1 bg-white text-[#111111] border border-[#111111] rounded text-[10px] font-black hover:bg-[#AB9FF2]/30"
                      >
                        <span>Install Phantom</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playBoostSound();
                          onConnect('Phantom Demo Sandbox');
                        }}
                        className="comic-btn px-2 py-1 bg-[#B4F000] text-[#111111] border border-[#111111] rounded text-[10px] font-black hover:bg-[#cbf738]"
                      >
                        Use Demo Solana Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* CASE 2: USER IS ONLY CONNECTED VIA PHANTOM (NO EMAIL YET)            */}
        {/* ==================================================================== */}
        {!isUserLoggedIn && wallet.isConnected && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-[#F4EEDF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PhantomLogo size={32} />
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

            {/* Optional Email Link */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t-2 border-[#111111]" />
              <span className="flex-shrink mx-3 px-3 py-0.5 bg-[#FFD13B] rounded-full border-2 border-[#111111] font-comic text-[11px] uppercase font-black text-[#111111]">
                LINK EMAIL ACCOUNT (OPTIONAL)
              </span>
              <div className="flex-grow border-t-2 border-[#111111]" />
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CASE 3: USER IS NOT LOGGED IN AT ALL (SHOW TABS: EMAIL vs PHANTOM)  */}
        {/* ==================================================================== */}
        {!isUserLoggedIn && !wallet.isConnected && (
          <div className="flex flex-col gap-4">
            {/* Top Selection Tabs: Email Login vs Phantom Wallet */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F4EEDF] rounded-xl border-2 border-[#111111]">
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(440);
                  setConnectTab('email');
                }}
                className={`py-2 text-xs font-comic font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  connectTab === 'email'
                    ? 'bg-[#3ECF8E] text-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111]'
                    : 'text-[#555555] hover:text-[#111111]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>EMAIL ACCOUNT</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playBeep(440);
                  setConnectTab('phantom');
                }}
                className={`py-2 text-xs font-comic font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  connectTab === 'phantom'
                    ? 'bg-[#FFD13B] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]'
                    : 'text-[#555555] hover:text-[#111111]'
                }`}
              >
                <PhantomLogo size={18} />
                <span>PHANTOM WALLET</span>
              </button>
            </div>

            {/* TAB CONTENT: PHANTOM WALLET */}
            {connectTab === 'phantom' && (
              <div className="flex flex-col gap-3">
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
                          SOLANA
                        </span>
                      </div>
                      <span className="font-body text-xs text-[#555555] font-medium block">
                        {isPhantomInstalled
                          ? 'Phantom Extension Detected · Ready'
                          : 'One-Tap Connect Solana Web3 Wallet'}
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

                {phantomNotDetected && !isPhantomInstalled && (
                  <div className="p-3 rounded-xl bg-[#FFF9E6] border-2 border-[#111111] text-[#111111] text-xs flex flex-col gap-2 shadow-[1px_1px_0px_#111111]">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                      <p className="font-body text-xs font-semibold leading-relaxed">
                        Phantom extension was not detected in this browser session:
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href="https://phantom.app"
                        target="_blank"
                        rel="noreferrer"
                        className="comic-btn inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-[#111111] border-2 border-[#111111] rounded-lg font-comic text-[11px] font-black hover:bg-[#AB9FF2]/30"
                      >
                        <span>Install Phantom</span>
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

            {/* TAB CONTENT: EMAIL AUTHENTICATION */}
            {connectTab === 'email' && (
              <div className="flex flex-col gap-3">
                {/* Sub-Tabs: Sign In / Create Account / Magic Link */}
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
                        <span>CREATE ACCOUNT</span>
                      </>
                    ) : authMode === 'magic' ? (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>SEND MAGIC LINK</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>SIGN IN WITH EMAIL</span>
                      </>
                    )}
                  </button>
                </form>

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
                  <span className="font-comic uppercase">Secure Pilot Login</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
