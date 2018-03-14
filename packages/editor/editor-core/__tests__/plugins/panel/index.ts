import {
  PanelState,
  stateKey as panelPluginKey,
} from '../../../src/plugins/panel/pm-plugins/main';
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
import panelPlugin from '../../../src/plugins/panel';
import listPlugin from '../../../src/plugins/lists';
import tablesPlugin from '../../../src/plugins/table';

describe('@atlaskit/editor-core ui/PanelPlugin', () => {
  const event = createEvent('event');
  const editor = (doc: any) =>
    createEditor<PanelState>({
      doc,
      editorPlugins: [panelPlugin, listPlugin, tablesPlugin],
      pluginKey: panelPluginKey,
    });

  describe('API', () => {
    it('should get current state immediately once subscribed', () => {
      const { pluginState } = editor(doc(panel()(p('te{<>}xt'))));
      const spy = jest.fn();
      pluginState.subscribe(spy);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call subscribers with argument panel state', () => {
      const { pluginState } = editor(doc(panel()(p('te{<>}xt'))));
      const spy = jest.fn();
      pluginState.subscribe(spy);
      expect(spy).toHaveBeenCalledWith(pluginState);
    });

    it('should call subscribers when panel is clicked', () => {
      const { editorView, plugin, pluginState, sel } = editor(
        doc(panel()(p('te{<>}xt'))),
      );
      const spy = jest.fn();
      pluginState.subscribe(spy);
      plugin.props.handleClick!(editorView, sel, event);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should not call subscribers when another block in editor is clicked', () => {
      const { editorView, plugin, pluginState, sel } = editor(
        doc(p('te{<>}xt'), panel()(p('text'))),
      );
      const spy = jest.fn();
      pluginState.subscribe(spy);
      plugin.props.handleClick!(editorView, sel, event);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call subscribers when panel was focused and editor blur', () => {
      const { editorView, plugin, pluginState } = editor(
        doc(panel()(p('te{<>}xt'))),
      );
      const spy = jest.fn();
      pluginState.subscribe(spy);
      plugin.props.handleDOMEvents!.focus(editorView, event);
      plugin.props.handleDOMEvents!.blur(editorView, event);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should not call subscribers when another block was focused and editor blur', () => {
      const { editorView, plugin, pluginState } = editor(
        doc(p('te{<>}xt'), panel()(p('text'))),
      );
      const spy = jest.fn();
      pluginState.subscribe(spy);
      plugin.props.handleDOMEvents!.focus(editorView, event);
      plugin.props.handleDOMEvents!.blur(editorView, event);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when panel received focus', () => {
      const { editorView, plugin, pluginState } = editor(
        doc(panel()(p('text'))),
      );
      const spy = jest.fn();
      pluginState.subscribe(spy);
      plugin.props.handleDOMEvents!.focus(editorView, event);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should be able to identify panel node', () => {
      const { pluginState } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.element).not.toBe(undefined);
    });

    it('should be able to change panel type using function changeType', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.activePanelType).toEqual('info');
      expect(pluginState.element).not.toBe(undefined);
      expect(pluginState.activePanelType).not.toBe(undefined);
      pluginState.changePanelType(editorView, { panelType: 'note' });
      expect(pluginState.activePanelType).toEqual('note');
    });

    it('should be able to change panel type using function changeType for panel with multiple blocks', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('te{<>}xt'), p('text'))),
      );
      pluginState.changePanelType(editorView, { panelType: 'note' });
      expect(editorView.state.doc).toEqualDocument(
        doc(panelNote(p('text'), p('text'))),
      );
    });

    it('should be able to remove panel type using function removePanel', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be able to remove panel having multiple paragraphs', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('te{<>}xt'), p('te{<>}xt'), p('te{<>}xt'))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be possible to remove panel inside table', () => {
      const { pluginState, editorView } = editor(
        doc(table(tr(td({})(panel()(p('text{<>}')))))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(table(tr(td({})(p())))));
    });

    it('should be possible to remove panel with no text inside table', () => {
      const { pluginState, editorView } = editor(
        doc(table(tr(td({})(panel()(p('{<>}')))))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(table(tr(td({})(p())))));
    });

    it('should be able to remove panel type using function removePanel even if panel has no text content', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('{<>}'))));
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should be able to remove panel for panel of multiple blocks using function removePanel', () => {
      const { pluginState, editorView } = editor(
        doc(panel()(p('te{<>}xt'), p('text'))),
      );
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should not remove enclosing block while removing panel', () => {
      const { pluginState, editorView } = editor(
        doc(p('testing'), panel()(p('te{<>}xt'), p('text')), p('testing')),
      );
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('testing'), p('testing')),
      );
    });

    it('should call handlers for change in panel type', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      const spy = jest.fn();
      pluginState.subscribe(spy);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.changePanelType(editorView, { panelType: 'note' });
      expect(pluginState.activePanelType).toEqual('note');
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('shoul call handlers when panel is removed', () => {
      const { pluginState, editorView } = editor(doc(panel()(p('te{<>}xt'))));
      const spy = jest.fn();
      pluginState.subscribe(spy);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(pluginState.activePanelType).toEqual('info');
      pluginState.removePanel(editorView);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('toolbarVisible', () => {
    describe('when editor is blur', () => {
      it('it is false', () => {
        const { editorView, plugin, pluginState } = editor(
          doc(p('te{<>}xt'), panel()(p('text'))),
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        plugin.props.handleDOMEvents!.blur(editorView, event);
        expect(pluginState.toolbarVisible).toBe(false);
      });
    });

    describe('when focus is inside a list in panel', () => {
      it('it is true', () => {
        const { editorView, plugin, pluginState } = editor(
          doc(p('text'), panel()(p('text'), ol(li(p('te{<>}xt'))))),
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        plugin.props.handleClick!(editorView, 2, createEvent('event'));
        expect(pluginState.toolbarVisible).toBe(true);
      });
    });
  });

  describe('editorFocued', () => {
    describe('when editor is focused', () => {
      it('it is true', () => {
        const { editorView, plugin, pluginState } = editor(
          doc(p('te{<>}xt'), panel()(p('text'))),
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        expect(pluginState.editorFocused).toBe(true);
      });
    });

    describe('when editor is blur', () => {
      it('it is false', () => {
        const { editorView, plugin, pluginState } = editor(
          doc(p('te{<>}xt'), panel()(p('text'))),
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        plugin.props.handleDOMEvents!.blur(editorView, event);
        expect(pluginState.editorFocused).toBe(false);
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
