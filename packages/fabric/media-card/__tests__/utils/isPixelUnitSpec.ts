import { isPixelUnit } from '../../src/utils';

describe('isPixelUnit', () => {
  it('should return true when passing a valid pixel value', () => {
    expect(isPixelUnit('0px')).toEqual(true);
    expect(isPixelUnit('50px')).toEqual(true);
    expect(isPixelUnit('1000px')).toEqual(true);
  });

  it('should return false when passing an invalid percentage value', () => {
    expect(isPixelUnit('k5px')).toEqual(false);
    expect(isPixelUnit('5kpx')).toEqual(false);
    expect(isPixelUnit('15pxpx')).toEqual(false);
    expect(isPixelUnit('15')).toEqual(false);
  });

  it('should return false when passing an random string', () => {
    expect(isPixelUnit('5k0g')).toEqual(false);
  });
});
