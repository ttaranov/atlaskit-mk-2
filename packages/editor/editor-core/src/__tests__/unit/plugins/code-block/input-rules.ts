import {
  createEditor,
  insertText,
  doc,
  li,
  p,
  ul,
  code_block,
} from '@atlaskit/editor-test-helpers';
import codeBlockPlugin from '../../../../plugins/code-block';
import listPlugin from '../../../../plugins/lists';

describe('inputrules', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [codeBlockPlugin(), listPlugin],
      editorProps: {
        textFormatting: {
          disableCode: true,
        },
      },
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
        it('should convert "```" to a code block\t', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));

          insertText(editorView, '```', sel);

          expect(editorView.state.doc).toEqualDocument(doc(code_block({})()));
          editorView.destroy();
        });
      });
    });
  });
});
