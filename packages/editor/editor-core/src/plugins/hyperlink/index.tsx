import * as React from 'react';
import { link, WithProviders } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { createInputRulePlugin } from './pm-plugins/input-rule';
import { createKeymapPlugin } from './pm-plugins/keymap';
import { plugin, stateKey, HyperlinkState } from './pm-plugins/main';
import fakeCursorToolbarPlugin from './pm-plugins/fake-cursor-for-toolbar';
import HyperlinkToolbar from './ui';

const hyperlinkPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'link', mark: link, rank: 100 }];
  },

  pmPlugins() {
    return [
      { rank: 900, plugin: ({ dispatch }) => plugin(dispatch) },
      { rank: 905, plugin: () => fakeCursorToolbarPlugin },
      { rank: 910, plugin: ({ schema }) => createInputRulePlugin(schema) },
      {
        rank: 920,
        plugin: ({ schema, props }) => createKeymapPlugin(schema, props),
      },
    ];
  },

  contentComponent({
    appearance,
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    providerFactory,
  }) {
    if (appearance === 'message') {
      return null;
    }
    const renderToolbar = providers => (
      <WithPluginState
        plugins={{ hyperlinkState: stateKey }}
        render={({ hyperlinkState }: { hyperlinkState?: HyperlinkState }) => (
          <HyperlinkToolbar
            hyperlinkState={hyperlinkState}
            view={editorView}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            activityProvider={
              providers ? providers.activityProvider : undefined
            }
          />
        )}
      />
    );

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['activityProvider']}
        renderNode={renderToolbar}
      />
    );
  },
};

export default hyperlinkPlugin;
