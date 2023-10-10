export const chunk = <T>(array: T[], size: number) => {
  const chunks = [];
  let i = 0;

  while (i < array.length) {
    chunks.push(array.slice(i, (i += size)));
  }

  return chunks;
};
