import * as React from 'react';
import { inlineExtension, extension } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import createPlugin, { pluginKey, ExtensionState } from './plugin';
import { editExtension, removeExtension } from './actions';
import { MacroState, pluginKey as macroPluginKey } from '../macro';
import ExtensionEditPanel from '../../../ui/ExtensionEditPanel';
import WithPluginState from '../../ui/WithPluginState';

const extensionPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 2300, name: 'extension', node: extension },
      { rank: 2310, name: 'inlineExtension', node: inlineExtension },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 2320,
        plugin: ({ schema, props, dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },

  contentComponent(editorView, eventDispatcher, providerFactory, appearance) {
    const { dispatch } = editorView;
    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          macroState: macroPluginKey,
          extensionState: pluginKey,
        }}
        // tslint:disable-next-line:jsx-no-lambda
        render={({
          macroState = {} as MacroState,
          extensionState = {} as ExtensionState,
        }) => (
          <ExtensionEditPanel
            element={extensionState.element}
            onEdit={() =>
              editExtension(macroState.macroProvider)(
                editorView.state,
                dispatch,
              )
            }
            onRemove={() => removeExtension(editorView.state, dispatch)}
          />
        )}
      />
    );
  },
};

export default extensionPlugin;
