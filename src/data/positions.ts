import { PositionInfo, PositionKey, PositionCategory } from '../types';

export const POSITIONS: PositionInfo[] = [
  {
    key: 'GK',
    label: 'Goalkeeper',
    category: 'GK',
    categoryLabel: 'Goalkeepers',
    description: 'Guards the goal, stops shots, distributes the ball',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    key: 'LB',
    label: 'Left Back',
    category: 'DEF',
    categoryLabel: 'Defenders',
    description: 'Defends left flank, overlaps on attack',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    key: 'CB',
    label: 'Centre Back',
    category: 'DEF',
    categoryLabel: 'Defenders',
    description: 'Central defensive anchor, stops opposition attackers',
    badgeColor: 'bg-blue-600/20 text-blue-300 border-blue-600/40',
  },
  {
    key: 'RB',
    label: 'Right Back',
    category: 'DEF',
    categoryLabel: 'Defenders',
    description: 'Defends right flank, overlaps on attack',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    key: 'CDM',
    label: 'Defensive Midfielder',
    category: 'MID',
    categoryLabel: 'Midfielders',
    description: 'Shields defense, wins back possession, distributes',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    key: 'CM',
    label: 'Central Midfielder',
    category: 'MID',
    categoryLabel: 'Midfielders',
    description: 'Box-to-box engine, dictates play pace',
    badgeColor: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/40',
  },
  {
    key: 'CAM',
    label: 'Attacking Midfielder',
    category: 'MID',
    categoryLabel: 'Midfielders',
    description: 'Creates key chances, playmakes behind strikers',
    badgeColor: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40',
  },
  {
    key: 'LW',
    label: 'Left Wing',
    category: 'ATT',
    categoryLabel: 'Attackers',
    description: 'Pacy wide attacker on left wing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
  {
    key: 'RW',
    label: 'Right Wing',
    category: 'ATT',
    categoryLabel: 'Attackers',
    description: 'Pacy wide attacker on right wing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
  {
    key: 'ST',
    label: 'Striker',
    category: 'ATT',
    categoryLabel: 'Attackers',
    description: 'Primary goal scorer, leads attack front line',
    badgeColor: 'bg-red-600/20 text-red-300 border-red-600/40',
  },
];

export const POSITION_MAP: Record<PositionKey, PositionInfo> = POSITIONS.reduce(
  (acc, pos) => {
    acc[pos.key] = pos;
    return acc;
  },
  {} as Record<PositionKey, PositionInfo>
);

export function getPositionCategory(key: PositionKey): PositionCategory {
  return POSITION_MAP[key]?.category || 'MID';
}

export function getCategoryBadgeClass(category: PositionCategory): string {
  switch (category) {
    case 'GK':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    case 'DEF':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'MID':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'ATT':
      return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
  }
}
