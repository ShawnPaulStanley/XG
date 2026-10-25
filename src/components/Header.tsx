import React from 'react';
import { ActiveTab, DivisionResult } from '../types';
import {
  Users,
  LayoutGrid,
  Shirt,
  Trophy,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  playerCount: number;
  hasResult: boolean;
  divisionResult?: DivisionResult | null;
  onGenerate: () => void;
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  playerCount,
  hasResult,
  divisionResult,
  onGenerate,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'HOME', icon: <Trophy className="w-4 h-4" /> },
    { id: 'players', label: 'PLAYERS', icon: <Users className="w-4 h-4" />, badge: playerCount },
    { id: 'teams', label: 'TEAMS', icon: <Shirt className="w-4 h-4" /> },
    { id: 'pitch', label: 'PITCH VIEW', icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white border-b-4 border-black font-['Space_Grotesk',sans-serif]">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center cursor-pointer group select-none"
          >
            <span className="font-black text-2xl sm:text-3xl tracking-wider text-white uppercase group-hover:text-[#CCFF00] transition-colors">
              XG
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 font-extrabold text-xs tracking-wider border-2 border-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#CCFF00] text-black neo-shadow-sm'
                      : 'bg-white text-black hover:bg-[#00FF66]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-black border border-black ${
                        isActive ? 'bg-black text-white' : 'bg-[#CCFF00] text-black'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onGenerate}
              disabled={playerCount < 2}
              className={`flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-wider neo-btn cursor-pointer ${
                playerCount >= 2
                  ? 'bg-[#CCFF00] text-black hover:bg-[#00FF66]'
                  : 'bg-zinc-400 text-zinc-700 cursor-not-allowed opacity-60'
              }`}
            >
              <span>MATCH UP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar px-2 py-2 bg-black border-t border-zinc-800 gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black ${
                isActive
                  ? 'bg-[#CCFF00] text-black neo-shadow-sm'
                  : 'bg-white text-black'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-black text-white font-black border border-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
