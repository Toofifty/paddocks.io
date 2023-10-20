import { AbilityKind } from '../common/data';
import { Game } from './game';

export const useAbilities: Record<AbilityKind, (game: Game) => void> = {
  'x-shift': () => {},
  'y-shift': () => {},
  rotate: () => {},
  'parallel-place': () => {},
  'corner-place': () => {},
  skip: () => {},
  undo: () => {},
  scramble: () => {},
  'super-scramble': () => {},
};
