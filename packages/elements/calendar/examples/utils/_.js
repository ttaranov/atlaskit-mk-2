// @flow

import { dateToString } from '../../src/util';

export const now = new Date();
export const today = now.getDate();
export const thisMonth = now.getMonth() + 1;
export const thisYear = now.getFullYear();

export const notToday = today === 10 ? 11 : 10;
export const notThisMonth = thisMonth === 10 ? 11 : 10;
export const notThisYear = thisYear + 1;

export function getDate(day: number = today) {
  return dateToString({ day, month: thisMonth, year: thisYear });
}

export function getDates() {
  return [getDate(), getDate(3), getDate(20)];
}

// eslint-disable-next-line
export const action = (...args: Array<any>) =>
  console.log.bind(console, ...args);
