//@flow
import cssReset, { styleSheet } from '../..';

describe('cssReset', () => {
  it('should not throw', () => {
    expect(() => {
      cssReset();
    }).not.toThrow();
  });
});

describe('styleSheet', () => {
  it('should not have [object Object]', () => {
    expect(styleSheet).not.toContain('[object Object]');
  });
  it('should not have [Function', () => {
    expect(styleSheet).not.toContain('[Function');
  });
});
