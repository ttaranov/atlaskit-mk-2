import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export const pluginKey = new PluginKey('tableHoverSelectionPlugin');

export type State = {
  decorationSet: DecorationSet;
  isTableHovered: boolean;
};

const plugin = new Plugin({
  state: {
    init: () => ({ decorationSet: DecorationSet.empty, isTableHovered: false }),

    apply(tr, state: State): State {
      const meta = tr.getMeta(pluginKey);
      if (meta) {
        return { ...state, ...meta };
      }

      return state;
    },
  },
  key: pluginKey,
  props: {
    decorations: state => pluginKey.getState(state).decorationSet,
  },
});

export default plugin;
