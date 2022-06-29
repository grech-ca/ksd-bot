import { minmax } from './minmax';

export const chance = (percentage = 50): boolean => {
  return Math.ceil(Math.random() * (100 / minmax(0, percentage, 100))) === 1;
};
