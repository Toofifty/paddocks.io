export type LobbyData = {
  id: string;
  hostId: string;
  options: GameOptions;
  players: PlayerData[];
};

export type PlayerData = {
  id: string;
  name: string;
  avatarId: number;
  styleId: number;
};

export type GameOptions = {
  fieldSize: number;
  timeLimit: number;
  superpowers: Superpower;
};

export type Superpower = 'none' | 'timid' | 'mild' | 'chaotic';
