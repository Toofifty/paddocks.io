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

export type GameData = {
  grid: PaddocksGrid;
  players: Record<string, GamePlayer>;
  turn: string;
};

export type GamePlayer = {
  score: number;
};

export type GateCellKind = 'post' | 'horizontal' | 'vertical' | 'paddock';

export type GateCell = {
  kind: GateCellKind;
  owner?: string;
};

/**
 */
export type PaddocksGrid = GateCell[];
