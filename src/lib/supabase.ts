import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MatchStats, Player, PositionKey } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface PlayerRow {
  id: string;
  name: string;
  preferred_positions: PositionKey[];
  kit_number: number | null;
  notes: string | null;
  is_attending: boolean;
  created_at: number;
  user_id: string;
}

function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    name: row.name,
    preferredPositions: row.preferred_positions,
    kitNumber: row.kit_number ?? undefined,
    notes: row.notes ?? undefined,
    isAttending: row.is_attending,
    createdAt: row.created_at,
  };
}

function toRow(player: Player, userId: string): PlayerRow {
  return {
    id: player.id,
    name: player.name,
    preferred_positions: player.preferredPositions,
    kit_number: player.kitNumber ?? null,
    notes: player.notes ?? null,
    is_attending: player.isAttending !== false,
    created_at: player.createdAt,
    user_id: userId,
  };
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,}$/;
const INTERNAL_EMAIL_DOMAIN = 'users.xg.invalid';

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function getInternalEmail(username: string): string {
  return `${normalizeUsername(username)}@${INTERNAL_EMAIL_DOMAIN}`;
}

function validateCredentials(username: string, password: string): string {
  const normalizedUsername = normalizeUsername(username);
  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return 'Username must be at least 3 characters using only letters, numbers, and underscores.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  return '';
}

export async function registerWithUsername(username: string, password: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const normalizedUsername = normalizeUsername(username);
  const validationError = validateCredentials(normalizedUsername, password);
  if (validationError) throw new Error(validationError);

  const { data, error } = await supabase.auth.signUp({
    email: getInternalEmail(normalizedUsername),
    password,
    options: { data: { username: normalizedUsername } },
  });
  if (error) {
    if (error.message.toLowerCase().includes('database error saving new user')) {
      throw new Error('Supabase setup is incomplete. Run the full supabase/schema.sql file in the Supabase SQL Editor.');
    }
    throw error;
  }
  if (!data.user) {
    throw new Error('Registration did not create an account. Check Supabase Auth settings and try again.');
  }
}

export async function signInWithUsername(username: string, password: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const normalizedUsername = normalizeUsername(username);
  const validationError = validateCredentials(normalizedUsername, password);
  if (validationError) throw new Error(validationError);

  const { error } = await supabase.auth.signInWithPassword({
    email: getInternalEmail(normalizedUsername),
    password,
  });
  if (error) throw new Error('Invalid username or password.');
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadRemotePlayers(userId: string): Promise<Player[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('players')
    .select('id, name, preferred_positions, kit_number, notes, is_attending, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to load players from Supabase', error);
    return [];
  }

  return (data as PlayerRow[]).map(toPlayer);
}

export async function upsertRemotePlayers(players: Player[], userId: string): Promise<void> {
  if (!supabase || players.length === 0) return;

  const { error } = await supabase.from('players').upsert(players.map((player) => toRow(player, userId)));
  if (error) {
    console.error('Failed to save players to Supabase', error);
  }
}

export async function deleteRemotePlayer(id: string, userId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from('players').delete().eq('id', id).eq('user_id', userId);
  if (error) {
    console.error('Failed to delete player from Supabase', error);
  }
}

export async function loadMatchStats(userId: string): Promise<MatchStats> {
    if (!supabase) return { matches: 0, goals: 0, assists: 0, appearances: 0, topScorer: null };

    const [{ count: matches, error: matchesError }, { data: goals, error: goalsError }, { count: appearances, error: appearancesError }] = await Promise.all([
      supabase.from('matches').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase
        .from('goals')
        .select('scorer_id, assist_id, players!goals_scorer_id_fkey(name)')
        .eq('user_id', userId),
      supabase.from('match_appearances').select('player_id', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    if (matchesError || goalsError || appearancesError) {
      console.error('Failed to load match stats from Supabase', matchesError || goalsError || appearancesError);
      return { matches: 0, goals: 0, assists: 0, appearances: 0, topScorer: null };
    }

    const scorerCounts = new Map<string, { name: string; goals: number }>();
    let assists = 0;
    (goals ?? []).forEach((goal) => {
      const player = Array.isArray(goal.players) ? goal.players[0] : goal.players;
      const current = scorerCounts.get(goal.scorer_id) ?? { name: player?.name ?? 'Unknown', goals: 0 };
      scorerCounts.set(goal.scorer_id, { ...current, goals: current.goals + 1 });
      if (goal.assist_id) assists += 1;
    });

    const topScorer = [...scorerCounts.values()].sort((a, b) => b.goals - a.goals)[0] ?? null;
    return { matches: matches ?? 0, goals: goals?.length ?? 0, assists, appearances: appearances ?? 0, topScorer };
}

export interface MatchGoalInput {
  scorerId: string;
  assistId: string | null;
}

export async function recordMatch(
    userId: string,
    teamAScore: number,
    teamBScore: number,
    goals: MatchGoalInput[],
    appearanceIds: string[],
    playedAt: string,
    notes: string,
  ): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        user_id: userId,
        team_a_score: teamAScore,
        team_b_score: teamBScore,
        played_at: playedAt,
        notes: notes || null,
      })
      .select('id')
      .single();

    if (matchError || !match) throw matchError ?? new Error('Supabase did not return the recorded match.');

    if (goals.length > 0) {
      const { error } = await supabase.from('goals').insert(
        goals.map((goal) => ({
          user_id: userId,
          match_id: match.id,
          scorer_id: goal.scorerId,
          assist_id: goal.assistId,
          })),
      );
      if (error) throw error;
  }

  if (appearanceIds.length > 0) {
      const { error } = await supabase.from('match_appearances').insert(
        appearanceIds.map((playerId) => ({ user_id: userId, match_id: match.id, player_id: playerId })),
      );
      if (error) throw error;
  }
}
