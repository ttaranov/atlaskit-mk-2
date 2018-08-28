import {
  createEditor,
  doc,
  ol,
  li,
  p,
  hardBreak,
  date,
} from '@atlaskit/editor-test-helpers';
import { enterKeyCommand } from '../../../../plugins/lists/commands';

describe('enterKeyCommand', () => {
  it('should not outdent a list when list item has visible content', () => {
    const timestamp = Date.now();
    const { editorView } = createEditor({
      doc: doc(
        ol(li(p('text')), li(p('{<>}', hardBreak(), date({ timestamp })))),
      ),
      editorProps: { allowLists: true, allowDate: true },
    });
    enterKeyCommand(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        ol(
          li(p('text')),
          li(p('')),
          li(p('', hardBreak(), date({ timestamp }))),
        ),
      ),
    );
  });
});
