import { DecorationSet } from 'prosemirror-view';
import placeholderPlugin, {
  stateKey,
} from '../../../src/plugins/fake-text-cursor';
import { doc, makeEditor, p as paragraph } from '@atlaskit/editor-test-helpers';
import {
  addFakeTextCursor,
  drawFakeTextCursor,
} from '../../../src/plugins/fake-text-cursor/cursor';

describe('fakeTextCursorPlugin', () => {
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

    it('should add fake text-cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addFakeTextCursor(editorView.state, editorView.dispatch);
      const decorators = drawFakeTextCursor(editorView.state);
      expect(decorators instanceof DecorationSet).toEqual(true);
      editorView.destroy();
    });
  });
});
