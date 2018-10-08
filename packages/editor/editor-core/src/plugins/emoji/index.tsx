import * as React from 'react';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import { emoji, WithProviders } from '@atlaskit/editor-common';
import {
  defaultListLimit,
  EmojiTypeAheadItem,
  SearchSort,
  SearchOptions,
} from '@atlaskit/emoji';

import { analyticsService } from '../../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';
import { EditorPlugin } from '../../types';

import { createPlugin, pluginKey, getPluginState } from './pm-plugins/main';
import { inputRulePlugin as asciiInputRulePlugin } from './pm-plugins/ascii-input-rules';
import ToolbarEmojiPicker from './ui/ToolbarEmojiPicker';

const emojiPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'emoji', node: emoji }];
  },

  pmPlugins() {
    return [
      {
        name: 'emoji',
        plugin: ({ providerFactory, portalProviderAPI }) =>
          createPlugin(portalProviderAPI, providerFactory),
      },
      {
        name: 'emojiAsciiInputRule',
        plugin: ({ providerFactory }) => asciiInputRulePlugin(providerFactory),
      },
    ];
  },

  pluginsOptions: {
    typeAhead: {
      trigger: ':',
      getItems(query, state, intl, { prevActive, queryChanged }) {
        if (!prevActive && queryChanged) {
          analyticsService.trackEvent(
            'atlassian.fabric.emoji.picker.trigger.shortcut',
          );
        }

        const pluginState = getPluginState(state);
        const emojis =
          !prevActive && queryChanged ? [] : pluginState.emojis || [];

        if (queryChanged && pluginState.provider) {
          const options: SearchOptions = {
            limit: defaultListLimit,
            skinTone: pluginState.provider.getSelectedTone(),
            sort: query ? SearchSort.Default : SearchSort.UsageFrequency,
          };
          pluginState.provider.filter(query || '', options);
        }

        return emojis.map(emoji => ({
          key: emoji.id || `${emoji.shortName}-${emoji.type}`,
          title: emoji.shortName,
          keywords: [emoji.fallback || ''],
          render: ({ isSelected, onClick, onMouseMove }) => (
            <EmojiTypeAheadItem
              emoji={emoji}
              selected={isSelected}
              onMouseMove={onMouseMove}
              onSelection={onClick}
            />
          ),
          emoji,
        }));
      },
      selectItem(state, item, insert) {
        const { id = '', type = '', fallback, shortName } = item.emoji;
        const text = fallback || shortName;

        analyticsService.trackEvent('atlassian.fabric.emoji.picker.insert', {
          emojiId: id,
          type,
          // queryLength
        });

        return insert(
          state.schema.nodes.emoji.createChecked({
            shortName,
            id,
            text,
          }),
        );
      },
    },
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.emoji),
        priority: 500,
        icon: () => <EmojiIcon label={formatMessage(messages.emoji)} />,
        action(insert, state) {
          const mark = state.schema.mark('typeAheadQuery', { trigger: ':' });
          const emojiText = state.schema.text(':', [mark]);
          return insert(emojiText);
        },
      },
    ],
  },
};

export default emojiPlugin;
