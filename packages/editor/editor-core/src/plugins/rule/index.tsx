import * as React from 'react';
import HorizontalRuleIcon from '@atlaskit/icon/glyph/editor/divider';
import { rule } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';
import keymapPlugin from './pm-plugins/keymap';
import inputRulePlugin from './pm-plugins/input-rule';

const rulePlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'rule', node: rule }];
  },

  pmPlugins() {
    return [
      {
        name: 'ruleInputRule',
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
      {
        name: 'ruleKeymap',
        plugin: ({ schema }) => keymapPlugin(schema),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.horizontalRule),
        keywords: ['horizontal rule', 'rule', 'line'],
        priority: 1200,
        icon: () => (
          <HorizontalRuleIcon label={formatMessage(messages.horizontalRule)} />
        ),
        action(insert, state) {
          return insert(state.schema.nodes.rule.createChecked());
        },
      },
    ],
  },
};

export default rulePlugin;
