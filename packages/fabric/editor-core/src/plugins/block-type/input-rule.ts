import {
  textblockTypeInputRule,
  wrappingInputRule,
  inputRules,
  InputRule,
} from 'prosemirror-inputrules';
import { Schema, NodeType } from 'prosemirror-model';
import { Plugin, Transaction, TextSelection } from 'prosemirror-state';
import { analyticsService, trackAndInvoke } from '../../analytics';
import {
  isConvertableToCodeBlock,
  transformToCodeBlockAction,
} from '../block-type/transform-to-code-block';
import {
  createInputRule,
  defaultInputRuleHandler,
  leafNodeReplacementCharacter,
} from '../utils';
import { findWrapping } from 'prosemirror-transform';

export function headingRule(nodeType: NodeType, maxLevel: number) {
  return textblockTypeInputRule(
    new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType,
    match => ({ level: match[1].length }),
  );
}

export function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

export function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```$/, nodeType);
}

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.heading) {
    // '# ' for h1, '## ' for h2 and etc
    const rule = defaultInputRuleHandler(
      headingRule(schema.nodes.heading, 5),
      true,
    );
    const currentHandler = (rule as any).handler; // TODO: Fix types (ED-2987)
    (rule as any).handler = (state, match, start, end) => {
      analyticsService.trackEvent(
        `atlassian.editor.format.heading${match[1].length}.autoformatting`,
      );
      return currentHandler(state, match, start, end);
    };
    rules.push(rule);
    rules.push(
      createInputRule(
        new RegExp(`${leafNodeReplacementCharacter}(#{1,5})\\s$`),
        (state, match, start, end): Transaction | undefined => {
          const { tr } = state;
          if (tr.doc.resolve(start).nodeAfter!.type.name !== 'hardBreak') {
            return;
          }
          if (!findWrapping(tr.doc.resolve(start + 1).blockRange()!, schema.nodes.heading)) {
            return;
          }
          return tr
            .replaceRangeWith(
              start,
              end + 1,
              schema.nodes.heading.createAndFill()!,
            )
            .setSelection(
              TextSelection.near(tr.doc.resolve(end))
            )
            .scrollIntoView();
        },
        true,
      ),
    );
  }

  if (schema.nodes.blockquote) {
    // '> ' for blockquote
    const rule = defaultInputRuleHandler(
      blockQuoteRule(schema.nodes.blockquote),
      true,
    );
    (rule as any).handler = trackAndInvoke(
      'atlassian.editor.format.blockquote.autoformatting',
      (rule as any).handler,
    ); // TODO: Fix types (ED-2987)
    rules.push(rule);
    rules.push(
      createInputRule(
        new RegExp(`${leafNodeReplacementCharacter}\\s*>\\s$`),
        (state, match, start, end): Transaction | undefined => {
          const { tr } = state;
          if (tr.doc.resolve(start).nodeAfter!.type.name !== 'hardBreak') {
            return;
          }
          if (!findWrapping(tr.doc.resolve(start + 1).blockRange()!, schema.nodes.blockquote)) {
            return;
          }
          return tr
            .replaceRangeWith(
              start,
              end + 1,
              schema.nodes.blockquote.createAndFill()!,
            )
            .setSelection(
              TextSelection.near(tr.doc.resolve(end))
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
        /((^`{3,})|(\s`{3,}))(\S*)\s$/,
        (state, match, start, end): Transaction | undefined => {
          const attributes: any = {};
          if (match[4]) {
            attributes.language = match[4];
          }
          if (isConvertableToCodeBlock(state)) {
            const newStart = match[0][0] === ' ' ? start + 1 : start;
            analyticsService.trackEvent(
              `atlassian.editor.format.codeblock.autoformatting`,
            );
            return (
              transformToCodeBlockAction(state, attributes)
                // remove markdown decorator ```
                .delete(newStart, end)
                .scrollIntoView()
            );
          }
        },
        true,
      ),
    );
    rules.push(
      createInputRule(
        new RegExp(`(${leafNodeReplacementCharacter}\\s*\`{3,})(\\S+)\\s$`),
        (state, match, start, end): Transaction | undefined => {
          const { tr } = state;
          if (tr.doc.resolve(start).nodeAfter!.type.name !== 'hardBreak') {
            return;
          }
          if (!findWrapping(tr.doc.resolve(start + 1).blockRange()!, schema.nodes.codeBlock)) {
            return;
          }
          const attributes = match[2] ? { language: match[2] } : {};
          return tr
            .replaceRangeWith(
              start,
              end + 1,
              schema.nodes.codeBlock.createAndFill(attributes)!,
            )
            .setSelection(
              TextSelection.create(tr.doc, end + 1)
            )
            .scrollIntoView();
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
