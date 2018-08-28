import {
  sendKeyToPm,
  createEditor,
  doc,
  p,
} from '@atlaskit/editor-test-helpers';
import submitPlugin from '../../../../plugins/submit-editor';

describe('submit-editor', () => {
  let onSave;
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [submitPlugin],
      editorProps: {
        onSave,
      },
    });

  beforeEach(() => {
    onSave = jest.fn();
  });

  it('Mod-Enter should submit editor content', () => {
    const { editorView } = editor(doc(p('{<>}')));
    sendKeyToPm(editorView, 'Mod-Enter');
    expect(onSave).toHaveBeenCalledTimes(1);
    editorView.destroy();
  });
});
