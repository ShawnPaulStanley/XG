import { Formation, TacticalSlot } from '../types';

export const FORMATIONS: Formation[] = [
  // --- 5v5 FORMATIONS ---
  {
    id: '5v5-2-2',
    name: '2-2',
    playersPerTeam: 5,
    category: '5v5',
    description: 'Balanced 5-a-side layout with 2 defenders and 2 forwards.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'ldef', role: 'CB', label: 'CB (L)', category: 'DEF', x: 30, y: 38 },
      { id: 'rdef', role: 'CB', label: 'CB (R)', category: 'DEF', x: 70, y: 38 },
      { id: 'latt', role: 'ST', label: 'ST (L)', category: 'ATT', x: 30, y: 78 },
      { id: 'ratt', role: 'ST', label: 'ST (R)', category: 'ATT', x: 70, y: 78 },
    ],
  },
  {
    id: '5v5-1-2-1',
    name: '1-2-1 (Diamond)',
    playersPerTeam: 5,
    category: '5v5',
    description: 'Diamond shape offering strong midfield control and width.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'def', role: 'CB', label: 'CB', category: 'DEF', x: 50, y: 35 },
      { id: 'lmid', role: 'CM', label: 'LM', category: 'MID', x: 22, y: 56 },
      { id: 'rmid', role: 'CM', label: 'RM', category: 'MID', x: 78, y: 56 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 82 },
    ],
  },

  // --- 6v6 FORMATIONS ---
  {
    id: '6v6-2-2-1',
    name: '2-2-1',
    playersPerTeam: 6,
    category: '6v6',
    description: 'Solid defensive base with dual midfielders and a central striker.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 30, y: 35 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 70, y: 35 },
      { id: 'lmid', role: 'CM', label: 'LCM', category: 'MID', x: 35, y: 58 },
      { id: 'rmid', role: 'CM', label: 'RCM', category: 'MID', x: 65, y: 58 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 82 },
    ],
  },
  {
    id: '6v6-1-3-1',
    name: '1-3-1',
    playersPerTeam: 6,
    category: '6v6',
    description: 'Dominant midfield spread for continuous passing triangles.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'cb', role: 'CB', label: 'CB', category: 'DEF', x: 50, y: 32 },
      { id: 'lw', role: 'LW', label: 'LM', category: 'MID', x: 20, y: 58 },
      { id: 'cm', role: 'CM', label: 'CM', category: 'MID', x: 50, y: 58 },
      { id: 'rw', role: 'RW', label: 'RM', category: 'MID', x: 80, y: 58 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 84 },
    ],
  },

  // --- 7v7 FORMATIONS ---
  {
    id: '7v7-2-3-1',
    name: '2-3-1',
    playersPerTeam: 7,
    category: '7v7',
    description: 'Standard 7-a-side layout with full wingbacks and a playmaker.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'lcb', role: 'CB', label: 'CB (L)', category: 'DEF', x: 32, y: 32 },
      { id: 'rcb', role: 'CB', label: 'CB (R)', category: 'DEF', x: 68, y: 32 },
      { id: 'lm', role: 'LW', label: 'LM', category: 'MID', x: 20, y: 58 },
      { id: 'cm', role: 'CM', label: 'CM', category: 'MID', x: 50, y: 58 },
      { id: 'rm', role: 'RW', label: 'RM', category: 'MID', x: 80, y: 58 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 84 },
    ],
  },
  {
    id: '7v7-3-2-1',
    name: '3-2-1 (Tree)',
    playersPerTeam: 7,
    category: '7v7',
    description: 'Defensive stability with a 3-man backline and double pivot.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 20, y: 32 },
      { id: 'cb', role: 'CB', label: 'CB', category: 'DEF', x: 50, y: 30 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 80, y: 32 },
      { id: 'lcm', role: 'CM', label: 'LCM', category: 'MID', x: 35, y: 58 },
      { id: 'rcm', role: 'CM', label: 'RCM', category: 'MID', x: 65, y: 58 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 84 },
    ],
  },

  // --- 8v8 FORMATIONS ---
  {
    id: '8v8-3-3-1',
    name: '3-3-1',
    playersPerTeam: 8,
    category: '8v8',
    description: 'Structured 8-a-side layout balancing flanks and central midfield.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 20, y: 30 },
      { id: 'cb', role: 'CB', label: 'CB', category: 'DEF', x: 50, y: 28 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 80, y: 30 },
      { id: 'lm', role: 'LW', label: 'LM', category: 'MID', x: 22, y: 56 },
      { id: 'cm', role: 'CM', label: 'CM', category: 'MID', x: 50, y: 56 },
      { id: 'rm', role: 'RW', label: 'RM', category: 'MID', x: 78, y: 56 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 84 },
    ],
  },
  {
    id: '8v8-3-2-2',
    name: '3-2-2',
    playersPerTeam: 8,
    category: '8v8',
    description: 'Dual strikers backed by 3 defenders and 2 central midfielders.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 12 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 20, y: 30 },
      { id: 'cb', role: 'CB', label: 'CB', category: 'DEF', x: 50, y: 28 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 80, y: 30 },
      { id: 'lcm', role: 'CM', label: 'LCM', category: 'MID', x: 35, y: 55 },
      { id: 'rcm', role: 'CM', label: 'RCM', category: 'MID', x: 65, y: 55 },
      { id: 'lst', role: 'ST', label: 'ST (L)', category: 'ATT', x: 35, y: 82 },
      { id: 'rst', role: 'ST', label: 'ST (R)', category: 'ATT', x: 65, y: 82 },
    ],
  },

  // --- 9v9 FORMATIONS ---
  {
    id: '9v9-3-3-2',
    name: '3-3-2',
    playersPerTeam: 9,
    category: '9v9',
    description: 'Classic 9-a-side layout offering width, central control, and twin strikers.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 7 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 20, y: 30 },
      { id: 'cb', role: 'CB', label: 'CB', category: 'DEF', x: 50, y: 28 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 80, y: 30 },
      { id: 'lm', role: 'LW', label: 'LM', category: 'MID', x: 20, y: 55 },
      { id: 'cm', role: 'CM', label: 'CM', category: 'MID', x: 50, y: 53 },
      { id: 'rm', role: 'RW', label: 'RM', category: 'MID', x: 80, y: 55 },
      { id: 'lst', role: 'ST', label: 'ST (L)', category: 'ATT', x: 35, y: 82 },
      { id: 'rst', role: 'ST', label: 'ST (R)', category: 'ATT', x: 65, y: 82 },
    ],
  },
  {
    id: '9v9-4-3-1',
    name: '4-3-1',
    playersPerTeam: 9,
    category: '9v9',
    description: '4 defenders for strong defensive stability and a central playmaker.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 7 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 18, y: 30 },
      { id: 'lcb', role: 'CB', label: 'CB (L)', category: 'DEF', x: 38, y: 28 },
      { id: 'rcb', role: 'CB', label: 'CB (R)', category: 'DEF', x: 62, y: 28 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 82, y: 30 },
      { id: 'lcm', role: 'CM', label: 'LCM', category: 'MID', x: 28, y: 55 },
      { id: 'cm', role: 'CAM', label: 'CAM', category: 'MID', x: 50, y: 58 },
      { id: 'rcm', role: 'CM', label: 'RCM', category: 'MID', x: 72, y: 55 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 82 },
    ],
  },

  // --- 11v11 FORMATIONS ---
  {
    id: '11v11-4-3-3',
    name: '4-3-3',
    playersPerTeam: 11,
    category: '11v11',
    description: 'The standard modern attacking formation with wingers and 3 midfielders.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 7 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 15, y: 30 },
      { id: 'lcb', role: 'CB', label: 'CB (L)', category: 'DEF', x: 38, y: 28 },
      { id: 'rcb', role: 'CB', label: 'CB (R)', category: 'DEF', x: 62, y: 28 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 85, y: 30 },
      { id: 'cdm', role: 'CDM', label: 'CDM', category: 'MID', x: 50, y: 46 },
      { id: 'lcm', role: 'CM', label: 'LCM', category: 'MID', x: 30, y: 60 },
      { id: 'rcm', role: 'CM', label: 'RCM', category: 'MID', x: 70, y: 60 },
      { id: 'lw', role: 'LW', label: 'LW', category: 'ATT', x: 18, y: 80 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 85 },
      { id: 'rw', role: 'RW', label: 'RW', category: 'ATT', x: 82, y: 80 },
    ],
  },
  {
    id: '11v11-4-4-2',
    name: '4-4-2',
    playersPerTeam: 11,
    category: '11v11',
    description: 'Classic 2-bank formation with 2 wingers and twin strikers.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 7 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 15, y: 30 },
      { id: 'lcb', role: 'CB', label: 'CB (L)', category: 'DEF', x: 38, y: 28 },
      { id: 'rcb', role: 'CB', label: 'CB (R)', category: 'DEF', x: 62, y: 28 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 85, y: 30 },
      { id: 'lm', role: 'LW', label: 'LM', category: 'MID', x: 18, y: 55 },
      { id: 'lcm', role: 'CM', label: 'LCM', category: 'MID', x: 38, y: 53 },
      { id: 'rcm', role: 'CM', label: 'RCM', category: 'MID', x: 62, y: 53 },
      { id: 'rm', role: 'RW', label: 'RM', category: 'MID', x: 82, y: 55 },
      { id: 'lst', role: 'ST', label: 'ST (L)', category: 'ATT', x: 35, y: 82 },
      { id: 'rst', role: 'ST', label: 'ST (R)', category: 'ATT', x: 65, y: 82 },
    ],
  },
  {
    id: '11v11-4-2-3-1',
    name: '4-2-3-1',
    playersPerTeam: 11,
    category: '11v11',
    description: 'Double pivot shielding defense with 3 fluid attacking midfielders.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 7 },
      { id: 'lb', role: 'LB', label: 'LB', category: 'DEF', x: 15, y: 28 },
      { id: 'lcb', role: 'CB', label: 'CB (L)', category: 'DEF', x: 38, y: 27 },
      { id: 'rcb', role: 'CB', label: 'CB (R)', category: 'DEF', x: 62, y: 27 },
      { id: 'rb', role: 'RB', label: 'RB', category: 'DEF', x: 85, y: 28 },
      { id: 'lcdm', role: 'CDM', label: 'LDM', category: 'MID', x: 35, y: 46 },
      { id: 'rcdm', role: 'CDM', label: 'RDM', category: 'MID', x: 65, y: 46 },
      { id: 'lam', role: 'CAM', label: 'LAM', category: 'MID', x: 22, y: 65 },
      { id: 'cam', role: 'CAM', label: 'CAM', category: 'MID', x: 50, y: 67 },
      { id: 'ram', role: 'CAM', label: 'RAM', category: 'MID', x: 78, y: 65 },
      { id: 'st', role: 'ST', label: 'ST', category: 'ATT', x: 50, y: 85 },
    ],
  },
  {
    id: '11v11-3-5-2',
    name: '3-5-2',
    playersPerTeam: 11,
    category: '11v11',
    description: 'Wingback flexibility with 3 central defenders and 5 midfielders.',
    slots: [
      { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 7 },
      { id: 'lcb', role: 'CB', label: 'CB (L)', category: 'DEF', x: 25, y: 28 },
      { id: 'mcb', role: 'CB', label: 'CB (C)', category: 'DEF', x: 50, y: 27 },
      { id: 'rcb', role: 'CB', label: 'CB (R)', category: 'DEF', x: 75, y: 28 },
      { id: 'lwb', role: 'LB', label: 'LWB', category: 'MID', x: 12, y: 50 },
      { id: 'cdm', role: 'CDM', label: 'CDM', category: 'MID', x: 50, y: 45 },
      { id: 'lcm', role: 'CM', label: 'LCM', category: 'MID', x: 32, y: 60 },
      { id: 'rcm', role: 'CM', label: 'RCM', category: 'MID', x: 68, y: 60 },
      { id: 'rwb', role: 'RB', label: 'RWB', category: 'MID', x: 88, y: 50 },
      { id: 'lst', role: 'ST', label: 'ST (L)', category: 'ATT', x: 35, y: 83 },
      { id: 'rst', role: 'ST', label: 'ST (R)', category: 'ATT', x: 65, y: 83 },
    ],
  },
];

