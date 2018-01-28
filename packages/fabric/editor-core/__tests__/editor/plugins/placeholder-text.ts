import { name } from '../../../package.json';
import {
  createPlugin as createPlaceholderTextPlugin,
  default as placeholderTextPlugin,
} from '../../../src/editor/plugins/placeholder-text';
import {
  makeEditor,
  doc,
  p,
  placeholderText,
  insertText,
} from '@atlaskit/editor-test-helpers';

const editor = (doc: any) =>
  makeEditor({
    doc,
    plugin: createPlaceholderTextPlugin(),
  });

describe(name, () => {
  describe('Plugins -> PlaceholderText', () => {
    it('should provide the placeholderText node', () => {
      expect(placeholderTextPlugin.nodes!()).toEqual([
        expect.objectContaining({ name: 'placeholderText' }),
      ]);
    });

    it('should not remove a placeholder when cursor is not directly before it', () => {
      const { editorView, sel } = editor(
        doc(p('Hello world{<>}!', placeholderText({ text: 'Type something' }))),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('Hello world!!', placeholderText({ text: 'Type something' }))),
      );
    });
    it('should not remove a placeholder when cursor is directly after it', () => {
      const { editorView, sel } = editor(
        doc(p(placeholderText({ text: 'Type something' }), '{<>}')),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(placeholderText({ text: 'Type something' }), '!')),
      );
    });

    it('should remove a placeholder when typing directly before it', () => {
      const { editorView, sel } = editor(
        doc(p('Hello world{<>}', placeholderText({ text: 'Type something' }))),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('Hello world!')));
    });
  });
});
