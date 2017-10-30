import { uuid } from '@atlaskit/editor-common';
import { inputRules, InputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { NodeSelection, Plugin, EditorState } from 'prosemirror-state';
import { analyticsService } from '../../analytics';
import { createInputRule, leafNodeReplacementCharacter } from '../utils';

const createListRule = (regex: RegExp, name: string, list: any, item: any, schema: Schema, analyticType: string) => {
  const { paragraph, hardBreak } = schema.nodes;

  return createInputRule(
      regex, (
        state: EditorState,
        match: Object | undefined,
        start: number,
        end: number
      ) => {
        const { tr, selection: { $from } } = state;

        // Only allow creating list from top-level paragraphs
        if ($from.node(1).type !== paragraph) {
          return;
        }

        const where = $from.before($from.depth);

        analyticsService.trackEvent(`atlassian.fabric.${analyticType}.trigger.shortcut`);
        const content = $from.node($from.depth).content;
        let shouldBreakNode = false;

        content.forEach((node, offset) => {
          if (node.type === hardBreak && offset < start) {
            shouldBreakNode = true;
          }
        });

        if (!shouldBreakNode) {
          tr
            .delete(where, $from.end($from.depth))
            .replaceSelectionWith(list.create({ localId: uuid.generate() }, [item.create({}, content)]))
            .delete(start + 1, end + 1)
          ;
        } else {
          tr
            .split($from.pos)
            .setSelection(new NodeSelection(tr.doc.resolve($from.pos + 1)))
            .replaceSelectionWith(list.create({ localId: uuid.generate() }, [item.create({}, tr.doc.nodeAt($from.pos + 1)!.content)]))
            .delete(start, end + 1)
          ;
        }

        return tr;
      }
    );
};

export function inputRulePlugin(schema: Schema): Plugin {
  const rules: InputRule[] = [];

  const {
    decisionList,
    decisionItem,
    taskList,
    taskItem,
  } = schema.nodes;

  if (decisionList && decisionItem) {
    rules.push(createListRule(new RegExp(`(^|${leafNodeReplacementCharacter})\\<\\>\\s$`), 'decisionlist', decisionList, decisionItem, schema, 'decision'));
  }

  if (taskList && taskItem) {
    rules.push(createListRule(new RegExp(`(^|${leafNodeReplacementCharacter})\\[\\]\\s$`), 'tasklist', taskList, taskItem, schema, 'action'));
  }

  return inputRules({ rules });
}

export default inputRulePlugin;
