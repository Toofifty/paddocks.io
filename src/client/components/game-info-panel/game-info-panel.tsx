import { useMemo } from 'react';
import { Stack, Text } from '@mantine/core';
import { GameData, LobbyData } from '../../../common/data';
import { PlayerList } from '../player-list';

import { useRankings } from '../../util';

import styles from './game-info-panel.module.scss';

interface GameInfoPanelProps {
  game: GameData;
  lobby: LobbyData;
}

export const GameInfoPanel = ({ game, lobby }: GameInfoPanelProps) => {
  const rankings = useRankings(game.players);

  const players = useMemo(
    () =>
      Object.entries(game.players)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([id, { score }]) => {
          const data = lobby.players.find((p) => p.id === id)!;
          return {
            score,
            ...data,
          };
        }),
    [game, lobby]
  );

  return (
    <Stack align="center">
      <Text fz="xl">Paddocks left: {game.available}</Text>
      <PlayerList players={players} rankings={rankings} turn={game.turn} />
    </Stack>
  );
};
