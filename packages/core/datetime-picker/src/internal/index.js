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

export const DropdownIndicator = ({ icon: Icon }: { icon?: any } = {}) =>
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

export function parseTime(timeString: string) {
  const dateTime = new Date();
  const time = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
  let hours = 0;

  if (!time) return NaN;
  if (time[1]) {
    hours = parseInt(time[1], 10);
  }

  if (hours === 12 && !time[3]) {
    hours = 0;
  } else {
    hours += hours < 12 && time[3] ? 12 : 0;
  }

  dateTime.setHours(hours);
  dateTime.setMinutes(parseInt(time[2], 10) || 0);
  dateTime.setSeconds(0, 0);
  return dateTime;
}
