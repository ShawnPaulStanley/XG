import React from 'react';
import { ActiveTab, Player } from '../types';
import { Users, ArrowRight, Shirt } from 'lucide-react';

interface HomeTabProps {
  players: Player[];
  setActiveTab: (tab: ActiveTab) => void;
  onGenerate: () => void;
  hasResult: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  players,
  setActiveTab,
  onGenerate,
  hasResult,
}) => {
  const attendingCount = players.filter((p) => p.isAttending !== false).length;

  return (
    <div className="min-h-[65vh] flex items-center justify-center py-10 px-4">
      {/* Neo-Brutalist Main Card Window */}
      <div className="w-full max-w-xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-0 text-black font-['Space_Grotesk',sans-serif]">
        {/* Content Area */}
        <div className="p-8 sm:p-10 space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
              XG <span className="bg-[#CCFF00] px-2.5 py-0.5 border-3 border-black inline-block">MATCH UP</span>
            </h1>

            <div>
              <span className="font-mono text-xs text-black bg-zinc-100 px-3 py-1 border-2 border-black inline-block font-bold neo-shadow-sm uppercase">
                {attendingCount} ATTENDING PLAYERS REGISTERED
              </span>
            </div>
          </div>

          <div className="space-y-3.5 pt-2 max-w-sm mx-auto">
            <button
              onClick={onGenerate}
              disabled={attendingCount < 2}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-black text-base uppercase tracking-wider neo-btn cursor-pointer ${
                attendingCount >= 2
                  ? 'bg-[#CCFF00] text-black hover:bg-[#00F0FF]'
                  : 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-70'
              }`}
            >
              <span>MATCH UP</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-[#00F0FF] text-black font-extrabold text-sm border-3 border-black neo-shadow-sm transition-all cursor-pointer uppercase tracking-wider"
            >
              <Users className="w-4 h-4 stroke-[2.5]" />
              <span>MANAGE PLAYERS ({players.length})</span>
            </button>

            <button
              onClick={() => setActiveTab(hasResult ? 'pitch' : 'teams')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00F0FF] hover:bg-[#CCFF00] text-black font-black text-sm border-3 border-black neo-shadow-sm transition-all cursor-pointer uppercase tracking-wider"
            >
              <Shirt className="w-4 h-4 stroke-[2.5]" />
              <span>VIEW PITCH LINEUP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
