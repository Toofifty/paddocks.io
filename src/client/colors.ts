import { darken, lighten } from '@mantine/core';

const orange = '#ff8964';
const blue = '#7ac4ed';
const green = '#84ed7a';
const pink = '#ff64d4';
const red = '#ff6782';
const lime = '#d2de4e';
const purple = '#8f67ff';
const cyan = '#3ce5e5';

export type PrimaryColor =
  | 'orange'
  | 'blue'
  | 'green'
  | 'pink'
  | 'red'
  | 'lime'
  | 'purple'
  | 'cyan';

export const colors = {
  orange,
  blue,
  green,
  pink,
  red,
  lime,
  purple,
  cyan,
};

export const addCSSVars = (element: HTMLElement) => {
  element.style.setProperty('--orange', colors.orange);
  element.style.setProperty('--orange-light', lighten(orange, 0.5));
  element.style.setProperty('--orange-dark', darken(orange, 0.2));

  element.style.setProperty('--blue', colors.blue);
  element.style.setProperty('--blue-light', lighten(blue, 0.5));
  element.style.setProperty('--blue-dark', darken(blue, 0.2));

  element.style.setProperty('--green', colors.green);
  element.style.setProperty('--green-light', lighten(green, 0.5));
  element.style.setProperty('--green-dark', darken(green, 0.2));

  element.style.setProperty('--pink', colors.pink);
  element.style.setProperty('--pink-light', lighten(pink, 0.5));
  element.style.setProperty('--pink-dark', darken(pink, 0.2));

  element.style.setProperty('--red', colors.red);
  element.style.setProperty('--red-light', lighten(red, 0.5));
  element.style.setProperty('--red-dark', darken(red, 0.2));

  element.style.setProperty('--lime', colors.lime);
  element.style.setProperty('--lime-light', lighten(lime, 0.5));
  element.style.setProperty('--lime-dark', darken(lime, 0.2));

  element.style.setProperty('--purple', colors.purple);
  element.style.setProperty('--purple-light', lighten(purple, 0.5));
  element.style.setProperty('--purple-dark', darken(purple, 0.2));

  element.style.setProperty('--cyan', colors.cyan);
  element.style.setProperty('--cyan-light', lighten(cyan, 0.5));
  element.style.setProperty('--cyan-dark', darken(cyan, 0.2));
};
