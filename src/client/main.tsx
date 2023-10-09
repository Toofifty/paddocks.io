import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';

import { Router } from './router.tsx';
import '@mantine/core/styles.css';
import './main.scss';

const theme = createTheme({
  fontFamily: 'Staatliches',
  fontSmoothing: true,
  headings: {
    fontWeight: '400',
    sizes: {
      h1: { fontSize: '48px' },
      h2: { fontSize: '32px' },
    },
  },
  defaultRadius: '8px',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  </React.StrictMode>
);
