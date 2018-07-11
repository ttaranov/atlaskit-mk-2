import { stateKey as codeBlockPluginKey } from '../../../src/plugins/code-block/pm-plugins/main';
import {
  code_block,
  doc,
  createEditor,
  p,
} from '@atlaskit/editor-test-helpers';
import { setTextSelection } from '../../../src/utils';

describe('code-block', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: { allowCodeBlocks: true },
      pluginKey: codeBlockPluginKey,
    });
  };

  describe('plugin', () => {
    describe('#state.init', () => {
      it('should set activeCodeBlock if initial selection is inside a code-block', () => {
        const { editorView, plugin } = editor(
          doc(code_block()('para{<>}graph')),
        );
        const pluginState = plugin.spec.state.init({}, editorView.state);
        expect(pluginState.activeCodeBlock.pos).toBe(0);
        expect(pluginState.activeCodeBlock.node).toEqualDocument(
          editorView.state.doc.nodeAt(0),
        );
      });

      it('should not set activeCodeBlock if initial selection is outside a code-block', () => {
        const { editorView, plugin } = editor(doc(p('paragraph{<>}')));
        const pluginState = plugin.spec.state.init({}, editorView.state);
        expect(pluginState.activeCodeBlock).toBeUndefined();
      });
    });

    describe('#state.update', () => {
      describe('when entering code block', () => {
        it('sets the activeCodeBlock', () => {
          const {
            refs: { cbPos },
            editorView,
          } = editor(doc(p('paragraph{<>}'), code_block()('codeBlock{cbPos}')));

          setTextSelection(editorView, cbPos);
          const pluginState = codeBlockPluginKey.getState(editorView.state);
          expect(pluginState.activeCodeBlock.pos).toBe(11);
          expect(pluginState.activeCodeBlock.node).toEqualDocument(
            editorView.state.doc.nodeAt(11),
          );
          editorView.destroy();
        });
      });

      describe('when moving to a different code block', () => {
        it('should update the activeCodeBlock', () => {
          const {
            refs: { cbPos },
            editorView,
          } = editor(
            doc(
              code_block()('codeBlock{<>}'),
              code_block()('codeBlock{cbPos}'),
            ),
          );

          let pluginState = codeBlockPluginKey.getState(editorView.state);
          expect(pluginState.activeCodeBlock).toBeDefined();

          setTextSelection(editorView, cbPos);

          pluginState = codeBlockPluginKey.getState(editorView.state);
          expect(pluginState.activeCodeBlock.pos).toBe(11);
          expect(pluginState.activeCodeBlock.node).toEqualDocument(
            editorView.state.doc.nodeAt(11),
          );
          editorView.destroy();
        });
      });

      describe('when moving within the same code block', () => {
        it('should not update state', () => {
          const {
            refs: { cbPos },
            pluginState,
            editorView,
          } = editor(doc(code_block()('{<>}codeBlock{cbPos}')));

          setTextSelection(editorView, cbPos);
          expect(codeBlockPluginKey.getState(editorView.state)).toEqual(
            pluginState,
          );
          editorView.destroy();
        });
      });

      describe('when leaving code block', () => {
        it('should unset the activeCodeBlock', () => {
          const {
            refs: { pPos },
            editorView,
          } = editor(doc(p('paragraph{pPos}'), code_block()('codeBlock{<>}')));

          expect(
            codeBlockPluginKey.getState(editorView.state).activeCodeBlock,
          ).toBeDefined();
          setTextSelection(editorView, pPos);

          expect(
            codeBlockPluginKey.getState(editorView.state).activeCodeBlock,
          ).toBeUndefined();
          editorView.destroy();
        });
      });

      describe('when cursor at the end of the code block', () => {
        it('should set active element pos immediately before the code block', () => {
          const { pluginState } = editor(doc(code_block()('codeBlock{<>}')));

          expect(pluginState.activeCodeBlock.pos).toBe(0);
        });
      });

      describe('when cursor at the beginning of the code block', () => {
        it('should set active element pos immediately before the code block', () => {
          const { pluginState } = editor(doc(code_block()('{<>}codeBlock')));

          expect(pluginState.activeCodeBlock.pos).toBe(0);
        });
      });

      describe('when cursor at the middle of the code block', () => {
        it('should set active element pos immediately before the code block', () => {
          const { pluginState } = editor(doc(code_block()('code{<>}Block')));

          expect(pluginState.activeCodeBlock.pos).toBe(0);
        });
      });
    });
  });
});
