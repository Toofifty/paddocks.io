import { useMemo } from 'react';
import { GamePlayer, PlayerData } from '../../../common/data';
import { joinList, useRankings } from '../../util';
import { Flex, Modal, Stack, Title } from '@mantine/core';
import { PlayerList } from '../player-list';

interface GameOverModalProps {
  open: boolean;
  onClose: () => void;
  players: Record<string, GamePlayer>;
  playerData: PlayerData[];
}

export const GameOverModal = ({
  open,
  onClose,
  players,
  playerData,
}: GameOverModalProps) => {
  const rankings = useRankings(players);

  const rankedPlayers = useMemo(() => {
    return Object.entries(rankings)
      .sort(([, a], [, b]) => a - b)
      .map(([id, rank]) => {
        const data = playerData.find((p) => p.id === id)!;
        const { score } = players[id];
        return {
          rank,
          score,
          ...data,
        };
      });
  }, [rankings, players, playerData]);

  const highestScore = Object.values(players).reduce(
    (best, { score }) => (score > best ? score : best),
    0
  );

  const winners = rankedPlayers
    .filter(({ score }) => score === highestScore)
    .map(({ name }) => name);

  return (
    <Modal opened={open} onClose={onClose} title="Game over!" size="lg">
      <Flex justify="center" p="xl">
        <Stack align="center">
          <Title>{joinList(winners)} wins!</Title>
          <PlayerList rankings={rankings} players={rankedPlayers} turn="" />
        </Stack>
      </Flex>
    </Modal>
  );
};
