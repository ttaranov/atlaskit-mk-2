import { uuid } from '@atlaskit/editor-common';
import { inputRules, InputRule } from 'prosemirror-inputrules';
import { Schema, NodeType, Node } from 'prosemirror-model';
import {
  NodeSelection,
  Plugin,
  EditorState,
  TextSelection,
} from 'prosemirror-state';
import { analyticsService } from '../../../analytics';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import { canInsert } from 'prosemirror-utils';
import { changeInDepth } from '../commands';

const createListRule = (
  regex: RegExp,
  name: string,
  list: NodeType,
  item: NodeType,
  schema: Schema,
  analyticType: string,
) => {
  const { paragraph, hardBreak } = schema.nodes;

  return createInputRule(
    regex,
    (
      state: EditorState,
      match: Object | undefined,
      start: number,
      end: number,
    ) => {
      const {
        tr,
        selection: { $from },
      } = state;

      const content = $from.node($from.depth).content;
      let shouldBreakNode = false;
      content.forEach((node, offset) => {
        if (node.type === hardBreak && offset < start) {
          shouldBreakNode = true;
        }
      });

      const $end = state.doc.resolve(end);
      const $endOfParent = state.doc.resolve($end.after());
      // Only allow creating list in nodes that support them.
      // Parent must be a paragraph as we don't want this applying to headings
      if (
        $end.parent.type !== paragraph ||
        !canInsert($endOfParent, list.createAndFill() as Node)
      ) {
        return null;
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
              item.create({ localId: uuid.generate() }, content),
            ]),
          )
          .delete(start + 1, end + 1)
          .setSelection(new TextSelection(tr.doc.resolve(start + 1)));
      } else {
        const depthAdjustment = changeInDepth($from, tr.selection.$from);
        tr
          .split($from.pos)
          .setSelection(new NodeSelection(tr.doc.resolve($from.pos + 1)))
          .replaceSelectionWith(
            list.create({ localId: uuid.generate() }, [
              item.create(
                { localId: uuid.generate() },
                // TODO: [ts30] handle void and null properly
                (tr.doc.nodeAt($from.pos + 1) as Node).content,
              ),
            ]),
          )
          .setSelection(
            new TextSelection(tr.doc.resolve($from.pos + depthAdjustment)),
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
