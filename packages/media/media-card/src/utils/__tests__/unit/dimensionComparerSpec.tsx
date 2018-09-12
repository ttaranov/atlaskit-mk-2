import { canCompareDimension } from '../../dimensionComparer';

describe('canCompareDimension', () => {
  it('should return true when dimensions can not be compared', () => {
    expect(canCompareDimension('10%', '30%')).toBe(true);
    expect(canCompareDimension(2, 100)).toBe(true);
    expect(canCompareDimension('2px', '100px')).toBe(true);
  });

  it('should return false when dimensions can not be compared', () => {
    expect(canCompareDimension('10%', 100)).toBe(false);
    expect(canCompareDimension('aa', '12%')).toBe(false);
    expect(canCompareDimension('10%', '12px')).toBe(false);
  });
});
