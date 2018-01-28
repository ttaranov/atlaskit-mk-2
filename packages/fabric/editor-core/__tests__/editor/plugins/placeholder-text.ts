import { name } from '../../../package.json';
import {
  createPlugin as createPlaceholderTextPlugin,
  default as placeholderTextPlugin,
} from '../../../src/editor/plugins/placeholder-text';
import { insertPlaceholderText } from '../../../src/editor/plugins/placeholder-text/actions';
import {
  makeEditor,
  doc,
  p,
  placeholder,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { Selection } from 'prosemirror-state';

const editor = (doc: any) =>
  makeEditor({
    doc,
    plugin: createPlaceholderTextPlugin(),
  });

describe(name, () => {
  describe('Plugins -> PlaceholderText', () => {
    it('should provide the placeholderText node', () => {
      expect(placeholderTextPlugin.nodes!()).toEqual([
        expect.objectContaining({ name: 'placeholder' }),
      ]);
    });

    it('should not remove a placeholder when cursor is not directly before it', () => {
      const { editorView, sel } = editor(
        doc(p('Hello world{<>}!', placeholder({ text: 'Type something' }))),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('Hello world!!', placeholder({ text: 'Type something' }))),
      );
    });
    it('should not remove a placeholder when cursor is directly after it', () => {
      const { editorView, sel } = editor(
        doc(p(placeholder({ text: 'Type something' }), '{<>}')),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(placeholder({ text: 'Type something' }), '!')),
      );
    });

    it('should remove a placeholder when typing directly before it', () => {
      const { editorView, sel } = editor(
        doc(p('Hello world{<>}', placeholder({ text: 'Type something' }))),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('Hello world!')));
    });
  });
  describe('Plugins -> PlaceholderText -> actions', () => {
    describe('insertPlaceholderText', () => {
      it('should insert placeholder-text node to the document', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        insertPlaceholderText()(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello{<>}', placeholder({ text: 'What are you saying' }))),
        );
      });

      it('should place selection after node when placeholder-text node inserted', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        insertPlaceholderText()(editorView.state, editorView.dispatch);
        const selectionAtEnd = Selection.atEnd(editorView.state.doc);
        expect(editorView.state.selection.eq(selectionAtEnd)).toBe(true);
      });
    });
  });
});
