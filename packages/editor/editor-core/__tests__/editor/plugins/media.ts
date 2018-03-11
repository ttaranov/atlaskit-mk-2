import { name } from '../../../package.json';
import { mediaPlugin } from '../../../src/editor/plugins';
import { EditorPlugin } from '../../../src/editor/types';

const getNodeNames = (plugin: EditorPlugin) =>
  plugin.nodes ? plugin.nodes({}).map(node => node.name) : [];

describe(name, () => {
  describe('Plugins -> Media', () => {
    it('should not have mediaSingle node by default', () => {
      const availableNodes = getNodeNames(mediaPlugin());
      expect(availableNodes).toHaveLength(2);
      expect(availableNodes).not.toContain('mediaSingle');
    });

    it('should have mediaSingle node when allowMediaSingle is true', () => {
      const availableNodes = getNodeNames(
        mediaPlugin({
          provider: Promise.resolve() as any,
          allowMediaSingle: true,
        }),
      );
      expect(availableNodes).toHaveLength(3);
      expect(availableNodes).toContain('mediaSingle');
    });
  });
});
