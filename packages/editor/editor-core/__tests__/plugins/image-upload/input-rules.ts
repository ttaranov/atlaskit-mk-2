import {
  doc,
  insertText,
  createEditor,
  p,
  img,
  code_block,
} from '@atlaskit/editor-test-helpers';
import imageUpload from '../../../src/plugins/image-upload';
import codeBlockPlugin from '../../../src/plugins/code-block';

describe('inputrules', () => {
  const editor = (doc: any, trackEvent?: () => {}) =>
    createEditor({
      doc,
      editorPlugins: [imageUpload, codeBlockPlugin],
      editorProps: { analyticsHandler: trackEvent },
    });

  describe('image rule', () => {
    it('should convert `![text](url)` to image', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(doc(p('{<>}')), trackEvent);

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(img({ src: 'url', alt: 'text', title: 'text' })())),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.image.autoformatting',
      );
    });

    it('should not convert `![text](url)` to image inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('![text](url)')),
      );
    });
  });
});
