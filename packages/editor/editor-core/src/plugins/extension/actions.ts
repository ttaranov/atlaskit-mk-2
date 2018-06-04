import {
  EditorState,
  Transaction,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Slice, Fragment, Node as PmNode } from 'prosemirror-model';
import {
  hasParentNodeOfType,
  removeSelectedNode,
  removeParentNodeOfType,
  selectParentNodeOfType,
  findSelectedNodeOfType,
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

export const updateExtensionLayout = layout => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  const { selection, schema, tr } = state;
  const { bodiedExtension, extension, inlineExtension } = schema.nodes;
  const parentExtNode = findParentNodeOfType([bodiedExtension])(selection);

  let extPosition;
  let extNode;

  const selectedNode = findSelectedNodeOfType([
    bodiedExtension,
    inlineExtension,
    extension,
  ])(selection);

  if (!parentExtNode && !selectedNode) {
    return;
  }
  /** set the position and node to update markup */
  if (selectedNode) {
    extPosition = selectedNode.pos;
    extNode = selectedNode.node;
  } else {
    extPosition = parentExtNode!.pos - 1;
    extNode = parentExtNode!.node;
  }

  /** Intentionally setting `undefined` here to preserve the type of node */
  dispatch(
    tr.setNodeMarkup(extPosition, undefined, {
      ...extNode!.attrs,
      layout,
    }),
  );

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
      if (hasParentNodeOfType(bodiedExtension)(tr.selection)) {
        dispatch(selectParentNodeOfType(bodiedExtension)(tr));
      }
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

export const removeBodiedExtensionWrapper = (
  state: EditorState,
  slice: Slice,
) => {
  const { schema: { nodes: { bodiedExtension } } } = state;
  const { content: { firstChild: wrapper } } = slice;

  if (wrapper!.type !== bodiedExtension || slice.content.childCount > 1) {
    return slice;
  }

  return new Slice(
    Fragment.from(wrapper!.content),
    Math.max(0, slice.openStart - 1),
    Math.max(0, slice.openEnd - 1),
  );
};

export const removeBodiedExtensionsIfSelectionIsInBodiedExtension = (
  slice: Slice,
  state: EditorState,
) => {
  const { selection, schema: { nodes: { bodiedExtension } } } = state;

  if (hasParentNodeOfType(bodiedExtension)(selection)) {
    const nodes: PmNode[] = [];
    slice.content.forEach(child => {
      if (child.type !== bodiedExtension) {
        nodes.push(child);
      }
    });

    return new Slice(Fragment.from(nodes), slice.openStart, slice.openEnd);
  }

  return slice;
};
