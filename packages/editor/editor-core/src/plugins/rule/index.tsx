import * as React from 'react';
import HorizontalRuleIcon from '@atlaskit/icon/glyph/editor/divider';
import { rule } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import keymapPlugin from './pm-plugins/keymap';
import inputRulePlugin from './pm-plugins/input-rule';

const rulePlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'rule', node: rule, rank: 1000 }];
  },

  pmPlugins() {
    return [
      {
        rank: 1000,
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
      {
        rank: 1010,
        plugin: ({ schema }) => keymapPlugin(schema),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Horizontal rule',
        keywords: ['hr', '-', '_'],
        icon: () => <HorizontalRuleIcon label="Horizontal rule" />,
        action(insert, state) {
          return insert(state.schema.nodes.rule.createChecked());
        },
      },
    ],
  },
};

export default rulePlugin;
