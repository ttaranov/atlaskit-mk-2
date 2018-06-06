import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { QuickInsertItem } from './types';
import { find } from './search';

const getItemSearchString = (item: QuickInsertItem) =>
  `${item.title} ${(item.keywords || []).join(' ')}`;

const quickInsertPlugin: EditorPlugin = {
  name: 'quickInsert',

  pmPlugins(quickInsert: Array<Array<QuickInsertItem>>) {
    return [
      {
        rank: 500, // It's important that this plugin is above TypeAheadPlugin
        plugin: () => quickInsertPluginFactory(quickInsert),
      },
    ];
  },

  pluginsOptions: {
    typeAhead: {
      trigger: '/',
      getItems: (query, state) => {
        const quickInsertItems = pluginKey.getState(state);
        return Promise.resolve(
          find(query, quickInsertItems, getItemSearchString),
        );
      },
      selectItem: (state, item, insert) =>
        (item as QuickInsertItem).action(insert, state),
    },
  },
};

export default quickInsertPlugin;

/**
 *
 * ProseMirror Plugin
 *
 */

export const pluginKey = new PluginKey('quickInsertPluginKey');

function quickInsertPluginFactory(
  quickInsertItems: Array<Array<QuickInsertItem>>,
) {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return (quickInsertItems || []).reduce(
          (acc, item) => acc.concat(...item),
          [],
        );
      },

      apply(tr, pluginState) {
        return pluginState;
      },
    },
  });
}
