import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { Dispatch } from '../../../event-dispatcher';
import { resetHoverSelection } from '../actions';

export const pluginKey = new PluginKey('tableHoverSelectionPlugin');

export type HoverSelectionState = {
  decorationSet: DecorationSet;
  isTableHovered: boolean;
  isTableInDanger: boolean;
  dangerColumns: number[];
  dangerRows: number[];
};

const defaultState = {
  decorationSet: DecorationSet.empty,
  isTableHovered: false,
  isTableInDanger: false,
  dangerColumns: [],
  dangerRows: [],
};

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init: () => ({ ...defaultState }),

      apply(tr, pluginState: HoverSelectionState): HoverSelectionState {
        const meta = tr.getMeta(pluginKey);

        // reset the selection whenever document is updated
        if (tr.docChanged) {
          const nextPluginState = { ...defaultState };
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        if (meta) {
          const nextPluginState = { ...pluginState, ...meta };
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      decorations: state => pluginKey.getState(state).decorationSet,

      handleClick: ({ state, dispatch }) => {
        const { decorationSet } = pluginKey.getState(state);
        if (decorationSet !== DecorationSet.empty) {
          resetHoverSelection(state, dispatch);
        }
        return false;
      },
    },
  });

export default createPlugin;
