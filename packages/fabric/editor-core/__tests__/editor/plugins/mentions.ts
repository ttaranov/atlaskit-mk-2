import { name } from '../../../package.json';
import { mentionsPlugin } from '../../../src/editor/plugins';

describe(name, () => {
  describe('Plugins -> Mentions', () => {
    it('should be defined', () => {
      expect(mentionsPlugin).toBeDefined();
    });

    it('should have primaryToolbarComponent', () => {
      expect(mentionsPlugin.primaryToolbarComponent).toBeDefined();
    });

    it('should have secondaryToolbarComponent', () => {
      expect(mentionsPlugin.secondaryToolbarComponent).toBeDefined();
    });
  });
});
