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
      /** Check is the wrapper has any content */
      const wrapperHasContent = wrapper.content.size >= 2;
      if (isEmptyNode(node) && !wrapperHasContent) {
        return commands.outdentList()(state, dispatch);
      } else {
        return splitListItem(listItem)(state, dispatch);
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
 * Implemetation taken and modified for our needs from PM
 * @param itemType Node
 * Splits the list items, specific implementation take from PM
 */
function splitListItem(itemType) {
  return function(state, dispatch) {
    const ref = state.selection;
    const $from = ref.$from;
    const $to = ref.$to;
    const node = ref.node;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }
    const grandParent = $from.node(-1);
    if (grandParent.type !== itemType) {
      return false;
    }
    /** --> The following line changed from the original PM implementation to allow list additions with multiple paragraphs */
    if (
      grandParent.content.content.length <= 1 &&
      $from.parent.content.size === 0 &&
      !(grandParent.content.size === 0)
    ) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if (
        $from.depth === 2 ||
        $from.node(-3).type !== itemType ||
        $from.index(-2) !== $from.node(-2).childCount - 1
      ) {
        return false;
      }
      if (dispatch) {
        let wrap = Fragment.empty;
        const keepItem = $from.index(-1) > 0;
        // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor
        for (
          let d = $from.depth - (keepItem ? 1 : 2);
          d >= $from.depth - 3;
          d--
        ) {
          wrap = Fragment.from($from.node(d).copy(wrap));
        }
        // Add a second list item with an empty default start node
        wrap = wrap.append(Fragment.from(itemType.createAndFill()));
        const tr$1 = state.tr.replace(
          $from.before(keepItem ? null : -1),
          $from.after(-3),
          new Slice(wrap, keepItem ? 3 : 2, 2),
        );
        tr$1.setSelection(
          state.selection.constructor.near(
            tr$1.doc.resolve($from.pos + (keepItem ? 3 : 2)),
          ),
        );
        dispatch(tr$1.scrollIntoView());
      }
      return true;
    }
    const nextType =
      $to.pos === $from.end() ? grandParent.defaultContentType(0) : null;
    const tr = state.tr.delete($from.pos, $to.pos);
    const types = nextType && [null, { type: nextType }];

    if (dispatch) {
      dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    }
    return true;
  };
}

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
