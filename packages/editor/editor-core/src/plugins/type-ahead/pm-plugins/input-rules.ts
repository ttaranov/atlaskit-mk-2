import { Schema } from 'prosemirror-model';
import { inputRules } from 'prosemirror-inputrules';
import { Transaction, Plugin } from 'prosemirror-state';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import { analyticsService } from '../../../analytics';
import { TypeAheadHandler } from '../types';
import {
  PluginState as TypeAheadPluginState,
  pluginKey as typeAheadPluginKey,
} from './main';

export function inputRulePlugin(
  schema: Schema,
  typeAheads: TypeAheadHandler[],
): Plugin | undefined {
  const triggers = typeAheads.map(t => t.trigger).join('|');

  if (!triggers.length) {
    return;
  }

  const regex = new RegExp(
    `(^|[.!?\\s${leafNodeReplacementCharacter}])(${triggers})$`,
  );

  const typeAheadInputRule = createInputRule(regex, (state, match, start, end):
    | Transaction
    | undefined => {
    const typeAheadState = typeAheadPluginKey.getState(
      state,
    ) as TypeAheadPluginState;

    if (!typeAheadState.isAllowed) {
      return;
    }

    const mark = schema.mark('typeAheadQuery', { trigger: match[2] });
    const { tr, selection } = state;
    const marks = selection.$from.marks();

    analyticsService.trackEvent('atlassian.editor.typeahead.trigger', {
      trigger: match[2],
    });

    return tr.replaceSelectionWith(
      schema.text(match[2], [mark, ...marks]),
      false,
    );
  });

  return inputRules({ rules: [typeAheadInputRule] });
}

export default inputRulePlugin;
