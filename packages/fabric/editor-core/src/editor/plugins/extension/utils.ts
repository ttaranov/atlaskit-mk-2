import {
  Node as PmNode,
  NodeRange,
  NodeType,
  ResolvedPos,
} from 'prosemirror-model';
import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state';

export const getExtensionNode = (state: EditorState): PmNode | undefined => {
  const { selection } = state;
  if (selection instanceof NodeSelection) {
    return selection.node;
  }
  const { $from } = selection;
  const { extension, inlineExtension } = state.schema.nodes;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === extension || node.type === inlineExtension) {
      return node;
    }
  }
};

export const isCursorInsideNode = (
  state: EditorState,
  nodeType: NodeType,
): boolean => {
  const { selection } = state;
  if (selection instanceof TextSelection === false) {
    return false;
  }
  const { $from } = selection;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === nodeType) {
      return true;
    }
  }
  return false;
};

export const getExtensionStartPos = (state: EditorState): number => {
  const { $from } = state.selection;
  const { extension, inlineExtension } = state.schema.nodes;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === extension || node.type === inlineExtension) {
      return $from.start(i);
    }
  }

  return 0;
};

export const getExtensionRange = (state: EditorState): NodeRange => {
  const { tr: { doc }, selection: { $from, $to } } = state;
  const { extension, inlineExtension } = state.schema.nodes;
  let depth;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === extension || node.type === inlineExtension) {
      depth = i;
      break;
    }
  }

  const start = doc.resolve($from.start(depth));
  const end = doc.resolve($to.end(depth));
  return start.blockRange(end)!;
};

export const cellStartPos = (state: EditorState): ResolvedPos | undefined => {
  const $pos = state.selection.$head;
  const { tableCell, tableHeader } = state.schema.nodes;
  for (
    let after = $pos.nodeAfter, pos = $pos.pos;
    after;
    after = after.firstChild, pos++
  ) {
    if (after.type === tableCell || after.type === tableHeader) {
      return $pos.doc.resolve(pos);
    }
  }
  for (
    let before = $pos.nodeBefore, pos = $pos.pos;
    before;
    before = before.lastChild, pos--
  ) {
    if (before.type === tableCell || before.type === tableHeader) {
      return $pos.doc.resolve(pos);
    }
  }
};
export const cellStartPos = (state: EditorState): ResolvedPos | undefined => {
  const { $from } = state.selection;
  const { tableCell, tableHeader } = state.schema.nodes;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === tableCell || node.type === tableHeader) {
      return state.doc.resolve($from.start(i));
    }
  }
};

export const findPrevCellPos = (state: EditorState): number | undefined => {
  const $cell = cellStartPos(state);
  debugger;
  if (!$cell) {
    return;
  }
  const before = $cell.nodeBefore;
  if (before) {
    return $cell.pos - before.nodeSize;
  }
  for (
    let row = $cell.index(-1) - 1, rowEnd = $cell.before();
    row >= 0;
    row--
  ) {
    const rowNode = $cell.node(-1).child(row);
    if (rowNode.childCount) {
      return rowEnd - 1 - rowNode.lastChild!.nodeSize;
    }
    rowEnd -= rowNode.nodeSize;
  }
};
