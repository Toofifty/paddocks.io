import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { LobbyData } from '../../common/data';

export const useLobbyData = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LobbyData>();

  useEffect(() => {
    socket.on('lobby-data', (data: LobbyData) => {
      navigate(`/lobby/${data.id}`);
      setData(data);
    });

    return () => {
      socket.off('lobby-data');
    };
  }, [navigate]);

  return data;
};
