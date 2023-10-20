export const joinList = (list: string[]) => {
  if (list.length === 1) {
    return list[0];
  }

  return list.slice(0, -1).join(', ') + ' and ' + list.at(-1);
};
