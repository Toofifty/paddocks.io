import { Flex, Loader } from '@mantine/core';
import { useGameData } from './use-game-data';
import { useLobby } from '../../util';
import { Box } from '../../components';
import { Grid } from '../../components/grid';
import { socket } from '../../socket';
import { PlayerList } from '../../components/player-list';

export const GamePage = () => {
  const { lobby } = useLobby();
  const data = useGameData();

  if (!data || !lobby) {
    return <Loader />;
  }

  console.log({ data, lobby });

  const { grid, players, turn } = data;

  const onPlace = (x: number, y: number) => {
    socket.emit('place', [lobby.id, x, y]);
  };

  return (
    <Box maw="100%" fullHeight>
      <Flex gap="xl">
        <Grid
          grid={grid}
          players={lobby.players}
          turn={turn}
          currentId={socket.id}
          onClick={onPlace}
        />
        <PlayerList players={players} playerData={lobby.players} turn={turn} />
      </Flex>
    </Box>
  );
};
