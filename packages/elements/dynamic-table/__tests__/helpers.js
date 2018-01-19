// @flow

import { inlineStylesIfRanking } from '../src/internal/helpers';

describe('helpers/inlineStylesIfRanking', () => {
  const width = 100;
  const height = 200;

  it('should return empty object if not in ranking state', () => {
    expect(inlineStylesIfRanking(false, width, height)).toEqual({});
  });

  it('should not add height prop if not passed', () => {
    expect(inlineStylesIfRanking(true, width)).toEqual({ width });
  });

  it('should add height if passed', () => {
    expect(inlineStylesIfRanking(true, width, height)).toEqual({ width, height });
  });
});
