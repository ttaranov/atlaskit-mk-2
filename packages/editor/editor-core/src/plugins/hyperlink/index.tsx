import * as React from 'react';
import { link, WithProviders } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, hyperlinkPluginKey } from './pm-plugins/main';
import { createInputRulePlugin } from './pm-plugins/input-rule';
import { createKeymapPlugin } from './pm-plugins/keymap';
import HyperlinkEdit from './ui/HyperlinkEdit';

export { hyperlinkPluginKey };

const hyperlinkPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'link', mark: link, rank: 100 }];
  },

  pmPlugins() {
    return [
      { rank: 900, plugin: ({ schema, props }) => createPlugin(schema, props) },
      { rank: 910, plugin: ({ schema }) => createInputRulePlugin(schema) },
      {
        rank: 920,
        plugin: ({ schema, props }) => createKeymapPlugin(schema, props),
      },
    ];
  },

  contentComponent({
    editorView,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  }) {
    if (appearance === 'message') {
      return null;
    }

    const renderNode = providers => {
      const pluginState = hyperlinkPluginKey.getState(editorView.state);
      return (
        <HyperlinkEdit
          editorView={editorView}
          pluginState={pluginState}
          activityProvider={providers.activityProvider}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsScrollableElement={popupsScrollableElement}
        />
      );
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['activityProvider']}
        renderNode={renderNode}
      />
    );
  },
};

export default hyperlinkPlugin;
