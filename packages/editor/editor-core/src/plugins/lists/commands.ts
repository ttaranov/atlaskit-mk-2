import { ResolvedPos, Fragment, Slice } from 'prosemirror-model';
import {
  EditorState,
  Transaction,
  TextSelection,
  NodeSelection,
} from 'prosemirror-state';
import { liftTarget, ReplaceAroundStep } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as baseCommand from 'prosemirror-commands';
import * as baseListCommand from 'prosemirror-schema-list';
import { isEmptyNode, hasVisibleContent } from '../../utils/document';
import {
  filter,
  isEmptySelectionAtStart,
  isFirstChildOfParent,
  isNthParentOfType,
  findCutBefore,
} from '../../utils/commands';
import { isRangeOfType } from '../../utils';
import { liftFollowingList, liftSelectionList } from './transforms';
import { Command } from '../../types';

const deletePreviousEmptyListItem = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { $from } = state.selection;
  const { listItem } = state.schema.nodes;

  const $cut = findCutBefore($from);
  if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
    return false;
  }

  const previousListItemEmpty =
    $cut.nodeBefore.childCount === 1 &&
    $cut.nodeBefore.firstChild!.nodeSize <= 2;

  if (previousListItemEmpty) {
    const { tr } = state;
    dispatch(
      tr
        .delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos)
        .scrollIntoView(),
    );
    return true;
  }

  return false;
};

const joinPToPreviousListItem = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { $from } = state.selection;
  const { paragraph, bulletList, orderedList } = state.schema.nodes;

  const $cut = findCutBefore($from);
  if (!$cut) {
    return false;
  }
  // see if the containing node is a list
  if (
    $cut.nodeBefore &&
    [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1
  ) {
    // and the node after this is a paragraph
    if ($cut.nodeAfter && $cut.nodeAfter.type === paragraph) {
      // find the nearest paragraph that precedes this node
      let $lastNode = $cut.doc.resolve($cut.pos - 1);

      while ($lastNode.parent.type !== paragraph) {
        $lastNode = state.doc.resolve($lastNode.pos - 1);
      }

      // take the text content of the paragraph and insert after the paragraph up until before the the cut
      let tr = state.tr.step(
        new ReplaceAroundStep(
          $lastNode.pos,
          $cut.pos + $cut.nodeAfter!.nodeSize,
          $cut.pos + 1,
          $cut.pos + $cut.nodeAfter!.nodeSize - 1,
          state.tr.doc.slice($lastNode.pos, $cut.pos),
          0,
          true,
        ),
      );

      // find out if there's now another list following and join them
      // as in, [list, p, list] => [list with p, list], and we want [joined list]
      let $postCut = tr.doc.resolve(
        tr.mapping.map($cut.pos + $cut.nodeAfter!.nodeSize),
      );
      if (
        $postCut.nodeBefore &&
        $postCut.nodeAfter &&
        $postCut.nodeBefore.type === $postCut.nodeAfter.type &&
        [bulletList, orderedList].indexOf($postCut.nodeBefore.type) > -1
      ) {
        tr = tr.join($postCut.pos);
      }

      dispatch(tr.scrollIntoView());
      return true;
    }
  }

  return false;
};

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
      /** Check if the wrapper has any visible content */
      const wrapperHasContent = hasVisibleContent(wrapper);
      if (isEmptyNode(node) && !wrapperHasContent) {
        return outdentList()(state, dispatch);
      } else {
        return splitListItem(listItem)(state, dispatch);
      }
    }
  }
  return false;
};

export const backspaceKeyCommand = baseCommand.chainCommands(
  // if we're at the start of a list item, we need to either backspace
  // directly to an empty list item above, or outdent this node
  filter(
    [
      isEmptySelectionAtStart,

      // list items might have multiple paragraphs; only do this at the first one
      isFirstChildOfParent,
      isNthParentOfType('listItem', 1),
    ],
    baseCommand.chainCommands(deletePreviousEmptyListItem, outdentList()),
  ),

  // if we're just inside a paragraph node and backspace, then try to join
  // the text to the previous list item, if one exists
  filter(
    [isEmptySelectionAtStart, isNthParentOfType('paragraph', 0)],
    joinPToPreviousListItem,
  ),
);

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

