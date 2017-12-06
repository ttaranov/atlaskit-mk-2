import { minWidth, maxWidth } from '../width';

describe('minWidth()', () => {
  it('should return 240 when there is a preview', () => {
    expect(minWidth({ hasPreview: true })).toEqual(240);
  });

  it('should return 240 when there is no preview', () => {
    expect(minWidth({ hasPreview: false })).toEqual(240);
  });
});

describe('maxWidth()', () => {
  it('should return 664 when there is a preview', () => {
    expect(maxWidth({ hasPreview: true })).toEqual(664);
  });

  it('should return 400 when there is no preview', () => {
    expect(maxWidth({ hasPreview: false })).toEqual(400);
  });
});
