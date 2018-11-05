import {
  doc,
  p,
  createEditor,
  h1,
  panel,
  code_block,
  alignment as alignmentMark,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers';
import {
  AlignmentPluginState,
  pluginKey as alignmentPluginKey,
} from '../../../../plugins/alignment/pm-plugins/main';
import { changeAlignment } from '../../../../plugins/alignment/commands/index';
import alignment from '../../../../plugins/alignment';
import panelPlugin from '../../../../plugins/panel';
import codeBlockPlugin from '../../../../plugins/code-block';
import tablesPlugin from '../../../../plugins/table';

describe('alignment', () => {
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
        allowPanel: true,
        allowCodeBlocks: true,
        allowTables: true,
      },
    });

  describe('applies alignment', () => {
    it('should be able to add alignment to a top level paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}')));
      const { dispatch, state } = editorView;
      changeAlignment('right')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(alignmentMark({ align: 'right' })(p('hello{<>}'))),
      );
      editorView.destroy();
    });

    it('applies alignment only to the current paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}'), p('world')));
      const { dispatch, state } = editorView;
      changeAlignment('right')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(alignmentMark({ align: 'right' })(p('hello{<>}')), p('world')),
      );

      editorView.destroy();
    });

    it('should be able to add alignment to a top level heading', () => {
      const { editorView } = editor(doc(h1('hello{<>}')));
      const { dispatch, state } = editorView;
      changeAlignment('right')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(alignmentMark({ align: 'right' })(h1('hello{<>}'))),
      );
      editorView.destroy();
    });

    it('applies alignment to multiple paragraphs', () => {
      const { editorView } = editor(
        doc(p('{<}hello'), panel()(p('hello')), p('world{>}')),
      );
      const { dispatch, state } = editorView;
      changeAlignment('right')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          alignmentMark({ align: 'right' })(p('{<}hello')),
          panel()(p('hello')),
          alignmentMark({ align: 'right' })(p('world{>}')),
        ),
      );
      editorView.destroy();
    });
  });

  describe('Does not apply inside special block nodes', () => {
    it('Does not apply to paragraph inside a panel', () => {
      const { editorView } = editor(doc(panel()(p('hello{<>}'))));
      const { dispatch, state } = editorView;
      changeAlignment('right')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p('hello{<>}'))),
      );
      editorView.destroy();
    });

    it('Does not apply to paragraph inside a codeblock', () => {
      const { editorView } = editor(doc(code_block()('hello{<>}')));
      const { dispatch, state } = editorView;
      changeAlignment('right')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('hello{<>}')),
      );
      editorView.destroy();
    });
  });

  describe('Adds alignment to top level paragraphs inside tables', () => {
    it('Does not apply to paragraph inside a table', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(td({})(p('hello')), td({})(p('world{<>}'))))),
      );
      const { dispatch, state } = editorView;
      changeAlignment('right')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table()(
            tr(
              td({})(p('hello')),
              td({})(alignmentMark({ align: 'right' })(p('world{<>}'))),
            ),
          ),
        ),
      );
      editorView.destroy();
    });
  });
});
