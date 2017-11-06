import { Schema } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import keymapPlugin from './keymap';
import inputRulePlugin from './input-rule';

export type StateChangeHandler = (state: RuleState) => any;

export class RuleState {
  private state: EditorState;

  constructor(state: EditorState) {
    this.state = state;
  }
}

export const stateKey = new PluginKey('rulePlugin');

const plugin = new Plugin({
  state: {
    init(config, state: EditorState) {
      return new RuleState(state);
    },
    apply(tr, pluginState: RuleState, oldState, newState) {
      return pluginState;
    }
  },
  key: stateKey,
  view: (view: EditorView) => {
    return {};
  }
});

const plugins = (schema: Schema) => {
  return [plugin, inputRulePlugin(schema), keymapPlugin(schema)].filter((plugin) => !!plugin) as Plugin[];
};

export default plugins;
