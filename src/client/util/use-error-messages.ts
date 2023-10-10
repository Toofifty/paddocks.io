import { useEffect } from 'react';
import { socket } from '../socket';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

export const useErrorMessages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('error', (message) => {
      console.error('server error:', message);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
      if (message === 'Lobby does not exist!') {
        navigate('/');
      }
    });

    return () => {
      socket.off('error');
    };
  }, [navigate]);
};
