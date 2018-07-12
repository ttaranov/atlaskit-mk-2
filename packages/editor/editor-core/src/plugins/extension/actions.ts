import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Slice, Fragment, Schema } from 'prosemirror-model';
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
import { hasOpenEnd } from '../../utils';

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

export const transformSliceToRemoveOpenBodiedExtension = (
  slice: Slice,
  schema: Schema,
) => {
  const { bodiedExtension } = schema.nodes;
  const wrapper = slice.content.firstChild;

  if (
    slice.content.childCount !== 1 ||
    wrapper!.type !== bodiedExtension ||
    !hasOpenEnd(slice)
  ) {
    return slice;
  }

  return new Slice(
    Fragment.from(wrapper!.content),
    Math.max(0, slice.openStart - 1),
    Math.max(0, slice.openEnd - 1),
  );
};
