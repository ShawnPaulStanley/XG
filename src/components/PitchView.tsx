import React, { useState, useRef } from 'react';
import {
  DivisionResult,
  AssignedPlayer,
  Player,
  PositionKey,
  TacticalSlot,
} from '../types';
import { formatTeamsForWhatsApp, formatTeamsPlainText } from '../utils/whatsappFormatter';
import { POSITIONS, getCategoryBadgeClass } from '../data/positions';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Shuffle,
  Download,
  Copy,
  Check,
  Shirt,
  ArrowUpDown,
  RefreshCw,
  Share2,
  Trophy,
} from 'lucide-react';

interface PitchViewProps {
  divisionResult: DivisionResult | null;
  onRandomizeAgain: () => void;
  onShuffle: () => void;
  onUpdateResult: (newResult: DivisionResult) => void;
  onOpenShareModal: () => void;
}

export const PitchView: React.FC<PitchViewProps> = ({
  divisionResult,
  onRandomizeAgain,
  onShuffle,
  onUpdateResult,
  onOpenShareModal,
}) => {
  const pitchRef = useRef<HTMLDivElement>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState<{
    teamId: 'teamA' | 'teamB';
    playerId: string;
  } | null>(null);

  if (!divisionResult) {
    return (
      <div className="py-20 text-center space-y-4 bg-zinc-900/40 rounded-3xl border border-zinc-800 p-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <Shirt className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Teams Generated Yet</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Add players and select a formation, then click "Generate Teams" to view your football pitch lineups.
        </p>
      </div>
    );
  }

  const { teamA, teamB, formation } = divisionResult;

  // Trigger celebration confetti on view load if recently generated
  const handleCopyWhatsApp = () => {
    const text = formatTeamsForWhatsApp(divisionResult);
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  // Export Pitch PNG
  const handleExportPNG = async () => {
    if (!pitchRef.current) return;
    try {
      setExporting(true);
      const node = pitchRef.current;
      const width = node.offsetWidth;
      const height = node.offsetHeight;

      const exportOptions = {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
        width,
        height,
        style: {
          margin: '0',
          transform: 'none',
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
        },
      };

      // Warmup pass + final render to prevent webfont/offset shifts
      await toPng(node, exportOptions);
      const dataUrl = await toPng(node, exportOptions);

      const link = document.createElement('a');
      link.download = `Football_Teams_${formation.name}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export pitch image', err);
    } finally {
      setExporting(false);
    }
  };

  // Tap-to-swap logic between two players
  const handlePlayerTap = (teamId: 'teamA' | 'teamB', playerId: string) => {
    if (!selectedPlayerForSwap) {
      // First selection
      setSelectedPlayerForSwap({ teamId, playerId });
      return;
    }

    // Second selection -> Perform Swap!
    if (
      selectedPlayerForSwap.teamId === teamId &&
      selectedPlayerForSwap.playerId === playerId
    ) {
      // Deselect if same player tapped
      setSelectedPlayerForSwap(null);
      return;
    }

    const sourceTeamId = selectedPlayerForSwap.teamId;
    const sourcePlayerId = selectedPlayerForSwap.playerId;

    // Deep clone state for mutation
    const newTeamA = JSON.parse(JSON.stringify(teamA));
    const newTeamB = JSON.parse(JSON.stringify(teamB));

    const sourceTeam = sourceTeamId === 'teamA' ? newTeamA : newTeamB;
    const targetTeam = teamId === 'teamA' ? newTeamA : newTeamB;

    // Find assigned indexes
    const sourceIdx = sourceTeam.assignedPlayers.findIndex(
      (ap: AssignedPlayer) => ap.player.id === sourcePlayerId
    );
    const targetIdx = targetTeam.assignedPlayers.findIndex(
      (ap: AssignedPlayer) => ap.player.id === playerId
    );

    if (sourceIdx !== -1 && targetIdx !== -1) {
      // Swap assigned positions/slots
      const tempPlayer = sourceTeam.assignedPlayers[sourceIdx].player;
      sourceTeam.assignedPlayers[sourceIdx].player = targetTeam.assignedPlayers[targetIdx].player;
      targetTeam.assignedPlayers[targetIdx].player = tempPlayer;

      onUpdateResult({
        ...divisionResult,
        teamA: newTeamA,
        teamB: newTeamB,
      });

      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }

    setSelectedPlayerForSwap(null);
  };

  return (
    <div className="space-y-6 py-4 font-['Space_Grotesk',sans-serif]">
      {/* Pitch Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border-4 border-black neo-shadow text-black">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-black stroke-[2.5]" />
            <h1 className="text-2xl font-black uppercase text-black">PITCH LINEUP VIEW</h1>
            <span className="px-2.5 py-0.5 bg-[#CCFF00] text-black border-2 border-black text-xs font-mono font-black">
              {formation.name}
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-700">
            Click any player to swap positions in real-time.
          </p>
        </div>

        {/* Tactical Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRandomizeAgain}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#00F0FF] text-black font-black text-xs border-2 border-black neo-shadow-sm transition-all cursor-pointer uppercase"
            title="Randomize Teams"
          >
            <Shuffle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>RE-SHUFFLE</span>
          </button>

          <button
            onClick={handleCopyWhatsApp}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#CCFF00] hover:bg-[#00F0FF] text-black font-black text-xs border-2 border-black neo-btn transition-all cursor-pointer uppercase"
          >
            {copiedWhatsApp ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>{copiedWhatsApp ? 'COPIED!' : 'COPY WHATSAPP'}</span>
          </button>

          <button
            onClick={handleExportPNG}
            disabled={exporting}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#00F0FF] hover:bg-[#CCFF00] text-black font-black text-xs border-2 border-black neo-shadow-sm transition-all cursor-pointer uppercase"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{exporting ? 'EXPORTING...' : 'EXPORT PNG'}</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="p-2 bg-white hover:bg-zinc-100 text-black border-2 border-black neo-shadow-sm cursor-pointer"
            title="Share Options"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {selectedPlayerForSwap && (
        <div className="flex items-center justify-between p-4 bg-[#FFBD2E] text-black border-3 border-black neo-shadow font-bold text-xs">
          <span>Tap another player to swap positions on the pitch.</span>
          <button
            onClick={() => setSelectedPlayerForSwap(null)}
            className="px-3 py-1 bg-black text-white font-black border-2 border-black cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      )}

      {/* Main Pitch Graphic Container */}
      <div
        ref={pitchRef}
        className="relative w-full max-w-4xl mx-auto border-4 border-black neo-shadow-lg bg-[#00A859] p-4 sm:p-6 text-black select-none space-y-6"
      >
        {/* Grass Texture Stripes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,168,89,1)_50%,rgba(0,140,74,1)_50%)] bg-[length:100%_40px] pointer-events-none" />

        {/* Outer Pitch Border & Lines */}
        <div className="relative min-h-[640px] sm:min-h-[720px] border-4 border-white p-2 flex flex-col justify-between">
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white -translate-y-1/2 pointer-events-none" />

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white pointer-events-none flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>

          {/* Top Penalty Box (Team B Goal Area) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-28 border-b-4 border-x-4 border-white pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 border-b-4 border-x-4 border-white" />
          </div>

          {/* Bottom Penalty Box (Team A Goal Area) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-28 border-t-4 border-x-4 border-white pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 border-t-4 border-x-4 border-white" />
          </div>

          {/* --- TOP HALF: TEAM B (Attacking Downward) --- */}
          <div className="relative z-10 w-full h-[300px] sm:h-[340px] mb-4">
            <div className="absolute top-2 left-4 flex items-center gap-2 bg-[#00FF66] text-black px-3 py-1 border-2 border-black font-black text-xs uppercase neo-shadow-sm">
              <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{teamB.name}</span>
            </div>

            {teamB.assignedPlayers.map((ap) => {
              const slot = {
                x: ap.x ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.x ?? 50,
                y: ap.y ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.y ?? 50,
              };
              const topY = slot.y;
              const isSelected =
                selectedPlayerForSwap?.teamId === 'teamB' &&
                selectedPlayerForSwap?.playerId === ap.player.id;
              const zIndexValue = isSelected ? 60 : Math.round(100 - slot.y);

              return (
                <div
                  key={ap.player.id}
                  onClick={() => handlePlayerTap('teamB', ap.player.id)}
                  style={{
                    left: `${slot.x}%`,
                    top: `${topY}%`,
                    zIndex: zIndexValue,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  {/* Token */}
                  <div
                    className={`relative w-11 h-11 sm:w-13 sm:h-13 border-3 border-black flex items-center justify-center font-black text-xs text-black neo-shadow-sm transition-all ${
                      isSelected
                        ? 'bg-[#FFBD2E] border-black ring-4 ring-black'
                        : 'bg-[#00FF66]'
                    }`}
                  >
                    <span>{ap.assignedPosition}</span>

                    {/* Captain Badge */}
                    {ap.isCaptain && (
                      <div
                        className="absolute -top-2 -right-2 w-5 h-5 bg-[#FFBD2E] text-black font-black text-[10px] flex items-center justify-center border-2 border-black neo-shadow-sm"
                        title="Captain"
                      >
                        C
                      </div>
                    )}
                  </div>

                  {/* Player Name Pill */}
                  <div className="mt-1 px-2 py-0.5 bg-black text-white font-mono font-bold text-[10px] sm:text-xs tracking-tight whitespace-nowrap border border-black neo-shadow-sm uppercase text-center max-w-none">
                    {ap.player.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- BOTTOM HALF: TEAM A (Attacking Upward) --- */}
          <div className="relative z-10 w-full h-[300px] sm:h-[340px] mt-4">
            <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-[#00F0FF] text-black px-3 py-1 border-2 border-black font-black text-xs uppercase neo-shadow-sm">
              <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{teamA.name}</span>
            </div>

            {teamA.assignedPlayers.map((ap) => {
              const slot = {
                x: ap.x ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.x ?? 50,
                y: ap.y ?? formation.slots.find((s) => s.role === ap.assignedPosition)?.y ?? 50,
              };
              const isSelected =
                selectedPlayerForSwap?.teamId === 'teamA' &&
                selectedPlayerForSwap?.playerId === ap.player.id;
              const zIndexValue = isSelected ? 60 : Math.round(slot.y);

              return (
                <div
                  key={ap.player.id}
                  onClick={() => handlePlayerTap('teamA', ap.player.id)}
                  style={{
                    left: `${slot.x}%`,
                    bottom: `${slot.y}%`,
                    zIndex: zIndexValue,
                  }}
                  className={`absolute -translate-x-1/2 translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  {/* Token */}
                  <div
                    className={`relative w-11 h-11 sm:w-13 sm:h-13 border-3 border-black flex items-center justify-center font-black text-xs text-black neo-shadow-sm transition-all ${
                      isSelected
                        ? 'bg-[#FFBD2E] border-black ring-4 ring-black'
                        : 'bg-[#00F0FF]'
                    }`}
                  >
                    <span>{ap.assignedPosition}</span>

                    {/* Captain Badge */}
                    {ap.isCaptain && (
                      <div
                        className="absolute -top-2 -right-2 w-5 h-5 bg-[#FFBD2E] text-black font-black text-[10px] flex items-center justify-center border-2 border-black neo-shadow-sm"
                        title="Captain"
                      >
                        C
                      </div>
                    )}
                  </div>

                  {/* Player Name Pill */}
                  <div className="mt-1 px-2 py-0.5 bg-black text-white font-mono font-bold text-[10px] sm:text-xs tracking-tight whitespace-nowrap border border-black neo-shadow-sm uppercase text-center max-w-none">
                    {ap.player.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
