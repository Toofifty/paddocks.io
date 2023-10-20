import { Flex, Loader, useMantineTheme } from '@mantine/core';
import { useGameData } from './use-game-data';
import { useLobby } from '../../util';
import { Box } from '../../components';
import { Grid } from '../../components/grid';
import { socket } from '../../socket';
import { GameInfoPanel } from '../../components/game-info-panel';
import { useMediaQuery } from '@mantine/hooks';

export const GamePage = () => {
  const { lobby } = useLobby();
  const game = useGameData();

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  if (!game || !lobby) {
    return <Loader />;
  }

  const onPlace = (x: number, y: number) => {
    socket.emit('place', [lobby.id, x, y]);
  };

  return (
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
  );
};
