import { EditorPlugin } from '../../types';
import keymapPlugin from '../../../plugins/rule/keymap';
import inputRulePlugin from '../../../plugins/rule/input-rule';

const rulePlugin: EditorPlugin = {
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
