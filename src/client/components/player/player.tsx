import { Button, Flex, Paper, Text } from '@mantine/core';
import cx from 'classnames';
import { PlayerData } from '../../../common/data';

import EditSVG from '../../assets/edit.svg';

import styles from './player.module.scss';

interface PlayerProps {
  currentId: string;
  onEdit?: () => void;
}

export const Player = ({
  currentId,
  id,
  name,
  styleId,
  onEdit,
}: PlayerProps & PlayerData) => (
  <Paper
    w={120}
    h={120}
    className={cx(`style-${styleId} style-${styleId}-shadow`, styles.player)}
    shadow="md"
  >
    {id === currentId && (
      <Button
        className={cx(
          `style-${styleId}-block style-${styleId}-shadow`,
          styles.you
        )}
        rightSection={<img src={EditSVG} className={styles.edit} />}
        onClick={onEdit}
      >
        You
      </Button>
    )}
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
