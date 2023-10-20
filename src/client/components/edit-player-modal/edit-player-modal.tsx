import { Flex, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useLobby } from '../../util';
import { Button, Player } from '..';
import { socket } from '../../socket';
import { getAudioById, useAudio } from '../../util/audio';
import AudioSVG from '../../assets/volume.svg';

interface EditPlayerModalProps {
  open: boolean;
  onClose: () => void;
}

export const EditPlayerModal = ({ open, onClose }: EditPlayerModalProps) => {
  const { lobby } = useLobby();
  const [, audioId, setAudio] = useAudio();

  if (!lobby) {
    return null;
  }

  const player = lobby.players.find(({ id }) => id === socket.id);

  const usedStyles = lobby.players.map(({ styleId }) => styleId);

  if (!player) {
    return null;
  }

  const onChangeName = (value: string) => {
    socket.emit('customize', [lobby.id, { ...player, name: value }]);
  };

  const onChangeStyle = (value: number) => {
    socket.emit('customize', [lobby.id, { ...player, styleId: value }]);
  };

  return (
    <Modal opened={open} onClose={onClose} title="Customize">
      <Stack align="stretch" pb="xl">
        <Text fz="lg">Preview</Text>
        <Player {...player} currentId="" />
        <Text fz="lg" mt="xl">
          Name
        </Text>
        <TextInput
          fz="xl"
          mt="0"
          value={player.name}
          onChange={(e) => onChangeName(e.target.value)}
        />
        <Text fz="lg" mt="lg">
          Color
        </Text>
        <Flex gap="xs" wrap="wrap">
          {new Array(8).fill(0).map((_, i) => (
            <Button
              key={i}
              disabled={usedStyles.includes(i)}
              onClick={() => onChangeStyle(i)}
              className={`style-${i}`}
              miw="100px"
            ></Button>
          ))}
        </Flex>
        <Text fz="lg" mt="lg">
          Alert
        </Text>
        <Flex gap="xs" wrap="wrap">
          {new Array(6).fill(0).map((_, i) => (
            <Button
              key={i}
              onClick={() => {
                getAudioById(i)?.play();
                setAudio(i);
              }}
              color={audioId === i ? 'blue' : 'orange'}
              miw="100px"
            >
              {i + 1} <img src={AudioSVG} style={{ marginLeft: 10 }} />
            </Button>
          ))}
          <Button
            onClick={() => setAudio(-1)}
            color={audioId === -1 ? 'blue' : 'orange'}
            miw="100px"
          >
            None
          </Button>
        </Flex>
      </Stack>
      <Button onClick={onClose} color="green">
        Done
      </Button>
    </Modal>
  );
};
