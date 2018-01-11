import * as React from 'react';
import { link, WithProviders } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from '../../../plugins/hyperlink';
import { createInputRulePlugin } from '../../../plugins/hyperlink/input-rule';
import { createKeymapPlugin } from '../../../plugins/hyperlink/keymap';
import pluginKey from '../../../plugins/hyperlink/plugin-key';
import HyperlinkEdit from '../../../ui/HyperlinkEdit';

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
  }) {
    if (appearance === 'message') {
      return null;
    }

    const renderNode = providers => {
      const pluginState = pluginKey.getState(editorView.state);
      return (
        <HyperlinkEdit
          editorView={editorView}
          pluginState={pluginState}
          activityProvider={providers.activityProvider}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
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
