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
        <Button color="#FF8964" mb="lg" onClick={onHost}>
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
        {/* <Flex gap="xl" wrap="wrap">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`style-${i}`}
              style={{
                padding: 60,
                borderWidth: 4,
                borderStyle: 'solid',
                borderRadius: 8,
              }}
            >
              <p
                className={`style-${i}-block`}
                style={{
                  borderWidth: 3,
                  borderStyle: 'solid',
                  borderRadius: 8,
                  padding: 10,
                  color: 'white',
                }}
              >
                Style {i}
              </p>
            </div>
          ))}
        </Flex> */}
      </Stack>
    </Box>
  );
};
