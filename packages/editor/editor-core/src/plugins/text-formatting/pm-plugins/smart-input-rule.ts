import { inputRules, InputRule } from 'prosemirror-inputrules';
import { analyticsService } from '../../../analytics';
import { InputRuleHandler, createInputRule } from '../../../utils/input-rules';
import { Transaction, Plugin, Selection } from 'prosemirror-state';

/**
 * Creates an InputRuleHandler that will match on a regular expression of the
 * form `(prefix, content, suffix?)`, and replace it with some given text,
 * maintaining prefix and suffix around the replacement.
 *
 * @param text text to replace with
 */
function replaceTextUsingCaptureGroup(
  text: string,
  trackingEventName?: string,
): InputRuleHandler {
  return (state, match, start, end): Transaction => {
    const [, prefix, , suffix] = match;
    const replacement = (prefix || '') + text + (suffix || '');

    if (trackingEventName) {
      analyticsService.trackEvent(
        `atlassian.editor.format.${trackingEventName}.autoformatting`,
      );
    }

    let {
      tr,
      selection: { $to },
    } = state;
    tr.replaceWith(start, end, state.schema.text(replacement, $to.marks()));
    tr.setSelection(Selection.near(tr.doc.resolve(tr.selection.to)));
    return tr;
  };
}

function createReplacementRule(
  to: string,
  from: RegExp,
  trackingEventName?: string,
): InputRule {
  return createInputRule(
    from,
    replaceTextUsingCaptureGroup(to, trackingEventName),
  );
}

function createReplacementRules(
  replMap,
  trackingEventName?: string,
): Array<InputRule> {
  const rules: Array<InputRule> = [];

  for (const replacement of Object.keys(replMap)) {
    const regex = replMap[replacement];
    rules.push(createReplacementRule(replacement, regex, trackingEventName));
  }

  return rules;
}

// We don't agressively upgrade single quotes to smart quotes because
// they may clash with an emoji. Only do that when we have a matching
// single quote, or a contraction.
function createSingleQuotesRules(trackingEventName): Array<InputRule> {
  return [
    // wrapped text
    createInputRule(
      /(\s+|^)'(\S+.*\S+)'$/,
      (state, match, start, end): Transaction => {
        const [, spacing, innerContent] = match;
        const replacement = spacing + '‘' + innerContent + '’';

        analyticsService.trackEvent(
          `atlassian.editor.format.${trackingEventName}.autoformatting`,
        );

        return state.tr.insertText(replacement, start, end);
      },
    ),

    // apostrophe
    createReplacementRule('’', /(\w)(')(\w)$/, trackingEventName),
  ];
}

export default inputRules({
  rules: [
    ...createReplacementRules(
      {
        Atlassian: /(\s+|^)(atlassian)(\s)$/,
        Jira: /(\s+|^)(jira|JIRA)(\s)$/,
        Bitbucket: /(\s+|^)(bitbucket|BitBucket)(\s)$/,
        Hipchat: /(\s+|^)(hipchat|HipChat)(\s)$/,
        Trello: /(\s+|^)(trello)(\s)$/,
      },
      'product',
    ),

    ...createReplacementRules(
      {
        '→': /(\s+|^)(--?>)(\s)$/,
        '←': /(\s+|^)(<--?)(\s)$/,
        '↔︎': /(\s+|^)(<->?)(\s)$/,
      },
      'arrow',
    ),

    ...createReplacementRules(
      {
        '–': /(\s+|^)(--)(\s)$/,
        '…': /()(\.\.\.)$/,
      },
      'typography',
    ),

    ...createReplacementRules(
      {
        '“': /((?:^|[\s\{\[\(\<'"\u2018\u201C]))(")$/,
        '”': /"$/,
      },
      'quote',
    ),

    ...createSingleQuotesRules('quote'),
  ],
}) as Plugin;
