import { name } from '../../../../package.json';
import { tablePlugin } from '../../../../src/editor/plugins';

describe(name, () => {
  describe('Plugins -> Table', () => {
    it('should be defined', () => {
      expect(tablePlugin).toBeDefined();
    });

    it('should have primaryToolbarComponent', () => {
      expect(tablePlugin.primaryToolbarComponent).toBeDefined();
    });
  });
});
