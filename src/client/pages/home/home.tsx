import { Flex, Loader, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Header } from '../../components';
import { socket } from '../../socket';

import { useLobbiesQuery } from './use-lobbies-query';
import { useLobbyRedirect } from './use-lobby-redirect';
import { randomColor } from '../../util';

export const HomePage = () => {
  const lobbies = useLobbiesQuery();
  const navigate = useNavigate();

  useLobbyRedirect();

  const onHost = () => {
    socket.emit('host');
  };

  const onJoin = (id: string) => {
    navigate(`/lobby/${id}`);
  };

  return (
    <Box>
      <Stack align="center">
        <Header />
        <Button color="orange" mb="lg" onClick={onHost}>
          Host new game
        </Button>
        <Title order={2}>Join a game</Title>
        {lobbies === undefined && <Loader />}
        {lobbies && lobbies.length === 0 && (
          <Text c="gray">No public games available. Start your own!</Text>
        )}
        <Flex gap="xl" wrap="wrap">
          {lobbies &&
            lobbies.length > 0 &&
            lobbies.map((id) => (
              <Button
                key={id}
                color={randomColor(id)}
                onClick={() => onJoin(id)}
              >
                Join {id}
              </Button>
            ))}
        </Flex>
      </Stack>
    </Box>
  );
};
