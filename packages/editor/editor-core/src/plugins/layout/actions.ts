import { Command } from '../../types';

export const insertLayoutColumns = ((state, dispatch) => {
  dispatch(
    state.tr.replaceSelectionWith(
      state.schema.nodes.layoutSection.createAndFill()!,
    ),
  );
  return true;
}) as Command;
