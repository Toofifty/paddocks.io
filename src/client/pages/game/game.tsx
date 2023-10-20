import { useEffect, useState } from 'react';
import { Flex, Loader, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { useGameData } from './use-game-data';
import { useLobby } from '../../util';
import { Box } from '../../components';
import { Grid } from '../../components/grid';
import { socket } from '../../socket';
import { GameInfoPanel } from '../../components/game-info-panel';
import { GameOverModal } from '../../components/game-over-modal';

export const GamePage = () => {
  const { lobby } = useLobby();
  const game = useGameData();

  const [gameOverModalOpen, setGameOverModalOpen] = useState(false);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  useEffect(() => {
    if (game?.available === 0) {
      setGameOverModalOpen(true);
    }
  }, [game?.available]);

  if (!game || !lobby) {
    return <Loader />;
  }

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
      </Box>
    </>
  );
};
