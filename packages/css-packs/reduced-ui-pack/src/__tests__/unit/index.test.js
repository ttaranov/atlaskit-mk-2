//@flow
import { styleSheet } from '../..';

describe('styleSheet', () => {
  it('should not have [object Object]', () => {
    expect(styleSheet).not.toContain('[object Object]');
  });
  it('should not have [Function', () => {
    expect(styleSheet).not.toContain('[Function');
  });
});
