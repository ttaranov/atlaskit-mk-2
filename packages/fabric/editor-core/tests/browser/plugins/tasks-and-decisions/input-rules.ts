import * as chai from 'chai';
import { expect } from 'chai';
import {
  chaiPlugin,
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
} from '../../../../src/test-helper';
import tasksAndDecisionsPlugins from '../../../../src/plugins/tasks-and-decisions';
import defaultSchema from '../../../../src/test-helper/schema';
import { uuid } from '@atlaskit/editor-common';

chai.use(chaiPlugin);
describe('tasks and decisions - input rules', () => {

  before(() => {
    uuid.setStatic('local-decision');
  });

  after(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) => makeEditor({
    doc,
    plugins: tasksAndDecisionsPlugins(defaultSchema)
  });

  describe('decisions', () => {

    it('should replace "<> " with a decisionList', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          decisionList(
            decisionItem('')
          )
        )
      );
    });

    it('should preserve existing content on row when converting', () => {
      const { editorView, sel } = editor(doc(p('{<>}Hello World')));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          decisionList(
            decisionItem('Hello World')
          )
        )
      );
    });

    it('should split on hardBreak and preserve content when converting', () => {
      const { editorView, sel } = editor(doc(p(text('Hello', defaultSchema), hardBreak(), text('{<>}World', defaultSchema))));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          p('Hello'),
          decisionList(
            decisionItem('World')
          )
        )
      );
    });

    it('should not create decisionList inside nested blocks', () => {
      const { editorView, sel } = editor(doc(blockquote(p('Hello World{<>}'))));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          blockquote(
            p(
              'Hello World<> '
            )
          )
        )
      );
    });

  });

  describe('tasks', () => {

    it('should replace "[] " with a taskList', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          taskList(
            taskItem('')
          )
        )
      );
    });

    it('should preserve existing content on row when converting', () => {
      const { editorView, sel } = editor(doc(p('{<>}Hello World')));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          taskList(
            taskItem('Hello World')
          )
        )
      );
    });

    it('should split on hardBreak and preserve content when converting', () => {
      const { editorView, sel } = editor(doc(p(text('Hello', defaultSchema), hardBreak(), text('{<>}World', defaultSchema))));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          p('Hello'),
          taskList(
            taskItem('World')
          )
        )
      );
    });

    it('should not create taskList inside nested blocks', () => {
      const { editorView, sel } = editor(doc(blockquote(p('Hello World{<>}'))));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          blockquote(
            p(
              'Hello World[] '
            )
          )
        )
      );
    });

  });

});
