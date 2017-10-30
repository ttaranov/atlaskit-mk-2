import { expect } from 'chai';

import { isSingleLine } from '../../../../src/plugins/paste/util';

describe('paste util', () => {
  it('should return true for single line of text', () => {
    expect(isSingleLine('only one line')).to.equal(true);
  });

  it('should return false for multiple lines of text', () => {
    expect(isSingleLine('first line\nsecond line')).to.equal(false);
  });
});
