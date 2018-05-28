import {
  createEditor,
  doc,
  p,
  code_block,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { AllSelection } from 'prosemirror-state';

describe('IDE UX plugin', () => {
  const editor = doc =>
    createEditor({
      doc,
      editorProps: { allowCodeBlocks: { enableKeybindingsForIDE: true } },
    });
  describe('Select-All', () => {
    describe('when cursor inside code-block', () => {
      it('should select all text inside code-block when Cmd+A pressed', () => {
        const { editorView, refs: { start, end } } = editor(
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
        const { editorView, refs: { start, end } } = editor(
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
              doc(code_block()('to{<}p\nstart\nbott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\n  start\n  bottom')),
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

          it('should indent lines with odd indentation levels when', () => {
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
          it('should indent selected lines by a tab spaces when Mod-] pressed', () => {
            const { editorView } = editor(
              doc(code_block()('\tto{<}p\n\tstart\nbott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ttop\n\t\tstart\n  bottom')),
            );
          });

          it('should indent lines with different indentation levels when Mod-] pressed', () => {
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
    });

    describe('Mod-[ pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should unindent by 2 spaces when Mod-[ pressed', () => {
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
          it('should unindent only selected lines by two spaces when Mod-[ pressed', () => {
            const { editorView } = editor(
              doc(code_block()('  to{<}p\n  start\n  bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should unindent lines with different indentation levels when Mod-[ pressed', () => {
            const { editorView } = editor(
              doc(code_block()('    to{<}p\n  start\n      bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\nstart\n    bottom')),
            );
          });

          it('should unindent lines with odd indentation levels when Mod-[ pressed', () => {
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
          it('should unindent only selected lines by two spaces when Mod-[ pressed', () => {
            const { editorView } = editor(
              doc(code_block()('\tto{<}p\n\tstart\n\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should unindent lines with different indentation levels when Mod-[ pressed', () => {
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
        it('should not unindent text when Mod-[ pressed', () => {
          const { editorView } = editor(
            doc(code_block()('{<}  to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Mod-[');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('  to'), p('end')),
          );
        });
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
        it('should do nothing', () => {
          const { editorView } = editor(
            doc(code_block()('to{<}p\n  start\nbot{>}tom')),
          );
          sendKeyToPm(editorView, 'Tab');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('top\n  start\nbottom')),
          );
        });
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
});
