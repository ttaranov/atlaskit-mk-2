import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export const pluginKey = new PluginKey('tableHoverSelectionPlugin');

export type State = {
  decorationSet: DecorationSet;
  isTableHovered: boolean;
  isTableInDanger: boolean;
};

const plugin = new Plugin({
  state: {
    init: () => ({
      decorationSet: DecorationSet.empty,
      isTableHovered: false,
      isTableInDanger: false,
    }),

    apply(tr, state: State): State {
      const meta = tr.getMeta(pluginKey);

      // @see: https://product-fabric.atlassian.net/browse/ED-3796
      if (tr.docChanged) {
        return { ...state, decorationSet: DecorationSet.empty };
      }

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
