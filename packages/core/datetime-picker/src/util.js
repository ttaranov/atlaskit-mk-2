// @flow

import { parse, format, isValid } from 'date-fns';

const internalDateFormat = 'YYYY-MM-DD';
const displayDateFormat = 'YYYY/MM/DD';

type ParsedDate = {
  date: Date,
  display: string,
  value: string,
};

export const parseDate = (date: string): ?ParsedDate => {
  const parsedDate = parse(date);

  if (!isValid(parsedDate)) {
    return null;
  }

  return {
    date: parsedDate,
    display: format(parsedDate, displayDateFormat),
    value: format(parsedDate, internalDateFormat),
  };
};

// Parses a string containing a 12-hour or 24-hour time and returns a string representing the
// 12-hour time, or null if the input string is invalid, e.g.:
// * 9:00am -> 9:00am
// * 9:00 -> 9:00am
// * 13:00 -> 1:00pm
// * 13:00am -> null
// * 9:60pm -> null
// * 25:00 -> null
export const parseTime = (time: string) => {
  const matches = time.trim().match(/^(\d{1,2}):(\d{2})([ap]m)?$/);
  if (!matches) {
    return null;
  }

  const hours = parseInt(matches[1], 10);
  const minutes = parseInt(matches[2], 10);
  const amOrPm = matches[3];
  const isTwentyFourHourTime = !amOrPm;

  // Handle 24-hour time
  if (isTwentyFourHourTime) {
    if (hours > 23 || minutes > 59) {
      return null;
    }
    const hourString = hours % 12 === 0 ? '12' : `${hours % 12}`;
    return `${hourString}:${pad(minutes)}${hours >= 12 ? 'pm' : 'am'}`;
  }

  // Handle 12-hour time
  if (hours > 12 || hours < 1 || minutes > 59) {
    return null;
  }

  return `${hours}:${pad(minutes)}${amOrPm}`;
};

function pad(num) {
  return num < 10 ? `0${num}` : num;
}

export function dateFromTime(time: string): Date {
  const [h, m] = time.match(/(\d\d):(\d\d)/) || [];
  return h && m ? parse(`0000-00-00T${h}:${m}`) : new Date('invalid date');
}

export function formatDate(date: string): string {
  return date.replace(/-/g, '/');
}

export function formatTime(time: string): string {
  const date = dateFromTime(time);
  return isValid(date) ? format(date, 'h:mma') : '';
}
