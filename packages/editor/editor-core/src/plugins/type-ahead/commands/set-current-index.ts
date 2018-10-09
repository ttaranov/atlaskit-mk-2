import { Command } from '../../../types';
import { pluginKey, ACTIONS } from '../pm-plugins/main';

export const setCurrentIndex = (currentIndex: number): Command => (
  state,
  dispatch,
) => {
  dispatch &&
    dispatch(
      state.tr.setMeta(pluginKey, {
        action: ACTIONS.SET_CURRENT_INDEX,
        params: { currentIndex },
      }),
    );
  return true;
};
