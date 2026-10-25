import {
  Player,
  Formation,
  DivisionResult,
  DividedTeam,
  AssignedPlayer,
  PositionCategory,
  PositionKey,
} from '../types';
import { getPositionCategory } from '../data/positions';

// Fisher-Yates array shuffle
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get the main category for a player based on preferred positions
function getPlayerPrimaryCategory(player: Player): PositionCategory {
  if (!player.preferredPositions || player.preferredPositions.length === 0) {
    return 'MID';
  }
  if (player.preferredPositions.includes('GK')) return 'GK';

  const counts: Record<PositionCategory, number> = { GK: 0, DEF: 0, MID: 0, ATT: 0 };
  player.preferredPositions.forEach((pos) => {
    const cat = getPositionCategory(pos);
    counts[cat] = (counts[cat] || 0) + 1;
  });

  let maxCat: PositionCategory = 'MID';
  let maxCount = -1;
  (['GK', 'DEF', 'MID', 'ATT'] as PositionCategory[]).forEach((cat) => {
    if (counts[cat] > maxCount) {
      maxCount = counts[cat];
      maxCat = cat;
    }
  });

  return maxCat;
}

// Helper to build a completely dynamic field lineup placing ALL players on the pitch
function buildTeamLineup(teamPlayers: Player[]): AssignedPlayer[] {
  if (teamPlayers.length === 0) return [];

  const players = [...teamPlayers];
  const assigned: AssignedPlayer[] = [];

  // 1. Separate Goalkeeper
  let gkIndex = players.findIndex((p) => p.preferredPositions.includes('GK'));
  if (gkIndex === -1) {
    gkIndex = 0; // Pick first available player
  }
  const gkPlayer = players.splice(gkIndex, 1)[0];
  assigned.push({
    player: gkPlayer,
    assignedPosition: 'GK',
    isOutCategory: !gkPlayer.preferredPositions.includes('GK'),
    isOutExact: !gkPlayer.preferredPositions.includes('GK'),
    isCaptain: false,
    slotId: 'gk',
    x: 50,
    y: 12,
  });

  if (players.length === 0) return assigned;

  // 2. Classify remaining field players into DEF, MID, ATT based on preferred positions
  const defs: Player[] = [];
  const mids: Player[] = [];
  const atts: Player[] = [];

  players.forEach((p) => {
    const cat = getPlayerPrimaryCategory(p);
    if (cat === 'DEF') defs.push(p);
    else if (cat === 'ATT') atts.push(p);
    else mids.push(p);
  });

  // Ensure balance across lines if one line is empty
  const totalField = players.length;
  if (defs.length === 0 && totalField >= 2) {
    if (mids.length > 0) defs.push(mids.pop()!);
    else if (atts.length > 0) defs.push(atts.pop()!);
  }
  if (atts.length === 0 && totalField >= 3) {
    if (mids.length > 0) atts.push(mids.pop()!);
    else if (defs.length > 1) atts.push(defs.pop()!);
  }

  // Calculate horizontal spacing across the pitch (x: 15% to 85%)
  const calculateXCoords = (count: number): number[] => {
    if (count <= 0) return [];
    if (count === 1) return [50];
    if (count === 2) return [32, 68];
    if (count === 3) return [20, 50, 80];
    if (count === 4) return [18, 38, 62, 82];
    if (count === 5) return [15, 32, 50, 68, 85];
    const step = 70 / (count - 1);
    return Array.from({ length: count }, (_, i) => Math.round(15 + i * step));
  };

  const assignLine = (
    linePlayers: Player[],
    category: 'DEF' | 'MID' | 'ATT',
    yCoord: number,
    rolesMap: PositionKey[]
  ) => {
    const xCoords = calculateXCoords(linePlayers.length);
    linePlayers.forEach((p, idx) => {
      const role =
        p.preferredPositions.find((pos) => getPositionCategory(pos) === category) ||
        p.preferredPositions[0] ||
        rolesMap[idx % rolesMap.length] ||
        (category === 'DEF' ? 'CB' : category === 'ATT' ? 'ST' : 'CM');

      const isExact = p.preferredPositions.includes(role);
      const isCat = p.preferredPositions.some((pos) => getPositionCategory(pos) === category);

      assigned.push({
        player: p,
        assignedPosition: role,
        isOutCategory: !isCat,
        isOutExact: !isExact,
        isCaptain: false,
        slotId: `${category.toLowerCase()}_${idx}`,
        x: xCoords[idx],
        y: yCoord,
      });
    });
  };

  // Assign DEF line (y = 30)
  assignLine(defs, 'DEF', 30, ['CB', 'LB', 'RB', 'CB']);

  // Assign MID line (y = 56)
  assignLine(mids, 'MID', 56, ['CM', 'CAM', 'CM', 'CDM']);

  // Assign ATT line (y = 82)
  assignLine(atts, 'ATT', 82, ['ST', 'LW', 'RW', 'ST']);

  return assigned;
}

