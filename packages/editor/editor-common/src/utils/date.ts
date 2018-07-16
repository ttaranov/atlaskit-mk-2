import * as isBefore from 'date-fns/is_before';

const ISO_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT = 'DD MMM YYYY';

export interface Date {
  day: number;
  month: number;
  year: number;
}

export const timestampToUTCDate = (timestamp: string | number): Date => {
  const date = new Date(Number(timestamp));
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return { day, month, year };
};

const addLeadingZero = val => {
  if (val < 10) {
    return `0${val}`;
  }
  return val;
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const days_full = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// example: "23 Jan 2018"
export const timestampToString = (
  timestamp: string | number,
  pattern?: string,
): string => {
  const date = new Date(Number(timestamp));
  switch (pattern) {
    case 'ddd, DD MMM':
      return `${days_full[date.getUTCDay()].substr(0, 3)}, ${addLeadingZero(
        date.getUTCDate(),
      )} ${months[date.getUTCMonth()]}`;
    case 'dddd':
      return `${days_full[date.getUTCDay()]}`;
    case ISO_FORMAT:
      return `${date.getUTCFullYear()}-${addLeadingZero(
        date.getUTCMonth() + 1,
      )}-${date.getUTCDate()}`;
    default:
      return `${addLeadingZero(date.getUTCDate())} ${
        months[date.getUTCMonth()]
      } ${date.getUTCFullYear()}`;
  }
};

// example: "2018-01-23"
export const timestampToIsoFormat = (timestamp: string | number): string => {
  return timestampToString(timestamp, ISO_FORMAT);
};

export const isPastDate = (timestamp: string | number): boolean => {
  return isBefore(
    timestampToIsoFormat(Number(timestamp)),
    timestampToIsoFormat(new Date().valueOf()),
  );
};

export const timestampToTaskContext = (timestamp: string | number): string => {
  const curDate = new Date();
  const givenDate = new Date(Number(timestamp));
  const distance = Math.abs(givenDate.getUTCDay() - curDate.getUTCDay());
  let pattern = '';

  if (
    givenDate.getUTCFullYear() !== curDate.getUTCFullYear() ||
    isPastDate(timestamp)
  ) {
    pattern = DEFAULT_FORMAT;
  } else if (
    givenDate.getUTCMonth() !== curDate.getUTCMonth() ||
    distance >= 7
  ) {
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
