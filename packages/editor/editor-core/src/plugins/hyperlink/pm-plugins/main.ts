import { Node } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { getCursor } from '../../../utils';

export enum LinkAction {
  EDITOR_FOCUSED,
  EDITOR_BLURRED,
  SHOW_INSERT_TOOLBAR,
  HIDE_TOOLBAR,
  SELECTION_CHANGE,
}
export enum InsertStatus {
  EDIT_LINK_TOOLBAR,
  INSERT_LINK_TOOLBAR,
}
type LinkToolbarState =
  | {
      type: InsertStatus.EDIT_LINK_TOOLBAR;
      node: Node;
      pos: number;
    }
  | {
      type: InsertStatus.INSERT_LINK_TOOLBAR;
      from: number;
      to: number;
    }
  | undefined;

const isSelectionInsideLink = (state: EditorState): boolean => {
  const $cursor = getCursor(state.selection);
  return $cursor ? !!state.schema.marks.link.isInSet($cursor.marks()) : false;
};

const mapFocusState = (isEditorFocused: boolean, action: LinkAction) => {
  switch (action) {
    case LinkAction.EDITOR_FOCUSED:
      return true;
    case LinkAction.EDITOR_BLURRED:
      return false;
    default:
      return isEditorFocused;
  }
};

const mapTransactionToState = (state: LinkToolbarState, tr: Transaction) => {
  if (state) {
    if (state.type === InsertStatus.EDIT_LINK_TOOLBAR) {
      return { ...state, pos: tr.mapping.map(state.pos) };
    } else {
      return {
        ...state,
        from: tr.mapping.map(state.from),
        to: tr.mapping.map(state.to),
      };
    }
  }
  return state;
};

const toState = (
  state: LinkToolbarState,
  action: LinkAction,
  editorState: EditorState,
): LinkToolbarState => {
  if (!state) {
    switch (action) {
      case LinkAction.SHOW_INSERT_TOOLBAR:
        const isSameParent =
          editorState.selection.$from.parent ===
          editorState.selection.$to.parent;
        const isInsideTextblock =
          editorState.selection.$from.parent.isTextblock;
        if (isSameParent && isInsideTextblock) {
          return {
            type: InsertStatus.INSERT_LINK_TOOLBAR,
            from: editorState.selection.from,
            to: editorState.selection.to,
          };
        }
        return undefined;
      case LinkAction.SELECTION_CHANGE:
        const linkedText = getActiveLinkMark(editorState);
        if (linkedText) {
          return { ...linkedText, type: InsertStatus.EDIT_LINK_TOOLBAR };
        }
        return undefined;
      default:
        return undefined;
    }
  } else if (state.type === InsertStatus.EDIT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.SELECTION_CHANGE:
        const linkedText = getActiveLinkMark(editorState);
        if (linkedText) {
          return linkedText.pos === state.pos && linkedText.node === state.node
            ? state
            : { ...linkedText, type: InsertStatus.EDIT_LINK_TOOLBAR };
        }
        return undefined;
      case LinkAction.HIDE_TOOLBAR:
        return undefined;
      default:
        return state;
    }
  } else if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.SELECTION_CHANGE:
      case LinkAction.HIDE_TOOLBAR:
        return undefined;
      default:
        return state;
    }
  }
};

const getActiveLinkMark = (state: EditorState) => {
  if (isSelectionInsideLink(state)) {
    const $cursor = getCursor(state.selection)!;
    const pos = $cursor.pos - $cursor.textOffset;
    const node = state.doc.nodeAt(pos);
    return node && node.isText ? { node, pos } : undefined;
  }
  return undefined;
};

export interface HyperlinkState {
  isEditorFocused: boolean;
  activeLinkMark?: LinkToolbarState;
}

export const stateKey = new PluginKey('hyperlinkPlugin');

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(_, state: EditorState): HyperlinkState {
        return {
          isEditorFocused: true,
          activeLinkMark: toState(
            undefined,
            LinkAction.SELECTION_CHANGE,
            state,
          ),
        };
      },
      apply(
        tr,
        pluginState: HyperlinkState,
        oldState,
        newState,
      ): HyperlinkState {
        let state: HyperlinkState = {
          isEditorFocused: pluginState.isEditorFocused,
          activeLinkMark: mapTransactionToState(pluginState.activeLinkMark, tr),
        };
        const action = tr.getMeta(stateKey) as LinkAction;

        if (action) {
          state = {
            isEditorFocused: mapFocusState(state.isEditorFocused, action),
            activeLinkMark: toState(
              pluginState.activeLinkMark,
              action,
              newState,
            ),
          };
        }

        if (!oldState.selection.eq(newState.selection) || tr.docChanged) {
          state = {
            isEditorFocused: state.isEditorFocused,
            activeLinkMark: toState(
              pluginState.activeLinkMark,
              LinkAction.SELECTION_CHANGE,
              newState,
            ),
          };
        }

        if (state !== pluginState) {
          dispatch(stateKey, state);
        }
        return state;
      },
    },
    key: stateKey,
    props: {
      handleDOMEvents: {
        click: (view, event) => {
          const pluginState: HyperlinkState = stateKey.getState(view.state);
          if (!pluginState.isEditorFocused) {
            const focusType = view.hasFocus()
              ? LinkAction.EDITOR_FOCUSED
              : LinkAction.EDITOR_BLURRED;
            view.dispatch(view.state.tr.setMeta(stateKey, focusType));
          }
          return false;
        },
        focus: (view, event) => {
          const pluginState: HyperlinkState = stateKey.getState(view.state);
          if (!pluginState.isEditorFocused) {
            view.dispatch(
              view.state.tr.setMeta(stateKey, LinkAction.EDITOR_FOCUSED),
            );
          }
          return false;
        },
        blur: (view, event: FocusEvent) => {
          const pluginState: HyperlinkState = stateKey.getState(view.state);
          if (pluginState.isEditorFocused) {
            view.dispatch(
              view.state.tr.setMeta(stateKey, LinkAction.EDITOR_BLURRED),
            );
          }
          return false;
        },
      },
    },
  });
