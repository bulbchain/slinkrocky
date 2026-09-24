import React, { useState } from 'react';
import { Gamepad2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { sounds } from '../audio';
import { SlinkChampion, SoundBurst } from './RetroCartoonCharacters';
import slinkLogo from '../assets/images/slink_creature_logo_1790169607687.jpg';

interface ReadyToDriftCTAProps {
  onLaunchNow: () => void;
}

export const ReadyToDriftCTA: React.FC<ReadyToDriftCTAProps> = ({ onLaunchNow }) => {
  const [copied, setCopied] = useState(false);

  const SLINK_CONTRACT = 'SL1NKvP3rG9zReap4UjT7kZ9sY2cSol8vQmW3aXpump';

  const handleCopyContract = async () => {
    try {
      await navigator.clipboard.writeText(SLINK_CONTRACT);
      setCopied(true);
      sounds.playBeep(800);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy contract address:', error);
    }
  };

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Big Comic Poster Card */}
      <div className="comic-card bg-[#FFD13B] border-4 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18] p-8 sm:p-12 text-center relative overflow-hidden flex flex-col items-center gap-5">
        {/* Top Sound Bursts */}
        <div className="absolute top-4 left-6 hidden sm:block -rotate-6">
          <SoundBurst text="GO TIME!" color="#FA824C" />
        </div>
        <div className="absolute top-4 right-6 hidden sm:block rotate-6">
          <SoundBurst text="YUMMY!" color="#70A288" />
        </div>

        {/* Mascot */}
        <div className="p-3 bg-white rounded-3xl border-3 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18]">
          <SlinkChampion size={88} />
        </div>

        {/* Headline */}
        <div>
          <span className="font-comic text-sm uppercase px-3 py-1 bg-white rounded border-2 border-[#1E1B18] text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
            ★ SUNDAY EDITION · ISSUE #1 ★
          </span>
          <h2 className="font-comic text-4xl sm:text-6xl uppercase text-[#1E1B18] tracking-wide mt-3 drop-shadow-[2px_2px_0px_white]">
            READY TO SLINK, WOBBLE &amp; WIN?
          </h2>
          <p className="font-body text-sm sm:text-base text-[#1E1B18] font-medium max-w-xl mx-auto mt-2">
            The meadow grass is freshly mowed and the apples are crisp! Slither straight into the action — no download or sign-up needed!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              sounds.playBoostSound();
              onLaunchNow();
            }}
            className="comic-btn w-full sm:w-auto bg-[#FA824C] hover:bg-[#FF9666] text-white text-2xl py-4 px-10 tracking-wider shadow-[5px_5px_0px_#1E1B18]"
          >
            <Gamepad2 className="w-6 h-6 mr-2 inline" />
            <span>PLAY FOR FREE NOW!</span>
          </button>

          <a
            href="https://x.com/play_slink"
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.playBeep(640)}
            className="comic-btn w-full sm:w-auto bg-white hover:bg-[#FFF8ED] text-[#1E1B18] text-base py-3.5 px-6 shadow-[4px_4px_0px_#1E1B18]"
          >
            <span>JOIN THE COMIC CLUB @PLAY_SLINK</span>
            <ExternalLink className="w-4 h-4 ml-1.5 inline" />
          </a>
        </div>

        {/* Contract Box */}
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <span className="font-comic text-xs uppercase text-[#1E1B18] tracking-wider">
            OFFICIAL $SLINK SOLANA CONTRACT
          </span>

          <div className="flex items-center gap-2 rounded-lg bg-white border-2 border-[#1E1B18] px-3.5 py-1.5 shadow-[2px_2px_0px_#1E1B18]">
            <img
              src={slinkLogo}
              alt="SLINK"
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover border border-[#1E1B18]"
            />
            <span className="font-mono text-xs text-[#1E1B18] font-bold">
              {SLINK_CONTRACT.slice(0, 8)}...{SLINK_CONTRACT.slice(-8)}
            </span>
            <button
              onClick={handleCopyContract}
              title="Copy Contract Address"
              className="p-1 rounded bg-[#FFD13B] border border-[#1E1B18] hover:bg-[#FFE066] text-[#1E1B18] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#70A288]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {copied && (
            <span className="font-comic text-xs text-[#70A288] font-bold">
              COPIED TO CLIPBOARD!
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
