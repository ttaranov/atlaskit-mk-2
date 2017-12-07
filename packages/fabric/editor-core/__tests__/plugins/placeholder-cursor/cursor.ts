import { TextSelection, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { Slice } from 'prosemirror-model';
import hyperlinkPlugins, {
  HyperlinkState,
} from '../../../src/plugins/hyperlink';
import {
  doc,
  makeEditor,
  p as paragraph,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import {
  addPlaceholderCursor,
  removePlaceholderCursor,
  PlaceholderCursor,
  drawPlaceholderCursor,
  PlaceholderBookmark,
} from '../../../src/plugins/placeholder-cursor/cursor';

describe('placeholdercursor', () => {
  const editor = (doc: any) =>
    makeEditor<HyperlinkState>({
      doc,
      plugins: hyperlinkPlugins(defaultSchema),
    });

  describe('addPlaceholderCursor', () => {
    it('should add placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      expect(editorView.state.selection instanceof TextSelection).toEqual(true);
      addPlaceholderCursor(editorView.state, editorView.dispatch);
      expect(editorView.state.selection instanceof PlaceholderCursor).toEqual(
        true,
      );
      editorView.destroy();
    });
  });

  describe('removePlaceholderCursor', () => {
    it('should remove placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addPlaceholderCursor(editorView.state, editorView.dispatch);
      expect(editorView.state.selection instanceof PlaceholderCursor).toEqual(
        true,
      );
      removePlaceholderCursor(editorView.state, editorView.dispatch);
      expect(editorView.state.selection instanceof TextSelection).toEqual(true);
      editorView.destroy();
    });
  });

  describe('drawPlaceholderCursor', () => {
    it('should return null if selection is not of type PlaceholderCursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      const decoration = drawPlaceholderCursor(editorView.state);
      expect(decoration).toEqual(null);
      editorView.destroy();
    });

    it('should return DecorationSet if selection is of type PlaceholderCursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addPlaceholderCursor(editorView.state, editorView.dispatch);
      const decoration = drawPlaceholderCursor(editorView.state);
      expect(decoration instanceof DecorationSet).toEqual(true);
      editorView.destroy();
    });
  });

  describe('PlaceholderBookmark', () => {
    const { editorView } = editor(doc(paragraph('{<>}')));
    const linkFakeBookmark = new PlaceholderBookmark(
      editorView.state.selection.$from.pos,
    );
    it('should have instance method map defined', () => {
      expect(linkFakeBookmark.map).not.toEqual(undefined);
    });

    it('should have instance method resolve defined', () => {
      expect(linkFakeBookmark.resolve).not.toEqual(undefined);
    });
  });

  describe('PlaceholderCursor', () => {
    const { editorView } = editor(doc(paragraph('{<>}')));
    const linkPlaceholderCursor = new PlaceholderCursor(
      editorView.state.selection.$from,
    );
    it('should extend Selection', () => {
      expect(linkPlaceholderCursor instanceof Selection).toEqual(true);
    });

    it('should return instance of PlaceholderBookmark when getBookmark is called', () => {
      expect(
        linkPlaceholderCursor.getBookmark() instanceof PlaceholderBookmark,
      ).toEqual(true);
    });

    it('should return true when eq() is called with PlaceholderCursor having same head', () => {
      const linkPlaceholderCursorOther = new PlaceholderCursor(
        editorView.state.selection.$from,
      );
      expect(linkPlaceholderCursor.eq(linkPlaceholderCursorOther)).toEqual(
        true,
      );
    });

    it('should return empty Slice when content() is called', () => {
      expect(linkPlaceholderCursor.content()).toEqual(Slice.empty);
    });
  });
});
