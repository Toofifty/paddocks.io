export const randomColor = (seed: string) => {
  const n = seed
    .split('')
    .map((c) => c.charCodeAt(0))
    .reduce((a, b) => a + b);

  return `hsl(${n % 256}, 100%, 70%)`;
};
