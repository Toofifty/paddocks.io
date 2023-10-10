import { Flex, Paper, Text } from '@mantine/core';
import { PlayerData } from '../../../common/data';

import styles from './player.module.scss';

interface PlayerProps {
  currentId: string;
}

export const Player = ({
  currentId,
  id,
  name,
  styleId,
}: PlayerProps & PlayerData) => (
  <Paper
    w={120}
    h={120}
    className={
      `style-${styleId} style-${styleId}-shadow ${styles.player} style-active ` +
      (currentId === id ? 'style-active' : '')
    }
    shadow="md"
  >
    <Flex direction="column" align="center">
      <Text
        c="white"
        px="8"
        m="lg"
        fz="xl"
        fw="400"
        className={`style-${styleId}-block `}
        display="inline"
        style={{ borderWidth: 4, borderRadius: 8, borderStyle: 'solid' }}
      >
        {name}
      </Text>
    </Flex>
  </Paper>
);
