// @flow

import { name } from '../../package.json';
import { parseDate, parseTime } from '../util';

describe(name, () => {
  describe('parseDate', () => {
    it('returns an object containing a date, display value, and value of the parsed date', () => {
      const parsedDate = parseDate('2014-08-01');
      expect(parsedDate).toMatchObject({
        date: new Date('2014/08/01'),
        display: '2014/08/01',
        value: '2014-08-01',
      });
    });

    it('returns null if the input value is not a valid date string', () => {
      expect(parseDate('invalid date')).toBe(null);
    });
  });

  describe('parseTime', () => {
    const testData = [
      { input: '9:00am', expected: '9:00am' },
      { input: '09:00am', expected: '9:00am' },
      { input: '3:21pm', expected: '3:21pm' },
      { input: '12:00', expected: '12:00pm' },
      { input: '0:00', expected: '12:00am' },
      { input: '11:59', expected: '11:59am' },
      { input: '23:59', expected: '11:59pm' },
      { input: ' 9:00am ', expected: '9:00am' },
      { input: '13:00pm', expected: null },
      { input: '09:0am', expected: null },
      { input: '9:0am', expected: null },
      { input: '9:60am', expected: null },
      { input: '23:60', expected: null },
      { input: '24:00', expected: null },
      { input: '0:00am', expected: null },
      { input: '3.00', expected: null },
      { input: '3:123', expected: null },
      { input: 'invalid string', expected: null },
      { input: '', expected: null },
    ];

    testData.forEach(({ input, expected }) => {
      it(`parsing time "${input}" should output "${expected || 'null'}"`, () => {
        expect(parseTime(input)).toBe(expected);
      });
    });
  });
});
