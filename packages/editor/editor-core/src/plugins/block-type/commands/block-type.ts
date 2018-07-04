import { EditorState, Selection, TextSelection } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';
import { Command } from '../../../types';
import * as blockTypes from '../types';

export function setBlockType(name: string): Command {
  return (state, dispatch) => {
    const { nodes } = state.schema;
    switch (name) {
      case blockTypes.NORMAL_TEXT.name:
        if (nodes.paragraph) {
          return setNormalText()(state, dispatch);
        }
        break;
      case blockTypes.HEADING_1.name:
        if (nodes.heading) {
          return setHeading(1)(state, dispatch);
        }
        break;
      case blockTypes.HEADING_2.name:
        if (nodes.heading) {
          return setHeading(2)(state, dispatch);
        }
        break;
      case blockTypes.HEADING_3.name:
        if (nodes.heading) {
          return setHeading(3)(state, dispatch);
        }
        break;
      case blockTypes.HEADING_4.name:
        if (nodes.heading) {
          return setHeading(4)(state, dispatch);
        }
        break;
      case blockTypes.HEADING_5.name:
        if (nodes.heading) {
          return setHeading(5)(state, dispatch);
        }
        break;
      case blockTypes.HEADING_6.name:
        if (nodes.heading) {
          return setHeading(6)(state, dispatch);
        }
        break;
    }
    return false;
  };
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
function insertCodeBlock(): Command {
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
