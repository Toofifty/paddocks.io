import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Flex, Loader } from '@mantine/core';
import { Box } from './components';

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
      <RouterProvider router={router} />
    </Suspense>
  );
};
