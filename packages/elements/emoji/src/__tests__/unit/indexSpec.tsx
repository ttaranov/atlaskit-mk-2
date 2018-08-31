import DefaultExport from '../..';
import EmojiTypeAhead from '../../components/typeahead/EmojiTypeAhead';
import { name } from '../../../package.json';

describe(name, () => {
  describe('exports', () => {
    it('should not export a base component', () => {
      expect(DefaultExport).toEqual(EmojiTypeAhead);
    });
  });
});
