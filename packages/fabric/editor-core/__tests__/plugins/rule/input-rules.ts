import rulePlugins from '../../../src/plugins/rule';
import {
  doc, hr, insertText, makeEditor, p, code_block
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';

describe('inputrules', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: rulePlugins(defaultSchema),
  });

  describe('rule', () => {
    it('should not convert "***" in the middle of a line to a horizontal rule', () => {
      const { editorView, sel } = editor(doc(p('test{<>}')));

      insertText(editorView, 'text***', sel);

      expect(editorView.state.doc).not.toEqualDocument(doc(p(), hr, p()));
    });

    it('should convert "***" in the start of a line to a horizontal rule', () => {
      let trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '***', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(), hr, p()));
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.format.horizontalrule.autoformatting');
    });

    it('should convert "---" at the start of a line to horizontal rule', () => {
      let trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '---', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(), hr, p()));
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.format.horizontalrule.autoformatting');
    });

    it('should not convert "---" in the middle of a line to a horizontal rule', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'text---', sel);

      expect(editorView.state.doc).not.toEqualDocument(doc(p('text'), hr, p()));
    });

    it('should not convert "---" inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '---', sel);

      expect(editorView.state.doc).toEqualDocument(doc(code_block()('---')));
    });
  });


});
