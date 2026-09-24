import React, { useState, useEffect } from 'react';
import { TelemetryLogItem } from '../types';
import { Newspaper, Trophy, Sparkles, Award } from 'lucide-react';
import { SlinkChampion, SlinkPeeking, SoundBurst } from './RetroCartoonCharacters';

interface LiveTelemetryProps {
  playerCallsign: string;
  playerScore: number;
  playerKills: number;
}

const INITIAL_LOGS: TelemetryLogItem[] = [
  {
    id: '1',
    killer: 'WOBBLY_JOE',
    victim: 'CURLY_PETE',
    method: 'with a sneaky tail loop',
    lumensReaped: 820,
    timeAgo: '3s AGO',
  },
  {
    id: '2',
    killer: 'BARNABY_BOB',
    victim: 'NOODLE_NICK',
    method: 'with a high-speed apple dash',
    lumensReaped: 1240,
    timeAgo: '12s AGO',
  },
  {
    id: '3',
    killer: 'CAPTAIN_COIL',
    victim: 'DIZZY_DAN',
    method: 'near the fence border',
    lumensReaped: 1650,
    timeAgo: '24s AGO',
  },
];

const MOCK_KILLERS = [
  'WOBBLY_JOE',
  'BARNABY_BOB',
  'CAPTAIN_COIL',
  'SLINKY_SUE',
  'ZIGGY_ZAG',
  'CHUBBY_CHEX',
  'WORMINGTON',
];

const MOCK_VICTIMS = [
  'CURLY_PETE',
  'NOODLE_NICK',
  'DIZZY_DAN',
  'SPEEDY_SAM',
  'TINY_TIM',
  'BOUNCY_BEN',
];

const MOCK_METHODS = [
  'with a cheeky cartoon coil',
  'over the last Honeycrisp apple',
  'after an epic high-speed wiggle',
  'with a sneaky tail interception',
  'near the sunny dandelion patch',
];

