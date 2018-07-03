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
import { analyticsService } from '../../../../analytics';
import listPlugin from '../../../../plugins/lists';
import codeBlockPlugin from '../../../../plugins/code-block';

describe('inputrules', () => {
  let trackEvent;
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [listPlugin, codeBlockPlugin()],
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
    it('should convert "1. " to a ordered list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.autoformatting',
      );
    });

    it('should convert "1. " after shift+enter to a ordered list item', () => {
      const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));
      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('test'), ol(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.autoformatting',
      );
    });

    it('should convert "1. " after multiple shift+enter to a ordered list item', () => {
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

    it('should convert "1) " to a ordered list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '1) ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.autoformatting',
      );
    });

    describe('for numbers other than 1', () => {
      it('should not convert "2. " to a ordered list item', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));

        insertText(editorView, '2. ', sel);
        expect(editorView.state.doc).toEqualDocument(doc(p('2. ')));
        expect(trackEvent).not.toHaveBeenCalledWith(
          'atlassian.editor.format.list.numbered.autoformatting',
        );
      });

      it('should not convert "2. " after shift+enter to a ordered list item', () => {
        const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));
        insertText(editorView, '2. ', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak(), '2. ')),
        );
        expect(trackEvent).not.toHaveBeenCalledWith(
          'atlassian.editor.format.list.numbered.autoformatting',
        );
      });

      it('should not convert "2. " after multiple shift+enter to a ordered list item', () => {
        const { editorView, sel } = editor(
          doc(p('test', hardBreak(), hardBreak(), '{<>}')),
        );
        insertText(editorView, '2. ', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak(), hardBreak(), '2. ')),
        );
        expect(trackEvent).not.toHaveBeenCalledWith(
          'atlassian.editor.format.list.numbered.autoformatting',
        );
      });

      it('should not convert "2) " to a ordered list item', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));

        insertText(editorView, '2) ', sel);
        expect(editorView.state.doc).toEqualDocument(doc(p('2) ')));
        expect(trackEvent).not.toHaveBeenCalledWith(
          'atlassian.editor.format.list.numbered.autoformatting',
        );
      });
    });

    it('should not be possible to convert code block to bullet list item', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('1. ')));
    });
  });
});
