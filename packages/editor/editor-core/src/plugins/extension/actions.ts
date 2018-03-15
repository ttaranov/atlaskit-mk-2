import {
  EditorState,
  Transaction,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import { Slice, Fragment, Node as PmNode } from 'prosemirror-model';
import {
  hasParentNodeOfType,
  removeSelectedNode,
  removeParentNodeOfType,
} from 'prosemirror-utils';
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
  const { schema, selection } = state;
  let tr = state.tr.setMeta(pluginKey, { element: null });

  if (selection instanceof NodeSelection) {
    tr = removeSelectedNode(tr);
  } else {
    tr = removeParentNodeOfType(schema.nodes.bodiedExtension)(tr);
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

export const removeBodiedExtensionsOnPaste = (slice: Slice) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const nodes: PmNode[] = [];
  const { tr, selection, schema: { nodes: { bodiedExtension } } } = state;

  if (hasParentNodeOfType(bodiedExtension)(selection)) {
    let modified = false;

    slice.content.forEach(child => {
      if (child.type === bodiedExtension) {
        modified = true;
      } else {
        nodes.push(child);
      }
    });

    if (modified) {
      const content = new Slice(
        Fragment.from(nodes),
        slice.openStart,
        slice.openEnd,
      );
      dispatch(tr.replaceSelection(content));
      return true;
    }
  }

  return false;
};
