import { Schema } from 'prosemirror-model';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Transaction, Plugin } from 'prosemirror-state';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import { analyticsService } from '../../../analytics';
import { MentionsState, mentionPluginKey } from './main';

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.mention && schema.marks.mentionQuery) {
    const regex = new RegExp(`(^|[\\s\(${leafNodeReplacementCharacter}])@$`);
    const mentionQueryRule = createInputRule(regex, (state, match, start, end):
      | Transaction
      | undefined => {
      const mentionsState = mentionPluginKey.getState(state) as MentionsState;

      if (!mentionsState.mentionProvider) {
        return undefined;
      }

      if (!mentionsState.isEnabled()) {
        return undefined;
      }

      const mark = schema.mark('mentionQuery');
      const { tr } = state;

      analyticsService.trackEvent(
        'atlassian.fabric.mention.picker.trigger.shortcut',
      );

      const mentionText = schema.text('@', [mark]);
      return tr.replaceSelectionWith(mentionText, false);
    });

    rules.push(mentionQueryRule);
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }
}

export default inputRulePlugin;
