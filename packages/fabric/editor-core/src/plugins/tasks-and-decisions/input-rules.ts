import { uuid } from '@atlaskit/editor-common';
import { inputRules, InputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import {
  NodeSelection,
  Plugin,
  EditorState,
  TextSelection,
} from 'prosemirror-state';
import { analyticsService } from '../../analytics';
import { createInputRule, leafNodeReplacementCharacter } from '../utils';

const createListRule = (
  regex: RegExp,
  name: string,
  list: any,
  item: any,
  schema: Schema,
  analyticType: string,
) => {
  const { paragraph, hardBreak, tableCell, tableHeader } = schema.nodes;

  return createInputRule(
    regex,
    (
      state: EditorState,
      match: Object | undefined,
      start: number,
      end: number,
    ) => {
      const { tr, selection: { $from } } = state;

      const content = $from.node($from.depth).content;
      let shouldBreakNode = false;
      content.forEach((node, offset) => {
        if (node.type === hardBreak && offset < start) {
          shouldBreakNode = true;
        }
      });

      // Only allow creating list from top-level paragraphs in beginning or after shift+enter
      // or inside table.
      if (
        ($from.node(1).type !== paragraph &&
          $from.node($from.depth - 1).type !== tableCell &&
          $from.node($from.depth - 1).type !== tableHeader) ||
        (shouldBreakNode && $from.node(1).type !== paragraph)
      ) {
        return;
      }

      const where = $from.before($from.depth);

      analyticsService.trackEvent(
        `atlassian.fabric.${analyticType}.trigger.shortcut`,
      );

      if (!shouldBreakNode) {
        tr
          .delete(where, $from.end($from.depth))
          .replaceSelectionWith(
            list.create({ localId: uuid.generate() }, [
              item.create({}, content),
            ]),
          )
          .delete(start + 1, end + 1)
          .setSelection(new TextSelection(tr.doc.resolve(start + 1)));
      } else {
        tr
          .split($from.pos)
          .setSelection(new NodeSelection(tr.doc.resolve($from.pos + 1)))
          .replaceSelectionWith(
            list.create({ localId: uuid.generate() }, [
              item.create({}, tr.doc.nodeAt($from.pos + 1)!.content),
            ]),
          )
          .delete(start, end + 1);
      }

      return tr;
    },
    true,
  );
};

export function inputRulePlugin(schema: Schema): Plugin {
  const rules: InputRule[] = [];

  const { decisionList, decisionItem, taskList, taskItem } = schema.nodes;

  if (decisionList && decisionItem) {
    rules.push(
      createListRule(
        new RegExp(`(^|${leafNodeReplacementCharacter})\\<\\>\\s$`),
        'decisionlist',
        decisionList,
        decisionItem,
        schema,
        'decision',
      ),
    );
  }

  if (taskList && taskItem) {
    rules.push(
      createListRule(
        new RegExp(`(^|${leafNodeReplacementCharacter})\\[\\]\\s$`),
        'tasklist',
        taskList,
        taskItem,
        schema,
        'action',
      ),
    );
  }

  return inputRules({ rules });
}

export default inputRulePlugin;
