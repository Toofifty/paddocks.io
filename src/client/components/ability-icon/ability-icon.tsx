import { Image, ImageProps } from '@mantine/core';
import { AbilityKind } from '../../../common/data';
import * as icons from '../../assets/abilities';

const map: Record<AbilityKind, string> = {
  'corner-place': icons.CornerPlace,
  'parallel-place': icons.ParallelPlace,
  rotate: icons.Rotate,
  scramble: icons.Scramble,
  skip: icons.Skip,
  'super-scramble': icons.SuperScramble,
  undo: icons.Undo,
  'x-shift': icons.XShift,
  'y-shift': icons.YShift,
};

interface AbilityIconProps {
  kind: AbilityKind;
}

export const AbilityIcon = ({
  kind,
  ...props
}: AbilityIconProps & ImageProps) => {
  return <Image src={map[kind]} {...props} />;
};
