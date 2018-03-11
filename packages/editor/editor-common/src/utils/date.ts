import * as format from 'date-fns/format';
import * as isBefore from 'date-fns/is_before';
import * as parseDate from 'date-fns/parse';
export { parseDate };

const ISO_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT = 'DD MMM YYYY';

export interface Date {
  day: number;
  month: number;
  year: number;
}

export const timestampToDate = (timestamp: string | number): Date => {
  const date = new Date(parseDate(Number(timestamp)));
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return { day, month, year };
};

// example: "23 Jan 2018"
export const timestampToString = (
  timestamp: string | number,
  pattern: string = DEFAULT_FORMAT,
): string => {
  // @see https://github.com/date-fns/date-fns/issues/489
  return format(parseDate(Number(timestamp)), pattern);
};

// example: "2018-01-23"
export const timestampToIso = (timestamp: string | number): string => {
  return timestampToString(timestamp, ISO_FORMAT);
};

export const isPastDate = (timestamp: string | number): boolean => {
  const curISO = timestampToIso(new Date().valueOf());
  const givenISO = timestampToIso(timestamp);
  return isBefore(givenISO, curISO);
};

export const timestampToTaskContext = (timestamp: string | number): string => {
  const curDate = timestampToDate(new Date().valueOf());
  const givenDate = timestampToDate(timestamp);
  const distance = Math.abs(givenDate.day - curDate.day);
  let pattern = '';

  if (givenDate.year !== curDate.year || isPastDate(timestamp)) {
    pattern = 'DD MMM YYYY';
  } else if (givenDate.month !== curDate.month || distance >= 7) {
    pattern = 'ddd, DD MMM';
  } else if (distance > 1 && distance < 7) {
    pattern = 'dddd';
  } else if (distance === 1) {
    return 'Tomorrow';
  } else {
    return 'Today';
  }

  return timestampToString(timestamp, pattern);
};
