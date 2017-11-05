import * as React from 'react';
import { EditorPlugin } from '../../types';
import {
  createPlugin,
  CollabEditProvider,
  pluginKey,
} from './plugin';
import Avatars from './ui/avatars';

export {
  CollabEditProvider,
  pluginKey,
};

const collabEditPlugin: EditorPlugin = {

  pmPlugins() {
    return [
      { rank: 1000, plugin: (schema, props, dispatch, providerFactory) => createPlugin(dispatch, providerFactory) }
    ];
  },

  primaryToolbarComponent(editorView, eventDispatcher) {
    return <Avatars editorView={editorView} eventDispatcher={eventDispatcher} />;
  },

};

export default collabEditPlugin;
