import { Command } from '../../types';
import { safeInsert } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';

export const insertLayoutColumns = ((state, dispatch) => {
  const { layoutSection } = state.schema.nodes;
  dispatch(safeInsert(layoutSection.createAndFill() as Node)(state.tr));
  return true;
}) as Command;