export function getFormationById(id: string): Formation {
  const found = FORMATIONS.find((f) => f.id === id);
  if (found) return found;
  return FORMATIONS[0];
}

export function getDefaultFormationForCount(totalPlayers: number): Formation {
  const perTeam = Math.max(1, Math.floor(totalPlayers / 2));
  if (perTeam <= 5) return FORMATIONS.find((f) => f.category === '5v5') || FORMATIONS[0];
  if (perTeam === 6) return FORMATIONS.find((f) => f.category === '6v6') || FORMATIONS[2];
  if (perTeam === 7) return FORMATIONS.find((f) => f.category === '7v7') || FORMATIONS[4];
  if (perTeam === 8) return FORMATIONS.find((f) => f.category === '8v8') || FORMATIONS[6];
  if (perTeam === 9) return FORMATIONS.find((f) => f.category === '9v9') || FORMATIONS[8];
  return FORMATIONS.find((f) => f.category === '11v11') || FORMATIONS[10];
}

// Helper to auto-generate dynamic tactical slots for custom player counts if needed
export function generateDynamicFormation(playersPerTeam: number): Formation {
  const slots: TacticalSlot[] = [
    { id: 'gk', role: 'GK', label: 'GK', category: 'GK', x: 50, y: 7 },
  ];

  const fieldPlayers = playersPerTeam - 1;
  let defCount = Math.max(1, Math.round(fieldPlayers * 0.35));
  let attCount = Math.max(1, Math.round(fieldPlayers * 0.25));
  let midCount = fieldPlayers - defCount - attCount;
  if (midCount < 1 && fieldPlayers > 2) {
    midCount = 1;
    defCount = Math.max(1, defCount - 1);
  }

  // Generate DEF line
  for (let i = 0; i < defCount; i++) {
    const x = defCount === 1 ? 50 : 20 + (60 / (defCount - 1)) * i;
    const role = i === 0 && defCount > 1 ? 'LB' : i === defCount - 1 && defCount > 1 ? 'RB' : 'CB';
    slots.push({
      id: `def_${i}`,
      role: role as any,
      label: role,
      category: 'DEF',
      x,
      y: 30,
    });
  }

  // Generate MID line
  for (let i = 0; i < midCount; i++) {
    const x = midCount === 1 ? 50 : 20 + (60 / (midCount - 1)) * i;
    slots.push({
      id: `mid_${i}`,
      role: 'CM',
      label: 'CM',
      category: 'MID',
      x,
      y: 55,
    });
  }

  // Generate ATT line
  for (let i = 0; i < attCount; i++) {
    const x = attCount === 1 ? 50 : 25 + (50 / (attCount - 1)) * i;
    const role = i === 0 && attCount > 2 ? 'LW' : i === attCount - 1 && attCount > 2 ? 'RW' : 'ST';
    slots.push({
      id: `att_${i}`,
      role: role as any,
      label: role,
      category: 'ATT',
      x,
      y: 82,
    });
  }

  return {
    id: `custom-${playersPerTeam}`,
    name: `Dynamic ${playersPerTeam}v${playersPerTeam}`,
    playersPerTeam,
    category: `${playersPerTeam}v${playersPerTeam}`,
    description: `Auto-balanced tactical layout for ${playersPerTeam} players per side.`,
    slots,
  };
}
