//@flow
import collapseRange from '../../../util/collapse-range';
import { name } from '../../../../package.json';

describe(`${name} - collapse range`, () => {
  it('should not throw when no parameters are passes', () => {
    expect(() => {
      //$FlowFixMe testing if does not pass any parameters
      collapseRange();
    }).not.toThrow();
  });
  it('should not throw', () => {
    const pages = collapseRange(5, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(pages).toEqual([1, 2, 3, '...', 10]);
  });
  it('should not add ellipsis when not needed', () => {
    const pages = collapseRange(4, 2, [1, 2, 3, 4]);
    expect(pages).toEqual([1, 2, 3, 4]);
  });
  it('should show ellipsis in start with there < 3 add ellipsis when not needed', () => {
    const pages = collapseRange(4, 2, [1, 2, 3, 4]);
    expect(pages).toEqual([1, 2, 3, 4]);
  });
});
