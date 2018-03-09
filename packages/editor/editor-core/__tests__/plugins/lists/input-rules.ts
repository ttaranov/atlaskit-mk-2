import {
  insertText,
  code_block,
  doc,
  li,
  createEditor,
  ol,
  p,
  ul,
  hardBreak,
} from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';
import listPlugin from '../../../src/editor/plugins/lists';
import codeBlockPlugin from '../../../src/editor/plugins/code-block';

describe('inputrules', () => {
  let trackEvent;
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [listPlugin, codeBlockPlugin],
      editorProps: { analyticsHandler: trackEvent },
    });
  beforeEach(() => {
    trackEvent = jest.fn();
    analyticsService.trackEvent = trackEvent;
  });

  describe('bullet list rule', () => {
    it('should convert "* " to a bullet list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '* ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.bullet.autoformatting',
      );
    });

    it('should convert "* " after shift+enter to a bullet list item', () => {
      const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));
      insertText(editorView, '* ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('test'), ul(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.bullet.autoformatting',
      );
    });

    it('should convert "* " after multiple shift+enter to a bullet list item', () => {
      const { editorView, sel } = editor(
        doc(p('test', hardBreak(), hardBreak(), '{<>}')),
      );
      insertText(editorView, '* ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test', hardBreak()), ul(li(p()))),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.bullet.autoformatting',
      );
    });

    it('should convert "* " after shift+enter to a bullet list for only current line', () => {
      const { editorView, sel } = editor(
        doc(p('test1', hardBreak(), '{<>}test2', hardBreak(), 'test3')),
      );
      insertText(editorView, '* ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test1'), ul(li(p('test2'))), p('test3')),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.bullet.autoformatting',
      );
    });

    it('should convert "- " to a bullet list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '- ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.bullet.autoformatting',
      );
    });

    it('should be not be possible to convert a code_clock to a list item', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));
      insertText(editorView, '* ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('* ')));
    });
  });

  describe('ordered list rule', () => {
    it('should convert "[number]. " to a ordered list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.autoformatting',
      );
    });

    it('should convert "[number]. " after shift+enter to a ordered list item', () => {
      const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));
      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('test'), ol(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.autoformatting',
      );
    });

    it('should convert "[number]. " after multiple shift+enter to a ordered list item', () => {
      const { editorView, sel } = editor(
        doc(p('test', hardBreak(), hardBreak(), '{<>}')),
      );
      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test', hardBreak()), ol(li(p()))),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.autoformatting',
      );
    });

    it('should convert "[number]) " to a ordered list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '1) ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.autoformatting',
      );
    });

    it('should always begin a new list on 1', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '3. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
    });

    it('should not be possible to convert code block to bullet list item', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('1. ')));
    });
  });
});
