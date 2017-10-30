import * as chai from 'chai';
import * as sinon from 'sinon';
import { expect } from 'chai';
import blockTypePlugin from '../../../../src/plugins/block-type';
import { browser, createSchema } from '@atlaskit/editor-common';
import {
  insertText,
  sendKeyToPm,
  blockquote,
  chaiPlugin,
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
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import blockTypePlugins from '../../../../src/plugins/block-type';
import { analyticsService } from '../../../../src/analytics';
import { setNodeSelection } from '../../../../src/utils';

chai.use(chaiPlugin);

describe('codeBlock - keymaps', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: blockTypePlugin(defaultSchema),
  });
  let trackEvent;
  beforeEach(() => {
    trackEvent = sinon.spy();
    analyticsService.trackEvent = trackEvent;
  });


  describe('keymap', () => {
    if (browser.mac) {
      context('when on a Mac', () => {
        context('when hits Cmd-Alt-9', () => {
          it('inserts blockquote', () => {
            const { editorView } = editor(doc(p('text')));
            sendKeyToPm(editorView, 'Cmd-Alt-9');

            expect(editorView.state.doc).to.deep.equal(doc(blockquote(p('text'))));
            expect(trackEvent.calledWith('atlassian.editor.format.blockquote.keyboard')).to.equal(true);
            editorView.destroy();
          });
        });

        context('when blockquote nodetype is not in schema', () => {
          it('corresponding keymaps should not work', () => {
            const schema = createSchema({
              nodes: [
                'doc',
                'paragraph',
                'text',
              ]
            });
            const editor = (doc: any) => makeEditor({
              doc,
              plugins: blockTypePlugins(schema),
              schema,
            });
            const { editorView } = editor(doc(p('text')));
            sendKeyToPm(editorView, 'Cmd-Alt-7');
            expect(editorView.state.doc).to.deep.equal(doc(p('text')));
            editorView.destroy();
          });
        });

        context('when hits Shift-Enter', () => {
          it('inserts hard-break', () => {
            const { editorView } = editor(doc(h1('t{<}ex{>}t')));
            sendKeyToPm(editorView, 'Shift-Enter');
            expect(editorView.state.doc).to.deep.equal(doc(h1('t', hardBreak(), 't')));
            expect(trackEvent.calledWith('atlassian.editor.newline.keyboard')).to.equal(true);
            editorView.destroy();
          });
        });
      });
    }

    context('when hits cmd-z', () => {
      it('should undo last autoformatting', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '# ', sel);
        expect(editorView.state.doc).to.deep.equal(doc(h1()));
        sendKeyToPm(editorView, 'Mod-z');
        expect(editorView.state.doc).to.deep.equal(doc(p('# ')));
        expect(trackEvent.calledWith('atlassian.editor.undo.keyboard')).to.equal(true);
        editorView.destroy();
      });
    });

    context('when hits enter', () => {
      context('when it matches fence format', () => {
        context('when it is already inside a code block', () => {
          it('does not create another code block', () => {
            const { editorView } = editor(doc(code_block()('```{<>}')));

            sendKeyToPm(editorView, 'Enter');

            expect(editorView.state.doc).to.deep.equal(doc(code_block()('```\n')));
            editorView.destroy();
          });
        });

        context('when it is not inside a code block', () => {
          context('when language is provided', () => {
            it('returns code block with language', () => {
              const { editorView } = editor(doc(p('```javascript{<>}')));

              sendKeyToPm(editorView, 'Enter');

              expect(editorView.state.doc).to.deep.equal(doc(code_block({ language: 'javascript' })('')));
              editorView.destroy();
            });

            it('trims the spaces', () => {
              const { editorView } = editor(doc(p('```javascript    {<>}   hello ', mention({ id: 'foo1', text: '@bar1' }))));

              sendKeyToPm(editorView, 'Enter');

              expect(editorView.state.doc).to.deep.equal(doc(code_block({ language: 'javascript' })('   hello @bar1')));
              editorView.destroy();
            });
          });

          context('when langauge is not provided', () => {
            it('returns code block without language', () => {
              const { editorView } = editor(doc(p('```{<>}')));

              sendKeyToPm(editorView, 'Enter');

              expect(editorView.state.doc).to.deep.equal(doc(code_block()('')));
              editorView.destroy();
            });

            it('trims the spaces', () => {
              const { editorView } = editor(doc(p('```    {<>}   hello')));

              sendKeyToPm(editorView, 'Enter');

              expect(editorView.state.doc).to.deep.equal(doc(code_block()('   hello')));
              editorView.destroy();
            });

            it('should convert to code block even if there are more than 3 backticks', () => {
              const { editorView } = editor(doc(p('`````{<>}')));
              sendKeyToPm(editorView, 'Enter');
              expect(editorView.state.doc).to.deep.equal(doc(code_block()()));
            });

            it('should convert to code block even if its in middle of paragraph', () => {
              const { editorView } = editor(doc(p('code ```{<>}')));
              sendKeyToPm(editorView, 'Enter');
              expect(editorView.state.doc).to.deep.equal(doc(code_block()('code ')));
            });

            it('should convert to code block even if there are more than 3 backticks in middle of paragraph', () => {
              const { editorView } = editor(doc(p('code `````{<>}')));
              sendKeyToPm(editorView, 'Enter');
              expect(editorView.state.doc).to.deep.equal(doc(code_block()('code ')));
            });

            it('should convert to code block even if its in middle of paragraph with trailing spaces', () => {
              const { editorView } = editor(doc(p('code ```     {<>}')));
              sendKeyToPm(editorView, 'Enter');
              expect(editorView.state.doc).to.deep.equal(doc(code_block()('code ')));
            });

            it('should convert to code block even and set language correctly even if its in middle of paragraph', () => {
              const { editorView } = editor(doc(p('code ```java     {<>}')));
              sendKeyToPm(editorView, 'Enter');
              expect(editorView.state.doc).to.deep.equal(doc(code_block({ language: 'java' })('code ')));
            });

            it('does not convert to code block if it is in middle of line and there is no space before it', () => {
              const { editorView } = editor(doc(p('hello```    {<>}   hello')));

              sendKeyToPm(editorView, 'Enter');

              expect(editorView.state.doc).to.deep.equal(doc(p('hello```    '), p('   hello')));
              editorView.destroy();
            });
          });
        });
      });
    });

    context('when hits up', () => {
      context('when on a text block', () => {
        context('when selection is not empty', () => {
          it('does not create a new paragraph above', () => {
            const { editorView } = editor(doc(code_block()('{<}te{>}xt')));

            sendKeyToPm(editorView, 'ArrowUp');

            expect(editorView.state.doc).to.deep.equal(doc(code_block()('text')));
            editorView.destroy();
          });
        });

        context('when selection is empty', () => {
          context('on a non nested structure', () => {
            context('inside a paragraph', () => {
              it('doesn not create a new paragraph above', () => {
                const { editorView } = editor(doc(p('{<>}text')));

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).to.deep.equal(doc(p('text')));
                editorView.destroy();
              });
            });

            context('when cursor is in the middle of the first block node', () => {
              it('does not create a new paragraph above', () => {
                const { editorView } = editor(doc(code_block()('te{<>}xt')));

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).to.deep.equal(doc(code_block()('text')));
                editorView.destroy();
              });
            });

            context('when cursor is at the beginning of the second block node', () => {
              it('does not create a new paragraph above', () => {
                const { editorView } = editor(doc(p('text'), code_block()('{<>}text')));

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).to.deep.equal(doc(p('text'), code_block()('text')));
                editorView.destroy();
              });
            });

            context('when cursor is at the beginning of the whole content', () => {
              context('on non list items', () => {
                it('creates a new paragraph above', () => {
                  const { editorView } = editor(doc(code_block()('{<>}text')));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).to.deep.equal(doc(p(''), code_block()('text')));
                  editorView.destroy();
                });

                it('does not ignore @mention', () => {

                  const { editorView } = editor(doc(p(mention({ id: 'foo1', text: '@bar1' }))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).to.deep.equal(doc(p(mention({ id: 'foo1', text: '@bar1' }))));
                  editorView.destroy();
                });
              });

              context('list item', () => {
                it('creates a new paragraph below the ul', () => {
                  const { editorView } = editor(doc(ul(li(p('{<>}text')))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).to.deep.equal(doc(p(''), ul(li(p('text')))));
                  editorView.destroy();
                });
              });

              context('when cursor is in the first cell of the table', () => {
                it('creates a new paragraph above the table', () => {
                  const { editorView } = editor(doc(table(tr(tdCursor, tdEmpty, tdEmpty))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).to.deep.equal(doc(p(''), table(tr(tdEmpty, tdEmpty, tdEmpty))));
                  editorView.destroy();
                });
              });
            });
          });

          context('on a nested structure', () => {
            context('when cursor is at the beginning of the nested structure', () => {
              context('when there is still content before the nested block', () => {
                it('does not create a new paragraph above', () => {
                  const { editorView } = editor(doc(p('text'), blockquote(p('{<>}text'))));

                  sendKeyToPm(editorView, 'ArrowUp');


                  expect(editorView.state.doc).to.deep.equal(doc(p('text'), blockquote(p('text'))));
                  editorView.destroy();
                });
              });

              context('when there is no more content before the nested block', () => {
                it('creates a new paragraph above', () => {
                  const { editorView } = editor(doc(blockquote(p('{<>}text'))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).to.deep.equal(doc(p(''), blockquote(p('text'))));
                  editorView.destroy();
                });
              });
            });
          });
        });
      });

      context('when on a node selection', () => {
        context('on a non nested structure', () => {
          context('when selection is in the middle of the content', () => {
            it('does not create a paragraph', () => {
              const { editorView, sel } = editor(doc(p('text'), hr, code_block()('{<>}text')));
              setNodeSelection(editorView, sel - 1);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).to.deep.equal(doc(p('text'), hr, code_block()('text')));
              editorView.destroy();
            });
          });

          context('when selection is at the beginning of the content', () => {
            it('creates a new paragraph above', () => {
              const { editorView } = editor(doc(hr, code_block()('text')));
              setNodeSelection(editorView, 0);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).to.deep.equal(doc(p(''), hr, code_block()('text')));
              expect(trackEvent.calledWith('atlassian.editor.moveup.keyboard')).to.equal(true);
              editorView.destroy();
            });
          });
        });

        context('on a nested structure', () => {
          context('when there is more content before the nested block', () => {
            it('does not create a paragraph', () => {
              const { editorView, sel } = editor(doc(p('text'), blockquote(hr, code_block()('{<>}text'))));
              setNodeSelection(editorView, sel - 1);

              sendKeyToPm(editorView, 'ArrowUpv');

              expect(editorView.state.doc).to.deep.equal(doc(p('text'), blockquote(hr, code_block()('text'))));
              editorView.destroy();
            });
          });

          context('when there is no more content before the nested block', () => {
            it('creates a new paragraph above', () => {
              const { editorView } = editor(doc(blockquote(hr, code_block()('{<>}text'))));
              setNodeSelection(editorView, 1);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).to.deep.equal(doc(p(''), blockquote(hr, code_block()('text'))));
              editorView.destroy();
            });
          });
        });
      });
    });

    context('when hits down', () => {
      context('when on a text block', () => {
        context('when selection is not empty', () => {
          it('does not create a new paragraph below', () => {
            const { editorView } = editor(doc(code_block()('te{<}xt{>}')));

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).to.deep.equal(doc(code_block()('text')));
            editorView.destroy();
          });
        });

        context('when selection is empty', () => {
          context('on a non nested structure', () => {
            context('when cursor is in the middle of the first block node', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(doc(code_block()('te{<>}xt')));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).to.deep.equal(doc(code_block()('text')));
                editorView.destroy();
              });
            });

            context('when cursor is at the end of the second last block node', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(doc(code_block()('text{<>}'), p('text')));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).to.deep.equal(doc(code_block()('text'), p('text')));
                editorView.destroy();
              });
            });

            context('when cursor is at the end of the whole content', () => {
              context('non list item', () => {
                it('creates a new paragraph below', () => {
                  const { editorView } = editor(doc(code_block()('text{<>}')));

                  sendKeyToPm(editorView, 'ArrowDown');

                  expect(editorView.state.doc).to.deep.equal(doc(code_block()('text'), p('')));
                  editorView.destroy();
                });
              });
              context('list item', () => {
                it('creates a new paragraph below the ul', () => {
                  const { editorView } = editor(doc(ul(li(p('text{<>}')))));

                  sendKeyToPm(editorView, 'ArrowDown');

                  expect(editorView.state.doc).to.deep.equal(doc(ul(li(p('text'))), p('')));
                  editorView.destroy();
                });
              });
            });

            context('when cursor is in the last cell of the table', () => {
              it('creates a new paragraph below the table', () => {
                const { editorView } = editor(doc(table(tr(tdEmpty, tdEmpty, tdCursor))));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).to.deep.equal(doc(table(tr(tdEmpty, tdEmpty, tdEmpty)), p('')));
                editorView.destroy();
              });
            });
          });
        });

        context('on a nested structure', () => {
          context('when cursor is at the end of the nested structure', () => {
            context('when there is still content after the nested block', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(doc(blockquote(p('text{<>}')), p('text')));

                sendKeyToPm(editorView, 'ArrowDown');


                expect(editorView.state.doc).to.deep.equal(doc(blockquote(p('text')), p('text')));
                editorView.destroy();
              });
            });

            context('when there is no more content before the nested block', () => {
              it('creates a new paragraph below', () => {
                const { editorView } = editor(doc(blockquote(p('text{<>}'))));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).to.deep.equal(doc(blockquote(p('text')), p('')));
                editorView.destroy();
              });
            });
          });
        });
      });
    });

    context('when on a node selection', () => {
      context('on a non nested structure', () => {
        context('when selection is in the middle of the content', () => {
          it('does not create a paragraph', () => {
            const { editorView, sel } = editor(doc(p('text{<>}'), hr, code_block()('text')));
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).to.deep.equal(doc(p('text'), hr, code_block()('text')));
            editorView.destroy();
          });
        });

        context('when selection is at the end of the content', () => {
          it('creates a new paragraph below', () => {
            const { editorView, sel } = editor(doc(code_block()('text{<>}'), hr));
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).to.deep.equal(doc(code_block()('text'), hr, p('')));
            editorView.destroy();
          });
        });
      });

      context('on a nested structure', () => {
        context('when there is more content after the nested block', () => {
          it('does not create a paragraph', () => {
            const { editorView, sel } = editor(doc(blockquote(hr, code_block()('{<>}text')), p('text')));
            setNodeSelection(editorView, sel - 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).to.deep.equal(doc(blockquote(hr, code_block()('text')), p('text')));
            editorView.destroy();
          });
        });

        context('when there is no more content after the nested block', () => {
          it('creates a new paragraph below', () => {
            const { editorView, sel } = editor(doc(blockquote(code_block()('text{<>}'), hr)));
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).to.deep.equal(doc(blockquote(code_block()('text'), hr), p('')));
            expect(trackEvent.calledWith('atlassian.editor.movedown.keyboard')).to.equal(true);
            editorView.destroy();
          });
        });
      });
    });
  });
});
