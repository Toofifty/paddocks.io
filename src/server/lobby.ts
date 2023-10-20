import { GameOptions, LobbyData, PlayerData } from '../common/data';
import { getDefaultPlayerData } from './default-player-data';
import { Game } from './game';

export class Lobby {
  private players: PlayerData[] = [];
  public game: Game | undefined;

  private options: GameOptions = {
    fieldSize: 8,
    timeLimit: 20,
    superpowers: 'none',
  };

  constructor(private id: string, private hostId: string) {}

  public join(playerId: string, playerData?: Omit<PlayerData, 'id'>) {
    if (this.gameStarted()) {
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
        ...(playerData ?? getDefaultPlayerData(this.players)),
      });
    }
  }

  public customize(playerId: string, playerData: Omit<PlayerData, 'id'>) {
    if (this.hasPlayer(playerId)) {
      const index = this.players.findIndex((p) => p.id === playerId);
      this.players[index] = {
        ...this.players[index],
        id: playerId,
        ...playerData,
      };
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

  public start() {
    this.game = new Game(
      this.options,
      this.players.map((player) => player.id)
    );
  }

  public gameStarted() {
    return !!this.game;
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
