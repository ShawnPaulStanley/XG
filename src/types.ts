export type PositionKey =
  | 'GK'
  | 'LB'
  | 'CB'
  | 'RB'
  | 'CDM'
  | 'CM'
  | 'CAM'
  | 'LW'
  | 'RW'
  | 'ST';

export type PositionCategory = 'GK' | 'DEF' | 'MID' | 'ATT';

export interface PositionInfo {
  key: PositionKey;
  label: string;
  category: PositionCategory;
  categoryLabel: string;
  description: string;
  badgeColor: string;
}

export interface Player {
  id: string;
  name: string;
  preferredPositions: PositionKey[];
  kitNumber?: number;
  notes?: string;
  isAttending?: boolean;
  createdAt: number;
}

export interface TacticalSlot {
  id: string;
  role: PositionKey;
  label: string;
  category: PositionCategory;
  // Normalized percentage position on a half pitch (x: 0-100%, y: 0-100%)
  // x: 0 = left wing, 50 = center, 100 = right wing
  // y: 10 = goalkeeper / baseline, 90 = top striker line
  x: number;
  y: number;
}

export interface Formation {
  id: string;
  name: string; // e.g., "4-3-3", "2-2"
  playersPerTeam: number; // e.g., 5, 6, 7, 8, 9, 11
  category: string; // "5v5", "6v6", "7v7", "8v8", "9v9", "11v11"
  description: string;
  slots: TacticalSlot[];
}

export interface AssignedPlayer {
  player: Player;
  assignedPosition: PositionKey;
  isOutCategory: boolean; // Assigned outside preferred category
  isOutExact: boolean; // Assigned outside preferred exact position
  isCaptain: boolean;
  slotId?: string;
  x?: number;
  y?: number;
}

export interface DividedTeam {
  id: 'teamA' | 'teamB';
  name: string;
  color: string; // primary color theme for kit
  secondaryColor: string;
  captainId: string | null;
  assignedPlayers: AssignedPlayer[];
  benchPlayers: Player[];
}

export interface DivisionResult {
  teamA: DividedTeam;
  teamB: DividedTeam;
  unassignedPlayers: Player[];
  formation: Formation;
  generatedAt: number;
}

export type ActiveTab = 'home' | 'players' | 'teams' | 'pitch';

export interface KitStyle {
  primaryColor: string;
  stripeColor: string;
  textColor: string;
  style: 'solid' | 'stripes' | 'sash' | 'halves';
}
