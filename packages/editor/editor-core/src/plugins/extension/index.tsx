import * as React from 'react';
import {
  inlineExtension,
  extension,
  bodiedExtension,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { MacroState, pluginKey as macroPluginKey } from '../macro';
import createPlugin, { pluginKey, ExtensionState } from './plugin';
import { editExtension, removeExtension } from './actions';
import ExtensionEditPanel from './ui/ExtensionEditPanel';
import WithPluginState from '../../ui/WithPluginState';

const extensionPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 2300, name: 'extension', node: extension },
      { rank: 2310, name: 'bodiedExtension', node: bodiedExtension },
      { rank: 2320, name: 'inlineExtension', node: inlineExtension },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 2330,
        plugin: ({ schema, props, dispatch, providerFactory }) =>
          createPlugin(
            dispatch,
            providerFactory,
            props.extensionHandlers || {},
          ),
      },
    ];
  },

  contentComponent({ editorView }) {
    const { dispatch } = editorView;
    return (
      <WithPluginState
        plugins={{
          macroState: macroPluginKey,
          extensionState: pluginKey,
        }}
        render={({
          macroState = {} as MacroState,
          extensionState = {} as ExtensionState,
        }) => (
          <ExtensionEditPanel
            element={extensionState.element}
            onEdit={() => editExtension(macroState.macroProvider)(editorView)}
            onRemove={() => removeExtension(editorView.state, dispatch)}
            stickToolbarToBottom={extensionState.stickToolbarToBottom}
          />
        )}
      />
    );
  },
};

export default extensionPlugin;
