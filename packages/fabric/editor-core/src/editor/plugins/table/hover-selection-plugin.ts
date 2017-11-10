import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export const pluginKey = new PluginKey('tableHoverSelectionPlugin');

const plugin = new Plugin({
  state: {
    init: () => DecorationSet.empty,

    apply(tr, set): DecorationSet {
      set = set.map(tr.mapping, tr.doc);

      const meta = tr.getMeta(pluginKey);
      if (meta && meta.set) {
        return meta.set;
      }

      return set;
    }
  },
  key: pluginKey,
  props: {
    decorations: state => pluginKey.getState(state)
  }
});

export default plugin;
