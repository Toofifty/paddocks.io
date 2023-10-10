import { useMemo } from 'react';
import cx from 'classnames';
import { PaddocksGrid, PlayerData } from '../../../common/data';

import styles from './grid.module.scss';
import { chunk } from '../../util';

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
    <div className={styles.grid} style={style}>
      {rows.map((row, y) => (
        <div key={y} className={styles.row}>
          {row.map((cell, x) => {
            const isGate =
              cell.kind === 'vertical' || cell.kind === 'horizontal';
            const isFilledPaddock = cell.kind == 'paddock' && !!cell.owner;
            const isHidden =
              (cell.kind === 'horizontal' &&
                (!get(x, y - 1) || get(x, y - 1)!.owner) &&
                (!get(x, y + 1) || get(x, y + 1)!.owner)) ||
              (cell.kind === 'vertical' &&
                (!get(x - 1, y) || get(x - 1, y)!.owner) &&
                (!get(x + 1, y) || get(x + 1, y)!.owner));
            const hideTopBorder =
              cell.owner && cell.owner === get(x, y - 1)?.owner;
            const hideLeftBorder =
              cell.owner && cell.owner === get(x - 1, y)?.owner;
            const hideRightBorder =
              cell.owner && cell.owner === get(x + 1, y)?.owner;
            const hideBottomBorder =
              cell.owner && cell.owner === get(x, y + 1)?.owner;

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
                  // isHidden && styles.hidden,
                  myTurn && !cell.owner && styles.hoverable
                )}
              >
                {isGate && (
                  <div
                    className={cx(
                      styles.gate,
                      cell.owner && styles['gate-filled'],
                      cell.owner && `style-${players[cell.owner].styleId}`,
                      {
                        // [styles['hide-top-border']]: hideTopBorder,
                        // [styles['hide-left-border']]: hideLeftBorder,
                        // [styles['hide-right-border']]: hideRightBorder,
                        // [styles['hide-bottom-border']]: hideBottomBorder,
                      }
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
