import { PluginKey } from 'prosemirror-state';
import { inlineCard, blockCard } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';

export { CardProvider, CardOptions } from './types';

export const stateKey = new PluginKey('cardPlugin');

const cardPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'inlineCard', node: inlineCard },
      { name: 'blockCard', node: blockCard },
    ];
  },
};

export default cardPlugin;
