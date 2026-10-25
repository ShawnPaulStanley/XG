import { Player } from '../types';

export const CUSTOM_18_PLAYERS: Omit<Player, 'id' | 'createdAt'>[] = [
  { name: 'Leonal', preferredPositions: ['CM', 'CB'], kitNumber: 10, isAttending: true },
  { name: 'Pradeep', preferredPositions: ['CM', 'CB'], kitNumber: 8, isAttending: true },
  { name: 'rhenius', preferredPositions: ['ST', 'CAM'], kitNumber: 7, isAttending: true },
  { name: 'Allen', preferredPositions: ['CB', 'CM'], kitNumber: 4, isAttending: true },
  { name: 'Shawn', preferredPositions: ['CM', 'CAM', 'CDM'], kitNumber: 6, isAttending: true },
  { name: 'Jenoh sam', preferredPositions: ['CM', 'ST'], kitNumber: 11, isAttending: true },
  { name: 'Sam', preferredPositions: ['ST'], kitNumber: 3, isAttending: true },
  { name: 'Kavin', preferredPositions: ['CB'], kitNumber: 5, isAttending: true },
  { name: 'garwin', preferredPositions: ['CB', 'CM'], kitNumber: 14, isAttending: true },
  { name: 'Issac', preferredPositions: ['ST', 'CAM'], kitNumber: 12, isAttending: true },
  { name: 'Kingston', preferredPositions: ['GK', 'CB'], kitNumber: 1, isAttending: true },
  { name: 'Jasfer', preferredPositions: ['GK', 'CB'], kitNumber: 13, isAttending: true },
  { name: 'Roshan', preferredPositions: ['ST'], kitNumber: 9, isAttending: true },
  { name: 'Britny', preferredPositions: ['CB', 'CM'], kitNumber: 15, isAttending: true },
  { name: 'Vamsi', preferredPositions: ['ST'], kitNumber: 17, isAttending: true },
  { name: 'Sandeep', preferredPositions: ['CM'], kitNumber: 77, isAttending: true },
  { name: 'Ritwick', preferredPositions: ['GK', 'CB'], kitNumber: 18, isAttending: true },
  { name: 'ashwin', preferredPositions: ['CB', 'CM'], kitNumber: 20, isAttending: true },
  { name: 'Joshua', preferredPositions: ['ST'], kitNumber: 19, isAttending: true },
];

export const SAMPLE_ROSTERS: { name: string; description: string; count: number; players: Omit<Player, 'id' | 'createdAt'>[] }[] = [
  {
    name: 'Full Custom Squad (19 Players)',
    description: 'All 19 custom squad members with updated positions.',
    count: 19,
    players: CUSTOM_18_PLAYERS,
  },
];


