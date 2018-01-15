import { DecorationSet } from 'prosemirror-view';
import {
  doc,
  createEditor,
  p as paragraph,
} from '@atlaskit/editor-test-helpers';
import {
  addPlaceholderCursor,
  drawPlaceholderCursor,
} from '../../../src/plugins/placeholder-cursor/cursor';
import placeholderCursor from '../../../src/editor/plugins/placeholder-cursor';

describe('placeholderplugin', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [placeholderCursor],
    });

  describe('plugin', () => {
    it('should add placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addPlaceholderCursor(editorView.state, editorView.dispatch);
      const decorators = drawPlaceholderCursor(editorView.state);
      expect(decorators instanceof DecorationSet).toEqual(true);
      editorView.destroy();
    });
  });
});
