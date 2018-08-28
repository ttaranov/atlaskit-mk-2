import { TextSelection } from 'prosemirror-state';
import { pluginKey, ACTIONS } from '../pm-plugins/main';

export const removeColor = () => (state, dispatch) => {
  const { textColor } = state.schema.marks;
  const { from, to, $cursor } = state.selection as TextSelection;

  let tr = state.tr;

  if ($cursor) {
    tr = state.tr.removeStoredMark(textColor);
  } else {
    tr = state.tr.removeMark(from, to, textColor);
  }

  dispatch(tr.setMeta(pluginKey, { action: ACTIONS.RESET_COLOR }));
};
