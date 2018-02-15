import defaultExported from '../src';

describe('@atlaskit/util-data-test', () => {
  describe('exports', () => {
    it('should export an empty base component', () => {
      expect(defaultExported).toEqual({});
    });
  });
});
