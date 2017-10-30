import * as React from 'react';
import { emoji, emojiQuery } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { WithProviders } from '../../../providerFactory/withProviders';
import { createPlugin } from '../../../plugins/emojis';
import inputRulePlugin from '../../../plugins/emojis/input-rules';
import keymap from '../../../plugins/emojis/keymap';
import { inputRulePlugin as asciiInputRulePlugin } from '../../../plugins/emojis/ascii-input-rules';
import pluginKey from '../../../plugins/emojis/plugin-key';
import ToolbarEmojiPicker from '../../../ui/ToolbarEmojiPicker';
import EmojiTypeAhead from '../../../ui/EmojiTypeAhead';

const emojiPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'emoji', node: emoji, rank: 1600 }];
  },

  marks() {
    return [{ name: 'emojiQuery', mark: emojiQuery, rank: 1600 }];
  },

  pmPlugins() {
    return [
      { rank: 400, plugin: (schema, props, dispatch, providerFactory) => createPlugin(providerFactory) },
      { rank: 410, plugin: schema => inputRulePlugin(schema) },
      { rank: 420, plugin: schema => keymap(schema) },
      { rank: 430, plugin: (schema, props, dispatch, providerFactory) => asciiInputRulePlugin(schema, providerFactory) }
    ];
  },

  contentComponent(editorView, eventDispatcher, providerFactory, apperance, popupsMountPoint, popupsBoundariesElement) {
    const renderNode = (providers) =>{
      return <EmojiTypeAhead
        editorView={editorView}
        pluginKey={pluginKey}
        emojiProvider={providers.emojiProvider}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
      />;
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['emojiProvider']}
        renderNode={renderNode}
      />
    );
  },

  secondaryToolbarComponent(editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement) {
    const renderNode = (providers) => {
      // numFollowingButtons must be changed if buttons are added after ToolbarEmojiPicker to the message editor
      return <ToolbarEmojiPicker
        editorView={editorView}
        pluginKey={pluginKey}
        emojiProvider={providers.emojiProvider}
        numFollowingButtons={4}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
      />;
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['emojiProvider']}
        renderNode={renderNode}
      />
    );
  },
};

export default emojiPlugin;
