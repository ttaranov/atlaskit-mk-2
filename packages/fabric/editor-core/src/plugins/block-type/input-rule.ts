import {
  wrappingInputRule,
  textblockTypeInputRule,
  inputRules,
  InputRule,
} from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { Plugin, Transaction } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';
import { analyticsService, trackAndInvoke } from '../../analytics';
import {
  isConvertableToCodeBlock,
  transformToCodeBlockAction,
} from '../block-type/transform-to-code-block';
import { createInputRule, defaultInputRuleHandler } from '../utils';

export function dumbInputRule(regexp, nodeType, getAttrs) {
  return new InputRule(regexp, (state, match, start, end) => {
    let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    let tr = state.tr.delete(start, end);
    let $start = tr.doc.resolve(start);
    let range = $start.blockRange();
    let wrapping = range && findWrapping(range, nodeType, attrs);
    if (!wrapping) return null;
    tr.wrap(range!, wrapping);
    return tr;
  });
}

export function blockQuoteRule(nodeType) {
  return wrappingInputRule(/\s*>\s$/, nodeType);
}

export function orderedListRule(nodeType) {
  return wrappingInputRule(
    /(\d+)\.\s$/,
    nodeType,
    match => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1],
  );
}

export function bulletListRule(nodeType) {
  return wrappingInputRule(/\s*([-+*])\s$/, nodeType);
}

export function headingRule(nodeType, maxLevel) {
  return textblockTypeInputRule(
    new RegExp('(#{1,' + maxLevel + '})\\s$'),
    nodeType,
    match => ({ level: match[1].length }),
  );
}

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.heading) {
    rules.push(
      createInputRule(
        /(\s*(#{1,5}))\s$/gm,
        (state, match, start, end): Transaction | undefined => {
          return state.tr
            .replaceRangeWith(
              start - 1,
              end + 1,
              schema.nodes.heading.createAndFill({ level: match[2].length }),
            )
            .scrollIntoView();
        },
        true,
      ),
    );
  }

  if (schema.nodes.blockquote) {
    rules.push(
      createInputRule(
        /(\s*>)\s$/gm,
        (state, match, start, end): Transaction | undefined => {
          return state.tr
            .replaceRangeWith(
              start - 1,
              end + 1,
              schema.nodes.blockquote.createAndFill(),
            )
            .scrollIntoView();
        },
        true,
      ),
    );
  }

  if (schema.nodes.codeBlock) {
    rules.push(
      createInputRule(
        /(\s*```)\s$/gm,
        (state, match, start, end): Transaction | undefined => {
          const attributes: any = {};
          if (match[4]) {
            attributes.language = match[4];
          }
          if (isConvertableToCodeBlock(state)) {
            const newStart = start + match[0].indexOf('`');
            return state.tr
              .replaceRangeWith(
                start - 1,
                end + 1,
                schema.nodes.codeBlock.createChecked(attributes),
              )
              .scrollIntoView();
          }
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
