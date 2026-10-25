import { DivisionResult } from '../types';

export function formatTeamsForWhatsApp(result: DivisionResult): string {
  if (!result || (!result.teamA && !result.teamB)) {
    return 'No teams generated yet.';
  }

  const { teamA, teamB, formation } = result;

  let text = `*XG MATCH SQUADS*\n`;
  text += `Formation: *${formation.name}* (${formation.category})\n`;
  text += `---------------------------------\n\n`;

  // Team A
  text += `*${teamA.name.toUpperCase()}*\n`;
  if (teamA.assignedPlayers.length === 0) {
    text += `(No players)\n`;
  } else {
    teamA.assignedPlayers.forEach((ap) => {
      const captainTag = ap.isCaptain ? ' (C)' : '';
      text += `${ap.assignedPosition} - ${ap.player.name}${captainTag}\n`;
    });
  }

  if (teamA.benchPlayers.length > 0) {
    text += `\n*Substitutes (${teamA.name}):*\n`;
    teamA.benchPlayers.forEach((bp) => {
      text += `SUB - ${bp.name}\n`;
    });
  }

  text += `\n---------------------------------\n\n`;

  // Team B
  text += `*${teamB.name.toUpperCase()}*\n`;
  if (teamB.assignedPlayers.length === 0) {
    text += `(No players)\n`;
  } else {
    teamB.assignedPlayers.forEach((ap) => {
      const captainTag = ap.isCaptain ? ' (C)' : '';
      text += `${ap.assignedPosition} - ${ap.player.name}${captainTag}\n`;
    });
  }

  if (teamB.benchPlayers.length > 0) {
    text += `\n*Substitutes (${teamB.name}):*\n`;
    teamB.benchPlayers.forEach((bp) => {
      text += `SUB - ${bp.name}\n`;
    });
  }

  text += `\n---------------------------------\n`;
  text += `Generated with XG`;

  return text;
}

export function formatTeamsPlainText(result: DivisionResult): string {
  if (!result) return '';
  const { teamA, teamB, formation } = result;

  let text = `FOOTBALL MATCH SQUADS\nFormation: ${formation.name}\n\n`;

  text += `=== ${teamA.name} ===\n`;
  teamA.assignedPlayers.forEach((ap) => {
    text += `${ap.assignedPosition} - ${ap.player.name}${ap.isCaptain ? ' (Captain)' : ''}\n`;
  });
  if (teamA.benchPlayers.length > 0) {
    text += `Subs: ${teamA.benchPlayers.map((p) => p.name).join(', ')}\n`;
  }

  text += `\n=== ${teamB.name} ===\n`;
  teamB.assignedPlayers.forEach((ap) => {
    text += `${ap.assignedPosition} - ${ap.player.name}${ap.isCaptain ? ' (Captain)' : ''}\n`;
  });
  if (teamB.benchPlayers.length > 0) {
    text += `Subs: ${teamB.benchPlayers.map((p) => p.name).join(', ')}\n`;
  }

  return text;
}
