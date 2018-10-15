import {
  createEditor,
  doc,
  p,
  insertText,
  insert,
  code_block,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers';
import { createTypeAheadPlugin } from './_create-type-ahead-plugin';
import { selectCurrentItem } from '../../../../../plugins/type-ahead/commands/select-item';
import { pluginKey as typeAheadPluginKey } from '../../../../../plugins/type-ahead/pm-plugins/main';

describe('typeAhead main plugin', () => {
  it('should close typeahed if a query starts with a space', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, '/ ', sel);
    expect(editorView.state.doc).toEqualDocument(doc(p('/ ')));
  });

  it('should handle inserting typeAheadQuery from type ahead', () => {
    const plugin = createTypeAheadPlugin({
      selectItem(state, item, insert) {
        const mark = state.schema.mark('typeAheadQuery', {
          trigger: '@',
        });
        const mentionText = state.schema.text('@', [mark]);
        return insert(mentionText);
      },
    });
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, '/1 ', sel);
    selectCurrentItem()(editorView.state, editorView.dispatch);
    const pluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState.trigger).toBe('@');
    expect(pluginState.active).toBe(true);
  });

  it('should disable type ahead inside code blocks', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('{<>}')),
      editorProps: { allowCodeBlocks: true },
    });
    const pluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState.isAllowed).toBe(false);
  });

  it('should dismiss type ahead when trigger has been removed', async () => {
    const { editorView } = createEditor({
      doc: doc(
        p(typeAheadQuery({ trigger: '/', query: 'test' })('{<}/test{>}')),
      ),
    });

    insert(editorView, ['']);

    expect(editorView.state.doc).toEqualDocument(doc(p('')));
  });
});
