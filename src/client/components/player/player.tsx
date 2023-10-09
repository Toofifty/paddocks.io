import { Paper } from '@mantine/core';
import { PlayerData } from '../../../common/data';

import styles from './player.module.scss';

export const Player = ({ id, name, styleId }: PlayerData) => (
  <Paper w={120} h={120} className={`style-${styleId} ${styles.player}`}>
    {name}
  </Paper>
);
