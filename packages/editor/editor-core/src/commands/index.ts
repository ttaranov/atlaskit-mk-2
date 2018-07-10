import { Fragment, Slice, Node as PMNode } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as blockTypes from '../plugins/block-type/types';
import {
  canMoveDown,
  canMoveUp,
  atTheEndOfDoc,
  atTheBeginningOfBlock,
  isTableCell,
} from '../utils';

export function setBlockType(view: EditorView, name: string): boolean {
  const { nodes } = view.state.schema;
  switch (name) {
    case blockTypes.NORMAL_TEXT.name:
      if (nodes.paragraph) {
        return setNormalText()(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_1.name:
      if (nodes.heading) {
        return setHeading(1)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_2.name:
      if (nodes.heading) {
        return setHeading(2)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_3.name:
      if (nodes.heading) {
        return setHeading(3)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_4.name:
      if (nodes.heading) {
        return setHeading(4)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_5.name:
      if (nodes.heading) {
        return setHeading(5)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_6.name:
      if (nodes.heading) {
        return setHeading(6)(view.state, view.dispatch);
      }
      break;
  }
  return false;
}

export function setNormalText(): Command {
  return function(state, dispatch) {
    const {
      tr,
      selection: { $from, $to },
      schema,
    } = state;
    dispatch(tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph));
    return true;
  };
}

export function setHeading(level: number): Command {
  return function(state, dispatch) {
    const {
      tr,
      selection: { $from, $to },
      schema,
    } = state;
    dispatch(
      tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, { level }),
    );
    return true;
  };
}

export function preventDefault(): Command {
  return function(state, dispatch) {
    return true;
  };
}

export function insertBlockType(name: string): Command {
  return function(state, dispatch) {
    const { nodes } = state.schema;

    switch (name) {
      case blockTypes.BLOCK_QUOTE.name:
        if (nodes.paragraph && nodes.blockquote) {
          return wrapSelectionIn(nodes.blockquote)(state, dispatch);
        }
        break;
      case blockTypes.CODE_BLOCK.name:
        if (nodes.codeBlock) {
          return insertCodeBlock()(state, dispatch);
        }
        break;
      case blockTypes.PANEL.name:
        if (nodes.panel && nodes.paragraph) {
          return wrapSelectionIn(nodes.panel)(state, dispatch);
        }
        break;
    }
    return false;
  };
}

/**
 * Function will add wraping node.
 * 1. If currently selected blocks can be wrapped in the warpper type it will wrap them.
 * 2. If current block can not be wrapped inside wrapping block it will create a new block below selection,
 *  and set selection on it.
 */
function wrapSelectionIn(type): Command {
  return function(state: EditorState, dispatch) {
    const { tr } = state;
    const { $from, $to } = state.selection;
    const { paragraph } = state.schema.nodes;
    const range = $from.blockRange($to) as any;
    const wrapping = range && (findWrapping(range, type) as any);
    if (range && wrapping) {
      tr.wrap(range, wrapping).scrollIntoView();
    } else {
      tr.replaceRangeWith(
        $to.pos,
        $to.pos,
        type.createAndFill({}, paragraph.create()),
      );
      tr.setSelection(Selection.near(tr.doc.resolve(state.selection.to + 1)));
    }
    dispatch(tr);
    return true;
  };
}

/**
 * Function will insert code block at current selection if block is empty or below current selection and set focus on it.
 */
export function insertCodeBlock(): Command {
  return function(state: EditorState, dispatch) {
    const { tr } = state;
    const { $to } = state.selection;
    const { codeBlock } = state.schema.nodes;
    const moveSel = $to.node($to.depth).textContent ? 1 : 0;
    tr.replaceRangeWith($to.pos, $to.pos, codeBlock.createAndFill()!);
    tr.setSelection(
      Selection.near(tr.doc.resolve(state.selection.to + moveSel)),
    );
    dispatch(tr);
    return true;
  };
}

export function insertNewLine(): Command {
  return function(state, dispatch) {
    const { $from } = state.selection;
    const parent = $from.parent;
    const { hardBreak } = state.schema.nodes;

    if (hardBreak) {
      const hardBreakNode = hardBreak.create();

      if (parent && parent.type.validContent(Fragment.from(hardBreakNode))) {
        dispatch(state.tr.replaceSelectionWith(hardBreakNode));
        return true;
      }
    }

    if (state.selection instanceof TextSelection) {
      dispatch(state.tr.insertText('\n'));
      return true;
    }

    return false;
  };
}

export function insertRule(): Command {
  return function(state, dispatch) {
    const { to } = state.selection;
    const { rule } = state.schema.nodes;
    if (rule) {
      const ruleNode = rule.create();
      dispatch(state.tr.insert(to + 1, ruleNode));
      return true;
    }
    return false;
  };
}

export function shouldAppendParagraphAfterBlockNode(state) {
  return (
    (atTheEndOfDoc(state) && atTheBeginningOfBlock(state)) || isTableCell(state)
  );
}

export function insertNodesEndWithNewParagraph(nodes: PMNode[]): Command {
  return function(state, dispatch) {
    const { tr, schema } = state;
    const { paragraph } = schema.nodes;

    if (shouldAppendParagraphAfterBlockNode(state)) {
      nodes.push(paragraph.create());
    }

    tr.replaceSelection(new Slice(Fragment.from(nodes), 0, 0));

    dispatch(tr);
    return true;
  };
}

export function createNewParagraphAbove(
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean {
  const append = false;
  if (!canMoveUp(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
}

export function createNewParagraphBelow(
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean {
  const append = true;
  if (!canMoveDown(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
}

function canCreateParagraphNear(state: EditorState): boolean {
  const {
    selection: { $from },
  } = state;
  const node = $from.node($from.depth);
  const insideCodeBlock = !!node && node.type === state.schema.nodes.codeBlock;
  const isNodeSelection = state.selection instanceof NodeSelection;
  return $from.depth > 1 || isNodeSelection || insideCodeBlock;
}

export function createParagraphNear(append: boolean = true): Command {
  return function(state, dispatch) {
    const paragraph = state.schema.nodes.paragraph;

    if (!paragraph) {
      return false;
    }

    let insertPos;

    if (state.selection instanceof TextSelection) {
      if (topLevelNodeIsEmptyTextBlock(state)) {
        return false;
      }
      insertPos = getInsertPosFromTextBlock(state, append);
    } else {
      insertPos = getInsertPosFromNonTextBlock(state, append);
    }

    const tr = state.tr.insert(insertPos, paragraph.createAndFill()!);
    tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));
    dispatch(tr);

    return true;
  };
}

function getInsertPosFromTextBlock(state: EditorState, append: boolean): void {
  const { $from, $to } = state.selection;
  let pos;
  if (!append) {
    pos = $from.start(0);
  } else {
    pos = $to.end(0);
  }
  return pos;
}

function getInsertPosFromNonTextBlock(
  state: EditorState,
  append: boolean,
): void {
  const { $from, $to } = state.selection;
  const nodeAtSelection =
    state.selection instanceof NodeSelection &&
    state.doc.nodeAt(state.selection.$anchor.pos);
  const isMediaSelection =
    nodeAtSelection && nodeAtSelection.type.name === 'mediaGroup';

  let pos;
  if (!append) {
    // The start position is different with text block because it starts from 0
    pos = $from.start($from.depth);
    // The depth is different with text block because it starts from 0
    pos = $from.depth > 0 && !isMediaSelection ? pos - 1 : pos;
  } else {
    pos = $to.end($to.depth);
    pos = $to.depth > 0 && !isMediaSelection ? pos + 1 : pos;
  }
  return pos;
}

function topLevelNodeIsEmptyTextBlock(state): boolean {
  const topLevelNode = state.selection.$from.node(1);
  return (
    topLevelNode.isTextblock &&
    topLevelNode.type !== state.schema.nodes.codeBlock &&
    topLevelNode.nodeSize === 2
  );
}

export const removeEmptyHeadingAtStartOfDocument: Command = (
  state,
  dispatch,
) => {
  const { $cursor } = state.selection as TextSelection;
  if (
    $cursor &&
    !$cursor.nodeBefore &&
    !$cursor.nodeAfter &&
    $cursor.pos === 1
  ) {
    if ($cursor.parent.type === state.schema.nodes.heading) {
      return setNormalText()(state, dispatch);
    }
  }
  return false;
};

export function createParagraphAtEnd(): Command {
  return function(state, dispatch) {
    const {
      doc,
      tr,
      schema: { nodes },
    } = state;
    if (
      doc.lastChild &&
      !(
        doc.lastChild.type === nodes.paragraph &&
        doc.lastChild.content.size === 0
      )
    ) {
      tr.insert(doc.content.size, nodes.paragraph.createAndFill()!);
    }
    tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size - 1));
    tr.scrollIntoView();
    dispatch(tr);
    return true;
  };
}

export interface Command {
  (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean;
}
