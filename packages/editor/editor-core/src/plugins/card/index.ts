import { PluginKey } from 'prosemirror-state';
import { inlineCard } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

export { CardProvider, CardOptions } from './types';

export const stateKey = new PluginKey('cardPlugin');

const cardPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'inlineCard', node: inlineCard }];
  },

  pmPlugins() {
    return [{ name: 'card', plugin: createPlugin }];
  },
};

export default cardPlugin;
