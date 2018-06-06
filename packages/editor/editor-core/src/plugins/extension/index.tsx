import * as React from 'react';
import {
  inlineExtension,
  extension,
  bodiedExtension,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { MacroState, pluginKey as macroPluginKey } from '../macro';
import createPlugin, { pluginKey, ExtensionState } from './plugin';
import {
  editExtension,
  removeExtension,
  updateExtensionLayout,
} from './actions';
import ExtensionEditPanel from './ui/ExtensionEditPanel';
import WithPluginState from '../../ui/WithPluginState';
import { hasParentNodeOfType } from 'prosemirror-utils';

const isLayoutSupported = (state, selectedExtNode) => {
  const {
    schema: { nodes: { bodiedExtension, extension, layoutSection, table } },
    selection,
  } = state;

  if (!selectedExtNode) {
    return false;
  }

  return !!(
    (selectedExtNode.node.type === bodiedExtension ||
      (selectedExtNode.node.type === extension &&
        !hasParentNodeOfType([bodiedExtension, table])(selection))) &&
    !hasParentNodeOfType([layoutSection])(selection)
  );
};

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
        plugin: ({
          schema,
          props,
          dispatch,
          providerFactory,
          portalProviderAPI,
        }) =>
          createPlugin(
            dispatch,
            providerFactory,
            props.extensionHandlers || {},
            portalProviderAPI,
            props.allowExtension,
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
            showLayoutOptions={isLayoutSupported(
              editorView.state,
              extensionState.node,
            )}
            layout={extensionState.layout}
            onLayoutChange={layout =>
              updateExtensionLayout(layout)(editorView.state, dispatch)
            }
          />
        )}
      />
    );
  },
};

export default extensionPlugin;
