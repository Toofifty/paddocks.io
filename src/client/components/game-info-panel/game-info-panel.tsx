import { Stack, Text } from '@mantine/core';
import { GameData, LobbyData } from '../../../common/data';
import { PlayerList } from '../player-list';

import styles from './game-info-panel.module.scss';

interface GameInfoPanelProps {
  game: GameData;
  lobby: LobbyData;
}

export const GameInfoPanel = ({ game, lobby }: GameInfoPanelProps) => (
  <Stack align="center">
    <Text fz="xl">Paddocks left: {game.available}</Text>
    <PlayerList
      players={game.players}
      playerData={lobby.players}
      turn={game.turn}
    />
  </Stack>
);
