import { name } from '../../../package.json';
import placeholderTextPlugin, {
  pluginKey,
} from '../../../src/editor/plugins/placeholder-text';
import {
  insertPlaceholderTextAtSelection,
  showPlaceholderFloatingToolbar,
  hidePlaceholderFloatingToolbar,
} from '../../../src/editor/plugins/placeholder-text/actions';
import {
  createEditor,
  doc,
  p,
  placeholder,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { Selection } from 'prosemirror-state';

const editor = (doc: any) =>
  createEditor({
    doc,
    editorPlugins: [placeholderTextPlugin],
  });

describe(name, () => {
  describe('Plugins -> PlaceholderText', () => {
    it('should provide the placeholderText node', () => {
      const nodes = placeholderTextPlugin.nodes!({});
      expect(nodes).toEqual([expect.objectContaining({ name: 'placeholder' })]);
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
    describe('insertPlaceholderTextAtSelection', () => {
      it('should insert placeholder-text node to the document', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        insertPlaceholderTextAtSelection('What are you saying')(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello{<>}', placeholder({ text: 'What are you saying' }))),
        );
      });

      it('should place selection after node when placeholder-text node inserted', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        insertPlaceholderTextAtSelection('What are you saying')(
          editorView.state,
          editorView.dispatch,
        );
        const selectionAtEnd = Selection.atEnd(editorView.state.doc);
        expect(editorView.state.selection.eq(selectionAtEnd)).toBe(true);
      });

      it('should hide the placeholder toolbar when placeholder-text node inserted', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        insertPlaceholderTextAtSelection('What are you saying')(
          editorView.state,
          editorView.dispatch,
        );
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy.mock.calls[0][0].getMeta(pluginKey)).toEqual({
          showInsertPanelAt: null,
        });
      });
    });

    describe('showPlaceholderFloatingToolbar', () => {
      it('should set the `showInsertPanelAt` meta value to the selection position', () => {
        const { editorView, sel } = editor(doc(p('hello{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(typeof sel).toBe('number');
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy.mock.calls[0][0].getMeta(pluginKey)).toEqual({
          showInsertPanelAt: sel,
        });
      });

      it('should delete the selection if non-empty', () => {
        const { editorView } = editor(doc(p('hel{<}lo{>}')));
        showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p('hel{<>}')));
      });
    });

    describe('hidePlaceholderFloatingToolbar', () => {
      it('should set the `showInsertPanelAt` meta value to null', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        hidePlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy.mock.calls[0][0].getMeta(pluginKey)).toEqual({
          showInsertPanelAt: null,
        });
      });
    });
  });
});
