import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Player, PositionKey } from '../types';

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

function toRow(player: Player): PlayerRow {
  return {
    id: player.id,
    name: player.name,
    preferred_positions: player.preferredPositions,
    kit_number: player.kitNumber ?? null,
    notes: player.notes ?? null,
    is_attending: player.isAttending !== false,
    created_at: player.createdAt,
  };
}

export async function loadRemotePlayers(): Promise<Player[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('players')
    .select('id, name, preferred_positions, kit_number, notes, is_attending, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to load players from Supabase', error);
    return [];
  }

  return (data as PlayerRow[]).map(toPlayer);
}

export async function upsertRemotePlayers(players: Player[]): Promise<void> {
  if (!supabase || players.length === 0) return;

  const { error } = await supabase.from('players').upsert(players.map(toRow));
  if (error) {
    console.error('Failed to save players to Supabase', error);
  }
}

export async function deleteRemotePlayer(id: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from('players').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete player from Supabase', error);
  }
}
