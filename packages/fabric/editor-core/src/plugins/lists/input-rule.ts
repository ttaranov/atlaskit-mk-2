import {
  InputRule,
  inputRules,
  wrappingInputRule,
} from 'prosemirror-inputrules';
import { NodeType, Schema } from 'prosemirror-model';
import { Plugin, Transaction, TextSelection } from 'prosemirror-state';
import { trackAndInvoke } from '../../analytics';
import {
  createInputRule as defaultCreateInputRule,
  defaultInputRuleHandler,
} from '../utils';
import { findWrapping } from 'prosemirror-transform';

export function createInputRule(regexp: RegExp, nodeType: NodeType): InputRule {
  return wrappingInputRule(
    regexp,
    nodeType,
    {},
    (_, node) => node.type === nodeType,
  );
}

// TODO: Fix types (ED-2987)
export default function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: InputRule[] = [];

  if (schema.nodes.bulletList) {
    // NOTE: we decided to restrict the creation of bullet lists to only "*"x
    const rule = defaultInputRuleHandler(
      createInputRule(/^\s*([\*\-]) $/, schema.nodes.bulletList),
      true,
    );
    (rule as any).handler = trackAndInvoke(
      'atlassian.editor.format.list.bullet.autoformatting',
      (rule as any).handler,
    );
    rules.push(rule);
    rules.push(
      defaultCreateInputRule(
        /\ufffc(\s*[\*\-])\s$/gm,
        (state, match, start, end): Transaction | undefined => {
          const { tr } = state;
          if (tr.doc.resolve(start).nodeAfter!.type.name !== 'hardBreak') {
            return;
          }
          if (
            !findWrapping(
              tr.doc.resolve(start + 1).blockRange()!,
              schema.nodes.bulletList,
            )
          ) {
            return;
          }
          return tr
            .replaceRangeWith(
              start,
              end + 1,
              schema.nodes.bulletList.createAndFill()!,
            )
            .setSelection(TextSelection.near(tr.doc.resolve(end)))
            .scrollIntoView();
        },
        true,
      ),
    );
  }

  if (schema.nodes.orderedList) {
    // NOTE: There is a built in input rule for ordered lists in ProseMirror. However, that
    // input rule will allow for a list to start at any given number, which isn't allowed in
    // markdown (where a ordered list will always start on 1). This is a slightly modified
    // version of that input rule.
    const rule = defaultInputRuleHandler(
      createInputRule(/^(\d+)[\.\)] $/, schema.nodes.orderedList),
      true,
    );
    (rule as any).handler = trackAndInvoke(
      'atlassian.editor.format.list.numbered.autoformatting',
      (rule as any).handler,
    );
    rules.push(rule);
    rules.push(
      defaultCreateInputRule(
        /\ufffc(\d+\.)\s$/gm,
        (state, match, start, end): Transaction | undefined => {
          const { tr } = state;
          if (tr.doc.resolve(start).nodeAfter!.type.name !== 'hardBreak') {
            return;
          }
          if (
            !findWrapping(
              tr.doc.resolve(start + 1).blockRange()!,
              schema.nodes.orderedList,
            )
          ) {
            return;
          }
          return tr
            .replaceRangeWith(
              start,
              end + 1,
              schema.nodes.orderedList.createAndFill()!,
            )
            .setSelection(TextSelection.near(tr.doc.resolve(end)))
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
