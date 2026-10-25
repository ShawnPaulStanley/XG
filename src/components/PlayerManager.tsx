import React, { useState } from 'react';
import { Player, PositionCategory } from '../types';
import { POSITIONS, getCategoryBadgeClass } from '../data/positions';
import { SAMPLE_ROSTERS } from '../data/samplePlayers';
import {
  Users,
  UserPlus,
  FileText,
  Search,
  Trash2,
  Edit2,
  ListPlus,
  AlertTriangle,
  Shirt,
  Sparkles,
  UserCheck,
  UserX,
  Sliders,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PlayerManagerProps {
  players: Player[];
  onOpenAddModal: () => void;
  onOpenEditModal: (player: Player) => void;
  onOpenBulkModal: () => void;
  onDeletePlayer: (id: string) => void;
  onClearAll: () => void;
  onLoadSample: (sampleIndex: number) => void;
  onGenerate: () => void;
  onToggleAttendance: (id: string) => void;
  onSetAttendanceCount: (count: number) => void;
  onToggleAllAttendance: (present: boolean) => void;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  players,
  onOpenAddModal,
  onOpenEditModal,
  onOpenBulkModal,
  onDeletePlayer,
  onClearAll,
  onLoadSample,
  onGenerate,
  onToggleAttendance,
  onSetAttendanceCount,
  onToggleAllAttendance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | PositionCategory>('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'ATTENDING' | 'ABSENT'>('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const attendingCount = players.filter((p) => p.isAttending !== false).length;

  // Filter logic
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (attendanceFilter === 'ATTENDING' && player.isAttending === false) return false;
    if (attendanceFilter === 'ABSENT' && player.isAttending !== false) return false;

    if (selectedCategory === 'ALL') return true;

    // Check if player has any preferred position in selected category
    return player.preferredPositions.some((posKey) => {
      const posInfo = POSITIONS.find((p) => p.key === posKey);
      return posInfo?.category === selectedCategory;
    });
  });

  return (
    <div className="space-y-6 py-4 font-['Space_Grotesk',sans-serif]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border-4 border-black neo-shadow text-black">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-black stroke-[2.5]" />
            <h1 className="text-2xl font-black uppercase text-black">PLAYER ROSTER</h1>
            <span className="px-2.5 py-0.5 bg-[#CCFF00] text-black border-2 border-black text-xs font-black">
              {players.length} TOTAL
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-700">
            Manage your squad roster & set position preferences
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onLoadSample(0)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#00F0FF] hover:bg-[#CCFF00] text-black font-black text-xs border-2 border-black neo-shadow-sm transition-all cursor-pointer uppercase"
            title="Load or Reset to Custom Squad"
          >
            <span>LOAD SQUAD</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#CCFF00] hover:bg-[#00F0FF] text-black font-black text-xs border-2 border-black neo-btn cursor-pointer uppercase"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ ADD PLAYER</span>
          </button>

          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-100 text-black font-extrabold text-xs border-2 border-black neo-shadow-sm transition-all cursor-pointer uppercase"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>BULK IMPORT</span>
          </button>

          {players.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 bg-[#FF5F56] hover:bg-red-600 text-black border-2 border-black neo-shadow-sm transition-all cursor-pointer"
              title="Clear All Players"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal / Banner */}
      {showClearConfirm && (
        <div className="flex items-center justify-between p-4 bg-[#FF5F56] text-black border-3 border-black neo-shadow font-bold text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-black stroke-[2.5] shrink-0" />
            <span>Remove all {players.length} players from roster?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 bg-white text-black font-black border-2 border-black cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                onClearAll();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 bg-black text-white font-black border-2 border-black cursor-pointer"
            >
              YES, CLEAR ALL
            </button>
          </div>
        </div>
      )}



      {/* Search Bar & Category & Attendance Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-black stroke-[2.5]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search players by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-3 border-black neo-shadow-sm focus:bg-[#00F0FF]/10 text-black text-xs font-bold placeholder-zinc-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* Attendance Filter */}
          <div className="flex items-center bg-white border-3 border-black p-1 neo-shadow-sm">
            <button
              onClick={() => setAttendanceFilter('ALL')}
              className={`px-3 py-1 text-xs font-black uppercase transition-all border border-black ${
                attendanceFilter === 'ALL'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setAttendanceFilter('ATTENDING')}
              className={`px-3 py-1 text-xs font-black uppercase transition-all border border-black ${
                attendanceFilter === 'ATTENDING'
                  ? 'bg-[#CCFF00] text-black'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              PLAYING ({attendingCount})
            </button>
            <button
              onClick={() => setAttendanceFilter('ABSENT')}
              className={`px-3 py-1 text-xs font-black uppercase transition-all border border-black ${
                attendanceFilter === 'ABSENT'
                  ? 'bg-[#FF5F56] text-black'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              OUT ({players.length - attendingCount})
            </button>
          </div>

          {/* Position Category Filter Pills */}
          <div className="flex items-center gap-1">
            {(['ALL', 'GK', 'DEF', 'MID', 'ATT'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 text-xs font-black uppercase whitespace-nowrap transition-all border-2 border-black ${
                  selectedCategory === cat
                    ? 'bg-[#00F0FF] text-black neo-shadow-sm'
                    : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                {cat === 'ALL' ? 'ALL POSITIONS' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Players List Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => {
            const isAttending = player.isAttending !== false;

            return (
              <div
                key={player.id}
                className={`group relative border-3 border-black p-4 flex items-center justify-between gap-3 font-['Space_Grotesk',sans-serif] transition-all ${
                  isAttending
                    ? 'bg-white text-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-zinc-200 text-zinc-600 opacity-70 border-zinc-500'
                }`}
              >
                {/* Left Shirt Icon & Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-10 h-10 bg-[#00F0FF] border-2 border-black flex items-center justify-center text-black font-black text-xs shrink-0 neo-shadow-sm">
                    {player.kitNumber ? (
                      <span>#{player.kitNumber}</span>
                    ) : (
                      <Shirt className="w-5 h-5 text-black stroke-[2.5]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-sm font-black text-black break-words leading-tight uppercase">
                      {player.name}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                      {player.preferredPositions.map((posKey) => {
                        return (
                          <span
                            key={posKey}
                            className="px-1.5 py-0.2 bg-black text-white text-[10px] font-mono font-black border border-black"
                          >
                            {posKey}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Actions: Attendance Switch & Edit / Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAttendance(player.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase border-2 border-black transition-all cursor-pointer ${
                      isAttending
                        ? 'bg-[#CCFF00] text-black neo-shadow-sm'
                        : 'bg-zinc-300 text-black'
                    }`}
                    title={isAttending ? 'Click to mark Absent' : 'Click to mark Present'}
                  >
                    {isAttending ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>PLAYING</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>OUT</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditModal(player)}
                      className="p-1.5 bg-white hover:bg-[#00F0FF] text-black border border-black cursor-pointer"
                      title="Edit player"
                    >
                      <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => onDeletePlayer(player.id)}
                      className="p-1.5 bg-[#FF5F56] hover:bg-red-600 text-black border border-black cursor-pointer"
                      title="Delete player"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-6 bg-white border-4 border-black neo-shadow p-8 text-black">
          <div className="w-16 h-16 mx-auto bg-[#CCFF00] border-3 border-black neo-shadow flex items-center justify-center text-black">
            <Users className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-black uppercase text-black">NO PLAYERS FOUND</h3>
            <p className="text-xs font-bold text-zinc-600">
              {searchTerm
                ? 'No players match your search filter.'
                : 'Add players manually or load sample roster.'}
            </p>
          </div>

          {!searchTerm && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-black text-xs border-2 border-black neo-btn cursor-pointer uppercase"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>+ ADD FIRST PLAYER</span>
              </button>

              <button
                onClick={() => onLoadSample(0)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#00F0FF] text-black font-black text-xs border-2 border-black neo-shadow-sm hover:bg-[#CCFF00] cursor-pointer uppercase"
              >
                <ListPlus className="w-4 h-4 stroke-[2.5]" />
                <span>LOAD CUSTOM SQUAD</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Action when players exist */}
      {players.length >= 2 && (
        <div className="sticky bottom-6 flex justify-center pt-4 pointer-events-none">
          <button
            onClick={onGenerate}
            className="pointer-events-auto flex items-center gap-2.5 px-6 py-3.5 bg-[#CCFF00] text-black font-black text-sm uppercase tracking-wider border-3 border-black neo-btn cursor-pointer shadow-2xl"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            <span>GENERATE TEAMS ({attendingCount} PLAYERS)</span>
          </button>
        </div>
      )}
    </div>
  );
};
