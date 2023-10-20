import { useEffect, useState } from 'react';
import { Flex, Loader, Stack, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { useGameData } from './use-game-data';
import { useLobby } from '../../util';
import { Box } from '../../components';
import { Grid } from '../../components/grid';
import { socket } from '../../socket';
import { GameInfoPanel } from '../../components/game-info-panel';
import { GameOverModal } from '../../components/game-over-modal';
import { useAudio } from '../../util/audio';
import { AbilityPanel } from '../../components/ability-panel';

export const GamePage = () => {
  const { lobby } = useLobby();
  const game = useGameData();
  const [audio] = useAudio();

  const [gameOverModalOpen, setGameOverModalOpen] = useState(false);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  useEffect(() => {
    if (game?.available === 0) {
      setGameOverModalOpen(true);
    }
  }, [game?.available]);

  useEffect(() => {
    if (game?.turn === socket.id) {
      audio?.play();
    }
  }, [game?.turn, audio]);

  if (!game || !lobby) {
    return <Loader />;
  }

  const thisPlayer = game.players[socket.id];

  const onPlace = (x: number, y: number) => {
    socket.emit('place', [lobby.id, x, y]);
  };

  return (
    <>
      <GameOverModal
        open={gameOverModalOpen}
        onClose={() => setGameOverModalOpen(false)}
        players={game.players}
        playerData={lobby.players}
      />
      <Box maw="min-content">
        <Stack>
          {lobby.options.superpowers != 'none' && (
            <AbilityPanel
              player={thisPlayer}
              currentTurn={game.turn === socket.id}
            />
          )}
          <Flex
            gap="xl"
            direction={isMobile ? 'column' : 'row'}
            align={isMobile ? 'center' : 'flex-start'}
          >
            <Grid
              grid={game.grid}
              players={lobby.players}
              turn={game.turn}
              currentId={socket.id}
              onClick={onPlace}
            />
            <GameInfoPanel game={game} lobby={lobby} />
          </Flex>
        </Stack>
      </Box>
    </>
  );
};
