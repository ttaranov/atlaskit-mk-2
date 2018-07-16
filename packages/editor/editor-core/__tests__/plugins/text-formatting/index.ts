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
  stateKey as textFormattingPluginKey,
} from '../../../src/plugins/text-formatting/pm-plugins/main';

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

  it('should allow a change handler to be attached', () => {
    const { pluginState } = editor(doc(p('text')));
    const spy = jest.fn();
    pluginState.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(pluginState);
  });

  describe('code', () => {
    it('should be able to toggle code on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleCode(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p(code('t'), 'ext')));
      expect(pluginState.toggleCode(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether code is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.codeActive).toBe(false);
      expect(pluginState.toggleCode(editorView));
      expect(pluginState.codeActive).toBe(true);
    });

    it('should expose whether code is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.codeActive).toBe(false);
      expect(pluginState.toggleCode(editorView));
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

    it('should convert smart characters to normal ascii', () => {
      const { editorView, pluginState } = editor(
        doc(p('{<}… → ← – “ ” ‘ ’{>}')),
      );

      expect(pluginState.toggleCode(editorView));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(code('... -> <- -- " " \' \''))),
      );
      expect(pluginState.toggleCode(editorView));
      expect(editorView.state.doc).toEqualDocument(
        doc(p('... -> <- -- " " \' \'')),
      );
    });
  });

  describe('em', () => {
    it('should be able to toggle em on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleEm(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p(em('t'), 'ext')));
      expect(pluginState.toggleEm(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether em is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.emActive).toBe(false);
      expect(pluginState.toggleEm(editorView));
      expect(pluginState.emActive).toBe(true);
    });

    it('should expose whether em is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.emActive).toBe(false);
      expect(pluginState.toggleEm(editorView));
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
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleStrong(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p(strong('t'), 'ext')));
      expect(pluginState.toggleStrong(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether strong is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.strongActive).toBe(false);
      expect(pluginState.toggleStrong(editorView));
      expect(pluginState.strongActive).toBe(true);
    });

    it('should expose whether strong is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.strongActive).toBe(false);
      expect(pluginState.toggleStrong(editorView));
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
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleUnderline(editorView));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(underline('t'), 'ext')),
      );
      expect(pluginState.toggleUnderline(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether underline is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.underlineActive).toBe(false);
      expect(pluginState.toggleUnderline(editorView));
      expect(pluginState.underlineActive).toBe(true);
    });

    it('should expose whether underline is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.underlineActive).toBe(false);
      expect(pluginState.toggleUnderline(editorView));
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
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleStrike(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p(strike('t'), 'ext')));
      expect(pluginState.toggleStrike(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether strike is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.strikeActive).toBe(false);
      expect(pluginState.toggleStrike(editorView));
      expect(pluginState.strikeActive).toBe(true);
    });

    it('should expose whether strike is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.strikeActive).toBe(false);
      expect(pluginState.toggleStrike(editorView));
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
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

      expect(pluginState.toggleSubscript(editorView));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sub' })('t'), 'ext')),
      );
      expect(pluginState.toggleSubscript(editorView));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether subcript is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.subscriptActive).toBe(false);
      expect(pluginState.toggleSubscript(editorView));
      expect(pluginState.subscriptActive).toBe(true);
    });

    it('should expose whether subcript is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.subscriptActive).toBe(false);
      expect(pluginState.toggleSubscript(editorView));
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

    it('deactives superscript after toggling subscript for an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      pluginState.toggleSuperscript(editorView);
      pluginState.toggleSubscript(editorView);
      expect(pluginState.superscriptActive).toBe(false);
    });

    it('deactives superscript after toggling subscript for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      pluginState.toggleSuperscript(editorView);
      pluginState.toggleSubscript(editorView);
      expect(pluginState.superscriptActive).toBe(false);
    });
  });

  describe('superscript', () => {
    it('should be able to toggle superscript on a character', () => {
      const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));
      pluginState.toggleSuperscript(editorView);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sup' })('t'), 'ext')),
      );
      pluginState.toggleSuperscript(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether superscript is active on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

      expect(pluginState.superscriptActive).toBe(false);
      expect(pluginState.toggleSuperscript(editorView));
      expect(pluginState.superscriptActive).toBe(true);
    });

    it('should expose whether superscript is active on a text selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.superscriptActive).toBe(false);
      expect(pluginState.toggleSuperscript(editorView));
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

      pluginState.toggleSubscript(editorView);
      pluginState.toggleSuperscript(editorView);
      expect(pluginState.subscriptActive).toBe(false);
    });

    it('deactives subscript after toggling superscript for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      pluginState.toggleSubscript(editorView);
      pluginState.toggleSuperscript(editorView);
      expect(pluginState.subscriptActive).toBe(false);
    });

    it('deactives strong, em, strike after toggling code for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

      expect(pluginState.strongDisabled).toBe(false);
      expect(pluginState.emDisabled).toBe(false);
      expect(pluginState.strikeDisabled).toBe(false);
      pluginState.toggleCode(editorView);
      expect(pluginState.strongDisabled).toBe(true);
      expect(pluginState.emDisabled).toBe(true);
      expect(pluginState.strikeDisabled).toBe(true);
    });
  });
});
