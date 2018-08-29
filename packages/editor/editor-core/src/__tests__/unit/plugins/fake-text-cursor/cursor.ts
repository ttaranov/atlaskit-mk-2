import { TextSelection, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { Slice } from 'prosemirror-model';
import {
  doc,
  createEditor,
  p as paragraph,
} from '@atlaskit/editor-test-helpers';
import {
  addFakeTextCursor,
  removeFakeTextCursor,
  FakeTextCursorSelection,
  drawFakeTextCursor,
  FakeTextCursorBookmark,
} from '../../../../plugins/fake-text-cursor/cursor';

describe('FakeTextCursor -> Cursor', () => {
  const editor = doc => createEditor({ doc });

  describe('addFakeTextCursor', () => {
    it('should add placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      expect(editorView.state.selection instanceof TextSelection).toEqual(true);
      addFakeTextCursor(editorView.state, editorView.dispatch);
      expect(
        editorView.state.selection instanceof FakeTextCursorSelection,
      ).toEqual(true);
      editorView.destroy();
    });
  });

  describe('removeFakeTextCursor', () => {
    it('should remove placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addFakeTextCursor(editorView.state, editorView.dispatch);
      expect(
        editorView.state.selection instanceof FakeTextCursorSelection,
      ).toEqual(true);
      removeFakeTextCursor(editorView.state, editorView.dispatch);
      expect(editorView.state.selection instanceof TextSelection).toEqual(true);
      editorView.destroy();
    });
  });

  describe('drawFakeTextCursor', () => {
    it('should return null if selection is not of type FakeTextCursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      const decoration = drawFakeTextCursor(editorView.state);
      expect(decoration).toEqual(null);
      editorView.destroy();
    });

    it('should return DecorationSet if selection is of type FakeTextCursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addFakeTextCursor(editorView.state, editorView.dispatch);
      const decoration = drawFakeTextCursor(editorView.state);
      expect(decoration instanceof DecorationSet).toEqual(true);
      editorView.destroy();
    });
  });

  describe('FakeTextCursorBookmark', () => {
    const { editorView } = editor(doc(paragraph('{<>}')));
    const linkFakeBookmark = new FakeTextCursorBookmark(
      editorView.state.selection.$from.pos,
    );
    it('should have instance method map defined', () => {
      expect(linkFakeBookmark.map).not.toEqual(undefined);
    });

    it('should have instance method resolve defined', () => {
      expect(linkFakeBookmark.resolve).not.toEqual(undefined);
    });
  });

  describe('FakeTextCursor', () => {
    const { editorView } = editor(doc(paragraph('{<>}')));
    const linkFakeTextCursor = new FakeTextCursorSelection(
      editorView.state.selection.$from,
    );
    it('should extend Selection', () => {
      expect(linkFakeTextCursor instanceof Selection).toEqual(true);
    });

    it('should return instance of FakeTextCursorBookmark when getBookmark is called', () => {
      expect(
        linkFakeTextCursor.getBookmark() instanceof FakeTextCursorBookmark,
      ).toEqual(true);
    });

    it('should return true when eq() is called with FakeTextCursor having same head', () => {
      const linkFakeTextCursorOther = new FakeTextCursorSelection(
        editorView.state.selection.$from,
      );
      expect(linkFakeTextCursor.eq(linkFakeTextCursorOther)).toEqual(true);
    });

    it('should return empty Slice when content() is called', () => {
      expect(linkFakeTextCursor.content()).toEqual(Slice.empty);
    });
  });
});
