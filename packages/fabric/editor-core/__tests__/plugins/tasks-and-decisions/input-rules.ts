import {
  insertText,
  makeEditor,
  doc,
  blockquote,
  p,
  decisionList,
  decisionItem,
  hardBreak,
  text,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers';
import tasksAndDecisionsPlugins from '../../../src/plugins/tasks-and-decisions';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { ProviderFactory, uuid } from '@atlaskit/editor-common';

describe('tasks and decisions - input rules', () => {
  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) =>
    makeEditor({
      doc,
      plugins: tasksAndDecisionsPlugins(
        defaultSchema,
        {},
        new ProviderFactory(),
      ),
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
        doc(
          p(
            text('Hello', defaultSchema),
            hardBreak(),
            text('{<>}World', defaultSchema),
          ),
        ),
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
        doc(
          p(
            text('Hello', defaultSchema),
            hardBreak(),
            text('{<>}World', defaultSchema),
          ),
        ),
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

    it('should not create taskList inside nested blocks', () => {
      const { editorView, sel } = editor(doc(blockquote(p('Hello World{<>}'))));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello World[] '))),
      );
    });
  });
});
