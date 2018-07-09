import { Node } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { getCursor } from '../../../utils';

export enum LinkAction {
  EDITOR_FOCUSED = 'focus',
  EDITOR_BLURRED = 'blur',
  SHOW_INSERT_TOOLBAR = 'show_insert',
  HIDE_TOOLBAR = 'hide_toolbar',
  SELECTION_CHANGE = 'selection_change',
}
export enum InsertStatus {
  EDIT_LINK_TOOLBAR = 'edit',
  INSERT_LINK_TOOLBAR = 'insert',
}
export type LinkToolbarState =
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

export const canLinkBeCreatedInRange = (from: number, to: number) => (
  state: EditorState,
) => {
  if (!state.doc.rangeHasMark(from, to, state.schema.marks.link)) {
    const $from = state.doc.resolve(from);
    const $to = state.doc.resolve(to);
    const link = state.schema.marks.link;
    if ($from.parent === $to.parent && $from.parent.isTextblock) {
      if ($from.parent.type.allowsMarkType(link)) {
        let allowed = true;
        state.doc.nodesBetween(from, to, node => {
          allowed =
            allowed && !node.marks.some(mark => mark.type.excludes(link));
          return allowed;
        });
        return allowed;
      }
    }
  }
  return false;
};

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
        const { from, to } = editorState.selection;
        if (canLinkBeCreatedInRange(from, to)(editorState)) {
          return {
            type: InsertStatus.INSERT_LINK_TOOLBAR,
            from,
            to,
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
  canInsertLink: boolean;
}

export const stateKey = new PluginKey('hyperlinkPlugin');

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(_, state: EditorState): HyperlinkState {
        const canInsertLink = canLinkBeCreatedInRange(
          state.selection.from,
          state.selection.to,
        )(state);
        return {
          canInsertLink,
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
        let state = pluginState;
        const action = tr.getMeta(stateKey) as LinkAction;

        if (tr.docChanged) {
          state = {
            canInsertLink: canLinkBeCreatedInRange(
              newState.selection.from,
              newState.selection.to,
            )(newState),
            isEditorFocused: state.isEditorFocused,
            activeLinkMark: mapTransactionToState(state.activeLinkMark, tr),
          };
        }

        if (action) {
          state = {
            canInsertLink: state.canInsertLink,
            isEditorFocused: mapFocusState(state.isEditorFocused, action),
            activeLinkMark: toState(state.activeLinkMark, action, newState),
          };
        }

        if (!oldState.selection.map(tr.doc, tr.mapping).eq(tr.selection)) {
          state = {
            canInsertLink: canLinkBeCreatedInRange(
              newState.selection.from,
              newState.selection.to,
            )(newState),
            isEditorFocused: state.isEditorFocused,
            activeLinkMark: toState(
              state.activeLinkMark,
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
        click: view => {
          const pluginState: HyperlinkState = stateKey.getState(view.state);
          if (!pluginState.isEditorFocused) {
            const focusType = view.hasFocus()
              ? LinkAction.EDITOR_FOCUSED
              : LinkAction.EDITOR_BLURRED;
            view.dispatch(view.state.tr.setMeta(stateKey, focusType));
          }
          return false;
        },
        focus: view => {
          const pluginState: HyperlinkState = stateKey.getState(view.state);
          if (!pluginState.isEditorFocused) {
            view.dispatch(
              view.state.tr.setMeta(stateKey, LinkAction.EDITOR_FOCUSED),
            );
          }
          return false;
        },
        blur: view => {
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
