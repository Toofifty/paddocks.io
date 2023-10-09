import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

const Home = lazy(() => import('./pages/home'));
const Lobby = lazy(() => import('./pages/lobby'));
const Game = lazy(() => import('./pages/game'));

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/lobby/:id', element: <Lobby /> },
  { path: '/game/:id', element: <Game /> },
]);

export const Router = () => <RouterProvider router={router} />;
