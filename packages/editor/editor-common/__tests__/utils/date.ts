import {
  timestampToString,
  timestampToIsoFormat,
  timestampToUTCDate,
  isPastDate,
  timestampToTaskContext,
} from '../../src/utils/date';

describe('@atlaskit/editor-common date utils', () => {
  describe('timestampToString', () => {
    it('should correctly format date', () => {
      const date = Date.parse('2018-06-19');
      expect (timestampToString(date, 'dddd')).toEqual('Tuesday');
      expect (timestampToString(date, 'ddd, DD MMM')).toEqual('Tue, 19 Jun');
      expect (timestampToString(date, 'YYYY-MM-DD')).toEqual('2018-06-19');
      expect (timestampToString(date, 'DD MMM YYYY')).toEqual('19 Jun 2018');
    });
  });

  describe('timestampToIsoFormat', () => {
    it('should correctly format date in ISO format', () => {
      const date = Date.parse('2018-06-19');
      expect (timestampToIsoFormat(date)).toEqual('2018-06-19');
    });
  });

  describe('timestampToUTCDate', () => {
    it('should correctly return UTC value of date', () => {
      const date = Date.parse('2018-06-19');
      const obj = timestampToUTCDate(date);
      expect (obj.day).toEqual(19);
      expect (obj.month).toEqual(6);
      expect (obj.year).toEqual(2018);
    });
  });

  describe('isPastDate', () => {
    it('should correctly true is passed date is before current date', () => {
      const date = Date.parse('2018-06-18');
      expect (isPastDate(date)).toEqual(true);
    });
  });

  describe('timestampToTaskContext', () => {
    it('should correctly true is passed date is before current date', () => {
      const date = new Date();
      expect (timestampToTaskContext(date.valueOf())).toEqual('Today');
      date.setDate(date.getDate() + 1);
      expect (timestampToTaskContext(date.valueOf())).toEqual('Tomorrow');
      date.setDate(date.getDate() + 2);
      expect (timestampToTaskContext(date.valueOf())).toEqual(timestampToString(date.valueOf(), 'dddd'));
      date.setMonth(date.getMonth() + 1);
      expect (timestampToTaskContext(date.valueOf())).toEqual(timestampToString(date.valueOf(), 'ddd, DD MMM'));
      date.setFullYear(date.getFullYear() + 1);
      expect (timestampToTaskContext(date.valueOf())).toEqual(timestampToString(date.valueOf(), 'DD MMM YYYY'));
    });
  });
});
