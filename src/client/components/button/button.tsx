import { ReactNode, forwardRef } from 'react';
import cx from 'classnames';
import { Button as MantineButton, MantineStyleProps } from '@mantine/core';

import styles from './button.module.scss';
import { PrimaryColor } from '../../colors';

interface ButtonProps extends MantineStyleProps {
  color?: PrimaryColor;
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color, ...props }, ref) => (
    <MantineButton
      ref={ref}
      h="60"
      {...props}
      className={cx(color, styles.button, props.className)}
    />
  )
);
