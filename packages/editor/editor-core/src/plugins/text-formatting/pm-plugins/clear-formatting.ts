import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { checkFormattingIsPresent } from '../utils';

export type StateChangeHandler = (state: ClearFormattingState) => any;

export interface ClearFormattingState {
  formattingIsPresent?: boolean;
}

export const pluginKey = new PluginKey('clearFormattingPlugin');

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(config, state: EditorState) {
        return { formattingIsPresent: checkFormattingIsPresent(state) };
      },
      apply(tr, pluginState: ClearFormattingState, oldState, newState) {
        const formattingIsPresent = checkFormattingIsPresent(newState);
        if (formattingIsPresent !== pluginState.formattingIsPresent) {
          dispatch(pluginKey, { formattingIsPresent });
          return { formattingIsPresent };
        }
        return pluginState;
      },
    },
    key: pluginKey,
  });
