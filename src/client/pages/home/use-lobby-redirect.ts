import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { LobbyData } from '../../../common/data';

export const useLobbyRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.once('lobby-data', (data: LobbyData) => {
      navigate(`/lobby/${data.id}`);
    });

    return () => {
      socket.off('lobby-data');
    };
  }, [navigate]);
};
