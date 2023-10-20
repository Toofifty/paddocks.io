import { AbilityKind } from '../common/data';
import { deepCopy } from './deep-copy';
import { Game } from './game';

const cullPaddocks = (game: Game) => {
  for (let y = 1; y < game.size; y += 2) {
    for (let x = 1; x < game.size; x += 2) {
      const cell = game.get(x, y);
      if (cell.owner) {
        const north = game.get(x, y - 1);
        const east = game.get(x + 1, y);
        const south = game.get(x, y + 1);
        const west = game.get(x - 1, y);
        if (!(north.owner && east.owner && south.owner && west.owner)) {
          cell.owner = undefined;
        }
      }
    }
  }
};

export const useAbilities: Record<AbilityKind, (game: Game) => void> = {
  'x-shift': (game) => {
    const shift = 2;
    const newGrid = deepCopy(game.grid);
    for (let i = 0; i < game.size; i++) {
      for (let j = 0; j < game.size; j++) {
        const source = game.get(i, j);
        const x = i + shift - (i + shift >= game.size ? game.size - 1 : 0);
        const index = game.toIndex(x, j);
        newGrid[index] = source;
      }
    }
    game.grid = newGrid;
    cullPaddocks(game);
  },
  'y-shift': (game) => {
    const shift = 2;
    const newGrid = deepCopy(game.grid);
    for (let i = 0; i < game.size; i++) {
      for (let j = 0; j < game.size; j++) {
        const source = game.get(i, j);
        const y = j - shift + (j - shift < 0 ? game.size - 1 : 0);
        const index = game.toIndex(i, y);
        newGrid[index] = source;
      }
    }
    game.grid = newGrid;
    cullPaddocks(game);
  },
  rotate: (game) => {
    const newGrid = deepCopy(game.grid);
    for (let i = 0; i < game.size; i++) {
      for (let j = 0; j < game.size; j++) {
        const source = game.get(i, j);
        const index = game.toIndex(game.size - 1 - j, i);
        newGrid[index] = deepCopy(source);
        if (source.kind === 'horizontal') {
          newGrid[index].kind = 'vertical';
        } else if (source.kind === 'vertical') {
          newGrid[index].kind = 'horizontal';
        }
      }
    }
    game.grid = newGrid;
  },
  'parallel-place': () => {},
  'corner-place': () => {},
  skip: () => {},
  undo: (game) => {
    if (!game.lastGrid) {
      throw new Error("You can't undo right now");
    }
    game.grid = game.lastGrid;
    game.lastGrid = undefined;
  },
  scramble: () => {},
  'super-scramble': () => {},
};
