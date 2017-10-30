import * as chai from 'chai';
import * as sinon from 'sinon';
import { expect } from 'chai';
import imageUploadPlugins from '../../../../src/plugins/image-upload';
import {
  chaiPlugin, doc, insertText, makeEditor, p, img, code_block
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { analyticsService } from '../../../../src/analytics';

chai.use(chaiPlugin);

describe('inputrules', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: imageUploadPlugins(defaultSchema),
  });

  describe('image rule', () => {
    it('should convert `![text](url)` to image', () => {
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).to.deep.equal(doc(p(img({ src: 'url', alt: 'text', title: 'text' }))));
      expect(trackEvent.calledWith('atlassian.editor.image.autoformatting')).to.equal(true);
    });

    it('should not convert `![text](url)` to image inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).to.deep.equal(doc(code_block()('![text](url)')));
    });
  });
});
