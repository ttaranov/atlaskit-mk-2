import { name } from '../../../package.json';
import { mediaPlugin } from '../../../src/editor/plugins';

describe(name, () => {
  describe('Plugins -> Media', () => {
    it('should be defined', () => {
      expect(mediaPlugin).toBeDefined();
    });

    it('should have primaryToolbarComponent', () => {
      expect(mediaPlugin.primaryToolbarComponent).toBeDefined();
    });

    it('should have secondaryToolbarComponent', () => {
      expect(mediaPlugin.secondaryToolbarComponent).toBeDefined();
    });
  });
});
