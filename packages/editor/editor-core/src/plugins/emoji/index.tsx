import * as React from 'react';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import { emoji, emojiQuery, WithProviders } from '@atlaskit/editor-common';

import { EditorPlugin } from '../../types';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';
import { createPlugin, emojiPluginKey } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rules';
import keymap from './pm-plugins/keymap';
import { inputRulePlugin as asciiInputRulePlugin } from './pm-plugins/ascii-input-rules';
import ToolbarEmojiPicker from './ui/ToolbarEmojiPicker';
import EmojiTypeAhead from './ui/EmojiTypeAhead';

const emojiPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'emoji', node: emoji }];
  },

  marks() {
    return [{ name: 'emojiQuery', mark: emojiQuery }];
  },

  pmPlugins() {
    return [
      {
        name: 'emoji',
        plugin: ({ providerFactory, portalProviderAPI }) =>
          createPlugin(portalProviderAPI, providerFactory),
      },
      {
        name: 'emojiInputRule',
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
      { name: 'emojiKeymap', plugin: ({ schema }) => keymap(schema) },
      {
        name: 'emojiAsciiInputRule',
        plugin: ({ schema, providerFactory }) =>
          asciiInputRulePlugin(schema, providerFactory),
      },
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
        <EmojiTypeAhead
          editorView={editorView}
          pluginKey={emojiPluginKey}
          emojiProvider={providers.emojiProvider}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
        />
      );
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['emojiProvider']}
        renderNode={renderNode}
      />
    );
  },

  secondaryToolbarComponent({
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    disabled,
  }) {
    const renderNode = providers => {
      // numFollowingButtons must be changed if buttons are added after ToolbarEmojiPicker to the message editor
      return (
        <ToolbarEmojiPicker
          editorView={editorView}
          pluginKey={emojiPluginKey}
          emojiProvider={providers.emojiProvider}
          numFollowingButtons={4}
          isReducedSpacing={true}
          isDisabled={disabled}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsScrollableElement={popupsScrollableElement}
        />
      );
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['emojiProvider']}
        renderNode={renderNode}
      />
    );
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.emoji),
        priority: 500,
        icon: () => <EmojiIcon label={formatMessage(messages.emoji)} />,
        action(insert, state) {
          const mark = state.schema.mark('emojiQuery');
          const emojiText = state.schema.text(':', [mark]);
          return insert(emojiText);
        },
      },
    ],
  },
};

export default emojiPlugin;
