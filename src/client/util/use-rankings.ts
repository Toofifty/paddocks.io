import { useMemo } from 'react';
import { GamePlayer } from '../../common/data';

export const useRankings = (playerScores: Record<string, GamePlayer>) =>
  useMemo(() => {
    const ordered = Object.fromEntries(
      Object.entries(playerScores).sort(([, a], [, b]) => b.score - a.score)
    );

    let position = 1;
    let lastScore = 0;
    return Object.fromEntries(
      Object.entries(ordered).map(([id, { score }]) => {
        if (lastScore > 0 && score < lastScore) {
          position++;
        }
        lastScore = score;

        return [id, position];
      })
    );
  }, [playerScores]);
