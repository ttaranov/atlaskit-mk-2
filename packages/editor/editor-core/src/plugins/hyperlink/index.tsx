import * as React from 'react';
import { link, WithProviders } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { createInputRulePlugin } from './pm-plugins/input-rule';
import { createKeymapPlugin } from './pm-plugins/keymap';
import { plugin, stateKey, HyperlinkState } from './pm-plugins/main';
import fakeCursorToolbarPlugin from './pm-plugins/fake-cursor-for-toolbar';
import syncTextAndUrlPlugin from './pm-plugins/sync-text-and-url';
import HyperlinkToolbar from './ui';

const hyperlinkPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'link', mark: link }];
  },

  pmPlugins() {
    return [
      {
        name: 'syncUrlText',
        plugin: ({ props: { appearance } }) =>
          appearance === 'message' ? syncTextAndUrlPlugin : undefined,
      },
      { name: 'hyperlink', plugin: ({ dispatch }) => plugin(dispatch) },
      {
        name: 'fakeCursorToolbarPlugin',
        plugin: () => fakeCursorToolbarPlugin,
      },
      {
        name: 'hyperlinkInputRule',
        plugin: ({ schema }) => createInputRulePlugin(schema),
      },
      {
        name: 'hyperlinkKeymap',
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
