import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Fragment, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { analyticsService } from '../../analytics';
import { createInputRule, leafNodeReplacementCharacter } from '../utils';

const createHorizontalRule = (state, match, start, end) => {
  if (state.doc.resolve(start).depth > 1) {
    return;
  }
  analyticsService.trackEvent(
    `atlassian.editor.format.horizontalrule.autoformatting`,
  );
  return state.tr.replaceWith(
    start,
    end,
    Fragment.from(state.schema.nodes.rule.create()),
  );
};

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push(
      // -1, so that it also replaces the container paragraph
      createInputRule(
        /^\-\-\-$|^\*\*\*$/,
        (state, match, start, end) =>
          createHorizontalRule(state, match, start - 1, end),
        true,
      ),
    );

    // '---' and '***' after shift+enter for hr
    rules.push(
      createInputRule(
        new RegExp(
          `${leafNodeReplacementCharacter}\\-\\-\\-|${leafNodeReplacementCharacter}\\*\\*\\*`,
        ),
        (state, match, start, end) => {
          const { hardBreak } = state.schema.nodes;
          if (state.doc.resolve(start).nodeAfter!.type !== hardBreak) {
            return;
          }
          return createHorizontalRule(state, match, start, end);
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
