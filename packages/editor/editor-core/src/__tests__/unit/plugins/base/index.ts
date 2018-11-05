import {
  compareSelection,
  createEditor,
  doc,
  p,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import tasksAndDecisionsPlugin from '../../../../plugins/tasks-and-decisions';
const editorFactory = (doc: any) =>
  createEditor({
    doc,
    editorPlugins: [tasksAndDecisionsPlugin],
  });

describe('Delete', () => {
  it(`should merge paragraph and preserve content`, () => {
    const { editorView } = editorFactory(doc(p('Hello{<>}'), p('World')));

    sendKeyToPm(editorView, 'Delete');

    const expectedDoc = doc(p('Hello{<>}World'));
    expect(editorView.state.doc).toEqualDocument(expectedDoc);
    compareSelection(editorFactory, expectedDoc, editorView);
  });
});
