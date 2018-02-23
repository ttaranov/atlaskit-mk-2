import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Schema, MarkType } from 'prosemirror-model';
import { Plugin, Transaction } from 'prosemirror-state';
import { analyticsService } from '../../analytics';
import { transformToCodeAction } from './transform-to-code';
import { InputRuleHandler, createInputRule } from '../utils';

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

function addMark(
  markType: MarkType,
  schema: Schema,
  charSize: number,
  char: string,
): InputRuleHandler {
  return (state, match, start, end): Transaction | undefined => {
    if (match[1] && match[1].length > 0 && !validRegex(char, match[1])) {
      return;
    }
    const to = end;
    // in case of *string* pattern it matches the text from beginning of the paragraph,
    // because we want ** to work for strong text
    // that's why "start" argument is wrong and we need to calculate it ourselves
    const from = match[2] ? to - match[2].length + 1 : start;

    // fixes the following case: my `*name` is *
    // expected result: should ignore special characters inside "code"
    if (
      state.schema.marks.code &&
      state.schema.marks.code.isInSet(state.doc.resolve(from + 1).marks())
    ) {
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
      return;
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
export const italicRegex1 = /(\S*)(\_([^\s\_].*[^\s\_]|[^\s\_])\_)$/;
export const italicRegex2 = /(\S*)(\*([^\s\*].*[^\s\*]|[^\s\*])\*)$/;
export const strikeRegex = /(\S*)(\~\~(\S.*\S|\S)\~\~)$/;
export const codeRegex = /(\S*)(`[^\s][^`]*`)$/;

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

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
