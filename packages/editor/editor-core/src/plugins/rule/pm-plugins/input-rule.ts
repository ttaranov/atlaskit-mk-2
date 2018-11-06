import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Fragment, Schema } from 'prosemirror-model';
import { Plugin, EditorState } from 'prosemirror-state';
import { analyticsService } from '../../../analytics';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';

export const createHorizontalRule = (state: EditorState, start, end) => {
  if (!state.selection.empty) {
    return null;
  }

  const { $from } = state.selection;
  const $afterRule = state.doc.resolve($from.after());
  const { paragraph } = state.schema.nodes;

  if ($afterRule.nodeAfter && $afterRule.nodeAfter.type === paragraph) {
    // if there's already a paragraph after, just insert the rule into
    // the current paragraph
    end = end + 1;
  }

  return state.tr.replaceWith(
    start,
    end,
    Fragment.from(state.schema.nodes.rule.createChecked()),
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
            return null;
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
