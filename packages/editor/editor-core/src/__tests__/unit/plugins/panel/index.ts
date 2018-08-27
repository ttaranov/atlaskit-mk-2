import {
  PanelState,
  pluginKey as panelPluginKey,
} from '../../../../plugins/panel/pm-plugins/main';
import {
  doc,
  panel,
  panelNote,
  p,
  createEditor,
  createEvent,
  sendKeyToPm,
  table,
  tr,
  td,
  ol,
  li,
} from '@atlaskit/editor-test-helpers';
import panelPlugin from '../../../../plugins/panel';
import listPlugin from '../../../../plugins/lists';
import tablesPlugin from '../../../../plugins/table';
import {
  removePanel,
  changePanelType,
} from '../../../../plugins/panel/actions';

describe('@atlaskit/editor-core ui/PanelPlugin', () => {
  const event = createEvent('event');
  const editor = (doc: any) =>
    createEditor<PanelState>({
      doc,
      editorPlugins: [panelPlugin, listPlugin, tablesPlugin()],
      pluginKey: panelPluginKey,
    });

  describe('API', () => {
    it('should call subscribers when panel is clicked', () => {
      const { pluginState } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.element).not.toBe(undefined);
    });

    it('should be able to identify panel node', () => {
      const { pluginState } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.element).not.toBe(undefined);
    });

    it('should be able to change panel type using function changeType', async () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.activePanelType).toEqual('info');
      expect(pluginState.element).not.toBe(undefined);
      expect(pluginState.activePanelType).not.toBe(undefined);
      changePanelType('note')(editorView.state, editorView.dispatch);
      setTimeout(() => {
        expect(pluginState.activePanelType).toEqual('note');
      }, 0);
    });

    it('should be able to change panel type using function changeType for panel with multiple blocks', () => {
      const { editorView } = editor(doc(panel()(p('te{<>}xt'), p('text'))));
      changePanelType('note')(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panelNote(p('text'), p('text'))),
      );
    });

    it('should be able to remove panel type using function removePanel', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.activePanelType).toEqual('info');
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be able to remove panel having multiple paragraphs', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('te{<>}xt'), p('te{<>}xt'), p('te{<>}xt'))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be possible to remove panel inside table', () => {
      const { pluginState, editorView } = editor(
        doc(table()(tr(td({})(panel()(p('text{<>}')))))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(td({})(p())))),
      );
    });

    it('should be possible to remove panel with no text inside table', () => {
      const { pluginState, editorView } = editor(
        doc(table()(tr(td({})(panel()(p('{<>}')))))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(td({})(p())))),
      );
    });

    it('should be able to remove panel type using function removePanel even if panel has no text content', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('{<>}'))));
      expect(pluginState.activePanelType).toEqual('info');
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be able to remove panel for panel of multiple blocks using function removePanel', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('te{<>}xt'), p('text'))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should not remove enclosing block while removing panel', () => {
      const { pluginState, editorView } = editor(
        doc(p('testing'), panel()(p('te{<>}xt'), p('text')), p('testing')),
      );
      expect(pluginState.activePanelType).toEqual('info');
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('testing'), p('testing')),
      );
    });

    it('should be able to remove panel node if cursor is inside nested list node', () => {
      const { editorView } = editor(
        doc(p('one'), panel()(p('text'), ol(li(p('te{<>}xt')))), p('two')),
      );
      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('one'), p('two')));
    });

    it('should change panel type if cursor is inside nested list node', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('text'), ol(li(p('te{<>}xt'))))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      changePanelType('note')(editorView.state, editorView.dispatch);
      // Wait till the dispatch cycle finishes and the state updates
      setTimeout(() => {
        expect(pluginState.activePanelType).toEqual('note');
      }, 0);
    });
  });

  describe('toolbarVisible', () => {
    describe('when editor is blur', () => {
      it('it is false', () => {
        const { editorView, plugin, pluginState } = editor(
          doc(p('te{<>}xt'), panel()(p('text'))),
        );
        plugin.props.handleDOMEvents!.blur(editorView, event);
        expect(pluginState.toolbarVisible).toBe(false);
      });
    });

    describe('when focus is inside a list in panel', () => {
      it('it is true', () => {
        const { pluginState } = editor(
          doc(p('text'), panel()(p('text'), ol(li(p('te{<>}xt'))))),
        );
        expect(pluginState.toolbarVisible).toBe(true);
      });
    });
  });

  describe('keyMaps', () => {
    describe('when Enter key is pressed', () => {
      it('a new paragraph should be created in panel', () => {
        const { editorView } = editor(doc(panel()(p('text{<>}'))));
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p('text'), p())),
        );
      });
    });

    describe('when Enter key is pressed twice', () => {
      it('a new paragraph should be created outside panel', () => {
        const { editorView } = editor(doc(panel()(p('text{<>}'))));
        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p('text')), p()),
        );
      });
    });
  });
});