export function generateBalancedTeams(
  players: Player[],
  formation: Formation
): DivisionResult {
  if (!players || players.length === 0) {
    return {
      teamA: {
        id: 'teamA',
        name: 'Team Blue',
        color: '#00F0FF',
        secondaryColor: '#0088CC',
        captainId: null,
        assignedPlayers: [],
        benchPlayers: [],
      },
      teamB: {
        id: 'teamB',
        name: 'Team Green',
        color: '#00FF66',
        secondaryColor: '#009933',
        captainId: null,
        assignedPlayers: [],
        benchPlayers: [],
      },
      unassignedPlayers: [],
      formation,
      generatedAt: Date.now(),
    };
  }

  // Shuffle players first to ensure randomness
  const shuffledPlayers = shuffleArray(players);

  // Group players by primary category
  const categories: Record<PositionCategory, Player[]> = {
    GK: [],
    DEF: [],
    MID: [],
    ATT: [],
  };

  shuffledPlayers.forEach((player) => {
    const cat = getPlayerPrimaryCategory(player);
    categories[cat].push(player);
  });

  const teamAPlayers: Player[] = [];
  const teamBPlayers: Player[] = [];

  const distributeList = (list: Player[]) => {
    const shuffledList = shuffleArray(list);
    shuffledList.forEach((player) => {
      if (teamAPlayers.length < teamBPlayers.length) {
        teamAPlayers.push(player);
      } else if (teamBPlayers.length < teamAPlayers.length) {
        teamBPlayers.push(player);
      } else {
        if (Math.random() < 0.5) {
          teamAPlayers.push(player);
        } else {
          teamBPlayers.push(player);
        }
      }
    });
  };

  distributeList(categories.GK);
  distributeList(categories.DEF);
  distributeList(categories.MID);
  distributeList(categories.ATT);

  // Build fluid pitch lineup for all players in each team
  const assignedA = buildTeamLineup(teamAPlayers);
  const assignedB = buildTeamLineup(teamBPlayers);

  // Pick random captain for each team
  let captainAId: string | null = null;
  if (assignedA.length > 0) {
    const randomIdx = Math.floor(Math.random() * assignedA.length);
    captainAId = assignedA[randomIdx].player.id;
  }

  let captainBId: string | null = null;
  if (assignedB.length > 0) {
    const randomIdx = Math.floor(Math.random() * assignedB.length);
    captainBId = assignedB[randomIdx].player.id;
  }

  const finalAssignedA = assignedA.map((ap) => ({
    ...ap,
    isCaptain: ap.player.id === captainAId,
  }));

  const finalAssignedB = assignedB.map((ap) => ({
    ...ap,
    isCaptain: ap.player.id === captainBId,
  }));

  const teamA: DividedTeam = {
    id: 'teamA',
    name: 'Team Blue',
    color: '#00F0FF',
    secondaryColor: '#0088CC',
    captainId: captainAId,
    assignedPlayers: finalAssignedA,
    benchPlayers: [],
  };

  const teamB: DividedTeam = {
    id: 'teamB',
    name: 'Team Green',
    color: '#00FF66',
    secondaryColor: '#009933',
    captainId: captainBId,
    assignedPlayers: finalAssignedB,
    benchPlayers: [],
  };

  const dynamicFormation: Formation = {
    id: 'custom-fluid',
    name: `Dynamic Custom (${teamAPlayers.length}v${teamBPlayers.length})`,
    playersPerTeam: Math.max(teamAPlayers.length, teamBPlayers.length),
    category: `${teamAPlayers.length}v${teamBPlayers.length}`,
    description: `Custom fluid lineup incorporating all ${players.length} players.`,
    slots: [],
  };

  return {
    teamA,
    teamB,
    unassignedPlayers: [],
    formation: dynamicFormation,
    generatedAt: Date.now(),
  };
}
