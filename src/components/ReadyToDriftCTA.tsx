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
      {/* Big Comic Poster Card (Hot Pink with Black Offset Shadow) */}
      <div className="comic-card bg-[#FF5D8F] border-4 border-[#111111] shadow-[8px_8px_0px_#111111] p-8 sm:p-12 text-center relative overflow-hidden flex flex-col items-center gap-5 rounded-3xl">
        {/* Top Sound Bursts */}
        <div className="absolute top-4 left-6 hidden sm:block -rotate-6">
          <SoundBurst text="GO TIME!" color="#B4F000" />
        </div>
        <div className="absolute top-4 right-6 hidden sm:block rotate-6">
          <SoundBurst text="YUMMY!" color="#55B3F3" />
        </div>

        {/* Mascot in Circular Yellow Halo */}
        <div className="p-3 bg-[#FFD13B] rounded-full border-3 border-[#111111] shadow-[4px_4px_0px_#111111]">
          <SlinkChampion size={88} />
        </div>

        {/* Headline */}
        <div>
          <span className="font-comic text-xs uppercase px-3 py-1 bg-[#B4F000] rounded-lg border-2 border-[#111111] text-[#111111] shadow-[2px_2px_0px_#111111] font-bold">
            ★ SUNDAY EDITION · 100% ORGANIC RETRO FUN ★
          </span>
          <h2 className="font-comic text-4xl sm:text-6xl uppercase text-[#111111] tracking-wide mt-3 drop-shadow-[2px_2px_0px_white]">
            READY TO SLINK, WOBBLE &amp; WIN?
          </h2>
          <p className="font-body text-base text-[#111111] font-bold max-w-xl mx-auto mt-2">
            The meadow is freshly mowed and the orchard fruits are ripe! Slither straight into the action — no download or sign-up needed!
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
            className="comic-btn w-full sm:w-auto bg-[#B4F000] hover:bg-[#9DE000] text-[#111111] text-2xl py-4 px-10 tracking-wider shadow-[6px_6px_0px_#111111] font-bold"
          >
            <Gamepad2 className="w-6 h-6 mr-2 inline" />
            <span>PLAY FOR FREE NOW!</span>
          </button>

          <a
            href="https://x.com/play_slink"
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.playBeep(640)}
            className="comic-btn w-full sm:w-auto bg-white hover:bg-[#F4EEDF] text-[#111111] text-base py-4 px-6 shadow-[5px_5px_0px_#111111] font-bold"
          >
            <span>JOIN THE COMIC CLUB @PLAY_SLINK</span>
            <ExternalLink className="w-4 h-4 ml-1.5 inline" />
          </a>
        </div>

        {/* Contract Box (Matching Wetcat CA pill box in black) */}
        <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-md">
          <span className="font-comic text-xs uppercase text-[#111111] tracking-wider font-bold">
            THE EXTREMELY IMPORTANT WORM ADDRESS:
          </span>

          <div className="w-full flex items-center justify-between gap-2 rounded-xl bg-white border-3 border-[#111111] p-2 sm:px-4 sm:py-2.5 shadow-[4px_4px_0px_#111111]">
            <img
              src={slinkLogo}
              alt="SLINK"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border-2 border-[#111111]"
            />
            <span className="font-mono text-xs sm:text-sm text-[#111111] font-bold tracking-tight truncate">
              {SLINK_CONTRACT}
            </span>
            <button
              onClick={handleCopyContract}
              title="Copy Contract Address"
              className="comic-btn px-3 py-1.5 bg-[#111111] text-white hover:bg-[#252525] text-xs font-bold shrink-0 shadow-[2px_2px_0px_#111111]"
            >
              {copied ? 'COPIED!' : 'COPY CA'}
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
