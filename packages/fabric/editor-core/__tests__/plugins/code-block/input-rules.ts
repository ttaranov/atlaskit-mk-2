import codeBlockPlugin from '../../../src/plugins/code-block';

import {
  doc,
  insertText,
  li,
  makeEditor,
  p,
  ul,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';

describe('inputrules', () => {
  const editor = (doc: any) =>
    makeEditor({
      doc,
      plugins: codeBlockPlugin(defaultSchema),
    });

  describe('codeblock rule', () => {
    describe('when node is not convertable to code block', () => {
      it('should not convert "```" to a code block\t', () => {
        const { editorView, sel } = editor(doc(ul(li(p('{<>}hello')))));

        insertText(editorView, '```', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('```hello')))),
        );
        editorView.destroy();
      });
    });

    describe('when node is convertable to code block', () => {
      describe('when converted node has no content', () => {
        it('should not convert "```" to a code block\t', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));

          insertText(editorView, '```', sel);

          expect(editorView.state.doc).toEqualDocument(doc(p('```')));
          editorView.destroy();
        });
      });
    });
  });
});
