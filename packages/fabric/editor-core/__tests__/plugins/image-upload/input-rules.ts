import imageUploadPlugins from '../../../src/plugins/image-upload';
import {
  doc,
  insertText,
  makeEditor,
  p,
  img,
  code_block,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';

describe('inputrules', () => {
  const editor = (doc: any) =>
    makeEditor({
      doc,
      plugins: imageUploadPlugins(defaultSchema),
    });

  describe('image rule', () => {
    it('should convert `![text](url)` to image', () => {
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(img({ src: 'url', alt: 'text', title: 'text' }))),
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
