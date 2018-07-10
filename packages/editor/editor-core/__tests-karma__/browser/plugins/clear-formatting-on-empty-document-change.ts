import { expect } from 'chai';
import { EditorView } from 'prosemirror-view';
import { sendKeyToPm, insertText } from '@atlaskit/editor-test-helpers';

import { createEditor } from '@atlaskit/editor-test-helpers';

/**
 * We need to simulate a backspace here as sendKeyToPm(view, 'Backspace') throws an error
 */
const backspace = (view: EditorView) => {
  const {
    state: {
      tr,
      selection: { $head },
    },
  } = view;
  view.dispatch(tr.delete($head.pos - 1, $head.pos));
};

describe('clear-marks-on-empty-document-change', () => {
  const editor = () =>
    createEditor({
      editorProps: { shouldFocus: true },
    });

  it('should clear any stored marks when the document changes to be empty', () => {
    const { editorView } = editor();

    sendKeyToPm(editorView, 'Mod-b');
    insertText(editorView, 'a', editorView.state.selection.$head.pos);
    backspace(editorView);
    insertText(editorView, 'b', editorView.state.selection.$head.pos);

    expect(editorView.state.doc.toJSON()).to.deep.equal({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'b',
            },
          ],
        },
      ],
    });
    editorView.destroy();
  });

  it('should not clear stored marks when the document changes but still has content', () => {
    const { editorView } = editor();

    sendKeyToPm(editorView, 'Mod-b');
    insertText(editorView, 'ab', editorView.state.selection.$head.pos);
    backspace(editorView);
    insertText(editorView, 'c', editorView.state.selection.$head.pos);

    expect(editorView.state.doc.toJSON()).to.deep.equal({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [{ type: 'strong' }],
              text: 'ac',
            },
          ],
        },
      ],
    });
    editorView.destroy();
  });

  it('should allow stored marks to be set on an empty document', () => {
    const { editorView } = editor();

    sendKeyToPm(editorView, 'Mod-b');
    insertText(editorView, 'a', editorView.state.selection.$head.pos);

    expect(editorView.state.doc.toJSON()).to.deep.equal({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [{ type: 'strong' }],
              text: 'a',
            },
          ],
        },
      ],
    });
    editorView.destroy();
  });
});
