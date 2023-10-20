import { Flex, Stack, Text, Title, Tooltip } from '@mantine/core';
import cx from 'classnames';
import { AbilityKind, GamePlayer } from '../../../common/data';
import { abilities } from '../../../common/abilities';
import { AbilityIcon } from '../ability-icon/ability-icon';
import { Button } from '../button';

import styles from './ability-panel.module.scss';
import { socket } from '../../socket';
import { useLobby } from '../../util';

interface AbilityPanelProps {
  player: GamePlayer;
  currentTurn: boolean;
}

const colors = ['green', 'orange', 'red'] as const;

export const AbilityPanel = ({ player, currentTurn }: AbilityPanelProps) => {
  const { lobby } = useLobby();

  const activate = (kind: AbilityKind) => {
    socket.emit('use-ability', [lobby?.id, kind]);
  };

  return (
    <Flex gap="md" className={cx(styles.panel, currentTurn && styles.active)}>
      <Title mr="xl">Abilities</Title>
      {Object.entries(player.abilities ?? {}).map(
        ([kind, { amount, usedThisTurn }]) => {
          const ability = abilities[kind as AbilityKind];
          return (
            <Tooltip
              multiline
              w={220}
              position="bottom"
              label={
                <Stack>
                  <Text>{ability.name}</Text>
                  <Text>{ability.description}</Text>
                  {ability.endsTurn && (
                    <Text>Using this will end your turn.</Text>
                  )}
                </Stack>
              }
            >
              <Button
                className={styles.ability}
                disabled={usedThisTurn || amount === 0}
                color={colors[ability.level - 1]}
                onClick={() => activate(kind as AbilityKind)}
              >
                <AbilityIcon kind={kind as AbilityKind} />
                <Text className={styles.amount} fz="xl">
                  <Text component="span" fz="sm">
                    x
                  </Text>
                  {amount}
                </Text>
              </Button>
            </Tooltip>
          );
        }
      )}
    </Flex>
  );
};
