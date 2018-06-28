import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Slice, Schema, Node } from 'prosemirror-model';
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
import { mapFragment } from '../../utils/slice';

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

  if (selectedNode) {
    extPosition = selectedNode.pos;
    extNode = selectedNode.node;
  } else {
    extPosition = parentExtNode!.pos;
    extNode = parentExtNode!.node;
  }

  const pluginState = pluginKey.getState(state);

  tr
    .setNodeMarkup(extPosition, undefined, {
      ...extNode!.attrs,
      layout,
    })
    .setMeta(pluginKey, { ...pluginState, layout });

  dispatch(tr);

  return true;
};

export const editExtension = (macroProvider: MacroProvider | null) => (
  view: EditorView,
): boolean => {
  const { state, dispatch } = view;
  // insert macro if there's macroProvider available
  const pluginState = pluginKey.getState(state);
  if (macroProvider) {
    const node = getExtensionNode(state);
    if (node) {
      const { bodiedExtension } = state.schema.nodes;
      let tr = state.tr.setMeta(pluginKey, { ...pluginState, element: null });
      if (hasParentNodeOfType(bodiedExtension)(tr.selection)) {
        dispatch(selectParentNodeOfType(bodiedExtension)(tr));
      }
      insertMacroFromMacroBrowser(macroProvider, node.node)(view);
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
  const pluginState = pluginKey.getState(state);
  let tr = state.tr.setMeta(pluginKey, { ...pluginState, element: null });

  if (selection instanceof NodeSelection) {
    tr = removeSelectedNode(tr);
  } else {
    tr = removeParentNodeOfType(schema.nodes.bodiedExtension)(tr);
  }
  dispatch(tr);

  return true;
};

/**
 * Lift content out of "open" top-level bodiedExtensions.
 * Will not work if bodiedExtensions are nested, or when bodiedExtensions are not in the top level
 */
export const transformSliceToRemoveOpenBodiedExtension = (
  slice: Slice,
  schema: Schema,
) => {
  const { bodiedExtension } = schema.nodes;

  const fragment = mapFragment(slice.content, (node, parent, index) => {
    if (node.type === bodiedExtension && !parent) {
      const currentNodeIsAtStartAndIsOpen = slice.openStart && index === 0;
      const currentNodeIsAtEndAndIsOpen =
        slice.openEnd && index + 1 === slice.content.childCount;

      if (currentNodeIsAtStartAndIsOpen || currentNodeIsAtEndAndIsOpen) {
        return (node.content as any).content as Node[];
      }
    }
    return node;
  });

  // If the first/last child has changed - then we know we've removed a bodied extension & to decrement the open depth
  return new Slice(
    fragment,
    fragment.firstChild &&
    fragment.firstChild!.type !== slice.content.firstChild!.type
      ? slice.openStart - 1
      : slice.openStart,
    fragment.lastChild &&
    fragment.lastChild!.type !== slice.content.lastChild!.type
      ? slice.openEnd - 1
      : slice.openEnd,
  );
};
