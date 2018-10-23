import {
  compareSelection,
  createEditor,
  doc,
  p,
  decisionList,
  decisionItem,
  sendKeyToPm,
  taskList,
  taskItem,
  mention,
  table,
  td,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers';
import { uuid } from '@atlaskit/editor-common';
import tasksAndDecisionsPlugin from '../../../../plugins/tasks-and-decisions';
import mentionsPlugin from '../../../../plugins/mentions';
import tablesPlugin from '../../../../plugins/table';

describe('tasks and decisions - keymaps', () => {
  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editorFactory = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [
        tablesPlugin(),
        tasksAndDecisionsPlugin,
        mentionsPlugin(),
      ],
    });

  const scenarios = [
    {
      name: 'action',
      list: taskList,
      item: taskItem,
      listProps: { localId: 'local-uuid' },
      itemProps: { localId: 'local-uuid', state: 'TODO' },
    },
    {
      name: 'decision',
      list: decisionList,
      item: decisionItem,
      listProps: { localId: 'local-uuid' },
      itemProps: { localId: 'local-uuid' },
    },
  ];
  scenarios.forEach(({ name, list, item, listProps, itemProps }) => {
    describe(name, () => {
      describe('Backspace', () => {
        describe(`when ${name}List exists before paragraph`, () => {
          it(`should merge paragraph with ${name}Item and preserve content`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('Hello')), p('{<>}World')),
            );

            sendKeyToPm(editorView, 'Backspace');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>}World')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should remove paragraph with ${name}Item and preserve content`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('Hello')), p('{<>}')),
            );

            sendKeyToPm(editorView, 'Backspace');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>}')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it('should delete only internal node on backspace', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)(
                    'Hello ',
                    mention({ id: '1234', text: '@Oscar Wallhult' })(),
                    '{<>}',
                  ),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Backspace');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello {<>}')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the beginning of a ${name}Item`, () => {
          it('should convert item to paragraph, splitting the list', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('Hello'),
                  item(itemProps)('{<>}World'),
                  item(itemProps)('Cheese is great!'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Backspace');
            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello')),
              p('{<>}World'),
              list(listProps)(item(itemProps)('Cheese is great!')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it('should merge with previous item, when backspacing twice', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('Hello'),
                  item(itemProps)('{<>}World'),
                  item(itemProps)('Cheese is great!'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Backspace');
            sendKeyToPm(editorView, 'Backspace');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>}World')),
              // TODO - list merging FS-2947
              list(listProps)(item(itemProps)('Cheese is great!')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the beginning of the first ${name}Item`, () => {
          it('should convert item to paragraph', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('{<>}Hello'),
                  item(itemProps)('World'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Backspace');

            const expectedDoc = doc(
              p('{<>}Hello'),
              list(listProps)(item(itemProps)('World')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it('should convert item to paragraph and remove the list if it is empty', () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('{<>}Hello World'))),
            );

            sendKeyToPm(editorView, 'Backspace');

            const expectedDoc = doc(p('{<>}Hello World'));
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should delete selection and keep ${name}Item`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('{<}Hello {>}World'))),
            );

            sendKeyToPm(editorView, 'Backspace');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('{<>}World')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe('when nested inside tables', () => {
          describe('when cursor is at the beginning of the first taskItem', () => {
            it('should convert item to paragraph and keep the cursor in the same cell', () => {
              const { editorView } = editorFactory(
                doc(
                  table()(
                    tr(
                      tdEmpty,
                      td()(list(listProps)(item(itemProps)('{<>}'))),
                      tdEmpty,
                    ),
                  ),
                ),
              );

              sendKeyToPm(editorView, 'Backspace');

              const expectedDoc = doc(table()(tr(tdEmpty, tdCursor, tdEmpty)));
              expect(editorView.state.doc).toEqualDocument(expectedDoc);
              compareSelection(editorFactory, expectedDoc, editorView);
            });
          });
        });
      });

      describe('Delete', () => {
        describe(`when ${name}List exists before paragraph`, () => {
          it(`should merge paragraph with ${name}Item and preserve content`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('Hello{<>}')), p('World')),
            );

            sendKeyToPm(editorView, 'Delete');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>}World')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should remove paragraph with ${name}Item and preserve content`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('Hello{<>}')), p()),
            );

            sendKeyToPm(editorView, 'Delete');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>}')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it('should delete only internal node on delete', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)(
                    'Hello {<>}',
                    mention({ id: '1234', text: '@Oscar Wallhult' })(),
                  ),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Delete');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello {<>}')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the end of a ${name}Item`, () => {
          it('should convert item to paragraph, splitting the list', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('Hello{<>}'),
                  item(itemProps)('World'),
                  item(itemProps)('Cheese is great!'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Delete');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>}')),
              p('World'),
              list(listProps)(item(itemProps)('Cheese is great!')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it('should merge with previous item, when deleting twice', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('Hello{<>}'),
                  item(itemProps)('World'),
                  item(itemProps)('Cheese is great!'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Delete');
            sendKeyToPm(editorView, 'Delete');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>}World')),
              // TODO - list merging FS-2947
              list(listProps)(item(itemProps)('Cheese is great!')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        it(`should delete selection and keep ${name}Item`, () => {
          const { editorView } = editorFactory(
            doc(list(listProps)(item(itemProps)('{<}Hello {>}World'))),
          );

          sendKeyToPm(editorView, 'Delete');

          const expectedDoc = doc(
            list(listProps)(item(itemProps)('{<>}World')),
          );
          expect(editorView.state.doc).toEqualDocument(expectedDoc);
          compareSelection(editorFactory, expectedDoc, editorView);
        });

        describe('when nested inside tables', () => {
          describe('when cursor is at the end of the first taskItem', () => {
            it('should convert second item to paragraph', () => {
              const { editorView } = editorFactory(
                doc(
                  table()(
                    tr(
                      tdEmpty,
                      td()(
                        list(listProps)(
                          item(itemProps)('{<>}'),
                          item(itemProps)('Hello'),
                        ),
                      ),
                      tdEmpty,
                    ),
                  ),
                ),
              );

              sendKeyToPm(editorView, 'Delete');

              const expectedDoc = doc(
                table()(
                  tr(
                    tdEmpty,
                    td()(list(listProps)(item(itemProps)('{<>}')), p('Hello')),
                    tdEmpty,
                  ),
                ),
              );
              expect(editorView.state.doc).toEqualDocument(expectedDoc);
              compareSelection(editorFactory, expectedDoc, editorView);
            });
          });
        });
      });

      describe('Enter', () => {
        describe(`when ${name}List is empty`, () => {
          it('should remove decisionList and replace with paragraph', () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('{<>}'))),
            );

            sendKeyToPm(editorView, 'Enter');
            const expectedDoc = doc(p('{<>}'));
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the end of empty ${name}Item`, () => {
          it(`should remove ${name}Item and insert a paragraph after`, () => {
            const { editorView } = editorFactory(
              doc(
                p('before'),
                list(listProps)(
                  item(itemProps)('Hello World'),
                  item(itemProps)('{<>}'),
                ),
                p('after'),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              p('before'),
              list(listProps)(item(itemProps)('Hello World')),
              p('{<>}'),
              p('after'),
            );

            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should remove ${name}Item and insert a paragraph before`, () => {
            const { editorView } = editorFactory(
              doc(
                p('before'),
                list(listProps)(
                  item(itemProps)('{<>}'),
                  item(itemProps)('Hello World'),
                ),
                p('after'),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              p('before'),
              p('{<>}'),
              list(listProps)(item(itemProps)('Hello World')),
              p('after'),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should split ${name}List and insert a paragraph when in middle`, () => {
            const { editorView } = editorFactory(
              doc(
                p('before'),
                list(listProps)(
                  item(itemProps)('Hello World'),
                  item(itemProps)('{<>}'),
                  item(itemProps)('Goodbye World'),
                ),
                p('after'),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              p('before'),
              list(listProps)(item(itemProps)('Hello World')),
              p('{<>}'),
              list(listProps)(item(itemProps)('Goodbye World')),
              p('after'),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the end of non-empty ${name}Item`, () => {
          it(`should insert another ${name}Item`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('Hello World{<>}'))),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              list(listProps)(
                item(itemProps)('Hello World'),
                item(itemProps)('{<>}'),
              ),
            );

            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should insert another ${name}Item when in middle of list`, () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('Hello World{<>}'),
                  item(itemProps)('Goodbye World'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              list(listProps)(
                item(itemProps)('Hello World'),
                item(itemProps)('{<>}'),
                item(itemProps)('Goodbye World'),
              ),
            );

            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });
      });

      describe('Down Arrow', () => {
        it(`should navigate out of ${name}`, () => {
          const { editorView } = editorFactory(
            doc(list(listProps)(item(itemProps)('Hello world{<>}'))),
          );

          sendKeyToPm(editorView, 'ArrowDown');

          const expectedDoc = doc(
            list(listProps)(item(itemProps)('Hello world')),
            p('{<>}'),
          );

          expect(editorView.state.doc).toEqualDocument(expectedDoc);
          compareSelection(editorFactory, expectedDoc, editorView);
        });
      });

      describe(`TAB ${name}Item`, () => {
        it('TAB should not affect document', () => {
          const testDoc = doc(
            list(listProps)(item(itemProps)('Hello{<>} World')),
          );

          const { editorView } = editorFactory(testDoc);

          sendKeyToPm(editorView, 'Tab');
          expect(editorView.state.doc).toEqualDocument(testDoc);
          compareSelection(editorFactory, testDoc, editorView);
        });

        it('Shift-TAB should not affect document', () => {
          const testDoc = doc(
            list(listProps)(item(itemProps)('Hello{<>} World')),
          );

          const { editorView } = editorFactory(testDoc);

          sendKeyToPm(editorView, 'Shift-Tab');
          expect(editorView.state.doc).toEqualDocument(testDoc);
          compareSelection(editorFactory, testDoc, editorView);
        });
      });
    });
  });
});
