// @flow

import cases from 'jest-in-case';

import {
  dateToString,
  getMonthName,
  getShortDayName,
  makeArrayFromNumber,
} from '../..';

cases(
  'getShortDayName(index)',
  ({ index, day }) => {
    expect(getShortDayName(index)).toBe(day);
  },
  [
    { index: 0, day: 'Sun' },
    { index: 1, day: 'Mon' },
    { index: 2, day: 'Tue' },
    { index: 3, day: 'Wed' },
    { index: 4, day: 'Thu' },
    { index: 5, day: 'Fri' },
    { index: 6, day: 'Sat' },
  ],
);

cases(
  'getMonthName(index)',
  ({ index, month }) => {
    expect(getMonthName(index)).toBe(month);
  },
  [
    { index: 0, month: undefined },
    { index: 1, month: 'January' },
    { index: 2, month: 'February' },
    { index: 3, month: 'March' },
    { index: 4, month: 'April' },
    { index: 5, month: 'May' },
    { index: 6, month: 'June' },
    { index: 7, month: 'July' },
    { index: 8, month: 'August' },
    { index: 9, month: 'September' },
    { index: 10, month: 'October' },
    { index: 11, month: 'November' },
    { index: 12, month: 'December' },
  ],
);

cases(
  'dateToString(date)',
  ({ src, dst }) => {
    expect(dateToString(src)).toBe(dst);
  },
  [
    { src: { year: 2017, month: 1, day: 1 }, dst: '2017-01-01' },
    { src: { year: 2017, month: 13, day: 32 }, dst: '2017-13-32' },
  ],
);

cases(
  'dateToString(date, { fixMonth: true })',
  ({ src, dst }) => {
    expect(dateToString(src, { fixMonth: true })).toBe(dst);
  },
  [
    { src: { year: 2017, month: 1, day: 1 }, dst: '2017-02-01' },
    { src: { year: 2017, month: 13, day: 32 }, dst: '2017-14-32' },
  ],
);

cases(
  'makeArrayFromNumber',
  ({ src, dst }) => {
    expect(makeArrayFromNumber(src)).toEqual(dst);
  },
  [{ src: 0, dst: [] }, { src: 1, dst: [0] }, { src: 2, dst: [0, 1] }],
);
