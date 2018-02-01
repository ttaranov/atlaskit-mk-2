import * as React from 'react';
import { mention, mentionQuery, WithProviders } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from '../../../plugins/mentions';
import inputRulePlugin from '../../../plugins/mentions/input-rules';
import keymap from '../../../plugins/mentions/keymap';
import pluginKey from '../../../plugins/mentions/plugin-key';
import ToolbarMention from '../../../ui/ToolbarMention';
import MentionPicker from '../../../ui/MentionPicker';

const mentionsPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'mention', node: mention, rank: 1200 }];
  },

  marks() {
    return [{ name: 'mentionQuery', mark: mentionQuery, rank: 1200 }];
  },

  pmPlugins() {
    return [
      {
        rank: 300,
        plugin: ({ providerFactory }) => createPlugin(providerFactory),
      },
      { rank: 310, plugin: ({ schema }) => inputRulePlugin(schema) },
      { rank: 320, plugin: ({ schema }) => keymap(schema) },
    ];
  },

  contentComponent({
    editorView,
    providerFactory,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  }) {
    const renderNode = providers => {
      return (
        <MentionPicker
          editorView={editorView}
          pluginKey={pluginKey}
          mentionProvider={providers.mentionProvider}
          presenceProvider={providers.presenceProvider}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsScrollableElement={popupsScrollableElement}
        />
      );
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['mentionProvider', 'presenceProvider']}
        renderNode={renderNode}
      />
    );
  },

  secondaryToolbarComponent({ editorView, disabled }) {
    return (
      <ToolbarMention
        editorView={editorView}
        pluginKey={pluginKey}
        isDisabled={disabled}
        isReducedSpacing={true}
      />
    );
  },
};

export default mentionsPlugin;
