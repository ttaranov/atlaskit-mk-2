import * as chai from 'chai';
import { expect } from 'chai';
import codeBlockPlugin from '../../../../src/plugins/code-block';

import {
  chaiPlugin, doc, makeEditor, p, sendKeyToPm, code_block
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';

chai.use(chaiPlugin);

describe('codeBlock - keymaps', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: codeBlockPlugin(defaultSchema),
  });

  describe('Enter keypress', () => {
    describe('when enter key is pressed 2 times', () => {
      it('it should not exit code block', () => {
        const { editorView } = editor(doc(code_block()('codeBlock{<>}')));

        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).to.deep.equal(doc(code_block()('codeBlock\n\n')));
        editorView.destroy();
      });
    });

    describe('when enter key is pressed 3 times', () => {
      it('it should exit code block', () => {
        const { editorView } = editor(doc(code_block()('codeBlock{<>}')));

        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).to.deep.equal(doc(code_block()('codeBlock'), p('{<>}')));
        editorView.destroy();
      });
    });
  });

  describe('Backspace', () => {
    it('should remove the code block if the cursor is at the beginning of the code block - 1', () => {
      const { editorView } = editor(doc(code_block()('{<>}')));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).to.deep.equal(doc(p()));
      editorView.destroy();
    });

    it('should remove the code block if the cursor is at the beginning of the code block - 2', () => {
      const { editorView } = editor(doc(p('Hello'), code_block()('{<>}')));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).to.deep.equal(doc(p('Hello')));
      editorView.destroy();
    });

    it('should remove the code block if the cursor is at the beginning of the code block - 2', () => {
      const { editorView } = editor(doc(code_block()('{<>}const x = 10;')));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).to.deep.equal(doc(p('const x = 10;')));
      editorView.destroy();
    });

    it('should not remove the code block if selection is not empty ', () => {
      const { editorView } = editor(doc(code_block()('const x = 1{<}0{>};')));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).to.deep.equal(doc(code_block()('const x = 1;')));
      editorView.destroy();
    });
  });
});
