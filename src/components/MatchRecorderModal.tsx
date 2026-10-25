import React, { useMemo, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Player } from '../types';
import { MatchGoalInput } from '../lib/supabase';

interface MatchRecorderModalProps {
  isOpen: boolean;
  players: Player[];
  onClose: () => void;
  onSave: (
    teamAScore: number,
    teamBScore: number,
    goals: MatchGoalInput[],
    appearanceIds: string[],
    playedAt: string,
    notes: string,
  ) => Promise<void>;
}

interface GoalRow {
  scorerId: string;
  assistId: string;
}

export const MatchRecorderModal: React.FC<MatchRecorderModalProps> = ({
  isOpen,
  players,
  onClose,
  onSave,
}) => {
  const [teamAScore, setTeamAScore] = useState('0');
  const [teamBScore, setTeamBScore] = useState('0');
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [goals, setGoals] = useState<GoalRow[]>([]);
  const [appearanceIds, setAppearanceIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const sortedPlayers = useMemo(() => [...players].sort((a, b) => a.name.localeCompare(b.name)), [players]);

  if (!isOpen) return null;

  const addGoal = () => setGoals((current) => [...current, { scorerId: '', assistId: '' }]);
  const updateGoal = (index: number, field: keyof GoalRow, value: string) => {
    setGoals((current) => current.map((goal, goalIndex) => (
      goalIndex === index ? { ...goal, [field]: value } : goal
    )));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const validGoals = goals.filter((goal) => goal.scorerId).map((goal) => ({
      scorerId: goal.scorerId,
      assistId: goal.assistId || null,
    }));

    if (validGoals.length !== Number(teamAScore) + Number(teamBScore)) {
      setError('Add one goal entry for every goal in the final score.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(Number(teamAScore), Number(teamBScore), validGoals, appearanceIds, playedAt, notes);
      setGoals([]);
      setAppearanceIds([]);
      setNotes('');
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save this match.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-4 border-black neo-shadow-lg text-black">
        <div className="flex items-center justify-between border-b-4 border-black bg-[#00F0FF] p-5">
          <div>
            <h2 className="text-xl font-black uppercase">RECORD MATCH</h2>
            <p className="text-xs font-bold uppercase">Save the score, scorers, and assists</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 border-2 border-black bg-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs font-black uppercase">
              Team A score
              <input type="number" min="0" value={teamAScore} onChange={(event) => setTeamAScore(event.target.value)} className="w-full border-2 border-black p-3 text-lg font-black" />
            </label>
            <label className="space-y-1 text-xs font-black uppercase">
              Team B score
              <input type="number" min="0" value={teamBScore} onChange={(event) => setTeamBScore(event.target.value)} className="w-full border-2 border-black p-3 text-lg font-black" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="space-y-1 text-xs font-black uppercase">
              Match date
              <input type="date" value={playedAt} onChange={(event) => setPlayedAt(event.target.value)} className="w-full border-2 border-black p-2.5 font-bold" required />
            </label>
            <label className="space-y-1 text-xs font-black uppercase">
              Notes
              <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional" className="w-full border-2 border-black p-2.5 font-bold" />
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase">Goals and assists ({goals.length})</h3>
              <button type="button" onClick={addGoal} className="flex items-center gap-1 border-2 border-black bg-[#CCFF00] px-3 py-2 text-xs font-black uppercase cursor-pointer">
                <Plus className="w-4 h-4" /> Add goal
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-2 border-black bg-zinc-100 p-3">
              {sortedPlayers.map((player) => (
                <label key={player.id} className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appearanceIds.includes(player.id)}
                    onChange={(event) => setAppearanceIds((current) =>
                      event.target.checked
                        ? [...current, player.id]
                        : current.filter((id) => id !== player.id)
                    )}
                    className="h-4 w-4 accent-[#CCFF00]"
                  />
                  <span className="truncate">{player.name}</span>
                </label>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase text-zinc-600">
              Select every player who appeared in this match.
            </p>
            {goals.map((goal, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <label className="text-[10px] font-black uppercase">
                  Scorer
                  <select required value={goal.scorerId} onChange={(event) => updateGoal(index, 'scorerId', event.target.value)} className="w-full border-2 border-black p-2 text-xs font-bold">
                    <option value="">Select player</option>
                    {sortedPlayers.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
                  </select>
                </label>
                <label className="text-[10px] font-black uppercase">
                  Assist
                  <select value={goal.assistId} onChange={(event) => updateGoal(index, 'assistId', event.target.value)} className="w-full border-2 border-black p-2 text-xs font-bold">
                    <option value="">None</option>
                    {sortedPlayers.filter((player) => player.id !== goal.scorerId).map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
                  </select>
                </label>
                <button type="button" onClick={() => setGoals((current) => current.filter((_, goalIndex) => goalIndex !== index))} className="border-2 border-black bg-[#FF5F56] p-2 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {error && <p className="border-2 border-black bg-[#FF5F56] p-3 text-xs font-black">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t-4 border-black p-5">
          <button type="button" onClick={onClose} className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase cursor-pointer">Cancel</button>
          <button type="submit" disabled={isSaving} className="border-3 border-black bg-[#CCFF00] px-5 py-2 text-xs font-black uppercase neo-btn cursor-pointer disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save match'}
          </button>
        </div>
      </form>
    </div>
  );
};
