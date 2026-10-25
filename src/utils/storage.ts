import { Player, DivisionResult } from '../types';

const STORAGE_KEYS = {
  PLAYERS: 'xg_players_v1',
  FORMATION_ID: 'xg_formation_id_v1',
  DIVISION_RESULT: 'xg_last_result_v1',
};

function scopedKey(key: string, userId: string): string {
  return `${key}_${userId}`;
}

export function loadStoredPlayers(userId: string): Player[] {
  try {
    const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.PLAYERS, userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored players', e);
    return [];
  }
}

export function saveStoredPlayers(players: Player[], userId: string): void {
  try {
    localStorage.setItem(scopedKey(STORAGE_KEYS.PLAYERS, userId), JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save players', e);
  }
}

export function loadStoredFormationId(userId: string): string | null {
  try {
    return localStorage.getItem(scopedKey(STORAGE_KEYS.FORMATION_ID, userId));
  } catch (e) {
    return null;
  }
}

export function saveStoredFormationId(id: string, userId: string): void {
  try {
    localStorage.setItem(scopedKey(STORAGE_KEYS.FORMATION_ID, userId), id);
  } catch (e) {
    console.error('Failed to save formation id', e);
  }
}

export function loadStoredDivisionResult(userId: string): DivisionResult | null {
  try {
    const raw = localStorage.getItem(scopedKey(STORAGE_KEYS.DIVISION_RESULT, userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveStoredDivisionResult(result: DivisionResult | null, userId: string): void {
  try {
    if (!result) {
      localStorage.removeItem(scopedKey(STORAGE_KEYS.DIVISION_RESULT, userId));
    } else {
      localStorage.setItem(scopedKey(STORAGE_KEYS.DIVISION_RESULT, userId), JSON.stringify(result));
    }
  } catch (e) {
    console.error('Failed to save division result', e);
  }
}
