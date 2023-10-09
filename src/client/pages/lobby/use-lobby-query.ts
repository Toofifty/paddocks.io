import { useEffect, useState } from 'react';
import { LobbyData } from '../../../common/data';
import { socket } from '../../socket';

export const useLobbyQuery = (id: string) => {
  const [lobby, setLobby] = useState<LobbyData>();

  useEffect(() => {
    socket.on('lobby-data', setLobby);
    socket.emit('join-lobby', id);

    return () => {
      socket.off('lobby-data');
    };
  }, [id]);

  return lobby;
};
