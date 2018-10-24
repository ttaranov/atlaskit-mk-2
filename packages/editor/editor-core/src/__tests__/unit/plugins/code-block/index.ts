import {
  code_block,
  doc,
  createEditor,
  p,
  table,
  tr,
  td,
  sendKeyToPm,
  createEvent,
} from '@atlaskit/editor-test-helpers';

import { pluginKey as codeBlockPluginKey } from '../../../../plugins/code-block/pm-plugins/main';
import tablesPlugin from '../../../../plugins/table';
import listPlugin from '../../../../plugins/lists';
import {
  removeCodeBlock,
  changeLanguage,
} from '../../../../plugins/code-block/actions';
import { setTextSelection } from '../../../../utils';
import codeBlockPlugin from '../../../../plugins/code-block';

describe('code-block', () => {
  const event = createEvent('event');
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [codeBlockPlugin(), listPlugin, tablesPlugin()],
      editorProps: { allowCodeBlocks: true },
      pluginKey: codeBlockPluginKey,
    });
  };

  describe('plugin', () => {
    describe('API', () => {
      it('should be able to identify code block node', () => {
        const { pluginState } = editor(doc(code_block()('te{<>}xt')));
        expect(pluginState.element).not.toBe(undefined);
      });

      it('should not identify code block if initial selection is outside a code-block', () => {
        const { pluginState } = editor(doc(p('paragraph{<>}')));
        expect(pluginState.element).toBe(undefined);
      });

      it('should be able to remove code block type using function removeCodeBlock', () => {
        const { editorView } = editor(doc(code_block()('te{<>}xt')));
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p()));
      });

      it('should be possible to remove code block with no text inside table', () => {
        const { pluginState, editorView } = editor(
          doc(table()(tr(td({})(code_block()('{<>}'))))),
        );
        expect(pluginState.element).not.toBe(undefined);
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(table()(tr(td({})(p())))),
        );
      });

      it('should be able to remove codeBlock using function removeCodeBlock even if it has no text content', () => {
        const { pluginState, editorView } = editor(doc(code_block()('{<>}')));
        expect(pluginState.element).not.toBe(undefined);
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p()));
      });

      it('should not remove surrounding blocks while removing codeBlock', () => {
        const { editorView } = editor(
          doc(p('testing'), code_block()('te{<>}xt'), p('testing')),
        );
        removeCodeBlock(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('testing'), p('testing')),
        );
      });
    });

    describe('toolbarVisible', () => {
      describe('when focus is inside the code block', () => {
        it('it is true', () => {
          const { pluginState } = editor(
            doc(p('text'), code_block()('text te{<>}xt')),
          );
          expect(pluginState.toolbarVisible).toBe(true);
        });
      });

      describe('when editor is blur', () => {
        it('is false', () => {
          const { editorView, plugin, pluginState } = editor(
            doc(p('te{<>}xt'), code_block()('text')),
          );
          plugin.props.handleDOMEvents!.blur(editorView, event);
          expect(pluginState.toolbarVisible).toBe(false);
        });
      });
    });

    describe('language picker', () => {
      describe('when selecting new language', () => {
        it('language in state should update', () => {
          const { pluginState, editorView } = editor(
            doc(code_block()('text{<>}')),
          );
          const language = 'someLanguage';
          changeLanguage(language)(editorView.state, editorView.dispatch);
          setTimeout(() => {
            expect(pluginState.language).toEqual(language);
          }, 0);
        });
      });
    });
    describe('keyMaps', () => {
      describe('when Enter key is pressed', () => {
        it('a new paragraph should be created in code block', () => {
          const { editorView } = editor(doc(code_block()('text{<>}')));
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('text\n')),
          );
        });
      });

      describe('when Enter key is pressed twice', () => {
        it('a new paragraph should be created outside code block', () => {
          const { editorView } = editor(doc(code_block()('text{<>}')));
          sendKeyToPm(editorView, 'Enter');
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('text'), p()),
          );
        });
      });
    });

    describe('#state.update', () => {
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

          expect(codeBlockPluginKey.getState(editorView.state)).toBeDefined();
          setTextSelection(editorView, pPos);

          expect(codeBlockPluginKey.getState(editorView.state)).toEqual({
            element: undefined,
            language: undefined,
            toolbarVisible: false,
          });
          editorView.destroy();
        });
      });
    });
  });
});
