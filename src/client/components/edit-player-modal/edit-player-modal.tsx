import { Flex, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useLobby } from '../../util';
import { Button, Player } from '..';
import { socket } from '../../socket';

interface EditPlayerModalProps {
  open: boolean;
  onClose: () => void;
}

export const EditPlayerModal = ({ open, onClose }: EditPlayerModalProps) => {
  const { lobby } = useLobby();

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
              disabled={usedStyles.includes(i)}
              onClick={() => onChangeStyle(i)}
              className={`style-${i}`}
              miw="100px"
            ></Button>
          ))}
        </Flex>
      </Stack>
      <Button onClick={onClose} color="#84ED7A">
        Done
      </Button>
    </Modal>
  );
};
