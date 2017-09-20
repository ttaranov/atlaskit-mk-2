import { join } from '../path';

describe.only('join', () => {
  it('single argument', () => {
    expect(join('one')).toBe('one');
  });
});
