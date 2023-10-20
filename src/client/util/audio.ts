import { useLocalStorage } from '@mantine/hooks';
import * as files from '../assets/audio';

const audio = [
  new Audio(files.Bing),
  new Audio(files.Cat),
  new Audio(files.Dog),
  new Audio(files.Firework),
  new Audio(files.Frog),
  new Audio(files.Horse),
];

export const getAudioById = (id: number) => {
  return id >= 0 ? audio[id] : undefined;
};

export const useAudio = () => {
  const [id, setId] = useLocalStorage({
    key: 'audio-id',
    defaultValue: '0',
  });

  return [
    getAudioById(Number(id)),
    Number(id),
    (id: number) => setId(id.toString()),
  ] as const;
};
