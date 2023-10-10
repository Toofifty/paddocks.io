import { PlayerData } from '../common/data';
import { shuffle } from './shuffle';

const uniqueOrRandom = <T>(array: T[], exclude: T[]) => {
  const shuffled = shuffle(array);
  return shuffled.find((item) => !exclude.includes(item)) ?? shuffled[0];
};

const NAMES = ['Bort', 'Dork', 'Dingus', 'Doofus', 'Goofer'];

export const getDefaultPlayerData = (
  others: PlayerData[]
): Omit<PlayerData, 'id'> => {
  const avatars = others.map((p) => p.avatarId);
  const styles = others.map((p) => p.styleId);

  return {
    name:
      NAMES[Math.floor(Math.random() * NAMES.length)] +
      '-' +
      (Math.random() * 100).toFixed(0),
    avatarId: uniqueOrRandom([0, 1, 2, 3, 4, 5, 6, 7], avatars),
    styleId: uniqueOrRandom([0, 1, 2, 3, 4, 5, 6, 7], styles),
  };
};
