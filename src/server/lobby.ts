import { LobbyData } from '../common/data';

export class Lobby {
  private started = false;

  constructor(private readonly id: string, private readonly hostId: string) {}

  public gameStarted() {
    return this.started;
  }

  public getData(): LobbyData {
    return {
      id: this.id,
    };
  }
}
