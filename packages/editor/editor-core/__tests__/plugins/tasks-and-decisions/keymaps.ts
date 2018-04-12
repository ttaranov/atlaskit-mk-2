import {
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
import tasksAndDecisionsPlugin from '../../../src/plugins/tasks-and-decisions';
import mentionsPlugin from '../../../src/plugins/mentions';

describe('tasks and decisions - keymaps', () => {
  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [tasksAndDecisionsPlugin, mentionsPlugin],
    });

  describe('decisions', () => {
    describe('Backspace', () => {
      describe('when decisionList exists before paragraph', () => {
        it('should merge paragraph with decisionItem and preserve content', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello'),
              ),
              p('{<>}World'),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('HelloWorld'),
              ),
            ),
          );
        });
        it('should remove paragraph with decisionItem and preserve content', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello'),
              ),
              p('{<>}'),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello'),
              ),
            ),
          );
        });

        it('should delete only internal node on backspace', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })(
                  'Hello ',
                  mention({ id: '1234', text: '@Oscar Wallhult' })(),
                  '{<>}',
                ),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello '),
              ),
            ),
          );
        });
      });

      describe('when cursor is at the begining of a decisionItem', () => {
        it('should merge content of current item with previous item', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello'),
                decisionItem({ localId: 'local-decision' })('{<>}World'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('HelloWorld'),
              ),
            ),
          );
        });
      });

      describe('when cursor is at the begining of the first decisionItem', () => {
        it('should convert item to paragraph', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('{<>}Hello'),
                decisionItem({ localId: 'local-decision' })('World'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('Hello'),
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('World'),
              ),
            ),
          );
        });

        it('should convert item to paragraph and remove the list if it is empty', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('{<>}Hello World'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(p('Hello World')));
        });

        it('should delete selection and keep decisionItem', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })(
                  '{<}Hello {>}World',
                ),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('World'),
              ),
            ),
          );
        });
      });
    });

    describe('Enter', () => {
      describe('when decisionList is empty', () => {
        it('should remove decisionList and replace with paragraph', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('{<>}'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(p()));
        });
      });

      describe('when cursor is at the end of empty decisionItem', () => {
        it('should remove decisionItem and insert a paragraph', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello World'),
                decisionItem({ localId: 'local-decision' })('{<>}'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello World'),
              ),
              p(),
            ),
          );
        });
      });

      describe('when cursor is at the end of non-empty decisionItem', () => {
        it('should insert another decisionItem', () => {
          const { editorView } = editor(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello World{<>}'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })('Hello World'),
                decisionItem({ localId: 'local-decision' })(),
              ),
            ),
          );
        });
      });
    });
  });

  describe('tasks', () => {
    describe('Backspace', () => {
      describe('when taskList exists before paragraph', () => {
        it('should merge paragraph with taskItem and preserve content', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello'),
              ),
              p('{<>}World'),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('HelloWorld'),
              ),
            ),
          );
        });

        it('should remove paragraph with taskItem and preserve content', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello'),
              ),
              p('{<>}'),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello'),
              ),
            ),
          );
        });

        it('should delete only internal node on backspace', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })(
                  'Hello ',
                  mention({ id: '1234', text: '@Oscar Wallhult' })(),
                  '{<>}',
                ),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello '),
              ),
            ),
          );
        });
      });

      describe('when cursor is at the begining of a taskItem', () => {
        it('should merge content of current item with previous item', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello'),
                taskItem({ localId: 'local-decision' })('{<>}World'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('HelloWorld'),
              ),
            ),
          );
        });
      });

      describe('when cursor is at the begining of the first taskItem', () => {
        it('should convert item to paragraph', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('{<>}Hello'),
                taskItem({ localId: 'local-decision' })('World'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('Hello'),
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('World'),
              ),
            ),
          );
        });

        it('should convert item to paragraph and remove the list if it is empty', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('{<>}Hello World'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(p('Hello World')));
        });

        it('should delete selection and keep taskItem', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('{<}Hello {>}World'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('World'),
              ),
            ),
          );
        });
      });
    });

    describe('Enter', () => {
      describe('when taskList is empty', () => {
        it('should remove taskList and replace with paragraph', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('{<>}'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(p()));
        });
      });

      describe('when cursor is at the end of empty taskItem', () => {
        it('should remove decisionItem and insert a paragraph', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello World'),
                taskItem({ localId: 'local-decision' })('{<>}'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello World'),
              ),
              p(),
            ),
          );
        });
      });

      describe('when cursor is at the end of non-empty taskItem', () => {
        it('should insert another taskItem', () => {
          const { editorView } = editor(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello World{<>}'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })('Hello World'),
                taskItem({ localId: 'local-decision' })(),
              ),
            ),
          );
        });
      });
    });
  });
});
