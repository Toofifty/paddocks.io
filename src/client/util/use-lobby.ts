import { createContext, useContext } from 'react';
import { LobbyData } from '../../common/data';

interface LobbyContextType {
  lobby?: LobbyData;
  setId: (id: string) => void;
}

export const LobbyContext = createContext<LobbyContextType>(undefined!);

export const useLobby = () => useContext(LobbyContext);
