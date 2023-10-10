import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Flex, Loader } from '@mantine/core';
import { Box } from './components';
import { LobbyProvider } from './util';

const Home = lazy(() => import('./pages/home'));
const Lobby = lazy(() => import('./pages/lobby'));
const Game = lazy(() => import('./pages/game'));

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/lobby/:id', element: <Lobby /> },
  { path: '/game', element: <Game /> },
]);

export const Router = () => {
  return (
    <Suspense
      fallback={
        <Box>
          <Flex justify="center">
            <Loader py="xl" />
          </Flex>
        </Box>
      }
    >
      <LobbyProvider>
        <RouterProvider router={router} />
      </LobbyProvider>
    </Suspense>
  );
};
