import { AbilityKind } from './data';

export type Ability = {
  name: string;
  description: string;
  level: 1 | 2 | 3;
  endsTurn: boolean;
  timid: number;
  mild: number;
  chaotic: number;
};

export const abilities: Record<AbilityKind, Ability> = {
  'x-shift': {
    name: 'Horizontal shift',
    description:
      'Shift the game area to the right by 1 cell - breaking existing paddocks that lose their gates.',
    level: 1,
    endsTurn: true,
    timid: 2,
    mild: 4,
    chaotic: 8,
  },
  'y-shift': {
    name: 'Vertical shift',
    description:
      'Shift the game area upwards by 1 cell - breaking existing paddocks that lose their gates.',
    level: 1,
    endsTurn: true,
    timid: 2,
    mild: 4,
    chaotic: 8,
  },
  rotate: {
    name: 'Rotate',
    description: 'Rotate the game board by 90 degrees',
    level: 1,
    endsTurn: false,
    timid: 2,
    mild: 4,
    chaotic: 8,
  },
  'parallel-place': {
    name: 'Place two (parallel)',
    description:
      'Place two gates at once, across from each other. Press R to change placement of the second gate.',
    level: 2,
    endsTurn: false,
    timid: 1,
    mild: 2,
    chaotic: 4,
  },
  'corner-place': {
    name: 'Place two (corner)',
    description:
      'Place two gates at once, directly next to each other. Press R to change placement of the second gate.',
    level: 2,
    endsTurn: false,
    timid: 1,
    mild: 2,
    chaotic: 4,
  },
  skip: {
    name: 'Skip',
    description: 'Skips your turn.',
    level: 1,
    endsTurn: true,
    timid: 0,
    mild: 4,
    chaotic: 8,
  },
  undo: {
    name: 'Undo',
    description:
      "Undo the last player's move, including any abilities used. Abilities aren't refunded.",
    level: 2,
    endsTurn: false,
    timid: 0,
    mild: 1,
    chaotic: 3,
  },
  scramble: {
    name: 'Scramble',
    description:
      "Scramble the game board - randomly moving any gates not connected to paddocks. This won't create any new paddocks.",
    level: 2,
    endsTurn: true,
    timid: 0,
    mild: 1,
    chaotic: 4,
  },
  'super-scramble': {
    name: 'SUPER SCRAMBLE',
    description:
      'Completely scramble the game board. New paddocks created are distributed to random players.',
    level: 3,
    endsTurn: true,
    timid: 0,
    mild: 0,
    chaotic: 2,
  },
};
