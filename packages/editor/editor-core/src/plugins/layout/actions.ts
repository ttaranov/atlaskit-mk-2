import { Command } from '../../types';
import { safeInsert } from 'prosemirror-utils';

export const insertLayoutColumns = ((state, dispatch) => {
  const { layoutSection } = state.schema.nodes;
  dispatch(safeInsert(layoutSection.createAndFill()!)(state.tr));
  return true;
}) as Command;
