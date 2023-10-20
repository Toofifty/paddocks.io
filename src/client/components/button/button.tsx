import { ReactNode } from 'react';
import {
  Button as MantineButton,
  MantineStyleProps,
  darken,
  lighten,
} from '@mantine/core';

import styles from './button.module.scss';

interface ButtonProps extends MantineStyleProps {
  color?: string;
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

export const Button = ({ color, ...props }: ButtonProps) => {
  color = props.disabled ? '#DFDFDF' : color;
  const borderColor = color ? lighten(color, 0.5) : 'white';
  const shadowColor = color ? darken(color, 0.2) : 'black';

  return (
    <MantineButton
      h="60"
      classNames={{ root: styles.button }}
      style={{
        '--p-button-color': color,
        '--p-border-color': borderColor,
        '--p-shadow-color': shadowColor,
      }}
      {...props}
    />
  );
};
