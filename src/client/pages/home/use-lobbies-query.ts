import { useEffect, useState } from 'react';
import { socket } from '../../socket';

export const useLobbiesQuery = () => {
  const [lobbies, setLobbies] = useState<string[]>();

  useEffect(() => {
    socket.once('query-lobbies-response', setLobbies);
    socket.emit('query-lobbies');

    return () => {
      socket.off('query-lobbies-response');
    };
  }, []);

  return lobbies;
};
