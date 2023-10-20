import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { addCSSVars } from './colors.ts';
import { Router } from './router.tsx';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './main.scss';
import './colors.scss';

const theme = createTheme({
  fontFamily: 'Staatliches',
  fontSmoothing: true,
  headings: {
    fontWeight: '400',
    fontFamily: 'Staatliches',
    sizes: {
      h1: { fontSize: '48px' },
      h2: { fontSize: '32px' },
    },
  },
  defaultRadius: '8px',
});

addCSSVars(document.body);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <Router />
    </MantineProvider>
  </React.StrictMode>
);
