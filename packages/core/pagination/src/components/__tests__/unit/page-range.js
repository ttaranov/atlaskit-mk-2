// @flow
import pageRange from '../../../internal/page-range';

it('should return correct range when less total pages than visible maximum', () => {
  const actual = pageRange(10, 3, 7);
  expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7]);
});
it('should return correct range when total pages equal to visible maximum', () => {
  const actual = pageRange(10, 8, 10);
  expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
it('should return correct range with 10 pages visible, 300 total pages and 150 selected', () => {
  const actual = pageRange(10, 150, 300);
  expect(actual).toEqual([1, '...', 147, 148, 149, 150, 151, 152, '...', 300]);
});
it('should throw exception if visible is less than 7', () => {
  let errorMessage;
  try {
    pageRange(6, 150, 300);
  } catch (ex) {
    errorMessage = ex.message;
  }
  expect(errorMessage).toBe(
    'cannot create range with visible pages less than 7',
  );
});
describe('with 10 pages visible, 15 total pages', () => {
  it('and page 1 selected', () => {
    const actual = pageRange(10, 1, 15);
    expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, '...', 15]);
  });
  it('and page 7 selected', () => {
    const actual = pageRange(10, 7, 15);
    expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, '...', 15]);
  });
  it('and page 8 selected', () => {
    const actual = pageRange(10, 8, 15);
    expect(actual).toEqual([1, '...', 5, 6, 7, 8, 9, 10, '...', 15]);
  });
  it('and page 9 selected', () => {
    const actual = pageRange(10, 9, 15);
    expect(actual).toEqual([1, '...', 8, 9, 10, 11, 12, 13, 14, 15]);
  });
  it('and page 15 selected', () => {
    const actual = pageRange(10, 15, 15);
    expect(actual).toEqual([1, '...', 8, 9, 10, 11, 12, 13, 14, 15]);
  });
});
