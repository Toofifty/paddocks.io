import { useMemo } from 'react';
import { Stack } from '@mantine/core';
import { GamePlayer, PlayerData } from '../../../common/data';

import { PlayerListItem } from './player-list-item';

import styles from './player-list.module.scss';

interface PlayerListProps {
  players: Record<string, GamePlayer>;
  playerData: PlayerData[];
  turn: string;
}

export const PlayerList = ({
  players: playerScores,
  playerData,
  turn,
}: PlayerListProps) => {
  const places = useMemo(() => {
    const ordered = Object.fromEntries(
      Object.entries(playerScores).sort(([, a], [, b]) => b.score - a.score)
    );

    let position = 1;
    let lastScore = 0;
    return Object.fromEntries(
      Object.entries(ordered).map(([id, { score }]) => {
        if (lastScore > 0 && score < lastScore) {
          position++;
        }
        lastScore = score;

        return [id, position];
      })
    );
  }, [playerScores]);

  const players = useMemo(
    () =>
      Object.entries(playerScores)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([id, { score }]) => {
          const data = playerData.find((p) => p.id === id)!;
          return {
            score,
            ...data,
          };
        }),
    [playerScores, playerData]
  );

  return (
    <Stack className={styles.playerList}>
      {players.map((player) => (
        <PlayerListItem
          key={player.id}
          {...player}
          current={player.id === turn}
          place={places[player.id]}
        />
      ))}
    </Stack>
  );
};
