import { InputRule, inputRules } from 'prosemirror-inputrules';
import { NodeType, Schema } from 'prosemirror-model';
import { Plugin, Transaction } from 'prosemirror-state';
import { trackAndInvoke } from '../../analytics';
import { createInputRule } from '../utils';

export function createInputRules(
  regexp: RegExp,
  nodeType: NodeType,
): InputRule {
  return createInputRule(
    regexp,
    (state, match, start, end): Transaction | undefined => {
      return state.tr
        .replaceRangeWith(start - 1, end + 1, nodeType.createChecked())
        .scrollIntoView();
    },
    true,
  );
}

// TODO: Fix types (ED-2987)
export default function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: InputRule[] = [];

  if (schema.nodes.bulletList) {
    rules.push(
      createInputRule(
        /(\s*[\*\-])\s$/gm,
        (state, match, start, end): Transaction | undefined => {
          return state.tr
            .replaceRangeWith(
              start - 1,
              end + 1,
              schema.nodes.bulletList.createAndFill()!,
            )
            .scrollIntoView();
        },
        true,
      ),
    );
  }

  if (schema.nodes.orderedList) {
    rules.push(
      createInputRule(
        /(\s*\d+\.)\s$/gm,
        (state, match, start, end): Transaction | undefined => {
          return state.tr
            .replaceRangeWith(
              start - 1,
              end + 1,
              schema.nodes.orderedList.createAndFill()!,
            )
            .scrollIntoView();
        },
        true,
      ),
    );
    // NOTE: There is a built in input rule for ordered lists in ProseMirror. However, that
    // input rule will allow for a list to start at any given number, which isn't allowed in
    // markdown (where a ordered list will always start on 1). This is a slightly modified
    // version of that input rule.

    const rule = createInputRules(/\s*([\*\-]) $/, schema.nodes.orderedList);
    (rule as any).handler = trackAndInvoke(
      'atlassian.editor.format.list.numbered.autoformatting',
      (rule as any).handler,
    );
    rules.push(rule);
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }
}
