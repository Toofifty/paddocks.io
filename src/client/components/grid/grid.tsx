import { useMemo } from 'react';
import cx from 'classnames';
import { PaddocksGrid, PlayerData } from '../../../common/data';
import { chunk } from '../../util';

import styles from './grid.module.scss';

interface GridProps {
  grid: PaddocksGrid;
  players: PlayerData[];
  currentId: string;
  turn: string;
  onClick: (x: number, y: number) => void;
}

export const Grid = ({
  grid,
  players: playersArray,
  currentId,
  turn,
  onClick,
}: GridProps) => {
  const size = Math.sqrt(grid.length);

  const myTurn = currentId === turn;

  const rows = useMemo(() => chunk(grid, size), [grid, size]);

  const players = useMemo(
    () => Object.fromEntries(playersArray.map((player) => [player.id, player])),
    [playersArray]
  );

  const get = (x: number, y: number) => {
    return x >= 0 && x < size && y > 0 && y <= size
      ? grid[x + y * size]
      : undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const style = { '--cell-size': `${100 / size}%` } as any;

  return (
    <div className={cx(styles.grid, myTurn && styles.active)} style={style}>
      {rows.map((row, y) => (
        <div key={y} className={styles.row}>
          {row.map((cell, x) => {
            const isGate =
              cell.kind === 'vertical' || cell.kind === 'horizontal';
            const isFilledPaddock = cell.kind == 'paddock' && !!cell.owner;

            const roundTopRight =
              !get(x, y - 2)?.owner && !get(x + 2, y)?.owner;
            const roundTopLeft = !get(x, y - 2)?.owner && !get(x - 2, y)?.owner;
            const roundBottomRight =
              !get(x, y + 2)?.owner && !get(x + 2, y)?.owner;
            const roundBottomLeft =
              !get(x, y + 2)?.owner && !get(x - 2, y)?.owner;
            return (
              <div
                key={x}
                onClick={myTurn && isGate ? () => onClick(x, y) : undefined}
                className={cx(
                  styles.cell,
                  styles[cell.kind],
                  cell.owner && isGate && styles['gate-filled']
                )}
              >
                {isGate && (
                  <div
                    className={cx(
                      styles.gate,
                      cell.owner && `style-${players[cell.owner].styleId}-block`
                    )}
                  />
                )}
                {isFilledPaddock && (
                  <div
                    className={cx(
                      styles['filled-paddock'],
                      cell.owner && `style-${players[cell.owner].styleId}`,
                      {
                        [styles['round-top-right']]: roundTopRight,
                        [styles['round-top-left']]: roundTopLeft,
                        [styles['round-bottom-right']]: roundBottomRight,
                        [styles['round-bottom-left']]: roundBottomLeft,
                      }
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
