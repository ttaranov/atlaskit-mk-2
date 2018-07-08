import { Plugin } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import {
  InsertStatus,
  stateKey as hyperlinkStateKey,
  HyperlinkState,
} from './main';

const createTextCursor = (pos: number): Decoration => {
  const node = document.createElement('div');
  node.className = 'ProseMirror-fake-text-cursor';
  return Decoration.widget(pos, node);
};

const createTextSelection = (from: number, to: number): Decoration =>
  Decoration.inline(from, to, { class: 'ProseMirror-fake-text-selection' });

const getInsertLinkToolbarState = (state: HyperlinkState) =>
  state &&
  state.activeLinkMark &&
  state.activeLinkMark.type === InsertStatus.INSERT_LINK_TOOLBAR
    ? state.activeLinkMark
    : undefined;

const fakeCursorToolbarPlugin: Plugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, pluginState: DecorationSet, oldState, newState) {
      const oldInsertToolbarState = getInsertLinkToolbarState(
        hyperlinkStateKey.getState(oldState),
      );
      const insertToolbarState = getInsertLinkToolbarState(
        hyperlinkStateKey.getState(newState),
      );
      if (oldInsertToolbarState && insertToolbarState) {
        const { from, to } = insertToolbarState;
        const oldFrom = tr.mapping.map(oldInsertToolbarState.from);
        const oldTo = tr.mapping.map(oldInsertToolbarState.to);
        // Map decoration if it still refers to the same position in the document
        if (oldFrom === from && oldTo === to) {
          return pluginState.map(tr.mapping, tr.doc);
        }
      }
      // Update DecorationSet if new insert toolbar, or if we have moved to a different position in the doc
      if (insertToolbarState) {
        const { from, to } = insertToolbarState;
        return DecorationSet.create(tr.doc, [
          from === to ? createTextCursor(from) : createTextSelection(from, to),
        ]);
      }
      return DecorationSet.empty;
    },
  },
  props: {
    decorations(state) {
      return fakeCursorToolbarPlugin.getState(state);
    },
  },
});

export default fakeCursorToolbarPlugin;
