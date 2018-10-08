import { EditorState, StateField } from 'prosemirror-state';
import { Command } from '../../types';

export type Reducer<S, A> = (state: S, action: A) => S;

export function pluginStateFactory<S, A, IS extends S>(
  pluginKey,
  initialState: IS,
  reducer: Reducer<S, A>,
): {
  state: StateField<S>;
  createCommand: (action: A) => Command;
  getPluginState: (editorState: EditorState) => S;
} {
  return {
    state: {
      init: () => initialState,
      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          return reducer(pluginState, meta);
        }
        return pluginState;
      },
    },
    createCommand: (action): Command => (state, dispatch) => {
      dispatch(state.tr.setMeta(pluginKey, action));
      return true;
    },
    getPluginState: editorState => pluginKey.getState(editorState),
  };
}