export const LiveTelemetry: React.FC<LiveTelemetryProps> = ({
  playerCallsign,
  playerScore,
  playerKills,
}) => {
  const [logs, setLogs] = useState<TelemetryLogItem[]>(INITIAL_LOGS);
  const [totalApplesEaten, setTotalApplesEaten] = useState(148200);

  useEffect(() => {
    const timer = setInterval(() => {
      const killer = MOCK_KILLERS[Math.floor(Math.random() * MOCK_KILLERS.length)];
      const victim = MOCK_VICTIMS[Math.floor(Math.random() * MOCK_VICTIMS.length)];
      const method = MOCK_METHODS[Math.floor(Math.random() * MOCK_METHODS.length)];
      const reaped = Math.floor(Math.random() * 800) + 250;

      const newEntry: TelemetryLogItem = {
        id: Date.now().toString(),
        killer,
        victim,
        method,
        lumensReaped: reaped,
        timeAgo: 'JUST NOW',
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 3)]);
      setTotalApplesEaten((prev) => prev + Math.floor(reaped / 10));
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-3 border-[#1E1B18] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#78C0E0] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] mb-2">
            <Newspaper className="h-4 w-4 text-[#1E1B18]" />
            <span className="font-comic text-xs uppercase tracking-wider text-[#1E1B18]">
              THE DAILY SLINK GAZETTE
            </span>
          </div>

          <h2 className="font-comic text-4xl sm:text-5xl uppercase text-[#1E1B18] tracking-wide">
            LIVE MEADOW DISPATCH
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#70A288] border border-[#1E1B18] animate-pulse" />
          <span className="font-comic text-sm uppercase text-[#1E1B18]">
            {totalApplesEaten.toLocaleString()} APPLES CHOMPED TODAY!
          </span>
        </div>
      </div>

      {/* Leaderboard + Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* WORM LEADERBOARD: PHYSICAL PRINTED PANEL */}
        <div className="lg:col-span-8 comic-card bg-[#FFFDF8] overflow-hidden p-0">
          <div className="p-4 bg-[#FFD13B] border-b-3 border-[#1E1B18] flex items-center justify-between">
            <span className="font-comic text-lg uppercase text-[#1E1B18] tracking-wide flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#1E1B18]" />
              HONOR ROLL OF LONGEST WORMS
            </span>
            <span className="font-comic text-xs uppercase bg-white px-2 py-0.5 rounded border border-[#1E1B18]">
              MEADOW SECTOR #1
            </span>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left font-body text-xs sm:text-sm">
              <thead>
                <tr className="font-comic text-sm uppercase text-[#5C3D2E] border-b-2 border-[#1E1B18]/20">
                  <th className="p-3">RANK</th>
                  <th className="p-3">WORM</th>
                  <th className="p-3">SEGMENTS</th>
                  <th className="p-3">CHOMPS</th>
                  <th className="p-3">BOUNTY</th>
                  <th className="p-3 text-right">TITLE</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#1E1B18]/10 font-medium text-[#1E1B18]">
                {/* Row 1 */}
                <tr className="hover:bg-[#FFF8ED] transition-colors">
                  <td className="p-3 font-comic text-lg text-[#FA824C]">#01</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FA824C] border border-[#1E1B18]" />
                      <span className="font-bold">BARNABY_BOB</span>
                      <span className="font-comic text-[10px] px-1.5 py-0.5 bg-[#FFD13B] text-[#1E1B18] rounded border border-[#1E1B18]">
                        KING
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-bold">18,450</td>
                  <td className="p-3 font-bold text-[#E63946]">24 CHOMPS</td>
                  <td className="p-3 font-bold text-[#FA824C]">4.85 SOL</td>
                  <td className="p-3 text-right">
                    <span className="font-comic text-xs px-2 py-0.5 rounded bg-[#FFD13B] border border-[#1E1B18]">
                      CHAMPION
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-[#FFF8ED] transition-colors">
                  <td className="p-3 font-comic text-lg text-[#5C3D2E]">#02</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#78C0E0] border border-[#1E1B18]" />
                      <span className="font-bold">CAPTAIN_COIL</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold">15,200</td>
                  <td className="p-3 font-bold text-[#E63946]">19 CHOMPS</td>
                  <td className="p-3 font-bold text-[#FA824C]">3.20 SOL</td>
                  <td className="p-3 text-right">
                    <span className="font-comic text-xs px-2 py-0.5 rounded bg-[#78C0E0] border border-[#1E1B18]">
                      SPEEDY
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-[#FFF8ED] transition-colors">
                  <td className="p-3 font-comic text-lg text-[#5C3D2E]">#03</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#70A288] border border-[#1E1B18]" />
                      <span className="font-bold">SLINKY_SUE</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold">12,900</td>
                  <td className="p-3 font-bold text-[#E63946]">15 CHOMPS</td>
                  <td className="p-3 font-bold text-[#FA824C]">2.10 SOL</td>
                  <td className="p-3 text-right">
                    <span className="font-comic text-xs px-2 py-0.5 rounded bg-[#70A288] text-white border border-[#1E1B18]">
                      COILER
                    </span>
                  </td>
                </tr>

                {/* Current Player Row */}
                <tr className="bg-[#FFF0D6] border-2 border-[#1E1B18] font-bold">
                  <td className="p-3 font-comic text-lg text-[#1E1B18]">#04</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FFD13B] border border-[#1E1B18]" />
                      <span className="text-[#FA824C]">{playerCallsign || 'WOBBLY_JOE'}</span>
                      <span className="font-comic text-[10px] px-1.5 py-0.5 bg-[#FA824C] text-white rounded border border-[#1E1B18]">
                        YOU!
                      </span>
                    </div>
                  </td>
                  <td className="p-3">{playerScore.toLocaleString()}</td>
                  <td className="p-3 text-[#E63946]">{playerKills} CHOMPS</td>
                  <td className="p-3 text-[#FA824C]">0.75 SOL</td>
                  <td className="p-3 text-right">
                    <span className="font-comic text-xs px-2 py-0.5 rounded bg-[#FA824C] text-white border border-[#1E1B18]">
                      CHALLENGER
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* LIVE CHOMP TICKER (4 cols) */}
        <div className="lg:col-span-4 comic-card bg-[#FFFDF8] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-[#1E1B18] pb-3">
            <span className="font-comic text-xl uppercase text-[#1E1B18] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FA824C]" />
              MEADOW WIRE
            </span>
            <SoundBurst text="NEWS!" color="#FFD13B" className="text-xs" />
          </div>

          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border-2 border-[#1E1B18] bg-[#FFF8ED] shadow-[2px_2px_0px_#1E1B18] flex flex-col gap-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-comic text-xs uppercase text-[#FA824C]">
                    {log.killer}
                  </span>
                  <span className="font-body text-[10px] font-bold text-[#5C3D2E]">
                    {log.timeAgo}
                  </span>
                </div>
                <p className="font-body text-xs text-[#1E1B18] leading-tight">
                  outmaneuvered <strong className="text-[#5C3D2E]">{log.victim}</strong> {log.method}!
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] font-comic">
                  <span className="text-[#70A288]">REAPED: +{log.lumensReaped} PTS</span>
                  <span className="text-[#E63946] font-bold">POOF!</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
