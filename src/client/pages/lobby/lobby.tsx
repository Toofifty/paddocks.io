import {
  Flex,
  SegmentedControl,
  Slider,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Box, Button, Header, Player } from '../../components';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';
import { useErrorMessages, useLobby } from '../../util';
import { useRedirectOnStart } from './use-redirect-on-start';
import { useEffect } from 'react';

export const LobbyPage = () => {
  useErrorMessages();
  useRedirectOnStart();

  const { id } = useParams<{ id: string }>();
  const { lobby, setId } = useLobby();

  useEffect(() => {
    id && setId(id);
  }, [id, setId]);

  if (!lobby) {
    return null;
  }

  const setFieldSize = (size: number) => {
    socket.emit('set-lobby-option', [id, 'fieldSize', size]);
  };

  const setTimeLimit = (timeLimit: number) => {
    socket.emit('set-lobby-option', [id, 'timeLimit', timeLimit]);
  };

  const setSuperpowers = (superpowers: string) => {
    socket.emit('set-lobby-option', [id, 'superpowers', superpowers]);
  };

  const onStartGame = () => {
    socket.emit('start-game', id);
  };

  return (
    <Box>
      <Stack align="center">
        <Header />
        <Title order={2}>
          Lobby code:{' '}
          <Text component="span" fz="inherit" variant="gradient">
            {lobby?.id}
          </Text>
        </Title>
        <Flex justify="space-between" gap="xl">
          <Stack>
            <Title order={2}>Settings</Title>
            <Text size="xl">
              Field size:{' '}
              <Text variant="gradient" component="span">
                {lobby.options.fieldSize}
                <Text size="sm" component="span">
                  x
                </Text>
                {lobby.options.fieldSize}
              </Text>
            </Text>
            <Slider
              value={Math.log2(lobby.options.fieldSize)}
              onChange={(n) => setFieldSize(2 ** n)}
              min={2}
              max={7}
              disabled={lobby.hostId !== socket.id}
              step={1}
              scale={(n) => 2 ** n}
            />
            <Text size="xl">
              Turn time limit:{' '}
              <Text variant="gradient" component="span">
                {lobby.options.timeLimit === 0 ? (
                  'Off'
                ) : (
                  <>
                    {lobby.options.timeLimit}
                    <Text size="sm" component="span">
                      s
                    </Text>
                  </>
                )}
              </Text>
            </Text>
            <SegmentedControl
              value={lobby.options.timeLimit.toString()}
              onChange={(value) => setTimeLimit(Number(value))}
              data={[
                { label: 'Off', value: '0' },
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '30', value: '30' },
                { label: '60', value: '60' },
                { label: '120', value: '120' },
              ]}
              disabled={lobby.hostId !== socket.id}
            />
            <Text size="xl">
              Superpowers:{' '}
              <Text variant="gradient" component="span">
                {lobby.options.superpowers}
              </Text>
            </Text>
            <SegmentedControl
              value={lobby.options.superpowers}
              onChange={setSuperpowers}
              data={[
                { label: 'None', value: 'none' },
                { label: 'Timid', value: 'timid' },
                { label: 'Mild', value: 'mild' },
                { label: 'Chaotic', value: 'chaotic' },
              ]}
              disabled={lobby.hostId !== socket.id}
            />
            <Flex gap="lg">
              {lobby.hostId === socket.id && (
                <Button
                  color="#84ED7A"
                  disabled={lobby.players.length < 2}
                  onClick={onStartGame}
                >
                  Start game
                </Button>
              )}
              <Button color="#7AC4ED">Copy link</Button>
            </Flex>
          </Stack>
          <Stack miw="400px">
            <Title order={2}>
              <Text variant="gradient" component="span" fz="inherit">
                {lobby.players.length} / 8
              </Text>{' '}
              Players
            </Title>
            <Flex wrap="wrap" align="flex-start" gap="md">
              {lobby.players.map((player) => (
                <Player key={player.id} currentId={socket.id} {...player} />
              ))}
            </Flex>
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
};
