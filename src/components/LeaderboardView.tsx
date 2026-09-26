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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4F000] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mx-auto">
          <Trophy className="w-4 h-4 text-[#111111]" />
          <span className="font-comic text-xs uppercase tracking-wider text-[#111111] font-black">
            THE COMIC BOOK HALL OF FAME
          </span>
        </div>

        <h1 className="font-comic text-4xl sm:text-6xl uppercase text-[#111111] tracking-wide">
          MEADOW LEADERBOARD
        </h1>

        <p className="font-body text-base text-[#555555] font-semibold leading-relaxed max-w-2xl mx-auto">
          Behold the mightiest, wobbliest, and hungriest creatures of all time! Can you take down Barnaby Bob?
        </p>
      </div>

      {/* PODIUM OF TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto w-full">
        {/* #2 Rank */}
        <div className="comic-card bg-[#55B3F3] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 text-center order-2 md:order-1 flex flex-col items-center rounded-2xl">
          <div className="p-2 bg-white rounded-2xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-2">
            <SlinkSpeedy size={64} />
          </div>
          <span className="font-comic text-lg uppercase bg-white px-3 py-0.5 rounded-full border-2 border-[#111111] text-[#111111] font-black">
            SILVER MEDAL #02
          </span>
          <h3 className="font-comic text-2xl uppercase text-[#111111] mt-2">
            CAPTAIN_COIL
          </h3>
          <span className="font-body text-xs font-black text-[#111111]">
            15,200 PTS · 19 CHOMPS
          </span>
          <div className="mt-3 font-comic text-xs bg-[#B4F000] text-[#111111] font-black px-3 py-1 rounded-full border-2 border-[#111111]">
            PRIZE: 3.20 SOL
          </div>
        </div>

        {/* #1 Rank (Center, taller) */}
        <div className="comic-card bg-[#FF5D8F] p-7 text-center order-1 md:order-2 flex flex-col items-center -translate-y-2 border-4 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-2xl">
          <div className="mb-2">
            <SoundBurst text="KING!" color="#B4F000" />
          </div>
          <div className="p-3 bg-white rounded-2xl border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mb-2">
            <SlinkChampion size={80} />
          </div>
          <span className="font-comic text-xl uppercase bg-[#B4F000] text-[#111111] font-black px-4 py-0.5 rounded-full border-2 border-[#111111]">
            ★ GOLD CROWN #01 ★
          </span>
          <h3 className="font-comic text-3xl uppercase text-white drop-shadow-[2px_2px_0px_#111111] mt-2">
            BARNABY_BOB
          </h3>
          <span className="font-body text-sm font-black text-white">
            18,450 PTS · 24 CHOMPS
          </span>
          <div className="mt-3 font-comic text-sm bg-white text-[#111111] font-black px-4 py-1 rounded-full border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
            GRAND PRIZE: 4.85 SOL
          </div>
        </div>

        {/* #3 Rank */}
        <div className="comic-card bg-[#B4F000] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 text-center order-3 md:order-3 flex flex-col items-center rounded-2xl">
          <div className="p-2 bg-white rounded-2xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-2">
            <SlinkHungry size={64} />
          </div>
          <span className="font-comic text-lg uppercase bg-white px-3 py-0.5 rounded-full border-2 border-[#111111] text-[#111111] font-black">
            BRONZE MEDAL #03
          </span>
          <h3 className="font-comic text-2xl uppercase text-[#111111] mt-2">
            SLINKY_SUE
          </h3>
          <span className="font-body text-xs font-black text-[#111111]">
            12,900 PTS · 15 CHOMPS
          </span>
          <div className="mt-3 font-comic text-xs bg-[#55B3F3] text-[#111111] font-black px-3 py-1 rounded-full border-2 border-[#111111]">
            PRIZE: 2.10 SOL
          </div>
        </div>
      </div>

      {/* CONTROLS & SEARCH */}
      <div className="comic-card bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilter('all');
                sounds.playBeep(600);
              }}
              className={`comic-btn text-xs uppercase py-2 px-4 rounded-xl border-2 border-[#111111] font-black ${
                filter === 'all' ? 'bg-[#B4F000] text-[#111111]' : 'bg-[#E8E2D2] text-[#111111]'
              }`}
            >
              ALL-TIME LEGENDS
            </button>
            <button
              onClick={() => {
                setFilter('weekly');
                sounds.playBeep(640);
              }}
              className={`comic-btn text-xs uppercase py-2 px-4 rounded-xl border-2 border-[#111111] font-black ${
                filter === 'weekly' ? 'bg-[#55B3F3] text-[#111111]' : 'bg-[#E8E2D2] text-[#111111]'
              }`}
            >
              THIS WEEK'S EDITION
            </button>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-[#F4EEDF] border-2 border-[#111111] rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#111111] w-full sm:w-64">
            <Search className="w-4 h-4 text-[#111111]" />
            <input
              type="text"
              placeholder="Search worm pilot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-comic text-xs text-[#111111] placeholder-[#777777] focus:outline-none w-full font-bold"
            />
          </div>
        </div>

        {/* FULL LEADERBOARD TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs sm:text-sm">
            <thead>
              <tr className="font-comic text-sm uppercase text-[#111111] border-b-2 border-[#111111]">
                <th className="p-3">RANK</th>
                <th className="p-3">CALLSIGN</th>
                <th className="p-3">TITLE</th>
                <th className="p-3">MASS / SCORE</th>
                <th className="p-3">CHOMPS</th>
                <th className="p-3">BOUNTY</th>
                <th className="p-3 text-right">FAMOUS MOTTO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15 font-semibold text-[#111111]">
              {filteredChamps.map((champ) => (
                <tr key={champ.rank} className="hover:bg-[#F4EEDF] transition-colors">
                  <td className="p-3 font-comic text-xl text-[#FF5D8F] font-black">
                    #{champ.rank.toString().padStart(2, '0')}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: champ.color }}
                        className="w-3.5 h-3.5 rounded-full border-2 border-[#111111]"
                      />
                      <strong className="font-bold">{champ.callsign}</strong>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-comic text-[11px] px-2.5 py-0.5 rounded-full bg-[#B4F000] border border-[#111111] font-black">
                      {champ.badge}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{champ.score.toLocaleString()}</td>
                  <td className="p-3 text-[#FF5D8F] font-black">{champ.chomps} KILLS</td>
                  <td className="p-3 font-bold text-[#111111]">{champ.bountySol} SOL</td>
                  <td className="p-3 text-right text-xs italic text-[#666666]">
                    {champ.motto}
                  </td>
                </tr>
              ))}

              {/* Current User Row */}
              <tr className="bg-[#B4F000]/25 border-2 border-[#111111] font-bold">
                <td className="p-3 font-comic text-xl text-[#111111]">#04</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#55B3F3] border-2 border-[#111111]" />
                    <span className="text-[#111111] font-black">{playerCallsign || 'WOBBLY_JOE'}</span>
                    <span className="font-comic text-[10px] px-2 py-0.5 bg-[#FF5D8F] text-white rounded-full border border-[#111111] font-black">
                      YOU!
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="font-comic text-[11px] px-2.5 py-0.5 rounded-full bg-[#55B3F3] text-[#111111] border border-[#111111] font-black">
                    CHALLENGER
                  </span>
                </td>
                <td className="p-3 font-black">{playerScore.toLocaleString()}</td>
                <td className="p-3 text-[#FF5D8F] font-black">{playerKills} KILLS</td>
                <td className="p-3 font-black text-[#111111]">0.75 SOL</td>
                <td className="p-3 text-right text-xs italic text-[#555555]">
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
