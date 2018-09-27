import { browser } from '@atlaskit/editor-common';
import {
  sendKeyToPm,
  doc,
  strike,
  strong,
  em,
  underline,
  code,
  p,
  subsup,
  createEditor,
  mention,
  insertText,
  code_block,
} from '@atlaskit/editor-test-helpers';
import {
  TextFormattingState,
  pluginKey as textFormattingPluginKey,
} from '../../../../plugins/text-formatting/pm-plugins/main';
import * as commands from '../../../../plugins/text-formatting/commands/text-formatting';
import { anyMarkActive } from '../../../../plugins/text-formatting/utils';

describe('text-formatting', () => {
  let trackEvent;
  const editor = (doc: any) =>
    createEditor<TextFormattingState>({
      doc,
      editorProps: {
        analyticsHandler: trackEvent,
        allowCodeBlocks: true,
        mentionProvider: new Promise(() => {}),
      },
      pluginKey: textFormattingPluginKey,
    });

  describe('plugin', () => {
    it('should disable smart autocompletion if option given', () => {
      const { editorView, sel } = createEditor({
        doc: doc(p('{<>}')),
        editorProps: { textFormatting: { disableSmartTextCompletion: true } },
      });
      insertText(editorView, '-- ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('-- ')));
    });

    it('should enable smart autocompletion by default', () => {
      const { editorView, sel } = createEditor({ doc: doc(p('{<>}')) });
      insertText(editorView, '-- ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('– ')));
    });
  });

  describe('keymap', () => {
    beforeEach(() => {
      trackEvent = jest.fn();
    });
    if (browser.mac) {
      describe('when on a mac', () => {
        describe('when hits Cmd-B', () => {
          it('toggles bold mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-b');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strong('text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.strong.keyboard',
            );
          });
        });

        describe('when hits Cmd-I', () => {
          it('toggles italic mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-i');

            expect(editorView.state.doc).toEqualDocument(doc(p(em('text'))));
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.em.keyboard',
            );
          });
        });

        describe('when hits Cmd-U', () => {
          it('toggles underline mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-u');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(underline('text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.underline.keyboard',
            );
          });
        });

        /*
         Node: Here dispatch key 'Shift-Cmd-S' instead of 'Cmd-Shift-S',
         Because after key binding, it was normalized.
         */
        describe('when hits Shift-Cmd-S', () => {
          it('toggles strikethrough mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Cmd-S');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strike('text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.strike.keyboard',
            );
          });
        });

        describe('when hits Shift-Cmd-M', () => {
          it('toggles code mark', () => {
            const { editorView } = editor(
              doc(
                p(
                  strong('{<}text '),
                  mention({ id: '1234', text: '@helga' })(),
                  em(' text{>}'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Shift-Cmd-M');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(code('text @helga text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.code.keyboard',
            );
          });
        });
      });
    } else {
      describe('when not on a mac', () => {
        describe('when hits Ctrl-B', () => {
          it('toggles bold mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-b');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strong('text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.strong.keyboard',
            );
          });
        });

        describe('when hits Ctrl-B', () => {
          it('toggles italic mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-i');

            expect(editorView.state.doc).toEqualDocument(doc(p(em('text'))));
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.em.keyboard',
            );
          });
        });

        describe('when hits Ctrl-B', () => {
          it('toggles underline mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-u');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(underline('text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.underline.keyboard',
            );
          });
        });

        /*
         Node: Here dispatch key 'Shift-Ctrl-S' instead of 'Ctrl-Shift-S',
         Because after key binding, it was normalized.
         */
        describe('when hits Shift-Ctrl-S', () => {
          it('toggles strikethrough mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Ctrl-S');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strike('text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.strike.keyboard',
            );
          });
        });

        describe('when hits Shift-Ctrl-M', () => {
          it('toggles code mark', () => {
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Ctrl-M');

            expect(editorView.state.doc).toEqualDocument(doc(p(code('text'))));
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.code.keyboard',
            );
          });
        });
      });
    }
    describe('code rule', () => {
      it('should convert when "``" is entered followed by a character in it', () => {
        const { editorView, sel } = editor(doc(p('`{<>}`')));
        insertText(editorView, 'c', sel);
        expect(editorView.state.doc).toEqualDocument(doc(p(code('c'))));
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.format.code.autoformatting',
        );
      });
    });
  });

  describe('code', () => {
    it('should be able to toggle code on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(code('t'), 'ext')));
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether code is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(code('some{<>}code'))));
      expect(pluginState.codeActive).toBe(true);
    });

    it('should expose whether code is active on a text selection', () => {
      const { pluginState } = editor(doc(p(code('t{<}e{>}xt'))));
      expect(pluginState.codeActive).toBe(true);
    });

    it('exposes code as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.codeDisabled).toBe(true);
    });

    it('exposes code as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.codeDisabled).toBe(false);
    });

    it('should disable underline when code is active', () => {
      const { pluginState } = editor(doc(p(code('t{<}e{>}xt'))));
      expect(pluginState.underlineDisabled).toBe(true);
      expect(pluginState.codeActive).toBe(true);
    });

    it('should convert smart characters to normal ascii', () => {
      const { editorView } = editor(doc(p('{<}… → ← – “ ” ‘ ’{>}')));
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(code('... -> <- -- " " \' \''))),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p('... -> <- -- " " \' \'')),
      );
    });
  });

  describe('em', () => {
    it('should be able to toggle em on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleEm()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(em('t'), 'ext')));
      expect(commands.toggleEm()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether em is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(em('te{<>}xt'))));
      expect(pluginState.emActive).toBe(true);
    });

    it('should expose whether em is active on a text selection', () => {
      const { pluginState } = editor(doc(p(em('t{<}e{>}xt'))));
      expect(pluginState.emActive).toBe(true);
    });

    it('exposes em as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.emDisabled).toBe(true);
    });

    it('exposes em as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.emDisabled).toBe(false);
    });
  });

  describe('strong', () => {
    it('should be able to toggle strong on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleStrong()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(strong('t'), 'ext')));
      expect(commands.toggleStrong()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether strong is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(strong('te{<>}xt'))));
      expect(pluginState.strongActive).toBe(true);
    });

    it('should expose whether strong is active on a text selection', () => {
      const { pluginState } = editor(doc(p(strong('t{<}e{>}xt'))));
      expect(pluginState.strongActive).toBe(true);
    });

    it('exposes strong as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.strongDisabled).toBe(true);
    });

    it('exposes strong as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.strongDisabled).toBe(false);
    });
  });

  describe('underline', () => {
    it('should be able to toggle underline on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleUnderline()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(underline('t'), 'ext')),
      );
      expect(commands.toggleUnderline()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether underline is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(underline('te{<>}xt'))));
      expect(pluginState.underlineActive).toBe(true);
    });

    it('should expose whether underline is active on a text selection', () => {
      const { pluginState } = editor(doc(p(underline('t{<}e{>}xt'))));
      expect(pluginState.underlineActive).toBe(true);
    });

    it('exposes underline as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.underlineDisabled).toBe(true);
    });

    it('exposes underline as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.underlineDisabled).toBe(false);
    });
  });

  describe('strike', () => {
    it('should be able to toggle strike on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleStrike()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(strike('t'), 'ext')));
      expect(commands.toggleStrike()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether strike is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(strike('te{<>}xt'))));
      expect(pluginState.strikeActive).toBe(true);
    });

    it('should expose whether strike is active on a text selection', () => {
      const { pluginState } = editor(doc(p(strike('t{<}e{>}xt'))));
      expect(pluginState.strikeActive).toBe(true);
    });

    it('exposes strike as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.strikeDisabled).toBe(true);
    });

    it('exposes strike as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.strikeDisabled).toBe(false);
    });
  });

  describe('subscript', () => {
    it('should be able to toggle subscript on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleSubscript()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sub' })('t'), 'ext')),
      );
      expect(commands.toggleSubscript()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether subcript is active on an empty selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('te{<>}xt'))),
      );
      expect(pluginState.subscriptActive).toBe(true);
    });

    it('should expose whether subcript is active on a text selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('t{<}e{>}xt'))),
      );
      expect(pluginState.subscriptActive).toBe(true);
    });

    it('exposes subcript as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.subscriptDisabled).toBe(true);
    });

    it('exposes subcript as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.subscriptDisabled).toBe(false);
    });

    it('deactives superscript if subscript is already active at empty selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('te{<>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(false);
    });

    it('deactives superscript if subscript is already active at selected text', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('t{<}e{>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(false);
    });
  });

  describe('superscript', () => {
    it('should be able to toggle superscript on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sup' })('t'), 'ext')),
      );
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether superscript is active on an empty selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sup' })('te{<>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(true);
    });

    it('should expose whether superscript is active on a text selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sup' })('t{<}e{>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(true);
    });

    it('exposes superscript as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.superscriptDisabled).toBe(true);
    });

    it('exposes superscript as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.superscriptDisabled).toBe(false);
    });

    it('deactives subscript after toggling superscript for an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));
      commands.toggleSubscript()(editorView.state, editorView.dispatch);
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(pluginState.subscriptActive).toBe(false);
    });

    it('deactives subscript after toggling superscript for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));
      commands.toggleSubscript()(editorView.state, editorView.dispatch);
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(pluginState.subscriptActive).toBe(false);
    });

    it('deactives strong, em, strike if selected text is inside code mark', () => {
      const { pluginState } = editor(doc(p(code('t{<}e{>}xt'))));
      expect(pluginState.strongDisabled).toBe(true);
      expect(pluginState.emDisabled).toBe(true);
      expect(pluginState.strikeDisabled).toBe(true);
    });
  });

  describe('code', () => {
    describe('when the cursor is right after the code mark', () => {
      it('should not be able to delete character with "Backspace" without entering into mark editing mode', () => {
        const { editorView, pluginState } = editor(doc(p(code('hell{<}o{>}'))));
        sendKeyToPm(editorView, 'Backspace');
        expect(pluginState.codeActive).toEqual(true);
      });
    });
    describe('when two code nodes separated with one non-code character', () => {
      describe('when moving between two code nodes with ArrowLeft', () => {
        it('should disable code for the first node and then enable for the second node', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{nextPos}'), 'x', code('h{<>}ello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when exiting code with ArrowRight', () => {
      describe('when code is the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{<>}'), '{nextPos}')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{<>}'), '{nextPos}text')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('x{<>}'), '{nextPos}text')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when exiting code with ArrowLeft', () => {
      describe('when code is the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('{nextPos}', code('{<>}hello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{nextPos}', code('h{<>}ello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{nextPos}', code('x{<>}'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when entering code with ArrowRight', () => {
      describe('when code is the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('{<>}', code('{nextPos}hello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{<>}', code('{nextPos}hello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{<>}', code('{nextPos}x'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when entering code with ArrowLeft', () => {
      describe('when code is the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{nextPos}'), '{<>}')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{nextPos}'), 't{<>}ext')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('x{nextPos}'), 't{<>}ext')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });
  });
});
