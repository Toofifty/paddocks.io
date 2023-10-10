import {
  GameData,
  GameOptions,
  GamePlayer,
  PaddocksGrid,
} from '../common/data';
import { shuffle } from './shuffle';

export class Game {
  private players: string[];
  private turn = 0;
  private size: number;
  private grid: PaddocksGrid = [];

  constructor(private options: GameOptions, players: string[]) {
    this.players = shuffle(players);
    this.size = options.fieldSize * 2 + 1;

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
    cell.owner = player;
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

  getScores(): Record<string, GamePlayer> {
    const scores: Record<string, GamePlayer> = Object.fromEntries(
      this.players.map((player) => [player, { score: 0 }])
    );

    this.grid.forEach((cell) => {
      if (cell.kind === 'paddock' && cell.owner) {
        scores[cell.owner].score++;
      }
    });

    return scores;
  }

  getData(): GameData {
    return {
      grid: this.grid,
      players: this.getScores(),
      turn: this.players[this.turn],
    };
  }
}
