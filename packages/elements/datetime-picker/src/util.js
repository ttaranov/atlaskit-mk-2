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

export const parseTime = (time: string) => {
  return time;
};

