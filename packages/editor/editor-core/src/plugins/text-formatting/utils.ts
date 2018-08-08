import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Mark, MarkType } from 'prosemirror-model';
import {
  FORMATTING_MARK_TYPES,
  FORMATTING_NODE_TYPES,
} from './commands/clear-formatting';

export const nodeLen = (node: Node): number => {
  return node.nodeType === 3 && node.nodeValue
    ? node.nodeValue.length
    : node.childNodes.length;
};

export const isIgnorable = (dom: any): boolean =>
  dom.pmViewDesc && dom.pmViewDesc.size === 0;

export const isBlockNode = (dom: any): boolean => {
  const desc = dom.pmViewDesc;
  return desc && desc.node && desc.node.isBlock;
};

export const domIndex = function(node: Node | null): number | undefined {
  if (node) {
    for (let index = 0; ; index++) {
      node = node.previousSibling;
      if (!node) {
        return index;
      }
    }
  }
};

export const deepEqual = (obj1, obj2) => {
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};

// Make sure the cursor isn't directly after one or more ignored
// nodes, which will confuse the browser's cursor motion logic.
export const removeIgnoredNodesLeft = (view: EditorView) => {
  const sel = (view.root as any).getSelection();
  let node = sel.anchorNode;
  let offset = sel.anchorOffset;
  let removeNode;
  // TODO: un-ignore it
  // @ts-ignore
  let removeOffset;

  if (!node) {
    return;
  }
  for (;;) {
    if (offset > 0) {
      if (node.nodeType !== 1) {
        // zero-width non-breaking space
        if (
          node.nodeType === 3 &&
          node.nodeValue.charAt(offset - 1) === '\ufeff'
        ) {
          removeNode = node;
          removeOffset = --offset;
        } else {
          break;
        }
      } else {
        const before = node.childNodes[offset - 1];
        if (isIgnorable(before)) {
          removeNode = before;
          removeOffset = --offset;
        } else if (before.nodeType === 3) {
          node = before;
          offset = node.nodeValue.length;
        } else {
          break;
        }
      }
    } else if (isBlockNode(node)) {
      break;
    } else {
      let prev = node.previousSibling;
      while (prev && isIgnorable(prev)) {
        removeNode = node.parentNode;
        removeOffset = domIndex(prev);
        prev = prev.previousSibling;
      }
      if (!prev) {
        node = node.parentNode;
        if (node === view.dom) {
          break;
        }
        offset = 0;
      } else {
        node = prev;
        offset = nodeLen(node);
      }
    }
  }
  if (removeNode) {
    removeNode.parentNode.removeChild(removeNode);
  }
};

export const hasCode = (state: EditorState, pos: number): boolean => {
  const { code } = state.schema.marks;
  const node = pos >= 0 && state.doc.nodeAt(pos);
  if (node) {
    return !!node.marks.filter(mark => mark.type === code).length;
  }

  return false;
};

/**
 * Determine if a mark (with specific attribute values) exists anywhere in the selection.
 */
export const markActive = (state: EditorState, mark: Mark): boolean => {
  const { from, to, empty } = state.selection;
  // When the selection is empty, only the active marks apply.
  if (empty) {
    return !!mark.isInSet(
      state.tr.storedMarks || state.selection.$from.marks(),
    );
  }
  // For a non-collapsed selection, the marks on the nodes matter.
  let found = false;
  state.doc.nodesBetween(from, to, node => {
    found = found || mark.isInSet(node.marks);
  });
  return found;
};

/**
 * Determine if a mark of a specific type exists anywhere in the selection.
 */
export const anyMarkActive = (
  state: EditorState,
  markType: MarkType,
): boolean => {
  const { $from, from, to, empty } = state.selection;
  if (empty) {
    return !!markType.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, markType);
};

const blockStylingIsPresent = (state: EditorState): boolean => {
  let { from, to } = state.selection;
  let isBlockStyling = false;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (FORMATTING_NODE_TYPES.indexOf(node.type.name) !== -1) {
      isBlockStyling = true;
      return false;
    }
    return true;
  });
  return isBlockStyling;
};

const marksArePresent = (state: EditorState) => {
  const activeMarkTypes = FORMATTING_MARK_TYPES.filter(mark => {
    if (!!state.schema.marks[mark]) {
      const { $from, empty } = state.selection;
      const { marks } = state.schema;
      if (empty) {
        return !!marks[mark].isInSet(state.storedMarks || $from.marks());
      }
      if (marks.code && mark === marks.code.name) {
        return markActive(state, marks.code.create());
      }
      return anyMarkActive(state, marks[mark]);
    }
    return false;
  });
  return activeMarkTypes.length > 0;
};

export const checkFormattingIsPresent = (state: EditorState) => {
  return marksArePresent(state) || blockStylingIsPresent(state);
};
