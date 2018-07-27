import * as React from 'react';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import { mention, mentionQuery, WithProviders } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, mentionPluginKey } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rules';
import keymap from './pm-plugins/keymap';
import ToolbarMention from './ui/ToolbarMention';
import MentionPicker from './ui/MentionPicker';

const mentionsPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'mention', node: mention }];
  },

  marks() {
    return [{ name: 'mentionQuery', mark: mentionQuery }];
  },

  pmPlugins() {
    return [
      {
        name: 'mention',
        plugin: ({ providerFactory, portalProviderAPI }) =>
          createPlugin(portalProviderAPI, providerFactory),
      },
      {
        name: 'mentionInputRule',
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
      { name: 'mentionKeymap', plugin: ({ schema }) => keymap(schema) },
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
          pluginKey={mentionPluginKey}
          mentionProvider={providers.mentionProvider}
          contextIdentifierProvider={providers.contextIdentifierProvider}
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
        providers={[
          'mentionProvider',
          'presenceProvider',
          'contextIdentifierProvider',
        ]}
        renderNode={renderNode}
      />
    );
  },

  secondaryToolbarComponent({ editorView, disabled }) {
    return (
      <ToolbarMention
        editorView={editorView}
        pluginKey={mentionPluginKey}
        isDisabled={disabled}
        isReducedSpacing={true}
      />
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Mention',
        icon: () => <MentionIcon label="Mention" />,
        action(insert, state) {
          const mark = state.schema.mark('mentionQuery');
          const emojiText = state.schema.text('@', [mark]);
          return insert(emojiText);
        },
      },
    ],
  },
};

export default mentionsPlugin;
