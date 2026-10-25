import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MatchStats, Player, PlayerRanking, PositionKey } from '../types';

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

  for (const player of players) {
    const row = toRow(player, userId);
    const { data: existing, error: lookupError } = await supabase
      .from('players')
      .select('id')
      .eq('id', player.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (lookupError) {
      console.error('Failed to check player ownership in Supabase', lookupError);
      throw new Error(`Unable to verify player ownership before recording the match: ${lookupError.message}`);
    }

    const result = existing
      ? await supabase.from('players').update(row).eq('id', player.id).eq('user_id', userId)
      : await supabase.from('players').insert(row);

    if (result.error) {
      console.error('Failed to save players to Supabase', result.error);
      throw new Error(`Unable to save the current player roster before recording the match: ${result.error.message}`);
    }
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
    const emptyStats: MatchStats = { matches: 0, goals: 0, assists: 0, appearances: 0, goalsRanking: [], assistsRanking: [], appearancesRanking: [] };
    if (!supabase) return emptyStats;

    const [{ count: matches, error: matchesError }, { data: players, error: playersError }, { data: goals, error: goalsError }, { data: appearances, error: appearancesError }] = await Promise.all([
      supabase.from('matches').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('players').select('id, name').eq('user_id', userId),
      supabase.from('goals').select('scorer_id, assist_id').eq('user_id', userId),
      supabase.from('match_appearances').select('player_id').eq('user_id', userId),
    ]);

    if (matchesError || playersError || goalsError || appearancesError) {
      console.error('Failed to load match stats from Supabase', matchesError || playersError || goalsError || appearancesError);
      return emptyStats;
    }

    const playerNames = new Map((players ?? []).map((player) => [player.id, player.name]));
    const goalsByPlayer = new Map<string, number>();
    const assistsByPlayer = new Map<string, number>();
    const appearancesByPlayer = new Map<string, number>();
    (goals ?? []).forEach((goal) => {
      goalsByPlayer.set(goal.scorer_id, (goalsByPlayer.get(goal.scorer_id) ?? 0) + 1);
      if (goal.assist_id) assistsByPlayer.set(goal.assist_id, (assistsByPlayer.get(goal.assist_id) ?? 0) + 1);
    });
    (appearances ?? []).forEach((appearance) => {
      appearancesByPlayer.set(appearance.player_id, (appearancesByPlayer.get(appearance.player_id) ?? 0) + 1);
    });

    const rank = (counts: Map<string, number>): PlayerRanking[] => [...counts.entries()]
      .map(([playerId, count]) => ({ playerId, name: playerNames.get(playerId) ?? 'Unknown player', count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return {
      matches: matches ?? 0,
      goals: goals?.length ?? 0,
      assists: [...assistsByPlayer.values()].reduce((total, count) => total + count, 0),
      appearances: appearances?.length ?? 0,
      goalsRanking: rank(goalsByPlayer),
      assistsRanking: rank(assistsByPlayer),
      appearancesRanking: rank(appearancesByPlayer),
    };
}

export interface MatchGoalInput {
  scorerId: string;
  assistId: string | null;
}

function describeSupabaseError(error: { message: string; details?: string; hint?: string }): Error {
  const detail = [error.message, error.details, error.hint].filter(Boolean).join(' ');
  if (detail.toLowerCase().includes('match_appearances')) {
    return new Error('The match_appearances table is missing or has no access policy. Run the complete supabase/schema.sql file in Supabase SQL Editor.');
  }
  return new Error(detail || 'Supabase rejected the match.');
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

    if (matchError || !match) {
      throw matchError ? describeSupabaseError(matchError) : new Error('Supabase did not return the recorded match.');
    }

    if (goals.length > 0) {
      const { error } = await supabase.from('goals').insert(
        goals.map((goal) => ({
          user_id: userId,
          match_id: match.id,
          scorer_id: goal.scorerId,
          assist_id: goal.assistId,
          })),
      );
      if (error) {
        await supabase.from('matches').delete().eq('id', match.id).eq('user_id', userId);
        throw describeSupabaseError(error);
      }
    }

    if (appearanceIds.length > 0) {
      const { error } = await supabase.from('match_appearances').insert(
        appearanceIds.map((playerId) => ({ user_id: userId, match_id: match.id, player_id: playerId })),
      );
      if (error) {
        await supabase.from('matches').delete().eq('id', match.id).eq('user_id', userId);
        throw describeSupabaseError(error);
      }
    }
}
