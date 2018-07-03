import { hexToRgba } from '../../../utils/color';

describe('@atlaskit/editor-core color utils', () => {
  describe('hex2rgba', () => {
    it('converts short hex to rgba', () => {
      expect(hexToRgba('#fab', 0.5)).toEqual('rgba(255,170,187,0.5)');
    });

    it('converts long hex to rgba', () => {
      expect(hexToRgba('#ffaabb', 0.5)).toEqual('rgba(255,170,187,0.5)');
    });
  });
});
