import * as React from 'react';
import HorizontalRuleIcon from '@atlaskit/icon/glyph/editor/divider';
import { rule } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
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
    quickInsert: [
      {
        title: 'Horizontal rule',
        priority: 1200,
        icon: () => <HorizontalRuleIcon label="Horizontal rule" />,
        action(insert, state) {
          return insert(state.schema.nodes.rule.createChecked());
        },
      },
    ],
  },
};

export default rulePlugin;
