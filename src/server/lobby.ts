import { GameOptions, LobbyData, PlayerData } from '../common/data';

const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const NAMES = ['Bort', 'Dork', 'Dingus', 'Doofus', 'Goofer'];

const defaultPlayer = (others: PlayerData[]): Omit<PlayerData, 'id'> => {
  const avatars = others.map((p) => p.avatarId);
  const styles = others.map((p) => p.styleId);

  return {
    name:
      NAMES[Math.floor(Math.random() * NAMES.length)] +
      '-' +
      (Math.random() * 100).toFixed(0),
    avatarId:
      shuffle([0, 1, 2, 3, 4, 5, 6, 7]).find((i) => !avatars.includes(i)) ??
      shuffle([0, 1, 2, 3, 4, 5, 6, 7])[0],
    styleId:
      shuffle([0, 1, 2, 3, 4, 5, 6, 7]).find((i) => !styles.includes(i)) ??
      shuffle([0, 1, 2, 3, 4, 5, 6, 7])[0],
  };
};

export class Lobby {
  private started = false;
  private players: PlayerData[] = [];

  private options: GameOptions = {
    fieldSize: 10,
    timeLimit: 20,
    superpowers: 'none',
  };

  constructor(private readonly id: string, private hostId: string) {}

  public join(playerId: string, playerData?: Omit<PlayerData, 'id'>) {
    if (this.started) {
      throw new Error('Game already started!');
    }

    if (this.players.length >= 8) {
      throw new Error('Lobby is full!');
    }

    if (this.hasPlayer(playerId)) {
      const index = this.players.findIndex((p) => p.id === playerId);
      this.players[index] = {
        ...this.players[index],
        id: playerId,
        ...playerData,
      };
      return;
    } else {
      this.players.push({
        id: playerId,
        ...(playerData ?? defaultPlayer(this.players)),
      });
    }
  }

  public hasPlayer(playerId: string) {
    return this.players.find((p) => p.id === playerId);
  }

  public leave(playerId: string): boolean {
    this.players = this.players.filter(({ id }) => id !== playerId);
    if (this.players.length === 0) {
      // destroy
      return true;
    }
    if (playerId === this.hostId) {
      this.hostId = this.players[0].id;
    }
    return false;
  }

  public gameStarted() {
    return this.started;
  }

  public isHost(playerId: string) {
    return playerId === this.hostId;
  }

  public setOption<T extends keyof GameOptions>(key: T, value: GameOptions[T]) {
    this.options[key] = value;
  }

  public getData(): LobbyData {
    return {
      id: this.id,
      hostId: this.hostId,
      options: this.options,
      players: this.players,
    };
  }
}
