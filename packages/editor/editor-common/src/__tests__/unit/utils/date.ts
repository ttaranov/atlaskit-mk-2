import {
  timestampToString,
  timestampToIsoFormat,
  timestampToUTCDate,
  isPastDate,
  // timestampToTaskContext,
} from '../../../utils/date';

describe('@atlaskit/editor-common date utils', () => {
  describe('timestampToString', () => {
    it('should correctly format date', () => {
      const date = Date.parse('2018-06-19');
      expect(timestampToString(date, 'ddd, DD MMM')).toEqual('Tue, 19 Jun');
      expect(timestampToString(date, 'YYYY-MM-DD')).toEqual('2018-06-19');
      expect(timestampToString(date, 'DD MMM YYYY')).toEqual('19 Jun 2018');
    });
  });

  describe('timestampToIsoFormat', () => {
    it('should correctly format date in ISO format', () => {
      const date = Date.parse('2018-06-19');
      expect(timestampToIsoFormat(date)).toEqual('2018-06-19');
    });
  });

  describe('timestampToUTCDate', () => {
    it('should correctly return UTC value of date', () => {
      const date = Date.parse('2018-06-19');
      const obj = timestampToUTCDate(date);
      expect(obj.day).toEqual(19);
      expect(obj.month).toEqual(6);
      expect(obj.year).toEqual(2018);
    });
  });

  describe('isPastDate', () => {
    it('should return true if passed date is before current date', () => {
      const date = Date.parse('2018-06-18');
      expect(isPastDate(date)).toEqual(true);
    });
  });

  // TODO: Currently skipped due to local issues
  // https://bitbucket.org/atlassian/atlaskit-mk-2/addon/pipelines/home#!/results/27648/steps/%7Bab5d2f0d-39aa-4bad-9ba5-0b0852a7b81e%7D/test-report
  // describe('timestampToTaskContext', () => {
  //   const matchesYearFormat = date => {
  //     const currentYear = new Date().getUTCFullYear();
  //     if (date.getUTCFullYear() === currentYear) {
  //       expect(timestampToTaskContext(date.valueOf())).toEqual(
  //         timestampToString(date.valueOf(), 'ddd, DD MMM'),
  //       );
  //     } else {
  //       expect(timestampToTaskContext(date.valueOf())).toEqual(
  //         timestampToString(date.valueOf(), 'DD MMM YYYY'),
  //       );
  //     }
  //   };
  //   it('should correctly format date for task', () => {
  //     const date = new Date();
  //     const currentDate = date.getUTCDate();
  //     const currentMonth = date.getUTCMonth();
  //     date.setDate(currentDate - 1);
  //     expect(timestampToTaskContext(date.valueOf())).toEqual(
  //       timestampToString(date.valueOf(), 'Yesterday'),
  //     );
  //     date.setDate(currentDate);
  //     expect(timestampToTaskContext(date.valueOf())).toEqual('Today');
  //     date.setDate(currentDate + 1);
  //     expect(timestampToTaskContext(date.valueOf())).toEqual('Tomorrow');
  //     date.setDate(currentDate - 4);
  //     matchesYearFormat(date);
  //     date.setDate(currentDate + 4);
  //     matchesYearFormat(date);
  //     date.setMonth(currentMonth + 1);
  //     matchesYearFormat(date);
  //     date.setFullYear(date.getFullYear() + 1);
  //     matchesYearFormat(date);
  //   });
  // });
});
