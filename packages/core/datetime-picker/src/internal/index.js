// @flow

import React from 'react';
import { format, isValid, parse } from 'date-fns';

export const ClearIndicator = null;

export const defaultTimes = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
];

export const defaultTimeFormat = 'h:mma';
export const defaultDateFormat = 'YYYY/MM/DD';

export function padToTwo(number: number) {
  return number <= 99 ? `0${number}`.slice(-2) : `${number}`;
}

export const DropdownIndicator = ({
  selectProps: { dropdownIndicatorIcon: Icon },
}: { selectProps: { dropdownIndicatorIcon?: any } } = {}) =>
  Icon ? (
    <span role="img">
      <Icon />
    </span>
  ) : null;

export function parseDateIntoStateValues(
  value: string,
  dateValue: string,
  timeValue: string,
  zoneValue: string,
) {
  const parsed = parse(value);
  const valid = isValid(parsed);
  return {
    dateValue: valid ? format(parsed, 'YYYY-MM-DD') : dateValue,
    timeValue: valid ? format(parsed, 'HH:mm') : timeValue,
    zoneValue: valid ? format(parsed, 'ZZ') : zoneValue,
  };
}

export function parseTime(timeString: string): Date | typeof NaN {
  const dateTime = new Date();
  const time = timeString.trim().match(/(\d+)(?::(\d\d))?\s*(a|p)?/i);
  const time24hr = timeString.trim().match(/(\d\d)[:.]?(\d\d)/);
  const num = timeString.replace(/[^0-9]/g, '');
  const meridiem = time && time[3] ? time[3].toLowerCase() : '';

  let hours: number = 0;
  let minutes: number = 0;

  // Validate times supplied
  if ((!time && !time24hr) || (time && !time[1])) return NaN;
  if (num.length > 4 || (num.length === 2 && parseInt(num, 10) > 12))
    return NaN;

  // For valid 24hr times we ignore am/pm
  if (time24hr && time24hr[1] && time24hr[2]) {
    hours = parseInt(time24hr[1], 10);
    minutes = parseInt(time24hr[2], 10);
  } else if (time && time[1]) {
    // Handle times supplied as one value e.g 135pm
    if (!time[2]) {
      if (time[1].length < 3) {
        hours = parseInt(time[1], 10) || 0;
        minutes = 0;
      } else {
        hours = parseInt(time[1].toString().charAt(0), 10);
        minutes = parseInt(time[1].toString().substring(1, 3), 10);
      }
    } else {
      hours = parseInt(time[1], 10) || 0;
      minutes = parseInt(time[2], 10) || 0;
    }
    // Adjust hours for PM
    if (hours === 12 && meridiem !== 'p') {
      hours = 0;
    } else {
      hours += hours < 12 && meridiem === 'p' ? 12 : 0;
    }
  }

  dateTime.setHours(hours);
  dateTime.setMinutes(minutes);
  dateTime.setSeconds(0, 0);
  return dateTime;
}

export function formatDateTimeZoneIntoIso(
  date: string,
  time: string,
  zone: string,
): string {
  // If no 'date' then return an empty string otherwise
  //  Firefox defaults to the beginning of epoch time.
  return date ? `${date}T${time}${zone}` : '';
}
