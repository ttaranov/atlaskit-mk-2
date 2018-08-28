import { TextSelection } from 'prosemirror-state';
import { pluginKey, ACTIONS } from '../pm-plugins/main';
import { getDisabledState } from '../utils/disabled';

export const toggleColor = color => (state, dispatch) => {
  const { textColor } = state.schema.marks;

  let tr = state.tr;

  const disabledState = getDisabledState(state);
  if (disabledState) {
    dispatch(tr.setMeta(pluginKey, { action: ACTIONS.DISABLE }));
    return false;
  }

  const { ranges, $cursor } = state.selection as TextSelection;

  if ($cursor) {
    const mark = textColor.create({ color });
    tr = tr.addStoredMark(mark);

    dispatch(tr.setMeta(pluginKey, { action: ACTIONS.SET_COLOR, color }));
    return true;
  }

  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    tr = tr.addMark($from.pos, $to.pos, textColor.create({ color }));
  }

  tr = tr.scrollIntoView();

  dispatch(tr.setMeta(pluginKey, { action: ACTIONS.SET_COLOR, color }));
  return true;
};
