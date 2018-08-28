import {
  doc,
  insertText,
  createEditor,
  p,
  code_block,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers';
import imageUpload from '../../../../plugins/image-upload';
import codeBlockPlugin from '../../../../plugins/code-block';
import mediaPlugin from '../../../../plugins/media';

describe('inputrules', () => {
  const editor = (doc: any, trackEvent?: () => {}) =>
    createEditor({
      doc,
      editorPlugins: [
        imageUpload,
        codeBlockPlugin(),
        mediaPlugin({ allowMediaSingle: true }),
      ],
      editorProps: { analyticsHandler: trackEvent },
    });

  describe('image rule', () => {
    it('should convert `![text](url)` to image', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(doc(p('{<>}')), trackEvent);

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(), mediaSingle()(media({ type: 'external', url: 'url' })()), p()),
      );

      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.image.autoformatting',
      );
    });

    it('should convert `![](url)` to image', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(doc(p('{<>}')), trackEvent);

      insertText(editorView, '![](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(), mediaSingle()(media({ type: 'external', url: 'url' })()), p()),
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
