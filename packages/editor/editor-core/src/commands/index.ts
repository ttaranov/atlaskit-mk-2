import { Fragment, Slice, Node as PMNode } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  canMoveDown,
  canMoveUp,
  atTheEndOfDoc,
  atTheBeginningOfBlock,
  isTableCell,
} from '../utils';

export function preventDefault(): Command {
  return function(state, dispatch) {
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

export function shouldAppendParagraphAfterBlockNode(state: EditorState) {
  return atTheEndOfDoc(state) && atTheBeginningOfBlock(state);
}

export function insertNodesEndWithNewParagraph(nodes: PMNode[]): Command {
  return function(state, dispatch) {
    const { tr, schema } = state;
    const { paragraph } = schema.nodes;
    const { head } = state.selection;

    if (shouldAppendParagraphAfterBlockNode(state)) {
      nodes.push(paragraph.create());
    }

    /** If table cell, the default is to move to the next cell, override to select paragraph */
    tr.replaceSelection(new Slice(Fragment.from(nodes), 0, 0));
    if (isTableCell(state)) {
      tr.setSelection(TextSelection.create(state.doc, head, head));
    }

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

    const tr = state.tr.insert(insertPos, paragraph.createAndFill() as PMNode);
    tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));
    dispatch(tr);

    return true;
  };
}

function getInsertPosFromTextBlock(
  state: EditorState,
  append: boolean,
): number {
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
): number {
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

function topLevelNodeIsEmptyTextBlock(state: EditorState): boolean {
  const topLevelNode = state.selection.$from.node(1);
  return (
    topLevelNode.isTextblock &&
    topLevelNode.type !== state.schema.nodes.codeBlock &&
    topLevelNode.nodeSize === 2
  );
}

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
      tr.insert(doc.content.size, nodes.paragraph.createAndFill() as PMNode);
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
