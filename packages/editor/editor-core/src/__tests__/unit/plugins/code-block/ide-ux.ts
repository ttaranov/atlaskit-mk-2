import {
  createEditor,
  doc,
  p,
  code_block,
  sendKeyToPm,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { AllSelection } from 'prosemirror-state';

describe('IDE UX plugin', () => {
  let trackEvent = jest.fn();
  const editor = doc =>
    createEditor({
      doc,
      editorProps: {
        allowCodeBlocks: { enableKeybindingsForIDE: true },
        analyticsHandler: trackEvent,
      },
    });
  describe('Select-All', () => {
    describe('when cursor inside code-block', () => {
      it('should select all text inside code-block when Cmd+A pressed', () => {
        const {
          editorView,
          refs: { start, end },
        } = editor(
          doc(p('start'), code_block()('{start}mid{<>}dle{end}'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        const { from, to } = editorView.state.selection;
        expect(from).toBe(start);
        expect(to).toBe(end);
      });
    });
    describe('when selection inside code-block', () => {
      it('should select all text inside code-block when Cmd+A pressed', () => {
        const {
          editorView,
          refs: { start, end },
        } = editor(
          doc(p('start'), code_block()('{start}{<}mid{>}dle{end}'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        const { from, to } = editorView.state.selection;
        expect(from).toBe(start);
        expect(to).toBe(end);
      });
    });

    describe('when starts inside code-block and finished outside', () => {
      it('should select whole document when Cmd+A pressed', () => {
        const { editorView } = editor(
          doc(p('start'), code_block()('mid{<}dle'), p('en{>}d')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        expect(editorView.state.selection).toBeInstanceOf(AllSelection);
      });
    });

    describe('when selection starts outside code-block and finishes inside', () => {
      it('should select whole document when Cmd+A pressed', () => {
        const { editorView } = editor(
          doc(p('start{<}'), code_block()('mid{>}dle'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        expect(editorView.state.selection).toBeInstanceOf(AllSelection);
      });
    });
  });

  describe('Indentation', () => {
    describe('Mod-] pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should indent by 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
          it('should indent by 1 space when odd number of spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>} start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should indent by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t{<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\t\tstart\nbottom')),
            );
          });

          it('should indent by a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t {<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\t\t start\nbottom')),
            );
          });
        });
      });

      describe('when selection is across multiple lines', () => {
        describe('and line starts with spaces', () => {
          it('should indent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('\nto{<}p\nstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n  top\n  start\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('  to{<}p\nstart\n    bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('    top\n  start\n      bottom')),
            );
          });

          it('should indent lines with odd indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\nstart\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\n  start\n    bottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should indent selected lines by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\n\tto{<}p\n\tstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n\t\ttop\n\t\tstart\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\tto{<}p\nstart\n\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ttop\n  start\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not indent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Mod-]');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('to'), p('end')),
          );
        });
      });

      it('should track when Mod-] is pressed', () => {
        const { editorView } = editor(doc(code_block()('top\n{<>}start\nend')));
        sendKeyToPm(editorView, 'Mod-]');
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.codeblock.indent',
        );
      });
    });

    describe('Mod-[ pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should unindent by 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}  start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should only unindent by 1 space when odd number of spaces and Mod-[ pressed', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}   start\nend')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nend')),
            );
          });

          it('should do nothing when no indentation on line and Mod-[ pressed', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nend')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n{<>}start\nend')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should unindent by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\tsta{<>}rt\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should unindent by a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t sta{<>}rt\nend')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n start\nend')),
            );
          });
        });
      });
      describe('when selection is across multiple lines', () => {
        describe('and line starts with spaces', () => {
          it('should unindent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('  \n  to{<}p\n  start\n  bott{>}om\n  ')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  \ntop\nstart\nbottom\n  ')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('    to{<}p\n  start\n      bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\nstart\n    bottom')),
            );
          });

          it('should unindent lines with odd indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\n  start\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\n  bottom')),
            );
          });
        });
        describe('and line starts with tabs', () => {
          it('should unindent only selected lines by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\t\n\tto{<}p\n\tstart\n\tbott{>}om\n\t')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ntop\nstart\nbottom\n\t')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\t\tto{<}p\n\tstart\n\t\t\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\ttop\nstart\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not unindent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}  to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Mod-[');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('  to'), p('end')),
          );
        });
      });

      it('should track when Mod-[ is pressed', () => {
        const { editorView } = editor(
          doc(code_block()('top\n{<>}   start\nend')),
        );
        sendKeyToPm(editorView, 'Mod-[');
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.codeblock.deindent',
        );
      });
    });

    describe('Tab pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should insert 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
          it('should insert 1 space when odd number of character in line to cursor', () => {
            const { editorView } = editor(
              doc(code_block()('top\n {<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should insert a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\tst{<>}art\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\tst\tart\nbottom')),
            );
          });

          it('should insert a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t start {<>}\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\t start \t\nbottom')),
            );
          });
        });
      });

      describe('when selection is across multiple lines', () => {
        describe('and line starts with spaces', () => {
          it('should indent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('\nto{<}p\nstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n  top\n  start\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('  to{<}p\nstart\n    bott{>}om')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('    top\n  start\n      bottom')),
            );
          });

          it('should indent lines with odd indentation levels when', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\nstart\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\n  start\n    bottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should indent selected lines by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\n\tto{<}p\n\tstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n\t\ttop\n\t\tstart\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\tto{<}p\nstart\n\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ttop\n  start\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not indent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Tab');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('to'), p('end')),
          );
        });
      });

      it('should track when Tab is pressed', () => {
        const { editorView } = editor(doc(code_block()('top\n{<>}start\nend')));
        sendKeyToPm(editorView, 'Tab');
        expect(trackEvent).toHaveBeenLastCalledWith(
          'atlassian.editor.codeblock.insert.indent',
        );
      });
    });

    describe('Shift-Tab pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should unindent by 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}  start\nbottom')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should only unindent by 1 space when odd number of spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}   start\nend')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nend')),
            );
          });

          it('should do nothing when no indentation on line', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nend')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n{<>}start\nend')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should unindent by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\tsta{<>}rt\nbottom')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should unindent by a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t sta{<>}rt\nend')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n start\nend')),
            );
          });
        });
      });
      describe('when selection is across multiple lines', () => {
        describe('and line starts with spaces', () => {
          it('should unindent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('  \n  to{<}p\n  start\n  bott{>}om\n  ')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  \ntop\nstart\nbottom\n  ')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('    to{<}p\n  start\n      bott{>}om')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\nstart\n    bottom')),
            );
          });

          it('should unindent lines with odd indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\n  start\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\n  bottom')),
            );
          });
        });
        describe('and line starts with tabs', () => {
          it('should unindent only selected lines a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\t\n\tto{<}p\n\tstart\n\tbott{>}om\n\t')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ntop\nstart\nbottom\n\t')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\t\tto{<}p\n\tstart\n\t\t\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\ttop\nstart\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not unindent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}  to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Shift-Tab');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('  to'), p('end')),
          );
        });
      });

      it('should track when Shift-Tab is pressed', () => {
        const { editorView } = editor(
          doc(code_block()('top\n{<>}   start\nend')),
        );
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(trackEvent).toHaveBeenLastCalledWith(
          'atlassian.editor.codeblock.deindent',
        );
      });
    });

    describe('Enter pressed', () => {
      describe('when line starts with spaces', () => {
        it('should maintain indentation of the current line', () => {
          const { editorView } = editor(
            doc(code_block()('top\n  start{<>}\nbottom')),
          );
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('top\n  start\n  \nbottom')),
          );
        });
      });
      describe('when line starts with tabs', () => {
        it('should maintain indentation of the current line', () => {
          const { editorView } = editor(
            doc(code_block()('top\n\t\tstart{<>}\nbottom')),
          );
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('top\n\t\tstart\n\t\t\nbottom')),
          );
        });
      });
    });
  });

  describe('Auto-closing Brackets', () => {
    [
      { left: '{', right: '}' },
      { left: '[', right: ']' },
      { left: '(', right: ')' },
    ].forEach(({ left, right }) => {
      describe(`when inserting '${left}'`, () => {
        it(`should insert a matching closing bracket '${right}'`, () => {
          const { editorView, sel } = editor(doc(code_block()('{<>}')));
          insertText(editorView, left, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`${left}${right}`)),
          );
          expect(editorView.state.selection.from).toBe(sel + 1);
        });
        it(`should insert a matching closing bracket '${right}' even when a '${right}' already exists`, () => {
          const { editorView, sel } = editor(doc(code_block()(`{<>}${right}`)));
          insertText(editorView, left, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`${left}${right}${right}`)),
          );
          expect(editorView.state.selection.from).toBe(sel + 1);
        });
      });
      describe(`when cursor in between '${left}' and '${right}'`, () => {
        it(`should only move the cursor when '${right}' inserted`, () => {
          const { editorView, sel } = editor(
            doc(code_block()(`${left}{<>}${right}`)),
          );
          insertText(editorView, right, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`${left}${right}`)),
          );
          expect(editorView.state.selection.from).toBe(sel + 1);
        });
        it('should remove the bracket pair when backspace pressed', () => {
          const { editorView, sel } = editor(
            doc(code_block()(`${left}{<>}${right}`)),
          );
          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(code_block()('')));
          expect(editorView.state.selection.from).toBe(sel - 1);
        });
      });
      describe(`when cursor in between multiple '${left}' and '${right}'`, () => {
        it(`should only move the cursor when '${right}' inserted`, () => {
          const { editorView, sel } = editor(
            doc(code_block()(`${left}${left}{<>}${right}${right}`)),
          );
          sendKeyToPm(editorView, 'Backspace');
          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(code_block()('')));
          expect(editorView.state.selection.from).toBe(sel - 2);
        });
      });
    });
  });
});
