import { getShortHash, defaultHashLength } from '../utils/string-helpers';

describe('getShortHash', () => {
  it(`should trim the string to ${defaultHashLength} characters by default`, () => {
    expect(getShortHash('1234567890')).toHaveLength(defaultHashLength);
  });
  it('should trim the sting to the specified length', () => {
    const length = 3;
    expect(getShortHash('1234567890', length)).toHaveLength(length);
  });
});
