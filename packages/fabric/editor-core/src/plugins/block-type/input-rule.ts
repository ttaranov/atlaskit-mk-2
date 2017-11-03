import { blockQuoteRule, headingRule, inputRules, InputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { Plugin, Transaction } from 'prosemirror-state';
import { analyticsService, trackAndInvoke } from '../../analytics';
import { isConvertableToCodeBlock, transformToCodeBlockAction } from '../block-type/transform-to-code-block';
import { createInputRule, defaultInputRuleHandler } from '../utils';

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.heading) {
    // '# ' for h1, '## ' for h2 and etc
    const rule = defaultInputRuleHandler(headingRule(schema.nodes.heading, 5));
    const currentHandler = (rule as any).handler; // TODO: Fix types (ED-2987)
    (rule as any).handler = (state, match, start, end) => {
      analyticsService.trackEvent(`atlassian.editor.format.heading${match[1].length}.autoformatting`);
      return currentHandler(state, match, start, end);
    };
    rules.push(rule);
  }

  if (schema.nodes.blockquote) {
    // '> ' for blockquote
    const rule = defaultInputRuleHandler(blockQuoteRule(schema.nodes.blockquote));
    (rule as any).handler = trackAndInvoke('atlassian.editor.format.blockquote.autoformatting', (rule as any).handler); // TODO: Fix types (ED-2987)
    rules.push(rule);
  }

  if (schema.nodes.codeBlock) {
    rules.push(createInputRule(/((^`{3,})|(\s`{3,}))(\S*)\s$/, (state, match, start, end): Transaction | undefined => {

      const attributes: any = {};
      if (match[4]) {
        attributes.language = match[4];
      }
      if (isConvertableToCodeBlock(state)) {
        const newStart = match[0][0] === ' ' ? start + 1 : start;
        analyticsService.trackEvent(`atlassian.editor.format.codeblock.autoformatting`);
        return transformToCodeBlockAction(state, attributes)
          // remove markdown decorator ```
          .delete(newStart, end)
          .scrollIntoView();
      }
    }));
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }
}

export default inputRulePlugin;
