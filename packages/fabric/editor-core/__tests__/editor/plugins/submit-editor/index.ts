import { sendKeyToPm, doc, makeEditor, p } from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import blockTypePlugins, {
  BlockTypeState,
} from '../../../../src/plugins/block-type';
import { createPlugin as createSubmitPlugin } from '../../../../src/editor/plugins/submit-editor';

describe('submit-editor', () => {
  let onSave;
  const editor = (doc: any) =>
    makeEditor<BlockTypeState>({
      doc,
      plugins: [
        ...blockTypePlugins(defaultSchema),
        createSubmitPlugin(onSave)!,
      ],
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
