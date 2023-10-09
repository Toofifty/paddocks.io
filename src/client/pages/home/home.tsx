import { Loader, Stack, Text, Title } from '@mantine/core';
import { Box, Button } from '../../components';
import { socket } from '../../socket';
import { useLobbyData } from '../../hooks';

import { useLobbiesQuery } from './use-lobbies-query';

export const HomePage = () => {
  const lobbies = useLobbiesQuery();

  useLobbyData();

  const onHost = () => {
    socket.emit('host');
  };

  return (
    <Box>
      <Stack align="center">
        <Title order={1}>- Super Paddocks -</Title>
        <Button color="#FF8964" mb="lg" onClick={onHost}>
          Host new game
        </Button>
        <Title order={2}>Join a game</Title>
        {lobbies === undefined && <Loader />}
        {lobbies && lobbies.length === 0 && (
          <Text c="gray">No public games available. Start your own!</Text>
        )}
      </Stack>
    </Box>
  );
};
