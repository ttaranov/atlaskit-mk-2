import Picker, * as other from '../../src';
import { name } from '../../package.json';

describe(name, () => {
  describe('exports', () => {
    it('should export a base component', () => {
      expect(Picker).not.toEqual(null);
      expect(other.default).toEqual(Picker);
    });
  });
});
