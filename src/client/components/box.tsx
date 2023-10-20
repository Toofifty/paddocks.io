import { Box as MantineBox, Paper } from '@mantine/core';
import { ReactNode } from 'react';

interface BoxProps {
  maw?: string;
  fullHeight?: boolean;
  children: ReactNode;
}

export const Box = ({ children, maw = '800px', fullHeight }: BoxProps) => (
  <MantineBox py="xl" mx="auto" maw={maw}>
    <Paper
      shadow="xl"
      p="xl"
      mx="lg"
      mih={fullHeight ? 'calc(100vh - 64px - 8px)' : undefined}
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
