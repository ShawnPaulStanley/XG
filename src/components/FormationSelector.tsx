import React from 'react';
import { Formation, ActiveTab } from '../types';
import { Grid3X3, Sparkles, Users, Shield, Check } from 'lucide-react';

interface FormationSelectorProps {
  selectedFormation: Formation;
  onSelectFormation: (formation: Formation) => void;
  playerCount: number;
  setActiveTab: (tab: ActiveTab) => void;
  onGenerate: () => void;
}

export const FormationSelector: React.FC<FormationSelectorProps> = ({
  playerCount,
  onGenerate,
}) => {
  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Custom Fluid Squad Formation</h1>
            <p className="text-xs text-zinc-400">
              All attending players are automatically included on the pitch with no bench warmers!
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Box */}
      <div className="bg-zinc-900/80 p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 font-black text-xs border border-emerald-800">
              CUSTOM FLUID
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white">All-Inclusive Pitch Layout</h3>
              <p className="text-xs text-zinc-400">
                Automatically adapts to your attending player count ({playerCount} players active)
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" /> Active Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> 100% Participation
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Every single player selected as playing today will be placed on the field pitch.
            </p>
          </div>

          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Flexible Teams
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Even if player counts are odd (e.g. 9v8), teams are divided evenly with all players assigned.
            </p>
          </div>

          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
            <div className="font-bold text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Smart Role Positioning
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Goalkeepers, defenders, midfielders, and forwards are arranged according to preferred roles.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onGenerate}
            disabled={playerCount < 2}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base shadow-2xl transition-all border ${
              playerCount >= 2
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-emerald-950 hover:scale-[1.02] active:scale-[0.98] border-emerald-400/30'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-700/50'
            }`}
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Generate Teams for {playerCount} Players</span>
          </button>
        </div>
      </div>
    </div>
  );
};

