import { Stack } from '@mantine/core';

import { PlayerListItem } from './player-list-item';

import styles from './player-list.module.scss';

interface PlayerListProps {
  players: {
    id: string;
    name: string;
    avatarId: number;
    styleId: number;
    score: number;
  }[];
  turn: string;
  rankings: Record<string, number>;
}

export const PlayerList = ({ players, rankings, turn }: PlayerListProps) => (
  <Stack className={styles.playerList}>
    {players.map((player) => (
      <PlayerListItem
        key={player.id}
        {...player}
        current={player.id === turn}
        place={rankings[player.id]}
      />
    ))}
  </Stack>
);
