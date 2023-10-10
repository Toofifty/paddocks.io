import { useEffect, useState } from 'react';
import { GameData } from '../../../common/data';
import { socket } from '../../socket';

export const useGameData = () => {
  const [data, setData] = useState<GameData>();

  useEffect(() => {
    socket.on('game-update', setData);

    return () => {
      socket.off('game-update');
    };
  }, []);

  return data;
};
