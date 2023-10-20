import { abilities } from '../common/abilities';
import {
  AbilityKind,
  AbilityStatus,
  GameData,
  GameOptions,
  GamePlayer,
  PaddocksGrid,
} from '../common/data';
import { deepCopy } from './deep-copy';
import { shuffle } from './shuffle';
import { useAbilities } from './use-abilities';

export class Game {
  public players: string[];
  public turn = 0;
  public size: number;
  public lastGrid?: PaddocksGrid;
  public grid: PaddocksGrid = [];
  public playerAbilities: Record<
    string,
    Partial<Record<AbilityKind, AbilityStatus>>
  > = {};
  public activeAbility?: AbilityKind;

  constructor(private options: GameOptions, players: string[]) {
    this.players = shuffle(players);
    this.size = options.fieldSize * 2 + 1;

    // build grid
    this.grid = new Array(this.size * this.size).fill(undefined).map((_, i) => {
      const [x, y] = this.toXY(i);
      if (x % 2 === 0 && y % 2 === 0) {
        return { kind: 'post' };
      }
      if (x % 2 === 0) {
        return { kind: 'vertical' };
      }
      if (y % 2 === 0) {
        return { kind: 'horizontal' };
      }
      return { kind: 'paddock' };
    });

    // fill abilities
    if (options.superpowers !== 'none') {
      this.players.forEach((player) => {
        this.playerAbilities[player] = {};
        Object.entries(abilities).forEach(([kind, ability]) => {
          this.playerAbilities[player][kind as AbilityKind] = {
            amount:
              ability[options.superpowers as 'timid' | 'mild' | 'chaotic'],
            usedThisTurn: false,
          };
        });
      });
    }
  }

  toIndex(x: number, y: number) {
    return x + y * this.size;
  }

  toXY(index: number) {
    return [index % this.size, Math.floor(index / this.size)];
  }

  get(x: number, y: number) {
    return this.grid[this.toIndex(x, y)];
  }

  isGate(x: number, y: number) {
    return x % 2 !== y % 2;
  }

  place(x: number, y: number, player: string) {
    if (this.players[this.turn] !== player) {
      throw new Error("It's not your turn");
    }
    if (!this.isGate(x, y)) {
      throw new Error('Invalid placement');
    }
    const cell = this.grid[this.toIndex(x, y)];
    if (cell.owner) {
      throw new Error('Gate is already placed');
    }
    this.lastGrid = deepCopy(this.grid);

    cell.owner = player;
    const claimed = this.computePaddocks(player);
    if (claimed === 0) {
      this.nextTurn();
    }
  }

  placeTwo(x1: number, y1: number, x2: number, y2: number, player: string) {
    if (
      !['parallel-place', 'corner-place'].includes(this.activeAbility ?? '')
    ) {
      throw new Error("You can't do that right now");
    }
    if (this.players[this.turn] !== player) {
      throw new Error("It's not your turn");
    }
    if (!this.isGate(x1, y1) || !this.isGate(x2, y2)) {
      throw new Error('Invalid placement');
    }
    const cell1 = this.grid[this.toIndex(x1, y1)];
    const cell2 = this.grid[this.toIndex(x2, y2)];
    if (cell1.owner || cell2.owner) {
      throw new Error('Gate is already placed');
    }
    this.lastGrid = deepCopy(this.grid);
    cell1.owner = player;
    cell2.owner = player;
    const claimed = this.computePaddocks(player);
    if (claimed === 0) {
      this.nextTurn();
    }
  }

  computePaddocks(player: string) {
    let claimed = 0;
    for (let y = 1; y < this.size; y += 2) {
      for (let x = 1; x < this.size; x += 2) {
        const cell = this.get(x, y);
        if (!cell.owner) {
          const north = this.get(x, y - 1);
          const east = this.get(x + 1, y);
          const south = this.get(x, y + 1);
          const west = this.get(x - 1, y);
          if (north.owner && east.owner && south.owner && west.owner) {
            cell.owner = player;
            claimed++;
          }
        }
      }
    }
    return claimed;
  }

  nextTurn() {
    this.turn++;
    if (this.turn >= this.players.length) {
      this.turn = 0;
    }
  }

  useAbility(kind: AbilityKind, player: string) {
    if (this.players[this.turn] !== player) {
      throw new Error("It's not your turn");
    }

    const ability = abilities[kind];
    useAbilities[kind](this);
    if (ability.endsTurn) {
      this.nextTurn();
    } else {
      this.activeAbility = kind;
    }
  }

  getPlayerData(): Record<string, GamePlayer> {
    const data: Record<string, GamePlayer> = Object.fromEntries(
      this.players.map((player, order) => [
        player,
        { score: 0, order, abilities: this.playerAbilities[player] },
      ])
    );

    this.grid.forEach((cell) => {
      if (cell.kind === 'paddock' && cell.owner) {
        data[cell.owner].score++;
      }
    });

    return data;
  }

  getAvailablePaddocks(): number {
    return this.grid.filter((cell) => cell.kind === 'paddock' && !cell.owner)
      .length;
  }

  getData(): GameData {
    const available = this.getAvailablePaddocks();
    return {
      grid: this.grid,
      players: this.getPlayerData(),
      turn: available > 0 ? this.players[this.turn] : '',
      available,
      activeAbility: this.activeAbility,
    };
  }
}
