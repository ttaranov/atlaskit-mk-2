import { DecorationSet } from 'prosemirror-view';
import placeholderPlugin, {
  stateKey,
} from '../../../src/plugins/placeholder-cursor';
import { doc, makeEditor, p as paragraph } from '@atlaskit/editor-test-helpers';
import {
  addPlaceholderCursor,
  drawPlaceholderCursor,
} from '../../../src/plugins/placeholder-cursor/cursor';

describe('placeholderplugin', () => {
  const editor = (doc: any) =>
    makeEditor<any>({
      doc,
      plugins: [placeholderPlugin()],
    });

  describe('stateKey', () => {
    it('should be well defined', () => {
      expect(stateKey).not.toEqual(undefined);
    });
  });

  describe('plugin', () => {
    it('should have defined property decorations', () => {
      const plugin = placeholderPlugin();
      expect(plugin.props.decorations).not.toEqual(undefined);
    });

    it('should add placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addPlaceholderCursor(editorView.state, editorView.dispatch);
      const decorators = drawPlaceholderCursor(editorView.state);
      expect(decorators instanceof DecorationSet).toEqual(true);
      editorView.destroy();
    });
  });
});
