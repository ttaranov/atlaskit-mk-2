import { PluginKey, NodeSelection } from 'prosemirror-state';
import { inlineCard, blockCard } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { FloatingToolbarConfig } from '../floating-toolbar/types';
import { buildToolbar } from './toolbar';

export { CardProvider, CardOptions } from './types';

export const stateKey = new PluginKey('cardPlugin');

const cardPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'inlineCard', node: inlineCard },
      { name: 'blockCard', node: blockCard },
    ];
  },

  pmPlugins() {
    return [{ name: 'card', plugin: createPlugin }];
  },

  pluginsOptions: {
    floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
      if (state.selection instanceof NodeSelection) {
        return buildToolbar(state, intl, state.selection.from);
      }
    },
  },
};

export default cardPlugin;
