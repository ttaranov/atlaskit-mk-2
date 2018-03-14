import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { Transaction, Plugin } from 'prosemirror-state';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import { EmojiState, emojiPluginKey } from './main';

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.emoji && schema.marks.emojiQuery) {
    const regex = new RegExp(`(^|[\\s\(${leafNodeReplacementCharacter}]):$`);
    const emojiQueryRule = createInputRule(regex, (state, match, start, end):
      | Transaction
      | undefined => {
      const emojisState = emojiPluginKey.getState(state) as EmojiState;

      if (!emojisState.emojiProvider) {
        return undefined;
      }

      if (!emojisState.isEnabled()) {
        return undefined;
      }

      const mark = schema.mark('emojiQuery');
      const { tr } = state;

      const emojiText = schema.text(':', [mark]);
      return tr.replaceSelectionWith(emojiText, false);
    });

    rules.push(emojiQueryRule);
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }
}

export default inputRulePlugin;
