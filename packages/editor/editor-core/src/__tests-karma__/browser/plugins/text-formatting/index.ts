import * as chai from 'chai';
import { expect } from 'chai';
import {
  chaiPlugin,
  sendKeyToPm,
  doc,
  code,
  p,
  code_block,
  createEditor,
} from '@atlaskit/editor-test-helpers';
import {
  TextFormattingState,
  stateKey,
} from '../../../../plugins/text-formatting/pm-plugins/main';
import codeBlockPlugin from '../../../../plugins/code-block';

chai.use(chaiPlugin);

describe('text-formatting', () => {
  const editor = (doc: any) =>
    createEditor<TextFormattingState>({
      doc,
      pluginKey: stateKey,
      editorPlugins: [codeBlockPlugin()],
    });

  describe('code', () => {
    describe('when the cursor is right after the code mark', () => {
      it('should not be able to delete character with "Backspace" without entering into mark editing mode', () => {
        const { editorView, pluginState } = editor(doc(p(code('hell{<}o{>}'))));
        sendKeyToPm(editorView, 'Backspace');
        expect(pluginState.codeActive).to.equal(true);
      });
    });

    describe('when two code nodes separated with one non-code character', () => {
      describe('when moving between two code nodes with ArrowLeft', () => {
        it('should disable code for the first node and then enable for the second node', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p(code('hello{nextPos}'), 'x', code('h{<>}ello'))),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    describe('when exiting code with ArrowRight', () => {
      describe('when code is the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p(code('hello{<>}'), '{nextPos}')),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      describe('when code is not the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p(code('hello{<>}'), '{nextPos}text')),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      describe('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p(code('x{<>}'), '{nextPos}text')),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    describe('when exiting code with ArrowLeft', () => {
      describe('when code is the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p('{nextPos}', code('{<>}hello'))),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      describe('when code is not the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p('text{nextPos}', code('h{<>}ello'))),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      describe('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p('text{nextPos}', code('x{<>}'))),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    describe('when entering code with ArrowRight', () => {
      describe('when code is the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p('{<>}', code('{nextPos}hello'))),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      describe('when code is not the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p('text{<>}', code('{nextPos}hello'))),
          );
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      describe('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p('text{<>}', code('{nextPos}x'))),
          );
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    describe('when entering code with ArrowLeft', () => {
      describe('when code is the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p(code('hello{nextPos}'), '{<>}')),
          );
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      describe('when code is not the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p(code('hello{nextPos}'), 't{<>}ext')),
          );
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(
            doc(p(code('x{nextPos}'), 't{<>}ext')),
          );
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    it('should be able to toggle code on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleCode(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p(code('t'), 'ext')));
      expect(pluginState.toggleCode(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p('text')));
    });

    it('should expose whether code is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.codeActive).to.equal(false);
      expect(pluginState.toggleCode(editorView));
      expect(pluginState.codeActive).to.equal(true);
    });

    it('should expose whether code is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.codeActive).to.equal(false);
      expect(pluginState.toggleCode(editorView));
      expect(pluginState.codeActive).to.equal(true);
    });

    it('exposes code as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));

      expect(pluginState.codeDisabled).to.equal(true);
    });

    it('exposes code as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.codeDisabled).to.equal(false);
    });
  });
});
