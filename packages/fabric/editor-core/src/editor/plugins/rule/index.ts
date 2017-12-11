import { EditorPlugin } from '../../types';
import { rule } from '@atlaskit/editor-common';
import keymapPlugin from '../../../plugins/rule/keymap';
import inputRulePlugin from '../../../plugins/rule/input-rule';

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
};

export default rulePlugin;
