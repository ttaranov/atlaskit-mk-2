import * as React from 'react';
import { link } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { WithProviders } from '../../../providerFactory/withProviders';
import { createPlugin } from '../../../plugins/hyperlink';
import { createInputRulePlugin } from '../../../plugins/hyperlink/input-rule';
import { createKeymapPlugin } from '../../../plugins/hyperlink/keymap';
import pluginKey from '../../../plugins/hyperlink/plugin-key';
import HyperlinkEdit from '../../../ui/HyperlinkEdit';
import ToolbarHyperlink from '../../../ui/ToolbarHyperlink';

const hyperlinkPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'link', mark: link, rank: 100 }];
  },

  pmPlugins() {
    return [
      { rank: 900, plugin: createPlugin },
      { rank: 910, plugin: createInputRulePlugin },
      { rank: 920, plugin: createKeymapPlugin },
    ];
  },

  primaryToolbarComponent(editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement, disabled) {
    const pluginState = pluginKey.getState(editorView.state);
    return <ToolbarHyperlink disabled={disabled} editorView={editorView} pluginState={pluginState} />;
  },

  contentComponent(editorView, dispatch, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement) {
    if (appearance === 'message') {
      return null;
    }

    const renderNode = (providers) => {
      const pluginState = pluginKey.getState(editorView.state);
      return <HyperlinkEdit editorView={editorView} pluginState={pluginState} activityProvider={providers.activityProvider} popupsMountPoint={popupsMountPoint} popupsBoundariesElement={popupsBoundariesElement} />;
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['activityProvider']}
        renderNode={renderNode}
      />
    );
  }
};

export default hyperlinkPlugin;
