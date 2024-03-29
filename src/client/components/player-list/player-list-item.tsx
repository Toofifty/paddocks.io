import { ReactNode } from 'react';
import cx from 'classnames';
import { Flex, Paper, Stack, Text } from '@mantine/core';

import CrownSVG from '../../assets/crown.svg';

import styles from './player-list-item.module.scss';
import { AbilityKind, AbilityStatus } from '../../../common/data';
import { AbilityIcon } from '../ability-icon/ability-icon';

interface PlayerListItemProps {
  name: string;
  avatarId: number;
  styleId: number;
  score: number;
  current: boolean;
  place: number;
  abilities?: Partial<Record<AbilityKind, AbilityStatus>>;
}

const TextBox = ({
  children,
  styleId,
}: {
  children: ReactNode;
  styleId: number;
}) => (
  <Text
    c="white"
    px="8"
    fz="24"
    fw="400"
    className={`style-${styleId}-block `}
    display="inline"
    style={{ borderWidth: 4, borderRadius: 8, borderStyle: 'solid' }}
  >
    {children}
  </Text>
);

const Place = ({ place, styleId }: { place: number; styleId: number }) => {
  const text =
    place +
    (() => {
      switch (place) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    })();

  return (
    <Text
      c="white"
      px="8"
      fz="24"
      fw="400"
      className={`style-${styleId}-block `}
      display="inline"
      style={{ borderWidth: 4, borderRadius: 8, borderStyle: 'solid' }}
    >
      {text}
    </Text>
  );
};

export const PlayerListItem = ({
  name,
  styleId,
  score,
  current,
  place,
  abilities,
}: PlayerListItemProps) => (
  <Paper
    className={cx(
      styles.player,
      current && styles.current,
      `style-${styleId}`,
      `style-${styleId}-shadow`
    )}
    p="lg"
  >
    {place === 1 && score > 0 && (
      <img src={CrownSVG} className={styles.crown} />
    )}
    <Stack>
      <Flex align="center" justify="space-evenly" gap="sm">
        <Place place={place} styleId={styleId} />
        <TextBox styleId={styleId}>{name}</TextBox>
        <TextBox styleId={styleId}>
          {score} paddock{score !== 1 && 's'}
        </TextBox>
      </Flex>
      {abilities && (
        <Flex ml="lg">
          {Object.entries(abilities).map(([kind, { amount }]) => {
            return (
              <Flex
                className={cx(styles.ability, amount === 0 && styles.spent)}
              >
                <AbilityIcon kind={kind as AbilityKind} />
              </Flex>
            );
          })}
        </Flex>
      )}
    </Stack>
  </Paper>
);
