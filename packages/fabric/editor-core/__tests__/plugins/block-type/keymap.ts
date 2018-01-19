import blockTypePlugin from '../../../src/plugins/block-type';
import { browser, createSchema } from '@atlaskit/editor-common';
import {
  insertText,
  sendKeyToPm,
  blockquote,
  code_block,
  doc,
  h1,
  makeEditor,
  mention,
  p,
  hr,
  ul,
  li,
  hardBreak,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import blockTypePlugins from '../../../src/plugins/block-type';
import { analyticsService } from '../../../src/analytics';
import { setNodeSelection } from '../../../src/utils';

describe('codeBlock - keymaps', () => {
  const editor = (doc: any) =>
    makeEditor({
      doc,
      plugins: blockTypePlugin(defaultSchema),
    });
  let trackEvent;
  beforeEach(() => {
    trackEvent = jest.fn();
    analyticsService.trackEvent = trackEvent;
  });

  describe('keymap', () => {
    if (browser.mac) {
      describe('when on a Mac', () => {
        describe('when hits Cmd-Alt-9', () => {
          it('inserts blockquote', () => {
            const { editorView } = editor(doc(p('text')));
            sendKeyToPm(editorView, 'Cmd-Alt-9');

            expect(editorView.state.doc).toEqualDocument(
              doc(blockquote(p('text'))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.blockquote.keyboard',
            );
            editorView.destroy();
          });
        });

        describe('when blockquote nodetype is not in schema', () => {
          it('corresponding keymaps should not work', () => {
            const schema = createSchema({
              nodes: ['doc', 'paragraph', 'text'],
            });
            const editor = (doc: any) =>
              makeEditor({
                doc,
                plugins: blockTypePlugins(schema),
                schema,
              });
            const { editorView } = editor(doc(p('text')));
            sendKeyToPm(editorView, 'Cmd-Alt-7');
            expect(editorView.state.doc).toEqualDocument(doc(p('text')));
            editorView.destroy();
          });
        });

        describe('when hits Shift-Enter', () => {
          it('inserts hard-break', () => {
            const { editorView } = editor(doc(h1('t{<}ex{>}t')));
            sendKeyToPm(editorView, 'Shift-Enter');
            expect(editorView.state.doc).toEqualDocument(
              doc(h1('t', hardBreak(), 't')),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.newline.keyboard',
            );
            editorView.destroy();
          });
        });
      });
    }

    describe('when hits cmd-z', () => {
      it('should undo last autoformatting', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '# ', sel);
        expect(editorView.state.doc).toEqualDocument(doc(h1()));
        sendKeyToPm(editorView, 'Mod-z');
        expect(editorView.state.doc).toEqualDocument(doc(p('# ')));
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.undo.keyboard',
        );
        editorView.destroy();
      });
    });

    describe('when hits up', () => {
      describe('when on a text block', () => {
        describe('when selection is not empty', () => {
          it('does not create a new paragraph above', () => {
            const { editorView } = editor(doc(code_block()('{<}te{>}xt')));

            sendKeyToPm(editorView, 'ArrowUp');

            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('text')),
            );
            editorView.destroy();
          });
        });

        describe('when selection is empty', () => {
          describe('on a non nested structure', () => {
            describe('inside a paragraph', () => {
              it('doesn not create a new paragraph above', () => {
                const { editorView } = editor(doc(p('{<>}text')));

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).toEqualDocument(doc(p('text')));
                editorView.destroy();
              });
            });

            describe('when cursor is in the middle of the first block node', () => {
              it('does not create a new paragraph above', () => {
                const { editorView } = editor(doc(code_block()('te{<>}xt')));

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).toEqualDocument(
                  doc(code_block()('text')),
                );
                editorView.destroy();
              });
            });

            describe('when cursor is at the beginning of the second block node', () => {
              it('does not create a new paragraph above', () => {
                const { editorView } = editor(
                  doc(p('text'), code_block()('{<>}text')),
                );

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).toEqualDocument(
                  doc(p('text'), code_block()('text')),
                );
                editorView.destroy();
              });
            });

            describe('when cursor is at the beginning of the whole content', () => {
              describe('on non list items', () => {
                it('creates a new paragraph above', () => {
                  const { editorView } = editor(doc(code_block()('{<>}text')));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(''), code_block()('text')),
                  );
                  editorView.destroy();
                });

                it('does not ignore @mention', () => {
                  const { editorView } = editor(
                    doc(p(mention({ id: 'foo1', text: '@bar1' }))),
                  );

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(mention({ id: 'foo1', text: '@bar1' }))),
                  );
                  editorView.destroy();
                });
              });

              describe('list item', () => {
                it('creates a new paragraph below the ul', () => {
                  const { editorView } = editor(doc(ul(li(p('{<>}text')))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(''), ul(li(p('text')))),
                  );
                  editorView.destroy();
                });
              });

              describe('when cursor is in the first cell of the table', () => {
                it('creates a new paragraph above the table', () => {
                  const { editorView } = editor(
                    doc(table(tr(tdCursor, tdEmpty, tdEmpty))),
                  );

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(''), table(tr(tdEmpty, tdEmpty, tdEmpty))),
                  );
                  editorView.destroy();
                });
              });
            });
          });

          describe('on a nested structure', () => {
            describe('when cursor is at the beginning of the nested structure', () => {
              describe('when there is still content before the nested block', () => {
                it('does not create a new paragraph above', () => {
                  const { editorView } = editor(
                    doc(p('text'), blockquote(p('{<>}text'))),
                  );

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p('text'), blockquote(p('text'))),
                  );
                  editorView.destroy();
                });
              });

              describe('when there is no more content before the nested block', () => {
                it('creates a new paragraph above', () => {
                  const { editorView } = editor(doc(blockquote(p('{<>}text'))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(''), blockquote(p('text'))),
                  );
                  editorView.destroy();
                });
              });
            });
          });
        });
      });

      describe('when on a node selection', () => {
        describe('on a non nested structure', () => {
          describe('when selection is in the middle of the content', () => {
            it('does not create a paragraph', () => {
              const { editorView, sel } = editor(
                doc(p('text'), hr, code_block()('{<>}text')),
              );
              setNodeSelection(editorView, sel - 1);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).toEqualDocument(
                doc(p('text'), hr, code_block()('text')),
              );
              editorView.destroy();
            });
          });

          describe('when selection is at the beginning of the content', () => {
            it('creates a new paragraph above', () => {
              const { editorView } = editor(doc(hr, code_block()('text')));
              setNodeSelection(editorView, 0);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).toEqualDocument(
                doc(p(''), hr, code_block()('text')),
              );
              expect(trackEvent).toHaveBeenCalledWith(
                'atlassian.editor.moveup.keyboard',
              );
              editorView.destroy();
            });
          });
        });

        describe('on a nested structure', () => {
          describe('when there is more content before the nested block', () => {
            it('does not create a paragraph', () => {
              const { editorView, sel } = editor(
                doc(p('text'), blockquote(hr, code_block()('{<>}text'))),
              );
              setNodeSelection(editorView, sel - 1);

              sendKeyToPm(editorView, 'ArrowUpv');

              expect(editorView.state.doc).toEqualDocument(
                doc(p('text'), blockquote(hr, code_block()('text'))),
              );
              editorView.destroy();
            });
          });

          describe('when there is no more content before the nested block', () => {
            it('creates a new paragraph above', () => {
              const { editorView } = editor(
                doc(blockquote(hr, code_block()('{<>}text'))),
              );
              setNodeSelection(editorView, 1);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).toEqualDocument(
                doc(p(''), blockquote(hr, code_block()('text'))),
              );
              editorView.destroy();
            });
          });
        });
      });
    });

    describe('when hits down', () => {
      describe('when on a text block', () => {
        describe('when selection is not empty', () => {
          it('does not create a new paragraph below', () => {
            const { editorView } = editor(doc(code_block()('te{<}xt{>}')));

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('text')),
            );
            editorView.destroy();
          });
        });

        describe('when selection is empty', () => {
          describe('on a non nested structure', () => {
            describe('when cursor is in the middle of the first block node', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(doc(code_block()('te{<>}xt')));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(code_block()('text')),
                );
                editorView.destroy();
              });
            });

            describe('when cursor is at the end of the second last block node', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(
                  doc(code_block()('text{<>}'), p('text')),
                );

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(code_block()('text'), p('text')),
                );
                editorView.destroy();
              });
            });

            describe('when cursor is at the end of the whole content', () => {
              describe('non list item', () => {
                it('creates a new paragraph below', () => {
                  const { editorView } = editor(doc(code_block()('text{<>}')));

                  sendKeyToPm(editorView, 'ArrowDown');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(code_block()('text'), p('')),
                  );
                  editorView.destroy();
                });
              });
              describe('list item', () => {
                it('creates a new paragraph below the ul', () => {
                  const { editorView } = editor(doc(ul(li(p('text{<>}')))));

                  sendKeyToPm(editorView, 'ArrowDown');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(ul(li(p('text'))), p('')),
                  );
                  editorView.destroy();
                });
              });
            });

            describe('when cursor is in the last cell of the table', () => {
              it('creates a new paragraph below the table', () => {
                const { editorView } = editor(
                  doc(table(tr(tdEmpty, tdEmpty, tdCursor))),
                );

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(table(tr(tdEmpty, tdEmpty, tdEmpty)), p('')),
                );
                editorView.destroy();
              });
            });
          });
        });

        describe('on a nested structure', () => {
          describe('when cursor is at the end of the nested structure', () => {
            describe('when there is still content after the nested block', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(
                  doc(blockquote(p('text{<>}')), p('text')),
                );

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(blockquote(p('text')), p('text')),
                );
                editorView.destroy();
              });
            });

            describe('when there is no more content before the nested block', () => {
              it('creates a new paragraph below', () => {
                const { editorView } = editor(doc(blockquote(p('text{<>}'))));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(blockquote(p('text')), p('')),
                );
                editorView.destroy();
              });
            });
          });
        });
      });
    });

    describe('when on a node selection', () => {
      describe('on a non nested structure', () => {
        describe('when selection is in the middle of the content', () => {
          it('does not create a paragraph', () => {
            const { editorView, sel } = editor(
              doc(p('text{<>}'), hr, code_block()('text')),
            );
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(p('text'), hr, code_block()('text')),
            );
            editorView.destroy();
          });
        });

        describe('when selection is at the end of the content', () => {
          it('creates a new paragraph below', () => {
            const { editorView, sel } = editor(
              doc(code_block()('text{<>}'), hr),
            );
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('text'), hr, p('')),
            );
            editorView.destroy();
          });
        });
      });

      describe('on a nested structure', () => {
        describe('when there is more content after the nested block', () => {
          it('does not create a paragraph', () => {
            const { editorView, sel } = editor(
              doc(blockquote(hr, code_block()('{<>}text')), p('text')),
            );
            setNodeSelection(editorView, sel - 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(blockquote(hr, code_block()('text')), p('text')),
            );
            editorView.destroy();
          });
        });

        describe('when there is no more content after the nested block', () => {
          it('creates a new paragraph below', () => {
            const { editorView, sel } = editor(
              doc(blockquote(code_block()('text{<>}'), hr)),
            );
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(blockquote(code_block()('text'), hr), p('')),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.movedown.keyboard',
            );
            editorView.destroy();
          });
        });
      });
    });
  });
});
