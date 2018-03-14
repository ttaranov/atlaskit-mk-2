import {
  Schema,
  ResolvedPos,
  Fragment,
  NodeRange,
  Slice,
} from 'prosemirror-model';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { liftTarget, ReplaceAroundStep } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as baseListCommand from 'prosemirror-schema-list';
import * as commands from '../../commands';
import { isEmptyNode } from '../../utils/document';

/**
 * Function will lift list item following selection to level-1.
 */
export function liftFollowingList(
  state: EditorState,
  from: number,
  to: number,
  rootListDepth: number,
  tr: Transaction,
): Transaction {
  const { listItem } = state.schema.nodes;
  let lifted = false;
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (!lifted && node.type === listItem && pos > from) {
      lifted = true;
      let listDepth = rootListDepth + 3;
      while (listDepth > rootListDepth + 2) {
        const start = tr.doc.resolve(tr.mapping.map(pos));
        listDepth = start.depth;
        const end = tr.doc.resolve(
          tr.mapping.map(pos + node.textContent.length),
        );
        const sel = new TextSelection(start, end);
        tr = liftListItem(state, sel, tr);
      }
    }
  });
  return tr;
}

/**
 * Lift list item.
 */
function liftListItem(
  state: EditorState,
  selection,
  tr: Transaction,
): Transaction {
  let { $from, $to } = selection;
  const nodeType = state.schema.nodes.listItem;
  let range = $from.blockRange(
    $to,
    node => node.childCount && node.firstChild.type === nodeType,
  );
  if (
    !range ||
    range.depth < 2 ||
    $from.node(range.depth - 1).type !== nodeType
  ) {
    return tr;
  }
  let end = range.end;
  let endOfList = $to.end(range.depth);
  if (end < endOfList) {
    tr.step(
      new ReplaceAroundStep(
        end - 1,
        endOfList,
        end,
        endOfList,
        new Slice(
          Fragment.from(nodeType.create(undefined, range.parent.copy())),
          1,
          0,
        ),
        1,
        true,
      ),
    );
    // TODO: Fix types (ED-2987) - Remove cast to any as soon as we've updated to prosemirror-model 0.24
    range = new (NodeRange as any)(
      tr.doc.resolve($from.pos),
      tr.doc.resolve(endOfList),
      range.depth,
    );
  }
  return tr.lift(range, liftTarget(range)!).scrollIntoView();
}

export const enterKeyCommand = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { selection } = state;
  if (selection.empty) {
    const { $from } = selection;
    const { listItem } = state.schema.nodes;
    const node = $from.node($from.depth);
    const wrapper = $from.node($from.depth - 1);
    if (wrapper && wrapper.type === listItem) {
      if (isEmptyNode(node)) {
        return commands.outdentList()(state, dispatch);
      } else {
        return baseListCommand.splitListItem(listItem)(state, dispatch);
      }
    }
  }
  return false;
};

export const toggleList = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  view: EditorView,
  listType: 'bulletList' | 'orderedList',
): boolean => {
  const { selection } = state;
  const { bulletList, orderedList, listItem } = state.schema.nodes;
  const fromNode = selection.$from.node(selection.$from.depth - 2);
  const endNode = selection.$to.node(selection.$to.depth - 2);
  if (
    !fromNode ||
    fromNode.type.name !== listType ||
    (!endNode || endNode.type.name !== listType)
  ) {
    return commands.toggleList(listType)(state, dispatch, view);
  } else {
    let rootListDepth;
    for (let i = selection.$to.depth - 1; i > 0; i--) {
      const node = selection.$to.node(i);
      if (node.type === bulletList || node.type === orderedList) {
        rootListDepth = i;
      }
      if (
        node.type !== bulletList &&
        node.type !== orderedList &&
        node.type !== listItem
      ) {
        break;
      }
    }
    let tr = liftFollowingList(
      state,
      selection.$to.pos,
      selection.$to.end(rootListDepth),
      rootListDepth,
      state.tr,
    );
    tr = liftSelectionList(state, tr);
    dispatch(tr);
    return true;
  }
};

/**
 * The function will list paragraphs in selection out to level 1 below root list.
 */
function liftSelectionList(state: EditorState, tr: Transaction): Transaction {
  const { from, to } = state.selection;
  const { paragraph } = state.schema.nodes;
  const listCol: any[] = [];
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === paragraph) {
      listCol.push({ node, pos });
    }
  });
  for (let i = listCol.length - 1; i >= 0; i--) {
    const paragraph = listCol[i];
    const start = tr.doc.resolve(tr.mapping.map(paragraph.pos));
    if (start.depth > 0) {
      let end;
      if (paragraph.node.textContent && paragraph.node.textContent.length > 0) {
        end = tr.doc.resolve(
          tr.mapping.map(paragraph.pos + paragraph.node.textContent.length),
        );
      } else {
        end = tr.doc.resolve(tr.mapping.map(paragraph.pos + 1));
      }
      const range = start.blockRange(end)!;
      tr.lift(range, listLiftTarget(state.schema, start));
    }
  }
  return tr;
}

/**
 * This will return (depth - 1) for root list parent of a list.
 */
function listLiftTarget(schema: Schema, resPos: ResolvedPos): number {
  let target = resPos.depth;
  const { bulletList, orderedList, listItem } = schema.nodes;
  for (let i = resPos.depth; i > 0; i--) {
    const node = resPos.node(i);
    if (node.type === bulletList || node.type === orderedList) {
      target = i;
    }
    if (
      node.type !== bulletList &&
      node.type !== orderedList &&
      node.type !== listItem
    ) {
      break;
    }
  }
  return target - 1;
}
