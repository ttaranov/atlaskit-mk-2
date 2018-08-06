import { PluginKey } from 'prosemirror-state';
import { action } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';

export const stateKey = new PluginKey('inlineActionPlugin');

const inlineActionPlugin: EditorPlugin = {
  marks: () => [{ name: 'action', mark: action }],
};

export default inlineActionPlugin;
