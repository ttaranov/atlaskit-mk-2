import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Schema, MarkType } from 'prosemirror-model';
import { Plugin, Transaction, Selection } from 'prosemirror-state';
import { analyticsService } from '../../../analytics';
import { transformToCodeAction } from '../commands/transform-to-code';
import { InputRuleHandler, createInputRule } from '../../../utils/input-rules';

const validCombos = {
  '**': ['_', '~~'],
  '*': ['__', '~~'],
  __: ['*', '~~'],
  _: ['**', '~~'],
  '~~': ['__', '_', '**', '*'],
};

const validRegex = (char: string, str: string): boolean => {
  for (let i = 0; i < validCombos[char].length; i++) {
    const ch = validCombos[char][i];
    if (ch === str) {
      return true;
    }
    const matchLength = str.length - ch.length;
    if (str.substr(matchLength, str.length) === ch) {
      return validRegex(ch, str.substr(0, matchLength));
    }
  }
  return false;
};

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

    let { tr } = state;
    tr.replaceWith(start, end, state.schema.text(replacement));
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

function addMark(
  markType: MarkType,
  schema: Schema,
  charSize: number,
  char: string,
): InputRuleHandler {
  return (state, match, start, end): Transaction | undefined => {
    const [, prefix, textWithCombo] = match;
    const to = end;
    // in case of *string* pattern it matches the text from beginning of the paragraph,
    // because we want ** to work for strong text
    // that's why "start" argument is wrong and we need to calculate it ourselves
    const from = textWithCombo ? start + prefix.length : start;
    const nodeBefore = state.doc.resolve(start + prefix.length).nodeBefore;

    if (
      prefix &&
      prefix.length > 0 &&
      !validRegex(char, prefix) &&
      !(nodeBefore && nodeBefore.type === state.schema.nodes.hardBreak)
    ) {
      return;
    }
    // fixes the following case: my `*name` is *
    // expected result: should ignore special characters inside "code"
    if (
      state.schema.marks.code &&
      state.schema.marks.code.isInSet(state.doc.resolve(from + 1).marks())
    ) {
      return;
    }

    // Prevent autoformatting across hardbreaks
    let containsHardBreak;
    state.doc.nodesBetween(from, to, node => {
      if (node.type === schema.nodes.hardBreak) {
        containsHardBreak = true;
        return false;
      }
      return !containsHardBreak;
    });
    if (containsHardBreak) {
      return;
    }

    // fixes autoformatting in heading nodes: # Heading *bold*
    // expected result: should not autoformat *bold*; <h1>Heading *bold*</h1>
    if (state.doc.resolve(from).sameParent(state.doc.resolve(to))) {
      if (!state.doc.resolve(from).parent.type.allowsMarkType(markType)) {
        return;
      }
    }

    analyticsService.trackEvent(
      `atlassian.editor.format.${markType.name}.autoformatting`,
    );

    // apply mark to the range (from, to)
    let tr = state.tr.addMark(from, to, markType.create());

    if (charSize > 1) {
      // delete special characters after the text
      // Prosemirror removes the last symbol by itself, so we need to remove "charSize - 1" symbols
      tr = tr.delete(to - (charSize - 1), to);
    }

    return (
      tr
        // delete special characters before the text
        .delete(from, from + charSize)
        .removeStoredMark(markType)
    );
  };
}

function addCodeMark(
  markType: MarkType,
  schema: Schema,
  specialChar: string,
): InputRuleHandler {
  return (state, match, start, end): Transaction | undefined => {
    if (match[1] && match[1].length > 0) {
      const nodeBefore = state.doc.resolve(start + match[1].length).nodeBefore;
      if (!(nodeBefore && nodeBefore.type === state.schema.nodes.hardBreak)) {
        return;
      }
    }
    // fixes autoformatting in heading nodes: # Heading `bold`
    // expected result: should not autoformat *bold*; <h1>Heading `bold`</h1>
    if (state.doc.resolve(start).sameParent(state.doc.resolve(end))) {
      if (!state.doc.resolve(start).parent.type.allowsMarkType(markType)) {
        return;
      }
    }
    analyticsService.trackEvent('atlassian.editor.format.code.autoformatting');
    const regexStart = end - match[2].length + 1;
    return transformToCodeAction(state, regexStart, end)
      .delete(regexStart, regexStart + specialChar.length)
      .removeStoredMark(markType);
  };
}

export const strongRegex1 = /(\S*)(\_\_(\S.*\S|\S)\_\_)$/;
export const strongRegex2 = /(\S*)(\*\*(\S.*\S|\S)\*\*)$/;
export const italicRegex1 = /(\S*[^\s\_]*)(\_([^\s\_].*[^\s\_]|[^\_])\_)$/;
export const italicRegex2 = /(\S*[^\s\*]*)(\*([^\s\*].*[^\s\*]|[^\*])\*)$/;
export const strikeRegex = /(\S*)(\~\~(\S.*\S|\S)\~\~)$/;
export const codeRegex = /(\S*)(`[^\s][^`]*`)$/;

// We don't agressively upgrade single quotes to smart quotes because
// they may clash with an emoji. Only do that when we have a matching
// single quote, or a contraction.
function createSingleQuotesRules(trackingEventName): Array<InputRule> {
  return [
    // wrapped text
    createInputRule(
      /(\s+|^)'(.*)'$/,
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

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [
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
  ];

  if (schema.marks.strong) {
    // **string** or __strong__ should bold the text
    const markLength = 2;
    rules.push(
      createInputRule(
        strongRegex1,
        addMark(schema.marks.strong, schema, markLength, '__'),
      ),
    );
    rules.push(
      createInputRule(
        strongRegex2,
        addMark(schema.marks.strong, schema, markLength, '**'),
      ),
    );
  }

  if (schema.marks.em) {
    // *string* or _string_ should italic the text
    const markLength = 1;
    rules.push(
      createInputRule(
        italicRegex1,
        addMark(schema.marks.em, schema, markLength, '_'),
      ),
    );
    rules.push(
      createInputRule(
        italicRegex2,
        addMark(schema.marks.em, schema, markLength, '*'),
      ),
    );
  }

  if (schema.marks.strike) {
    // ~~string~~ should strikethrough the text
    const markLength = 2;
    rules.push(
      createInputRule(
        strikeRegex,
        addMark(schema.marks.strike, schema, markLength, '~~'),
      ),
    );
  }

  if (schema.marks.code) {
    // `string` should monospace the text
    rules.push(
      createInputRule(codeRegex, addCodeMark(schema.marks.code, schema, '`')),
    );
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }
}

export default inputRulePlugin;
