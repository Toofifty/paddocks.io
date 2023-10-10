import { Loader } from '@mantine/core';
import { useGameData } from './use-game-data';
import { useLobby } from '../../util';
import { Box } from '../../components';
import { Grid } from '../../components/grid';
import { socket } from '../../socket';

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
    <Box>
      <Grid
        grid={grid}
        players={lobby.players}
        turn={turn}
        currentId={socket.id}
        onClick={onPlace}
      />
    </Box>
  );
};
