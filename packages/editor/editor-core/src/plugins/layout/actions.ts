import { safeInsert } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import { Command } from '../../types';
import { pluginKey, LayoutState } from './pm-plugins/main';

export const insertLayoutColumns = ((state, dispatch) => {
  const { layoutSection } = state.schema.nodes;
  dispatch(safeInsert(layoutSection.createAndFill() as Node)(state.tr));
  return true;
}) as Command;

// We just change the attribute value here
// Merging the layouts is handled by the appendTransaction
export const setActiveLayoutType = (layoutType: string) =>
  ((state, dispatch) => {
    const { pos } = pluginKey.getState(state) as LayoutState;
    if (pos !== null) {
      dispatch(state.tr.setNodeMarkup(pos, undefined, { layoutType }));
      return true;
    }
    return false;
  }) as Command;

export const deleteActiveLayoutNode = ((state, dispatch) => {
  const { pos } = pluginKey.getState(state) as LayoutState;
  if (pos !== null) {
    const node = state.doc.nodeAt(pos) as Node;
    dispatch(state.tr.delete(pos, pos + node.nodeSize));
    return true;
  }
  return false;
}) as Command;
