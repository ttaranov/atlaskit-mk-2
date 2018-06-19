import {
  doc,
  insertText,
  createEditor,
  p,
  panel,
  sleep,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { pluginKey as typeAheadPluginKey } from '../../../src/plugins/type-ahead/pm-plugins/main';

describe('Quick Insert', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        quickInsert: true,
        allowPanel: true,
        allowCodeBlocks: true,
      },
    });

  it('should be able to search for quick insert items using type ahead', async () => {
    const { editorView, sel } = editor(doc(p('{<>}')));
    insertText(editorView, '/Panel', sel);
    await sleep(50);
    const pluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState.items[0].title).toBe('Panel');
    expect(pluginState.items.length).toBe(1);
  });

  it('should be able to select a quick insert items using type ahead', async () => {
    const { editorView, sel } = editor(doc(p('{<>}')));
    insertText(editorView, '/Panel', sel);
    await sleep(50);
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p())),
    );
  });
});
