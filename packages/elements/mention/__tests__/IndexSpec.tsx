import Picker, * as other from '../src';

describe(name, () => {
  describe('exports', () => {
    it('should export a base component', () => {
      expect(Picker).not.toEqual(null);
      expect(other.default).toEqual(Picker);
    });
  });
});
