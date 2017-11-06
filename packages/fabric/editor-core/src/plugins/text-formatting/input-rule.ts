import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Schema, MarkType } from 'prosemirror-model';
import { Plugin, Transaction } from 'prosemirror-state';
import { analyticsService } from '../../analytics';
import { transformToCodeAction } from './transform-to-code';
import { InputRuleHandler, createInputRule } from '../utils';

function addMark(markType: MarkType, schema: Schema, charSize: number): InputRuleHandler {
  return (state, match, start, end): Transaction | undefined => {
    const to = end;
    // in case of *string* pattern it matches the text from beginning of the paragraph,
    // because we want ** to work for strong text
    // that's why "start" argument is wrong and we need to calculate it ourselves
    const from = match[1] ? to - match[1].length + 1 : start;

    // fixes the following case: my `*name` is *
    // expected result: should ignore special characters inside "code"
    if (state.schema.marks.code && state.schema.marks.code.isInSet(state.doc.resolve(from + 1).marks())) {
      return;
    }

    // fixes autoformatting in heading nodes: # Heading *bold*
    // expected result: should not autoformat *bold*; <h1>Heading *bold*</h1>
    if (state.doc.resolve(from).sameParent(state.doc.resolve(to))) {
      if (!state.doc.resolve(from).parent.contentMatchAt(0).allowsMark(markType)) {
        return;
      }
    }

    analyticsService.trackEvent(`atlassian.editor.format.${markType.name}.autoformatting`);

    // apply mark to the range (from, to)
    let tr = state.tr.addMark(from, to, markType.create());

    if (charSize > 1) {
      // delete special characters after the text
      // Prosemirror removes the last symbol by itself, so we need to remove "charSize - 1" symbols
      tr = tr.delete(to - (charSize - 1), to);
    }

    return tr
       // delete special characters before the text
       .delete(from, from + charSize)
       .removeStoredMark(markType);
  };
}

function addCodeMark(markType: MarkType, schema: Schema, specialChar: string): InputRuleHandler {
  return (state, match, start, end): Transaction | undefined => {
    // fixes autoformatting in heading nodes: # Heading `bold`
    // expected result: should not autoformat *bold*; <h1>Heading `bold`</h1>
    if (state.doc.resolve(start).sameParent(state.doc.resolve(end))) {
      if (!state.doc.resolve(start).parent.contentMatchAt(0).allowsMark(markType)) {
        return;
      }
    }
    analyticsService.trackEvent('atlassian.editor.format.code.autoformatting');
    return transformToCodeAction(state, start, end).delete(start, start + specialChar.length).removeStoredMark(markType);
  };
}

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.marks.strong) {
    // **string** or __strong__ should bold the text
    const markLength = 2;
    rules.push(createInputRule(/(?:[^`0-9A-Za-z]+)(\_\_([^\s\_][^\_]+)\_\_)$|^(\_\_([^\s \_][^\_]+)\_\_)$/, addMark(schema.marks.strong, schema, markLength)));
    rules.push(createInputRule(/^(?:[^`]+)(\*\*([^\s\*][^\*]+)\*\*)$|^(\*\*([^\s\*][^\*]+)\*\*)$/, addMark(schema.marks.strong, schema, markLength)));
  }

  if (schema.marks.em) {
    // *string* or _string_ should italic the text
    const markLength = 1;
    rules.push(createInputRule(/(?:[^\_`0-9A-Za-z]+)(\_([^\s\_][^\_]+?)\_)$|^(\_([^\s\_][^\_]+)\_)$/, addMark(schema.marks.em, schema, markLength)));
    rules.push(createInputRule(/^(?:[^\*`]+)(\*([^\s\*][^\*]+?)\*)$|^(\*([^\s\*][^\*]+)\*)$/, addMark(schema.marks.em, schema, markLength)));
  }

  if (schema.marks.strike) {
    // ~~string~~ should strikethrough the text
    const markLength = 2;
    rules.push(createInputRule(/^(?:[^`]+)(\~\~([^\s\~][^\~]+)\~\~)$|^(\~\~([^\s\~][^\~]+)\~\~)$/, addMark(schema.marks.strike, schema, markLength)));
  }

  if (schema.marks.code) {
    // `string` should monospace the text
    rules.push(createInputRule(/(`[^\s`].*`)$/, addCodeMark(schema.marks.code, schema, '`')));
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }
}

export default inputRulePlugin;
