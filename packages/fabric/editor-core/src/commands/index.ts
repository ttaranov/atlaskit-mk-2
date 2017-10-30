import { Fragment } from 'prosemirror-model';
import { EditorState, NodeSelection, Selection, TextSelection, Transaction  } from 'prosemirror-state';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as baseCommand from 'prosemirror-commands';
import * as baseListCommand from 'prosemirror-schema-list';
import * as blockTypes from '../plugins/block-type/types';
import { isConvertableToCodeBlock, transformToCodeBlockAction } from '../plugins/block-type/transform-to-code-block';
import {
  isRangeOfType,
  canMoveDown, canMoveUp,
  setTextSelection,
} from '../utils';
import hyperlinkPluginStateKey from '../plugins/hyperlink/plugin-key';

export function toggleBlockType(view: EditorView, name: string): boolean {
  const { nodes } = view.state.schema;
  switch (name) {
    case blockTypes.NORMAL_TEXT.name:
      if (nodes.paragraph) {
        return setNormalText()(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_1.name:
      if (nodes.heading) {
        return toggleHeading(1)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_2.name:
      if (nodes.heading) {
        return toggleHeading(2)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_3.name:
      if (nodes.heading) {
        return toggleHeading(3)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_4.name:
      if (nodes.heading) {
        return toggleHeading(4)(view.state, view.dispatch);
      }
      break;
    case blockTypes.HEADING_5.name:
      if (nodes.heading) {
        return toggleHeading(5)(view.state, view.dispatch);
      }
      break;
  }
  return false;
}

export function setNormalText(): Command {
  return function (state, dispatch) {
    const { tr, selection: { $from, $to }, schema } = state;
    dispatch(tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph));
    return true;
  };
}

export function toggleHeading(level: number): Command {
  return function (state, dispatch) {
    const { tr, selection: { $from, $to }, schema } = state;
    const currentBlock = $from.parent;
    if (currentBlock.type !== schema.nodes.heading || currentBlock.attrs['level'] !== level) {
      dispatch(tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, { level }));
    } else {
      dispatch(tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph));
    }
    return true;
  };
}

/**
 * Sometimes a selection in the editor can be slightly offset, for example:
 * it's possible for a selection to start or end at an empty node at the very end of
 * a line. This isn't obvious by looking at the editor and it's likely not what the
 * user intended - so we need to adjust the seletion a bit in scenarios like that.
 */
export function adjustSelectionInList(doc, selection: TextSelection): TextSelection {
  let { $from, $to } = selection;

  const isSameLine = $from.pos === $to.pos;

  if (isSameLine) {
    $from = doc.resolve($from.start($from.depth));
    $to = doc.resolve($from.end($from.depth));
  }

  let startPos = $from.pos;
  let endPos = $to.pos;

  if (isSameLine && startPos === doc.nodeSize - 3) { // Line is empty, don't do anything
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

export function preventDefault(): Command {
  return function (state, dispatch) {
    return true;
  };
}

export function toggleList(listType: 'bulletList' | 'orderedList'): Command {
  return function (state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView): boolean {
    dispatch(state.tr.setSelection(adjustSelectionInList(state.doc, state.selection as TextSelection)));
    state = view.state;

    const { $from, $to } = state.selection;
    const parent = $from.node(-2);
    const grandgrandParent = $from.node(-3);
    const isRangeOfSingleType = isRangeOfType(state.doc, $from, $to, state.schema.nodes[listType]);

    if ((parent && parent.type === state.schema.nodes[listType] ||
      grandgrandParent && grandgrandParent.type === state.schema.nodes[listType]) &&
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

export function toggleBulletList(): Command {
  return toggleList('bulletList');
}

export function toggleOrderedList(): Command {
  return toggleList('orderedList');
}

export function wrapInList(nodeType): Command {
  return baseCommand.autoJoin(
    baseListCommand.wrapInList(nodeType),
    (before, after) => before.type === after.type && before.type === nodeType
  );
}

export function liftListItems(): Command {
  return function (state, dispatch) {
    const { tr } = state;
    const { $from, $to } = state.selection;

    tr.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      // Following condition will ensure that block types paragraph, heading, codeBlock, blockquote, panel are lifted.
      // isTextblock is true for paragraph, heading, codeBlock.
      if (node.isTextblock || node.type.name === 'blockquote' || node.type.name === 'panel') {
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

export function insertBlockType(view: EditorView, name: string): boolean {
  const { nodes } = view.state.schema;

  switch (name) {
    case blockTypes.BLOCK_QUOTE.name:
      if (nodes.paragraph && nodes.blockquote) {
        return wrapSelectionIn(nodes.blockquote)(view.state, view.dispatch);
      }
      break;
    case blockTypes.CODE_BLOCK.name:
      if (nodes.codeBlock) {
        return insertCodeBlock()(view.state, view.dispatch);
      }
      break;
    case blockTypes.PANEL.name:
      if (nodes.panel && nodes.paragraph) {
        return wrapSelectionIn(nodes.panel)(view.state, view.dispatch);
      }
      break;
  }
  return false;
}

/**
 * Function will add wraping node.
 * 1. If currently selected blocks can be wrapped in the warpper type it will wrap them.
 * 2. If current block can not be wrapped inside wrapping block it will create a new block below selection,
 *  and set selection on it.
 */
function wrapSelectionIn(type): Command {
  return function (state: EditorState, dispatch) {
    const { tr } = state;
    const { $from, $to } = state.selection;
    const { paragraph } = state.schema.nodes;
    const range = $from.blockRange($to) as any;
    const wrapping = range && findWrapping(range, type) as any;
    if (range && wrapping) {
      tr.wrap(range, wrapping).scrollIntoView();
    } else {
      tr.replaceRangeWith($to.pos, $to.pos, type.createAndFill({}, paragraph.create()));
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
  return function (state: EditorState, dispatch) {
    const { tr } = state;
    const { $to } = state.selection;
    const { codeBlock } = state.schema.nodes;
    const moveSel = $to.node($to.depth).textContent ? 1 : 0;
    tr.replaceRangeWith($to.pos, $to.pos, codeBlock.createAndFill()!);
    tr.setSelection(Selection.near(tr.doc.resolve(state.selection.to + moveSel)));
    dispatch(tr);
    return true;
  };
}

export function createCodeBlockFromFenceFormat(): Command {
  return function (state, dispatch) {
    const { codeBlock } = state.schema.nodes;
    const { $from } = state.selection;
    const parentBlock = $from.parent;
    if (!parentBlock.isTextblock || parentBlock.type === codeBlock) {
      return false;
    }
    const startPos = $from.start($from.depth);

    let textOnly = true;

    state.doc.nodesBetween(startPos, $from.pos, (node) => {
      if (node.childCount === 0 && !node.isText && !node.isTextblock) {
        textOnly = false;
      }
    });

    if (!textOnly) {
      return false;
    }

    if (!state.schema.nodes.codeBlock) {
      return false;
    }

    const fencePart = parentBlock.textContent.slice(0, $from.pos - startPos);

    const matcheStart = /(^`{3,}(\S*)\s*$)/.exec(fencePart);
    const matchMiddle = /\s(`{3,}(\S*)\s*$)/.exec(fencePart);
    const matches = matcheStart || matchMiddle;

    if (matches && isConvertableToCodeBlock(state)) {
      const attributes: {language?: string} = {};

      if (matches[2]) {
        attributes.language = matches[2];
      }
      dispatch(transformToCodeBlockAction(state, attributes).delete($from.pos - matches[1].length, $from.pos));
      return true;
    }

    return false;
  };
}

export function showLinkPanel(): Command {
  return function (state, dispatch, view) {
    const pluginState = hyperlinkPluginStateKey.getState(state);
    return pluginState.showLinkPanel(view);
  };
}

export function insertNewLine(): Command {
  return function (state, dispatch) {
    const { $from } = state.selection;
    const node = $from.parent;
    const { hardBreak } = state.schema.nodes;

    if (hardBreak) {
      const hardBreakNode = hardBreak.create();

      if (node.type.validContent(Fragment.from(hardBreakNode))) {
        dispatch(state.tr.replaceSelectionWith(hardBreakNode));
        return true;
      }
    }

    dispatch(state.tr.insertText('\n'));
    return true;
  };
}

export function insertRule(): Command {
  return function (state, dispatch) {
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

export function indentList(): Command {
  return function (state, dispatch) {
    const { listItem } = state.schema.nodes;
    const { $from } = state.selection;
    if ($from.node(-1).type === listItem) {
      return baseListCommand.sinkListItem(listItem)(state, dispatch);
    }
    return false;
  };
}

export function outdentList(): Command {
  return function (state, dispatch) {
    const { listItem } = state.schema.nodes;
    const { $from } = state.selection;
    if ($from.node(-1).type === listItem) {
      return baseListCommand.liftListItem(listItem)(state, dispatch);
    }
    return false;
  };
}

export function createNewParagraphAbove(view: EditorView): Command {
  return function (state, dispatch) {
    const append = false;

    if (!canMoveUp(state) && canCreateParagraphNear(state)) {
      createParagraphNear(view, append);
      return true;
    }

    return false;
  };
}

export function createNewParagraphBelow(view: EditorView): Command {
  return function (state, dispatch) {
    const append = true;

    if (!canMoveDown(state) && canCreateParagraphNear(state)) {
      createParagraphNear(view, append);
      return true;
    }

    return false;
  };
}

function canCreateParagraphNear(state: EditorState): boolean {
  const { selection: { $from } } = state;
  const node = $from.node($from.depth);
  const insideCodeBlock = !!node && node.type === state.schema.nodes.codeBlock;
  const isNodeSelection = state.selection instanceof NodeSelection;
  return $from.depth > 1 || isNodeSelection || insideCodeBlock;
}

export function createParagraphNear(view: EditorView, append: boolean = true): void {
  const { state, dispatch } = view;
  const paragraph = state.schema.nodes.paragraph;

  if (!paragraph) {
    return;
  }

  let insertPos;

  if (state.selection instanceof TextSelection) {
    if (topLevelNodeIsEmptyTextBlock(state)) {
      return;
    }
    insertPos = getInsertPosFromTextBlock(state, append);
  } else {
    insertPos = getInsertPosFromNonTextBlock(state, append);
  }

  dispatch(state.tr.insert(insertPos, paragraph.create()));

  setTextSelection(view, insertPos + 1);
}

function getInsertPosFromTextBlock(state: EditorState, append: boolean): void {
  const { $from, $to } = state.selection;
  let pos;
  const nodeType = $to.node($to.depth - 1).type;

  if (!append) {
    pos = $from.start($from.depth) - 1;
    pos = $from.depth > 1 ? pos - 1 : pos;

    // Same theory as comment below.
    if (nodeType === state.schema.nodes.listItem) {
      pos = pos - 1;
    }
    if (nodeType === state.schema.nodes.tableCell || nodeType === state.schema.nodes.tableHeader) {
      pos = pos - 2;
    }
  } else {
    pos = $to.end($to.depth) + 1;
    pos = $to.depth > 1 ? pos + 1 : pos;

    // List is a special case. Because from user point of view, the whole list is a unit,
    // which has 3 level deep (ul, li, p), all the other block types has maxium two levels as a unit.
    // eg. block type (bq, p/other), code block (cb) and panel (panel, p/other).
    if (nodeType === state.schema.nodes.listItem) {
      pos = pos + 1;
    }
    // table has 4 level depth
    if (nodeType === state.schema.nodes.tableCell || nodeType === state.schema.nodes.tableHeader) {
      pos = pos + 2;
    }
  }

  return pos;
}

function getInsertPosFromNonTextBlock(state: EditorState, append: boolean): void {
  const { $from, $to } = state.selection;
  let pos;

  if (!append) {
    // The start position is different with text block because it starts from 0
    pos = $from.start($from.depth);
    // The depth is different with text block because it starts from 0
    pos = $from.depth > 0 ? pos - 1 : pos;
  } else {
    pos = $to.end($to.depth);
    pos = $to.depth > 0 ? pos + 1 : pos;
  }

  return pos;
}

function topLevelNodeIsEmptyTextBlock(state): boolean {
  const topLevelNode = state.selection.$from.node(1);
  return topLevelNode.isTextblock && topLevelNode.type !== state.schema.nodes.codeBlock && topLevelNode.nodeSize === 2;
}

export interface Command {
  (state: EditorState, dispatch: (tr: Transaction) => void, view?: EditorView): boolean;
}
