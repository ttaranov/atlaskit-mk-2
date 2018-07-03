import { isSingleLine } from '../../../../plugins/paste/util';

describe('paste util', () => {
  it('should return true for single line of text', () => {
    expect(isSingleLine('only one line')).toBe(true);
  });

  it('should return false for multiple lines of text', () => {
    expect(isSingleLine('first line\nsecond line')).toBe(false);
  });
});
