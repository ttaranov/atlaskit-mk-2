import {
  insertText,
  createEditor,
  doc,
  blockquote,
  p,
  decisionList,
  decisionItem,
  hardBreak,
  taskList,
  taskItem,
  thEmpty,
  table,
  tr,
  td,
  th,
  tdEmpty,
  tdCursor,
  thCursor,
} from '@atlaskit/editor-test-helpers';
import { uuid } from '@atlaskit/editor-common';
import tasksAndDecisionsPlugin from '../../../src/editor/plugins/tasks-and-decisions';
import tablesPlugin from '../../../src/editor/plugins/table';

describe('tasks and decisions - input rules', () => {
  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [tasksAndDecisionsPlugin, tablesPlugin],
    });

  describe('decisions', () => {
    it('should replace "<> " with a decisionList', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })(''),
          ),
        ),
      );
    });

    it('should replace "<> " with a decisionList inside table header', () => {
      const { editorView, sel } = editor(
        doc(table(tr(thCursor), tr(tdEmpty), tr(tdEmpty))),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(
              th({})(
                decisionList({ localId: 'local-decision' })(
                  decisionItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should replace "<> " with a decisionList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(table(tr(thEmpty), tr(tdCursor), tr(tdEmpty))),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(thEmpty),
            tr(
              td({})(
                decisionList({ localId: 'local-decision' })(
                  decisionItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should not replace "<> " after shift+enter with a decisionList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(
          table(
            tr(thEmpty),
            tr(td({})(p('Hello', hardBreak(), '{<>}'))),
            tr(tdEmpty),
          ),
        ),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(thEmpty),
            tr(td({})(p('Hello', hardBreak(), '<> '))),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should preserve existing content on row when converting', () => {
      const { editorView, sel } = editor(doc(p('{<>}Hello World')));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })('Hello World'),
          ),
        ),
      );
    });

    it('should split on hardBreak and preserve content when converting', () => {
      const { editorView, sel } = editor(
        doc(p('Hello', hardBreak(), '{<>}World')),
      );
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('Hello'),
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })('World'),
          ),
        ),
      );
    });

    it('should not create decisionList inside nested blocks', () => {
      const { editorView, sel } = editor(doc(blockquote(p('Hello World{<>}'))));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello World<> '))),
      );
    });
  });

  describe('tasks', () => {
    it('should replace "[] " with a taskList', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })(''),
          ),
        ),
      );
    });

    it('should preserve existing content on row when converting', () => {
      const { editorView, sel } = editor(doc(p('{<>}Hello World')));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })('Hello World'),
          ),
        ),
      );
    });

    it('should split on hardBreak and preserve content when converting', () => {
      const { editorView, sel } = editor(
        doc(p('Hello', hardBreak(), '{<>}World')),
      );
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('Hello'),
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })('World'),
          ),
        ),
      );
    });
    it('should replace "[] " with a taskList inside table header', () => {
      const { editorView, sel } = editor(
        doc(table(tr(thCursor), tr(tdEmpty), tr(tdEmpty))),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(
              th({})(
                taskList({ localId: 'local-decision' })(
                  taskItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should replace "[] " with a taskList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(table(tr(thEmpty), tr(tdCursor), tr(tdEmpty))),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(thEmpty),
            tr(
              td({})(
                taskList({ localId: 'local-decision' })(
                  taskItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should not replace "[] " after shift+enter with a taskList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(
          table(
            tr(thEmpty),
            tr(td({})(p('Hello', hardBreak(), '{<>}'))),
            tr(tdEmpty),
          ),
        ),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(thEmpty),
            tr(td({})(p('Hello', hardBreak(), '[] '))),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should not create taskList inside nested blocks', () => {
      const { editorView, sel } = editor(doc(blockquote(p('Hello World{<>}'))));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello World[] '))),
      );
    });
  });
});
