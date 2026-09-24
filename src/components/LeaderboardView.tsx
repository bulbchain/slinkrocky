import React, { useState } from 'react';
import { Trophy, Search, Sparkles, Crown, Medal, Award } from 'lucide-react';
import { sounds } from '../audio';
import {
  SlinkChampion,
  SlinkSpeedy,
  SlinkHungry,
  SoundBurst,
} from './RetroCartoonCharacters';

interface LeaderboardViewProps {
  playerCallsign: string;
  playerScore: number;
  playerKills: number;
}

interface WormChamp {
  rank: number;
  callsign: string;
  badge: string;
  score: number;
  chomps: number;
  bountySol: number;
  color: string;
  motto: string;
}

const CHAMPIONS: WormChamp[] = [
  {
    rank: 1,
    callsign: 'BARNABY_BOB',
    badge: 'GRAND APPLE KING',
    score: 18450,
    chomps: 24,
    bountySol: 4.85,
    color: '#FA824C',
    motto: '"Apples are for champions, not sidekicks!"',
  },
  {
    rank: 2,
    callsign: 'CAPTAIN_COIL',
    badge: 'SPEED DEMON',
    score: 15200,
    chomps: 19,
    bountySol: 3.20,
    color: '#78C0E0',
    motto: '"Zip fast, loop tight, never look back."',
  },
  {
    rank: 3,
    callsign: 'SLINKY_SUE',
    badge: 'MEADOW QUEEN',
    score: 12900,
    chomps: 15,
    bountySol: 2.10,
    color: '#70A288',
    motto: '"Wiggling with elegance since 1974."',
  },
  {
    rank: 4,
    callsign: 'ZIGGY_ZAG',
    badge: 'TRICKSTER',
    score: 9800,
    chomps: 11,
    bountySol: 1.45,
    color: '#FFD13B',
    motto: '"Bet you didn\'t see that left turn coming!"',
  },
  {
    rank: 5,
    callsign: 'CHUBBY_CHEX',
    badge: 'HEAVYWEIGHT',
    score: 8400,
    chomps: 9,
    bountySol: 1.15,
    color: '#E63946',
    motto: '"Just one more Honeycrisp, please."',
  },
  {
    rank: 6,
    callsign: 'NOODLE_NICK',
    badge: 'LONG TAIL',
    score: 7200,
    chomps: 8,
    bountySol: 0.90,
    color: '#5C3D2E',
    motto: '"My tail is currently in three different zip codes."',
  },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  playerCallsign,
  playerScore,
  playerKills,
}) => {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'free'>('all');
  const [search, setSearch] = useState('');

  const filteredChamps = CHAMPIONS.filter((c) =>
    c.callsign.toLowerCase().includes(search.toLowerCase()) ||
    c.badge.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] mx-auto">
          <Trophy className="w-4 h-4 text-[#1E1B18]" />
          <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
            THE COMIC BOOK HALL OF FAME
          </span>
        </div>

        <h1 className="font-comic text-4xl sm:text-6xl uppercase text-[#1E1B18] tracking-wide">
          MEADOW LEADERBOARD
        </h1>

        <p className="font-body text-base text-[#5C3D2E] font-medium leading-relaxed max-w-2xl mx-auto">
          Behold the mightiest, wobbliest, and hungriest worms of all time! Can you take down Barnaby Bob?
        </p>
      </div>

      {/* PODIUM OF TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto w-full">
        {/* #2 Rank */}
        <div className="comic-card bg-[#78C0E0] p-6 text-center order-2 md:order-1 flex flex-col items-center">
          <div className="p-2 bg-white rounded-2xl border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] mb-2">
            <SlinkSpeedy size={64} />
          </div>
          <span className="font-comic text-lg uppercase bg-white px-3 py-0.5 rounded border-2 border-[#1E1B18] text-[#1E1B18]">
            SILVER MEDAL #02
          </span>
          <h3 className="font-comic text-2xl uppercase text-[#1E1B18] mt-2">
            CAPTAIN_COIL
          </h3>
          <span className="font-body text-xs font-bold text-[#1E1B18]">
            15,200 PTS · 19 CHOMPS
          </span>
          <div className="mt-3 font-comic text-xs bg-[#FFD13B] px-2 py-1 rounded border border-[#1E1B18]">
            PRIZE: 3.20 SOL
          </div>
        </div>

        {/* #1 Rank (Center, taller) */}
        <div className="comic-card bg-[#FFD13B] p-7 text-center order-1 md:order-2 flex flex-col items-center -translate-y-2 border-4 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18]">
          <div className="mb-2">
            <SoundBurst text="KING!" color="#FA824C" />
          </div>
          <div className="p-3 bg-white rounded-2xl border-3 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] mb-2">
            <SlinkChampion size={80} />
          </div>
          <span className="font-comic text-xl uppercase bg-[#FA824C] text-white px-3 py-0.5 rounded border-2 border-[#1E1B18]">
            ★ GOLD CROWN #01 ★
          </span>
          <h3 className="font-comic text-3xl uppercase text-[#1E1B18] mt-2">
            BARNABY_BOB
          </h3>
          <span className="font-body text-sm font-bold text-[#1E1B18]">
            18,450 PTS · 24 CHOMPS
          </span>
          <div className="mt-3 font-comic text-sm bg-white px-3 py-1 rounded border-2 border-[#1E1B18]">
            GRAND PRIZE: 4.85 SOL
          </div>
        </div>

        {/* #3 Rank */}
        <div className="comic-card bg-[#70A288] p-6 text-center order-3 md:order-3 flex flex-col items-center text-white">
          <div className="p-2 bg-white rounded-2xl border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] mb-2">
            <SlinkHungry size={64} />
          </div>
          <span className="font-comic text-lg uppercase bg-white px-3 py-0.5 rounded border-2 border-[#1E1B18] text-[#1E1B18]">
            BRONZE MEDAL #03
          </span>
          <h3 className="font-comic text-2xl uppercase text-[#1E1B18] mt-2">
            SLINKY_SUE
          </h3>
          <span className="font-body text-xs font-bold text-[#1E1B18]">
            12,900 PTS · 15 CHOMPS
          </span>
          <div className="mt-3 font-comic text-xs bg-[#FFD13B] text-[#1E1B18] px-2 py-1 rounded border border-[#1E1B18]">
            PRIZE: 2.10 SOL
          </div>
        </div>
      </div>

      {/* CONTROLS & SEARCH */}
      <div className="comic-card bg-[#FFFDF8] p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilter('all');
                sounds.playBeep(600);
              }}
              className={`comic-btn text-xs uppercase py-1.5 px-3 ${
                filter === 'all' ? 'bg-[#FFD13B] text-[#1E1B18]' : 'bg-[#FFF8ED] text-[#5C3D2E]'
              }`}
            >
              ALL-TIME LEGENDS
            </button>
            <button
              onClick={() => {
                setFilter('weekly');
                sounds.playBeep(640);
              }}
              className={`comic-btn text-xs uppercase py-1.5 px-3 ${
                filter === 'weekly' ? 'bg-[#FFD13B] text-[#1E1B18]' : 'bg-[#FFF8ED] text-[#5C3D2E]'
              }`}
            >
              THIS WEEK'S EDITION
            </button>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-[#FFF8ED] border-2 border-[#1E1B18] rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#1E1B18] w-full sm:w-64">
            <Search className="w-4 h-4 text-[#5C3D2E]" />
            <input
              type="text"
              placeholder="Search worm pilot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-comic text-xs text-[#1E1B18] placeholder-[#5C3D2E]/60 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* FULL LEADERBOARD TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs sm:text-sm">
            <thead>
              <tr className="font-comic text-sm uppercase text-[#5C3D2E] border-b-2 border-[#1E1B18]/20">
                <th className="p-3">RANK</th>
                <th className="p-3">WORM CALLSIGN</th>
                <th className="p-3">TITLE</th>
                <th className="p-3">MASS / SCORE</th>
                <th className="p-3">CHOMPS</th>
                <th className="p-3">BOUNTY</th>
                <th className="p-3 text-right">FAMOUS MOTTO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1B18]/10 font-medium text-[#1E1B18]">
              {filteredChamps.map((champ) => (
                <tr key={champ.rank} className="hover:bg-[#FFF8ED] transition-colors">
                  <td className="p-3 font-comic text-xl text-[#FA824C]">
                    #{champ.rank.toString().padStart(2, '0')}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: champ.color }}
                        className="w-3.5 h-3.5 rounded-full border border-[#1E1B18]"
                      />
                      <strong className="font-bold">{champ.callsign}</strong>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-comic text-[11px] px-2 py-0.5 rounded bg-[#FFD13B] border border-[#1E1B18]">
                      {champ.badge}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{champ.score.toLocaleString()}</td>
                  <td className="p-3 text-[#E63946] font-bold">{champ.chomps} KILLS</td>
                  <td className="p-3 font-bold text-[#FA824C]">{champ.bountySol} SOL</td>
                  <td className="p-3 text-right text-xs italic text-[#5C3D2E]">
                    {champ.motto}
                  </td>
                </tr>
              ))}

              {/* Current User Row */}
              <tr className="bg-[#FFF0D6] border-2 border-[#1E1B18] font-bold">
                <td className="p-3 font-comic text-xl text-[#1E1B18]">#04</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FA824C] border border-[#1E1B18]" />
                    <span className="text-[#FA824C]">{playerCallsign || 'WOBBLY_JOE'}</span>
                    <span className="font-comic text-[10px] px-1.5 py-0.5 bg-[#FA824C] text-white rounded border border-[#1E1B18]">
                      YOU!
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="font-comic text-[11px] px-2 py-0.5 rounded bg-[#78C0E0] text-[#1E1B18] border border-[#1E1B18]">
                    CHALLENGER
                  </span>
                </td>
                <td className="p-3 font-bold">{playerScore.toLocaleString()}</td>
                <td className="p-3 text-[#E63946] font-bold">{playerKills} KILLS</td>
                <td className="p-3 font-bold text-[#FA824C]">0.75 SOL</td>
                <td className="p-3 text-right text-xs italic text-[#5C3D2E]">
                  "Watch my wiggle!"
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
