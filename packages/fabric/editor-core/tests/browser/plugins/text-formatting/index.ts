import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { browser } from '@atlaskit/editor-common';
import {
  sendKeyToPm, doc, strike, plain, strong, em, underline, code, p,
  subsup, chaiPlugin, makeEditor, mention, insertText
} from '../../../../src/test-helper';
import textFormattingPlugins, { TextFormattingState } from '../../../../src/plugins/text-formatting';
import defaultSchema from '../../../../src/test-helper/schema';
import { analyticsService } from '../../../../src/analytics';

chai.use(chaiPlugin);

describe('text-formatting', () => {
  const editor = (doc: any) => makeEditor<TextFormattingState>({
    doc,
    plugins: textFormattingPlugins(defaultSchema),
  });

  describe('keymap', () => {
    let trackEvent;
    beforeEach(() => {
      trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
    });
    if (browser.mac) {
      context('when on a mac', () => {
        context('when hits Cmd-B', () => {
          it('toggles bold mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-b');

            expect(editorView.state.doc).to.deep.equal(doc(p(strong('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.strong.keyboard')).to.equal(true);
          });
        });

        context('when hits Cmd-I', () => {
          it('toggles italic mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-i');

            expect(editorView.state.doc).to.deep.equal(doc(p(em('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.em.keyboard')).to.equal(true);
          });
        });

        context('when hits Cmd-U', () => {
          it('toggles underline mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-u');

            expect(editorView.state.doc).to.deep.equal(doc(p(underline('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.underline.keyboard')).to.equal(true);
          });
        });

        /*
         Node: Here dispatch key 'Shift-Cmd-S' instead of 'Cmd-Shift-S',
         Because after key binding, it was normalized.
         */
        context('when hits Shift-Cmd-S', () => {
          it('toggles strikethrough mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Cmd-S');

            expect(editorView.state.doc).to.deep.equal(doc(p(strike('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.strike.keyboard')).to.equal(true);
          });
        });

        context('when hits Shift-Cmd-M', () => {
          it('toggles code mark', () => {
            const { editorView } = editor(doc(p(strong('{<}text '), mention({ id: '1234', text: '@helga' }), em(' text{>}'))));

            sendKeyToPm(editorView, 'Shift-Cmd-M');

            expect(editorView.state.doc).to.deep.equal(doc(p(code('text @helga text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.code.keyboard')).to.equal(true);
          });
        });
      });
    } else {
      context('when not on a mac', () => {
        context('when hits Ctrl-B', () => {
          it('toggles bold mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-b');

            expect(editorView.state.doc).to.deep.equal(doc(p(strong('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.strong.keyboard')).to.equal(true);
          });
        });

        context('when hits Ctrl-B', () => {
          it('toggles italic mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-i');

            expect(editorView.state.doc).to.deep.equal(doc(p(em('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.em.keyboard')).to.equal(true);
          });
        });

        context('when hits Ctrl-B', () => {
          it('toggles underline mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-u');

            expect(editorView.state.doc).to.deep.equal(doc(p(underline('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.underline.keyboard')).to.equal(true);
          });
        });

        /*
         Node: Here dispatch key 'Shift-Ctrl-S' instead of 'Ctrl-Shift-S',
         Because after key binding, it was normalized.
         */
        context('when hits Shift-Ctrl-S', () => {
          it('toggles strikethrough mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Ctrl-S');

            expect(editorView.state.doc).to.deep.equal(doc(p(strike('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.strike.keyboard')).to.equal(true);
          });
        });

        context('when hits Shift-Ctrl-M', () => {
          it('toggles code mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Ctrl-M');

            expect(editorView.state.doc).to.deep.equal(doc(p(code('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.code.keyboard')).to.equal(true);
          });
        });
      });
    }
    describe('code rule', () => {
      it('should convert when "``" is entered followed by a character in it', () => {
        const { editorView, sel } = editor(doc(p('`{<>}`')));
        insertText(editorView, 'c', sel);
        expect(editorView.state.doc).to.deep.equal(doc(p(code('c'))));
        expect(trackEvent.calledWith('atlassian.editor.format.code.autoformatting')).to.equal(true);
      });
    });

  });

  it('should allow a change handler to be attached', () => {
    const { pluginState } = editor(doc(p('text')));
    const spy = sinon.spy();
    pluginState.subscribe(spy);

    expect(spy.callCount).to.equal(1);
    expect(spy.calledWith(pluginState)).to.equal(true);
  });

  describe('em', () => {
    it('should be able to toggle em on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleEm(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p(em('t'), 'ext')));
      expect(pluginState.toggleEm(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p('text')));
    });

    it('should expose whether em is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.emActive).to.equal(false);
      expect(pluginState.toggleEm(editorView));
      expect(pluginState.emActive).to.equal(true);
    });

    it('should expose whether em is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.emActive).to.equal(false);
      expect(pluginState.toggleEm(editorView));
      expect(pluginState.emActive).to.equal(true);
    });

    it('exposes em as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(plain('te{<>}xt')));

      expect(pluginState.emDisabled).to.equal(true);
    });

    it('exposes em as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.emDisabled).to.equal(false);
    });
  });

  describe('strong', () => {
    it('should be able to toggle strong on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleStrong(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p(strong('t'), 'ext')));
      expect(pluginState.toggleStrong(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p('text')));
    });

    it('should expose whether strong is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.strongActive).to.equal(false);
      expect(pluginState.toggleStrong(editorView));
      expect(pluginState.strongActive).to.equal(true);
    });

    it('should expose whether strong is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.strongActive).to.equal(false);
      expect(pluginState.toggleStrong(editorView));
      expect(pluginState.strongActive).to.equal(true);
    });

    it('exposes strong as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(plain('te{<>}xt')));

      expect(pluginState.strongDisabled).to.equal(true);
    });

    it('exposes strong as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.strongDisabled).to.equal(false);
    });
  });

  describe('underline', () => {
    it('should be able to toggle underline on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleUnderline(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p(underline('t'), 'ext')));
      expect(pluginState.toggleUnderline(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p('text')));
    });

    it('should expose whether underline is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.underlineActive).to.equal(false);
      expect(pluginState.toggleUnderline(editorView));
      expect(pluginState.underlineActive).to.equal(true);
    });

    it('should expose whether underline is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.underlineActive).to.equal(false);
      expect(pluginState.toggleUnderline(editorView));
      expect(pluginState.underlineActive).to.equal(true);
    });

    it('exposes underline as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(plain('te{<>}xt')));

      expect(pluginState.underlineDisabled).to.equal(true);
    });

    it('exposes underline as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.underlineDisabled).to.equal(false);
    });
  });

  describe('code', () => {
    context('when the cursor is right after the code mark', () => {
      it('should not be able to delete character with "Backspace" without entering into mark editing mode', () => {
        const { editorView, pluginState } = editor(doc(p(code('hell{<}o{>}'))));
        sendKeyToPm(editorView, 'Backspace');
        expect(pluginState.codeActive).to.equal(true);
      });
    });

    context('when two code nodes separated with one non-code character', () => {
      context('when moving between two code nodes with ArrowLeft', () => {
        it('should disable code for the first node and then enable for the second node', () => {
          const { editorView, pluginState, refs } = editor(doc(p(code('hello{nextPos}'), 'x',  code('h{<>}ello'))));
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

    context('when exiting code with ArrowRight', () => {
      context('when code is the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p(code('hello{<>}'), '{nextPos}')));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      context('when code is not the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p(code('hello{<>}'), '{nextPos}text')));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      context('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p(code('x{<>}'), '{nextPos}text')));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    context('when exiting code with ArrowLeft', () => {
      context('when code is the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p('{nextPos}', code('{<>}hello'))));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      context('when code is not the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p('text{nextPos}', code('h{<>}ello'))));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      context('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p('text{nextPos}', code('x{<>}'))));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    context('when entering code with ArrowRight', () => {
      context('when code is the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p('{<>}', code('{nextPos}hello'))));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      context('when code is not the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p('text{<>}', code('{nextPos}hello'))));
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });

      context('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p('text{<>}', code('{nextPos}x'))));
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
    });

    context('when entering code with ArrowLeft', () => {
      context('when code is the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p(code('hello{nextPos}'), '{<>}')));
          expect(pluginState.codeActive).to.equal(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      context('when code is not the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p(code('hello{nextPos}'), 't{<>}ext')));
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(pluginState.codeActive).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(refs.nextPos);
        });
      });
      context('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, pluginState, refs } = editor(doc(p(code('x{nextPos}'), 't{<>}ext')));
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
      const { pluginState } = editor(doc(plain('te{<>}xt')));

      expect(pluginState.codeDisabled).to.equal(true);
    });

    it('exposes code as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.codeDisabled).to.equal(false);
    });
  });

  describe('strike', () => {
    it('should be able to toggle strike on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleStrike(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p(strike('t'), 'ext')));
      expect(pluginState.toggleStrike(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p('text')));
    });

    it('should expose whether strike is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.strikeActive).to.equal(false);
      expect(pluginState.toggleStrike(editorView));
      expect(pluginState.strikeActive).to.equal(true);
    });

    it('should expose whether strike is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.strikeActive).to.equal(false);
      expect(pluginState.toggleStrike(editorView));
      expect(pluginState.strikeActive).to.equal(true);
    });

    it('exposes strike as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(plain('te{<>}xt')));

      expect(pluginState.strikeDisabled).to.equal(true);
    });

    it('exposes strike as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.strikeDisabled).to.equal(false);
    });
  });

  describe('subscript', () => {
    it('should be able to toggle subscript on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleSubscript(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p(subsup({ type: 'sub' })('t'), 'ext')));
      expect(pluginState.toggleSubscript(editorView));
      expect(editorView.state.doc).to.deep.equal(doc(p('text')));
    });

    it('should expose whether subcript is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.subscriptActive).to.equal(false);
      expect(pluginState.toggleSubscript(editorView));
      expect(pluginState.subscriptActive).to.equal(true);
    });

    it('should expose whether subcript is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.subscriptActive).to.equal(false);
      expect(pluginState.toggleSubscript(editorView));
      expect(pluginState.subscriptActive).to.equal(true);
    });

    it('exposes subcript as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(plain('te{<>}xt')));

      expect(pluginState.subscriptDisabled).to.equal(true);
    });

    it('exposes subcript as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.subscriptDisabled).to.equal(false);
    });

    it('deactives superscript after toggling subscript for an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      pluginState.toggleSuperscript(editorView);
      pluginState.toggleSubscript(editorView);
      expect(pluginState.superscriptActive).to.equal(false);
    });

    it('deactives superscript after toggling subscript for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      pluginState.toggleSuperscript(editorView);
      pluginState.toggleSubscript(editorView);
      expect(pluginState.superscriptActive).to.equal(false);
    });
  });

  describe('superscript', () => {
    it('should be able to toggle superscript on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));
      pluginState.toggleSuperscript(editorView);
      expect(editorView.state.doc).to.deep.equal(doc(p(subsup({ type: 'sup' })('t'), 'ext')));
      pluginState.toggleSuperscript(editorView);
      expect(editorView.state.doc).to.deep.equal(doc(p('text')));
    });

    it('should expose whether superscript is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.superscriptActive).to.equal(false);
      expect(pluginState.toggleSuperscript(editorView));
      expect(pluginState.superscriptActive).to.equal(true);
    });

    it('should expose whether superscript is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.superscriptActive).to.equal(false);
      expect(pluginState.toggleSuperscript(editorView));
      expect(pluginState.superscriptActive).to.equal(true);
    });

    it('exposes superscript as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(plain('te{<>}xt')));

      expect(pluginState.superscriptDisabled).to.equal(true);
    });

    it('exposes superscript as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.superscriptDisabled).to.equal(false);
    });

    it('deactives subscript after toggling superscript for an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      pluginState.toggleSubscript(editorView);
      pluginState.toggleSuperscript(editorView);
      expect(pluginState.subscriptActive).to.equal(false);
    });

    it('deactives subscript after toggling superscript for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      pluginState.toggleSubscript(editorView);
      pluginState.toggleSuperscript(editorView);
      expect(pluginState.subscriptActive).to.equal(false);
    });

    it('deactives strong, em, strike after toggling code for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.strongDisabled).to.equal(false);
      expect(pluginState.emDisabled).to.equal(false);
      expect(pluginState.strikeDisabled).to.equal(false);
      pluginState.toggleCode(editorView);
      expect(pluginState.strongDisabled).to.equal(true);
      expect(pluginState.emDisabled).to.equal(true);
      expect(pluginState.strikeDisabled).to.equal(true);
    });
  });
});
