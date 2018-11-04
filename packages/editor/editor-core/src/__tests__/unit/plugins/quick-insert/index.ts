import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  insertText,
  createEditor,
  p,
  panel,
  sleep,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { pluginKey as typeAheadPluginKey } from '../../../../plugins/type-ahead/pm-plugins/main';
import { pluginKey as quickInsertPluginKey } from '../../../../plugins/quick-insert';

describe('Quick Insert', () => {
  const editor = (doc: any, providerFactory?: any) =>
    createEditor({
      doc,
      pluginKey: quickInsertPluginKey,
      providerFactory,
      editorProps: {
        quickInsert: true,
        allowPanel: true,
        allowCodeBlocks: true,
      },
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

  it('should support custom items through the QuickInsert provider', async () => {
    const provider = Promise.resolve({
      getItems() {
        return Promise.resolve([
          {
            title: 'Custom item',
            action(insert) {
              return insert('custom item');
            },
          },
        ]);
      },
    });
    const providerFactory = new ProviderFactory();
    const { editorView, sel } = editor(doc(p('{<>}')), providerFactory);
    providerFactory.setProvider('quickInsertProvider', provider);
    insertText(editorView, '/Custom', sel);
    await sleep(50);
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(doc(p('custom item')));
  });

  it('should fallback to default items if QuickInsert provider rejects', async () => {
    const provider = Promise.resolve({
      getItems: () => Promise.reject('Error'),
    });
    const providerFactory = new ProviderFactory();
    const { editorView, sel } = editor(doc(p('{<>}')), providerFactory);
    providerFactory.setProvider('quickInsertProvider', provider);
    insertText(editorView, '/Panel', sel);
    await sleep(50);
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p())),
    );
  });

  const disabledEditor = (doc: any, providerFactory?: any) =>
    createEditor({
      doc,
      pluginKey: quickInsertPluginKey,
      providerFactory,
      editorProps: {
        quickInsert: false,
        allowPanel: true,
        allowCodeBlocks: true,
      },
    });

  it("shouldn't start quick insert with quickInsert:false", async () => {
    const { editorView, sel } = disabledEditor(doc(p('{<>}')));
    insertText(editorView, '/Panel', sel);
    await sleep(50);
    const activePlugin = typeAheadPluginKey.get(editorView.state);
    expect(activePlugin).not.toBe(undefined);

    const pluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState.items.length).toBe(0);
  });
});
