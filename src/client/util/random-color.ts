import { PrimaryColor, colors } from '../colors';

export const randomColor = (seed: string) => {
  const n = seed
    .split('')
    .map((c) => c.charCodeAt(0))
    .reduce((a, b) => a + b);

  return (Object.keys(colors) as PrimaryColor[])[
    n % Object.keys(colors).length
  ];
};