export function outdentList(): Command {
  return function(state, dispatch) {
    const { listItem } = state.schema.nodes;
    const { $from, $to } = state.selection;
    if ($from.node(-1).type === listItem) {
      // if we're backspacing at the start of a list item, unindent it
      // take the the range of nodes we might be lifting

      // the predicate is for when you're backspacing a top level list item:
      // we don't want to go up past the doc node, otherwise the range
      // to clear will include everything
      let range = $from.blockRange(
        $to,
        node => node.childCount > 0 && node.firstChild!.type === listItem,
      );

      if (!range) {
        return false;
      }

      let tr;
      if (
        baseListCommand.liftListItem(listItem)(state, liftTr => (tr = liftTr))
      ) {
        /* we now need to handle the case that we lifted a sublist out,
          * and any listItems at the current level get shifted out to
          * their own new list; e.g.:
          *
          * unorderedList
          *  listItem(A)
          *  listItem
          *    unorderedList
          *      listItem(B)
          *  listItem(C)
          *
          * becomes, after unindenting the first, top level listItem, A:
          *
          * content of A
          * unorderedList
          *  listItem(B)
          * unorderedList
          *  listItem(C)
          *
          * so, we try to merge these two lists if they're of the same type, to give:
          *
          * content of A
          * unorderedList
          *  listItem(B)
          *  listItem(C)
          */

        const $start: ResolvedPos = state.doc.resolve(range.start);
        const $end: ResolvedPos = state.doc.resolve(range.end);
        const $join = tr.doc.resolve(tr.mapping.map(range.end - 1));

        if (
          $join.nodeBefore &&
          $join.nodeAfter &&
          $join.nodeBefore.type === $join.nodeAfter.type
        ) {
          if (
            $end.nodeAfter &&
            $end.nodeAfter.type === listItem &&
            $end.parent.type === $start.parent.type
          ) {
            tr.join($join.pos);
          }
        }

        dispatch(tr.scrollIntoView());
        return true;
      }
    }
    return false;
  };
}

export function indentList(): Command {
  return function(state, dispatch) {
    const { listItem } = state.schema.nodes;
    const { $from } = state.selection;
    if ($from.node(-1).type === listItem) {
      baseListCommand.sinkListItem(listItem)(state, dispatch);
      return true;
    }
    return false;
  };
}

export function liftListItems(): Command {
  return function(state, dispatch) {
    const { tr } = state;
    const { $from, $to } = state.selection;

    tr.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      // Following condition will ensure that block types paragraph, heading, codeBlock, blockquote, panel are lifted.
      // isTextblock is true for paragraph, heading, codeBlock.
      if (
        node.isTextblock ||
        node.type.name === 'blockquote' ||
        node.type.name === 'panel'
      ) {
        const sel = new NodeSelection(tr.doc.resolve(tr.mapping.map(pos)));
        const range = sel.$from.blockRange(sel.$to);

        if (!range || sel.$from.parent.type !== state.schema.nodes.listItem) {
          return false;
        }

        const target = range && liftTarget(range);

        if (target === undefined || target === null) {
          return false;
        }

        tr.lift(range, target);
      }
    });

    dispatch(tr);

    return true;
  };
}

/**
 * Sometimes a selection in the editor can be slightly offset, for example:
 * it's possible for a selection to start or end at an empty node at the very end of
 * a line. This isn't obvious by looking at the editor and it's likely not what the
 * user intended - so we need to adjust the selection a bit in scenarios like that.
 */
export function adjustSelectionInList(
  doc,
  selection: TextSelection,
): TextSelection {
  let { $from, $to } = selection;

  const isSameLine = $from.pos === $to.pos;

  if (isSameLine) {
    $from = doc.resolve($from.start($from.depth));
    $to = doc.resolve($from.end($from.depth));
  }

  let startPos = $from.pos;
  let endPos = $to.pos;

  if (isSameLine && startPos === doc.nodeSize - 3) {
    // Line is empty, don't do anything
    return selection;
  }

  // Selection started at the very beginning of a line and therefor points to the previous line.
  if ($from.nodeBefore && !isSameLine) {
    startPos++;
    let node = doc.nodeAt(startPos);
    while (!node || (node && !node.isText)) {
      startPos++;
      node = doc.nodeAt(startPos);
    }
  }

  if (endPos === startPos) {
    return new TextSelection(doc.resolve(startPos));
  }

  return new TextSelection(doc.resolve(startPos), doc.resolve(endPos));
}

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
    return toggleListCommand(listType)(state, dispatch, view);
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

export function toggleListCommand(listType: 'bulletList' | 'orderedList') {
  return function(
    state: EditorState,
    dispatch: (tr: Transaction) => void,
    view: EditorView,
  ): boolean {
    dispatch(
      state.tr.setSelection(
        adjustSelectionInList(state.doc, state.selection as TextSelection),
      ),
    );
    state = view.state;

    const { $from, $to } = state.selection;
    const parent = $from.node(-2);
    const grandgrandParent = $from.node(-3);
    const isRangeOfSingleType = isRangeOfType(
      state.doc,
      $from,
      $to,
      state.schema.nodes[listType],
    );

    if (
      ((parent && parent.type === state.schema.nodes[listType]) ||
        (grandgrandParent &&
          grandgrandParent.type === state.schema.nodes[listType])) &&
      isRangeOfSingleType
    ) {
      // Untoggles list
      return liftListItems()(state, dispatch);
    } else {
      // Wraps selection in list and converts list type e.g. bullet_list -> ordered_list if needed
      if (!isRangeOfSingleType) {
        liftListItems()(state, dispatch);
        state = view.state;
      }
      return wrapInList(state.schema.nodes[listType])(state, dispatch);
    }
  };
}

export function toggleBulletList(view) {
  return toggleList(view.state, view.dispatch, view, 'bulletList');
}

export function toggleOrderedList(view) {
  return toggleList(view.state, view.dispatch, view, 'orderedList');
}

export function wrapInList(nodeType): Command {
  return baseCommand.autoJoin(
    baseListCommand.wrapInList(nodeType),
    (before, after) => before.type === after.type && before.type === nodeType,
  );
}
