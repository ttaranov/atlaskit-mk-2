import {
  EditorState,
  Transaction,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Slice, Fragment, Node as PmNode } from 'prosemirror-model';
import {
  hasParentNodeOfType,
  removeSelectedNode,
  removeParentNodeOfType,
  selectParentNodeOfType,
} from 'prosemirror-utils';
import { pluginKey } from './plugin';
import { MacroProvider, insertMacroFromMacroBrowser } from '../macro';
import { getExtensionNode } from './utils';

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
  view: EditorView,
): boolean => {
  const { state, dispatch } = view;
  // insert macro if there's macroProvider available
  if (macroProvider) {
    const node = getExtensionNode(state);
    if (node) {
      const { bodiedExtension } = state.schema.nodes;
      let tr = state.tr.setMeta(pluginKey, { element: null });
      dispatch(selectParentNodeOfType(bodiedExtension)(tr));
      insertMacroFromMacroBrowser(macroProvider, node)(view);
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
