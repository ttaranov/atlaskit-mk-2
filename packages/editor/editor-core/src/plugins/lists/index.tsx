import * as React from 'react';
import { orderedList, bulletList, listItem } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { ToolbarSize } from '../../ui/Toolbar';
import ToolbarLists from './ui/ToolbarLists';
import { createPlugin, pluginKey } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import WithPluginState from '../../ui/WithPluginState';

import EditorBulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import EditorNumberedListIcon from '@atlaskit/icon/glyph/editor/number-list';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';

const listPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'bulletList', node: bulletList },
      { name: 'orderedList', node: orderedList },
      { name: 'listItem', node: listItem },
    ];
  },

  pmPlugins() {
    return [
      { name: 'lists', plugin: ({ dispatch }) => createPlugin(dispatch) },
      {
        name: 'listsInputRule',
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
      { name: 'listsKeymap', plugin: ({ schema }) => keymapPlugin(schema) },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.bulletList),
        keywords: ['ul', 'unordered list'],
        priority: 1100,
        icon: () => (
          <EditorBulletListIcon label={formatMessage(messages.bulletList)} />
        ),
        action(insert, state) {
          return insert(
            state.schema.nodes.bulletList.createChecked(
              {},
              state.schema.nodes.listItem.createChecked(
                {},
                state.schema.nodes.paragraph.createChecked(),
              ),
            ),
          );
        },
      },
      {
        title: formatMessage(messages.orderedList),
        keywords: ['ol', 'ordered list', 'numbered list'],
        priority: 1200,
        icon: () => (
          <EditorNumberedListIcon label={formatMessage(messages.orderedList)} />
        ),
        action(insert, state) {
          return insert(
            state.schema.nodes.orderedList.createChecked(
              {},
              state.schema.nodes.listItem.createChecked(
                {},
                state.schema.nodes.paragraph.createChecked(),
              ),
            ),
          );
        },
      },
    ],
  },

  primaryToolbarComponent({
    editorView,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
  }) {
    const isSmall = toolbarSize < ToolbarSize.L;
    const isSeparator = toolbarSize >= ToolbarSize.S;

    return (
      <WithPluginState
        plugins={{ listsState: pluginKey }}
        render={({ listsState }) => (
          <ToolbarLists
            isSmall={isSmall}
            isSeparator={isSeparator}
            isReducedSpacing={isToolbarReducedSpacing}
            disabled={disabled}
            editorView={editorView}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
            bulletListActive={listsState.bulletListActive}
            bulletListDisabled={listsState.bulletListDisabled}
            orderedListActive={listsState.orderedListActive}
            orderedListDisabled={listsState.orderedListDisabled}
          />
        )}
      />
    );
  },
};

export default listPlugin;
