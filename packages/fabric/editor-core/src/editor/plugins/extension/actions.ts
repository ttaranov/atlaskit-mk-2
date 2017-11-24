import {
  EditorState,
  Transaction,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import { pluginKey } from './plugin';
import { MacroProvider, insertMacroFromMacroBrowser } from '../macro';
import {
  getExtensionNode,
  getExtensionRange,
  getExtensionStartPos,
  isCursorInsideNode,
  findPrevCellPos,
} from './utils';

export const setExtensionElement = (element: HTMLElement | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  let tr = state.tr.setMeta(pluginKey, { element });
  if (!element) {
    tr = tr.setSelection(
      TextSelection.create(state.doc, state.selection.$from.pos),
    );
  }
  dispatch(tr);
  return true;
};

export const selectExtension = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (state.selection instanceof NodeSelection) {
    return false;
  }

  if (isCursorInsideNode(state, state.schema.nodes.extension)) {
    const range = getExtensionRange(state);
    dispatch(
      state.tr.setSelection(
        NodeSelection.create(state.doc, range.$from.pos - 1),
      ),
    );
    return true;
  }

  // if block extension node without body (contentEditable=false) is clicked,
  // PM attemps to set cursor after the extension node if extension is not the last node in the doc
  // otherwise it sets cursor before the node.
  // The code below finds the extension node and creates NodeSelection
  const { $cursor } = state.selection as TextSelection;
  if ($cursor) {
    const { extension, inlineExtension } = state.schema.nodes;
    for (let i = $cursor.depth - 1; i >= 0; i--) {
      // if cursor is after the node
      if ($cursor.index(i) > 0) {
        const nodeBefore = $cursor.node(i).child($cursor.index(i) - 1);
        if (
          nodeBefore.type === extension ||
          nodeBefore.type === inlineExtension
        ) {
          const cut = $cursor.before(i + 1);
          dispatch(
            state.tr.setSelection(
              NodeSelection.create(state.doc, cut - nodeBefore.nodeSize),
            ),
          );
          return true;
        }
      }
      if ($cursor.node(i).childCount >= $cursor.index(i) + 2) {
        // if cursor is before the node
        const nodeAfter = $cursor.node(i).child($cursor.index(i) + 1);
        if (
          nodeAfter.type === extension ||
          nodeAfter.type === inlineExtension
        ) {
          const cut = $cursor.after(i + 1);
          dispatch(state.tr.setSelection(NodeSelection.create(state.doc, cut)));
          return true;
        }
      }
    }

    if (isCursorInsideNode(state, state.schema.nodes.table)) {
      // const prevCellPos = findPrevCellPos(state);
      // const $cell = state.doc.resolve(prevCellPos!);
      // debugger;
    }
    return false;
  }

  // if there's no cursor after selection, e.g. the only child of the doc
  dispatch(
    state.tr.setSelection(
      NodeSelection.create(state.doc, getExtensionStartPos(state)),
    ),
  );
  return true;
};

export const editExtension = (macroProvider: MacroProvider | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  // insert macro if there's macroProvider available
  if (macroProvider) {
    const node = getExtensionNode(state);
    if (node) {
      insertMacroFromMacroBrowser(macroProvider, node)(state, dispatch);
      dispatch(state.tr.setMeta(pluginKey, { element: null }));
      return true;
    }
  }

  return false;
};

export const removeExtension = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tr, selection } = state;
  let from;
  let to;

  if (selection instanceof NodeSelection) {
    from = selection.$from.pos;
    to = selection.$to.pos;
  } else {
    const range = getExtensionRange(state);
    from = range.start - 1;
    to = range.end + 1;
  }

  dispatch(tr.delete(from, to).setMeta(pluginKey, { element: null }));
  return true;
};
