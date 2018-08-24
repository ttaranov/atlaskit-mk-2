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
      editorPlugins: [tablesPlugin(), tasksAndDecisionsPlugin, mentionsPlugin],
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
            expect(editorView.state.doc).toEqualDocument(
              doc(list(listProps)(item(itemProps)('HelloWorld'))),
            );
          });
          it(`should remove paragraph with ${name}Item and preserve content`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('Hello')), p('{<>}')),
            );

            sendKeyToPm(editorView, 'Backspace');
            expect(editorView.state.doc).toEqualDocument(
              doc(list(listProps)(item(itemProps)('Hello'))),
            );
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
            expect(editorView.state.doc).toEqualDocument(
              doc(list(listProps)(item(itemProps)('Hello '))),
            );
          });
        });

        describe(`when cursor is at the begining of a ${name}Item`, () => {
          it('should merge content of current item with previous item', () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('Hello'),
                  item(itemProps)('{<>}World'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Backspace');
            expect(editorView.state.doc).toEqualDocument(
              doc(list(listProps)(item(itemProps)('HelloWorld'))),
            );
          });
        });

        describe(`when cursor is at the begining of the first ${name}Item`, () => {
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
            expect(editorView.state.doc).toEqualDocument(
              doc(p('Hello'), list(listProps)(item(itemProps)('World'))),
            );
          });

          it('should convert item to paragraph and remove the list if it is empty', () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('{<>}Hello World'))),
            );

            sendKeyToPm(editorView, 'Backspace');
            expect(editorView.state.doc).toEqualDocument(doc(p('Hello World')));
          });

          it(`should delete selection and keep ${name}Item`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('{<}Hello {>}World'))),
            );

            sendKeyToPm(editorView, 'Backspace');
            expect(editorView.state.doc).toEqualDocument(
              doc(list(listProps)(item(itemProps)('World'))),
            );
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
    });
  });
});
