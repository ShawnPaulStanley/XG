import { Player, DivisionResult } from '../types';

const STORAGE_KEYS = {
  PLAYERS: 'xg_players_v1',
  FORMATION_ID: 'xg_formation_id_v1',
  DIVISION_RESULT: 'xg_last_result_v1',
  TEAM_NAMES: 'xg_team_names_v1',
};

export function loadStoredPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored players', e);
    return [];
  }
}

export function saveStoredPlayers(players: Player[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save players', e);
  }
}

export function loadStoredFormationId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.FORMATION_ID);
  } catch (e) {
    return null;
  }
}

export function saveStoredFormationId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FORMATION_ID, id);
  } catch (e) {
    console.error('Failed to save formation id', e);
  }
}

export function loadStoredDivisionResult(): DivisionResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIVISION_RESULT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveStoredDivisionResult(result: DivisionResult | null): void {
  try {
    if (!result) {
      localStorage.removeItem(STORAGE_KEYS.DIVISION_RESULT);
    } else {
      localStorage.setItem(STORAGE_KEYS.DIVISION_RESULT, JSON.stringify(result));
    }
  } catch (e) {
    console.error('Failed to save division result', e);
  }
}
