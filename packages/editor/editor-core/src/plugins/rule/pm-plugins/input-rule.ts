import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Fragment, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { analyticsService } from '../../../analytics';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';

export const createHorizontalRule = (state, start, end) => {
  return state.tr.replaceWith(
    start,
    end,
    Fragment.from(state.schema.nodes.rule.create()),
  );
};

const createHorizontalRuleAutoformat = (state, start, end) => {
  analyticsService.trackEvent(
    `atlassian.editor.format.horizontalrule.autoformatting`,
  );
  return createHorizontalRule(state, start, end);
};

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push(
      // -1, so that it also replaces the container paragraph
      createInputRule(
        /^(\-\-\-|\*\*\*)$/,
        (state, match, start, end) =>
          createHorizontalRuleAutoformat(state, start - 1, end),
        true,
      ),
    );

    // '---' and '***' after shift+enter for hr
    rules.push(
      createInputRule(
        new RegExp(`${leafNodeReplacementCharacter}(\\-\\-\\-|\\*\\*\\*)`),
        (state, match, start, end) => {
          const { hardBreak } = state.schema.nodes;
          if (state.doc.resolve(start).nodeAfter!.type !== hardBreak) {
            return;
          }
          return createHorizontalRuleAutoformat(state, start, end);
        },
        true,
      ),
    );
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }
}

export default inputRulePlugin;
