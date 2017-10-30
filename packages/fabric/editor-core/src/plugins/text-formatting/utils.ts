import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export const nodeLen = (node: Node): number => {
  return node.nodeType === 3 && node.nodeValue ? node.nodeValue.length : node.childNodes.length;
};

export const isIgnorable = (dom: any): boolean => dom.pmViewDesc && dom.pmViewDesc.size === 0;

export const isBlockNode = (dom: any): boolean => {
  const desc = dom.pmViewDesc;
  return desc && desc.node && desc.node.isBlock;
};

export const domIndex = function(node: Node | null): number | undefined {
  if (node) {
    for (let index = 0;; index++) {
      node = node.previousSibling;
      if (!node) {
        return index;
      }
    }
  }
};

// Make sure the cursor isn't directly after one or more ignored
// nodes, which will confuse the browser's cursor motion logic.
export const removeIgnoredNodesLeft = (view: EditorView) => {
  const sel = (view.root as any).getSelection();
  let node = sel.anchorNode;
  let offset = sel.anchorOffset;
  let removeNode;
  let removeOffset;
  if (!node) {
    return;
  }
  for (;;) {
    if (offset > 0) {
      if (node.nodeType !== 1) {
        // zero-width non-breaking space
        if (node.nodeType === 3 && node.nodeValue.charAt(offset - 1) === '\ufeff') {
          removeNode = node;
          removeOffset = --offset;
        } else { break; }
      } else {
        const before = node.childNodes[offset - 1];
        if (isIgnorable(before)) {
          removeNode = before;
          removeOffset = --offset;
        } else if (before.nodeType === 3) {
          node = before;
          offset = node.nodeValue.length;
        } else { break; }
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
        if (node === view.dom) { break; }
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

export const hasCode = (state: EditorState, pos: number) : boolean => {
  const { code } = state.schema.marks;
  const node = pos >= 0 && state.doc.nodeAt(pos);
  if (node) {
    return !!node.marks.filter(mark => mark.type === code).length;
  }

  return false;
};
