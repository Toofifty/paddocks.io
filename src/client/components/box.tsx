import { Box as MantineBox, Paper } from '@mantine/core';
import { ReactNode } from 'react';

interface BoxProps {
  maw?: string;
  children: ReactNode;
}

export const Box = ({ children, maw = '800px' }: BoxProps) => (
  <MantineBox mx="auto" maw={maw}>
    <Paper
      shadow="xl"
      p="xl"
      m="xl"
      mx="lg"
      style={(theme) => ({
        backgroundColor: theme.colors.gray[1],
        borderRadius: 16,
        borderWidth: 4,
        borderColor: theme.white,
      })}
    >
      {children}
    </Paper>
  </MantineBox>
);
