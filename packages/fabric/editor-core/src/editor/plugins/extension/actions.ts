import {
  EditorState,
  Transaction,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import { pluginKey } from './plugin';
import { MacroProvider, insertMacroFromMacroBrowser } from '../macro';
import { getExtensionNode, getExtensionRange } from './utils';

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

export const editExtension = (macroProvider: MacroProvider | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  // insert macro if there's macroProvider available
  if (macroProvider) {
    const node = getExtensionNode(state);
    if (node) {
      let tr = state.tr.setMeta(pluginKey, { element: null });

      if (state.selection instanceof NodeSelection === false) {
        const range = getExtensionRange(state);
        tr = tr.setSelection(
          NodeSelection.create(state.doc, range.$from.pos - 1),
        );
      }

      insertMacroFromMacroBrowser(macroProvider, node)(state, dispatch, tr);
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

export const selectExtension = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (state.selection instanceof NodeSelection) {
    return false;
  }

  // cursor is inside extension body
  const node = getExtensionNode(state);
  if (node && !node.isAtom) {
    const range = getExtensionRange(state);
    dispatch(
      state.tr.setSelection(
        NodeSelection.create(state.doc, range.$from.pos - 1),
      ),
    );
    return true;
  }

  return false;
};
