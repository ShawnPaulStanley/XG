import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import {
  ActiveTab,
  Player,
  Formation,
  DivisionResult,
  DividedTeam,
} from './types';
import { FORMATIONS, getFormationById, getDefaultFormationForCount, generateDynamicFormation } from './data/formations';
import { SAMPLE_ROSTERS } from './data/samplePlayers';
import { generateBalancedTeams } from './utils/teamDivider';
import {
  loadStoredPlayers,
  saveStoredPlayers,
  loadStoredFormationId,
  saveStoredFormationId,
  loadStoredDivisionResult,
  saveStoredDivisionResult,
} from './utils/storage';
import { formatTeamsForWhatsApp } from './utils/whatsappFormatter';
import {
  deleteRemotePlayer,
  loadMatchStats,
  loadRemotePlayers,
  MatchGoalInput,
  recordMatch,
  signOut,
  supabase,
  upsertRemotePlayers,
} from './lib/supabase';
import { MatchStats } from './types';
import confetti from 'canvas-confetti';

import { Header } from './components/Header';
import { HomeTab } from './components/HomeTab';
import { PlayerManager } from './components/PlayerManager';
import { PlayerModal } from './components/PlayerModal';
import { BulkImportModal } from './components/BulkImportModal';
import { PitchView } from './components/PitchView';
import { TeamCard } from './components/TeamCard';
import { ShareModal } from './components/ShareModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { MatchRecorderModal } from './components/MatchRecorderModal';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [players, setPlayers] = useState<Player[]>(() => {
    const stored = loadStoredPlayers();
    // If stored players exist and are not old pros, migrate updated names/positions and ensure Joshua is present
    if (stored.length > 0) {
      const hasOldPros = stored.some(p => ['Neuer', 'Mbappe', 'Haaland', 'Courtois', 'Ramos'].some(name => p.name.includes(name)));
      if (!hasOldPros) {
        const updated = stored.map(p => {
          const lower = p.name.toLowerCase();
          if (lower.includes('samduarai') || lower === 'samduarai ruban' || lower === 'samduarai ruben') {
            return { ...p, name: 'Sam' };
          }
          if (lower === 'issac pradeep') {
            return { ...p, name: 'Issac' };
          }
          if (lower === 'shawn') {
            return { ...p, preferredPositions: ['CM', 'CAM', 'CDM'] };
          }
          return p;
        });

        if (!updated.some(p => p.name.toLowerCase() === 'joshua')) {
          updated.push({
            id: `init_joshua_${Date.now()}`,
            name: 'Joshua',
            preferredPositions: ['ST'],
            kitNumber: 19,
            isAttending: true,
            createdAt: Date.now(),
          });
        }
        return updated;
      }
    }
    // Default load 19-player custom squad
    return SAMPLE_ROSTERS[0].players.map((p, idx) => ({
      ...p,
      id: `init_${idx}_${Date.now()}`,
      createdAt: Date.now() + idx,
    }));
  });

  const [selectedFormation, setSelectedFormation] = useState<Formation>(() => {
    const storedId = loadStoredFormationId();
    if (storedId) return getFormationById(storedId);
    return FORMATIONS.find((f) => f.id === '7v7-2-3-1') || FORMATIONS[0];
  });

  const [divisionResult, setDivisionResult] = useState<DivisionResult | null>(() => {
    return loadStoredDivisionResult();
  });

  // Modal controls
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isMatchRecorderOpen, setIsMatchRecorderOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRemoteReady, setIsRemoteReady] = useState(false);
  const [matchStats, setMatchStats] = useState<MatchStats>({ matches: 0, goals: 0, assists: 0, topScorer: null });

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      setIsAuthLoading(false);
      if (data.session?.user) {
        void loadRemotePlayers(data.session.user.id).then((remotePlayers) => {
          if (!cancelled && remotePlayers.length > 0) setPlayers(remotePlayers);
          if (!cancelled) setIsRemoteReady(true);
        });
        void loadMatchStats(data.session.user.id).then((stats) => {
          if (!cancelled) setMatchStats(stats);
        });
      } else {
        setIsRemoteReady(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
      if (session?.user) {
        setIsRemoteReady(false);
        void loadRemotePlayers(session.user.id).then((remotePlayers) => {
          if (!cancelled && remotePlayers.length > 0) setPlayers(remotePlayers);
          if (!cancelled) setIsRemoteReady(true);
        });
        void loadMatchStats(session.user.id).then(setMatchStats);
      } else {
        setIsRemoteReady(false);
        setMatchStats({ matches: 0, goals: 0, assists: 0, topScorer: null });
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    saveStoredPlayers(players);
    if (user && isRemoteReady) void upsertRemotePlayers(players, user.id);
  }, [players, user, isRemoteReady]);

  useEffect(() => {
    saveStoredFormationId(selectedFormation.id);
  }, [selectedFormation]);

  useEffect(() => {
    saveStoredDivisionResult(divisionResult);
  }, [divisionResult]);

  // Core Team Generator function - Filters attending players and incorporates ALL of them on field
  const handleGenerateTeams = useCallback(() => {
    const attendingPlayers = players.filter((p) => p.isAttending !== false);
    if (attendingPlayers.length < 2) return;

    const result = generateBalancedTeams(attendingPlayers, selectedFormation);
    setDivisionResult(result);
    setActiveTab('pitch');

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [players, selectedFormation]);

  // Attendance toggling handlers
  const handleToggleAttendance = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAttending: p.isAttending === false } : p))
    );
  };

  const handleSetAttendanceCount = (count: number) => {
    setPlayers((prev) =>
      prev.map((p, idx) => ({ ...p, isAttending: idx < count }))
    );
  };

  const handleToggleAllAttendance = (present: boolean) => {
    setPlayers((prev) => prev.map((p) => ({ ...p, isAttending: present })));
  };

  // Randomize Again with current formation
  const handleRandomizeAgain = () => {
    handleGenerateTeams();
  };

  // Shuffle teams while maintaining position balance
  const handleShuffle = () => {
    if (!divisionResult) {
      handleGenerateTeams();
      return;
    }
    const result = generateBalancedTeams(players, selectedFormation);
    setDivisionResult(result);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  // Add or edit player
  const handleSavePlayer = (
    playerData: Omit<Player, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === existingId ? { ...p, ...playerData } : p))
      );
    } else {
      const newPlayer: Player = {
        ...playerData,
        id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        createdAt: Date.now(),
      };
      setPlayers((prev) => [newPlayer, ...prev]);
    }
  };

  // Bulk import
  const handleBulkImport = (newPlayers: Omit<Player, 'id' | 'createdAt'>[]) => {
    const formatted: Player[] = newPlayers.map((p, idx) => ({
      ...p,
      id: `bulk_${Date.now()}_${idx}`,
      createdAt: Date.now() + idx,
    }));
    setPlayers((prev) => [...formatted, ...prev]);
  };

  // Delete single player
  const handleDeletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    if (user) void deleteRemotePlayer(id, user.id);
  };

  const handleRecordMatch = async (
    teamAScore: number,
    teamBScore: number,
    goals: MatchGoalInput[],
    playedAt: string,
    notes: string,
  ) => {
    if (!user) throw new Error('Log in before recording a match.');
    await recordMatch(user.id, teamAScore, teamBScore, goals, playedAt, notes);
    setMatchStats(await loadMatchStats(user.id));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  if (!user) {
    return <AuthScreen isConfigured={Boolean(supabase)} />;
  }

  // Clear all players
  const handleClearAllPlayers = () => {
    setPlayers([]);
    setDivisionResult(null);
  };

  // Load sample roster
  const handleLoadSample = (sampleIndex: number) => {
    const sample = SAMPLE_ROSTERS[sampleIndex];
    if (!sample) return;

    const loaded: Player[] = sample.players.map((p, idx) => ({
      ...p,
      id: `sample_${sampleIndex}_${idx}_${Date.now()}`,
      createdAt: Date.now() + idx,
    }));

    setPlayers(loaded);
    setActiveTab('players');
  };

  // Swap captain designation within a team
  const handleSwapCaptain = (teamId: 'teamA' | 'teamB', playerId: string) => {
    if (!divisionResult) return;

    const newTeamA = { ...divisionResult.teamA };
    const newTeamB = { ...divisionResult.teamB };

    const targetTeam = teamId === 'teamA' ? newTeamA : newTeamB;
    targetTeam.captainId = playerId;
    targetTeam.assignedPlayers = targetTeam.assignedPlayers.map((ap) => ({
      ...ap,
      isCaptain: ap.player.id === playerId,
    }));

    setDivisionResult({
      ...divisionResult,
      teamA: newTeamA,
      teamB: newTeamB,
    });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'g' || e.key === 'G' || (e.ctrlKey && e.key === 'Enter')) {
        e.preventDefault();
        handleGenerateTeams();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleShuffle();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        if (divisionResult) {
          navigator.clipboard.writeText(formatTeamsForWhatsApp(divisionResult));
        }
      } else if (e.key === '1') {
        setActiveTab('home');
      } else if (e.key === '2') {
        setActiveTab('players');
      } else if (e.key === '3') {
        setActiveTab('teams');
      } else if (e.key === '4') {
        setActiveTab('teams');
      } else if (e.key === '5') {
        setActiveTab('pitch');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerateTeams, divisionResult]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        playerCount={players.length}
        hasResult={Boolean(divisionResult)}
        divisionResult={divisionResult}
        onGenerate={handleGenerateTeams}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        user={user}
        onSignOut={() => void handleSignOut()}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <HomeTab
            players={players}
            setActiveTab={setActiveTab}
            onGenerate={handleGenerateTeams}
            stats={matchStats}
            onRecordMatch={() => setIsMatchRecorderOpen(true)}
            canRecordMatch={Boolean(user)}
            hasResult={Boolean(divisionResult)}
          />
        )}

        {activeTab === 'players' && (
          <PlayerManager
            players={players}
            onOpenAddModal={() => {
              setEditingPlayer(null);
              setIsPlayerModalOpen(true);
            }}
            onOpenEditModal={(player) => {
              setEditingPlayer(player);
              setIsPlayerModalOpen(true);
            }}
            onOpenBulkModal={() => setIsBulkModalOpen(true)}
            onDeletePlayer={handleDeletePlayer}
            onClearAll={handleClearAllPlayers}
            onLoadSample={handleLoadSample}
            onGenerate={handleGenerateTeams}
            onToggleAttendance={handleToggleAttendance}
            onSetAttendanceCount={handleSetAttendanceCount}
            onToggleAllAttendance={handleToggleAllAttendance}
          />
        )}

        {activeTab === 'pitch' && (
          <PitchView
            divisionResult={divisionResult}
            onRandomizeAgain={handleRandomizeAgain}
            onShuffle={handleShuffle}
            onUpdateResult={setDivisionResult}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6 py-4">
            {divisionResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TeamCard
                  team={divisionResult.teamA}
                  otherTeam={divisionResult.teamB}
                  onSwapCaptain={handleSwapCaptain}
                  onCopyWhatsApp={() =>
                    navigator.clipboard.writeText(formatTeamsForWhatsApp(divisionResult))
                  }
                />
                <TeamCard
                  team={divisionResult.teamB}
                  otherTeam={divisionResult.teamA}
                  onSwapCaptain={handleSwapCaptain}
                  onCopyWhatsApp={() =>
                    navigator.clipboard.writeText(formatTeamsForWhatsApp(divisionResult))
                  }
                />
              </div>
            ) : (
              <PitchView
                divisionResult={divisionResult}
                onRandomizeAgain={handleRandomizeAgain}
                onShuffle={handleShuffle}
                onUpdateResult={setDivisionResult}
                onOpenShareModal={() => setIsShareModalOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => {
          setIsPlayerModalOpen(false);
          setEditingPlayer(null);
        }}
        onSave={handleSavePlayer}
        editingPlayer={editingPlayer}
      />

      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImport={handleBulkImport}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={divisionResult}
        onExportPNG={() => {
          // Trigger pitch view PNG export
          setActiveTab('pitch');
        }}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <MatchRecorderModal
        isOpen={isMatchRecorderOpen}
        players={players}
        onClose={() => setIsMatchRecorderOpen(false)}
        onSave={handleRecordMatch}
      />
    </div>
  );
}
