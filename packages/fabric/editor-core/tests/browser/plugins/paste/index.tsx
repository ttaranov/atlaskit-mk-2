import * as chai from 'chai';
import { expect } from 'chai';

import pastePlugins from '../../../../src/plugins/paste';
import { browser } from '@atlaskit/editor-common';
import { chaiPlugin, code_block, doc, p, code, makeEditor, dispatchPasteEvent, isMobileBrowser } from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';

chai.use(chaiPlugin);

if(!browser.ie && !isMobileBrowser()) {
  describe('paste plugins', () => {
    const editor = (doc: any) => makeEditor<any>({
      doc,
      plugins: pastePlugins(defaultSchema),
    });

    describe('handlePaste', () => {
      it('should not create paragraph when plain text is copied in code-block', () => {
        const { editorView } = editor(doc(code_block()('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).to.deep.equal(doc(code_block()('plain text')));
      });

      it('should create paragraph when plain text is not copied in code-block', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).to.deep.equal(doc(p('plain text')));
      });

      it('should create code-block for multiple lines of code copied', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'code line 1\ncode line 2', html: '<pre>code line 1\ncode line 2</pre>' });
        expect(editorView.state.doc).to.deep.equal(doc(code_block()('code line 1\ncode line 2')));
      });

      it('should create code mark for single lines of code copied', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'code single line', html: '<pre>code single line</pre>' });
        expect(editorView.state.doc).to.deep.equal(doc(p(code('code single line'))));
      });

      it('should create code block for font-family monospace css', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { html: `<meta charset='utf-8'><div style="font-family: Menlo, Monaco, 'Courier New', monospace;white-space: pre;">Code :D</div>` });
        expect(editorView.state.doc).to.deep.equal(doc(code_block()('Code :D')));
      });

      it('should create code block for whitespace pre css', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { html: `<meta charset='utf-8'><div style="white-space: pre;">Hello</div>` });
        expect(editorView.state.doc).to.deep.equal(doc(code_block()('Hello')));
      });

      it('should not create code block for whitespace pre-wrap css', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { html: `<meta charset='utf-8'><div style="white-space: pre-wrap;">Hello</div>` });
        expect(editorView.state.doc).to.deep.equal(doc(p('Hello')));
      });

      it('should not handle events with Files type', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'my-awesome-mug.png', types: ['text/plain', 'Files'] });
        expect(editorView.state.doc).to.deep.equal(doc(p('')));
      });
    });
  });
}
