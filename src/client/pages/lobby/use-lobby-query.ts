import { useEffect, useRef, useState } from 'react';
import { LobbyData } from '../../../common/data';
import { socket } from '../../socket';

export const useLobbyQuery = (id: string) => {
  const [lobby, setLobby] = useState<LobbyData>();
  const lastId = useRef<string>();

  useEffect(() => {
    socket.on('lobby-data', setLobby);
    if (id !== lastId.current) {
      socket.emit('join-lobby', id);
      lastId.current = id;
    }

    return () => {
      socket.off('lobby-data');
    };
  }, [id]);

  return lobby;
};
