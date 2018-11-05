import {
  doc,
  p,
  createEditor,
  h1,
  alignment as alignmentMark,
  tr,
  table,
  td,
  panel,
  code_block,
} from '@atlaskit/editor-test-helpers';
import {
  AlignmentPluginState,
  pluginKey as alignmentPluginKey,
} from '../../../../plugins/alignment/pm-plugins/main';
import alignment from '../../../../plugins/alignment';
import panelPlugin from '../../../../plugins/panel';
import codeBlockPlugin from '../../../../plugins/code-block';
import tablesPlugin from '../../../../plugins/table';
import {
  removeAlignment,
  canApplyAlignment,
} from '../../../../plugins/alignment/utils';
import { Transaction } from 'prosemirror-state';

describe('alignment utils', () => {
  const editor = (doc: any) =>
    createEditor<AlignmentPluginState>({
      doc,
      pluginKey: alignmentPluginKey,
      editorPlugins: [
        tablesPlugin(),
        codeBlockPlugin(),
        panelPlugin,
        alignment,
      ],
      editorProps: {
        allowTextAlignment: true,
      },
    });

  it('removes alignment', () => {
    const { editorView } = editor(
      doc(alignmentMark({ align: 'right' })(p('{<}hello{>}'))),
    );
    const tr = removeAlignment(editorView.state) as Transaction;
    editorView.dispatch(tr);
    expect(editorView.state.doc).toEqualDocument(doc(p('hello{<>}')));
    editorView.destroy();
  });

  describe('check disabled state', () => {
    it('should be able to add alignment to a top level paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}')));
      expect(canApplyAlignment(editorView)).toBe(true);
      editorView.destroy();
    });

    it('should be able to add alignment to a top level heading', () => {
      const { editorView } = editor(doc(h1('hello{<>}')));
      expect(canApplyAlignment(editorView)).toBe(true);
      editorView.destroy();
    });

    it('should be able to add alignment inside a table cell', () => {
      const { editorView } = editor(
        doc(
          p('text{<>}'),
          table()(tr(td({})(p('hello')), td({})(p('world{<>}')))),
        ),
      );
      expect(canApplyAlignment(editorView)).toBe(true);
      editorView.destroy();
    });

    it('should not be able to add alignment inside a panel', () => {
      const { editorView } = editor(doc(panel()(p('hello{<>}'))));
      expect(canApplyAlignment(editorView)).toBe(false);
      editorView.destroy();
    });

    it('should not be able to add alignment inside a panel', () => {
      const { editorView } = editor(doc(code_block()('hello{<>}')));
      expect(canApplyAlignment(editorView)).toBe(false);
      editorView.destroy();
    });
  });
});
