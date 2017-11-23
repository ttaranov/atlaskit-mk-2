import listsInputRulesPlugin from '../../../src/plugins/lists/input-rule';
import {
  insertText,
  code_block, doc,
  li, makeEditor, ol, p, ul,
  defaultSchema as schema
} from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';


describe('inputrules', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugin: listsInputRulesPlugin(schema)
  });
  let trackEvent;
  beforeEach(() => {
    trackEvent = jest.fn()
    analyticsService.trackEvent = trackEvent;
  });

  describe('bullet list rule', () => {
    it('should convert "* " to a bullet list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '* ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.format.list.bullet.autoformatting');
    });

    it('should convert "- " to a bullet list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '- ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.format.list.bullet.autoformatting');
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
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.format.list.numbered.autoformatting');
    });

    it('should convert "[number]) " to a ordered list item', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '1) ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.format.list.numbered.autoformatting');
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
