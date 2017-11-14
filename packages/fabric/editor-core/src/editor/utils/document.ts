import { Node, Fragment, Schema } from 'prosemirror-model';

/**
 * Checks if node is an empty paragraph.
 */
export function isEmptyParagraph(node?: Node | null): boolean {
  return !node || (node.type.name === 'paragraph' && !node.textContent && !node.childCount);
}

/**
 * Checks if a node has any significant content.
 */
export function isEmpty(node?: Node): boolean {
  if (node && node.textContent) {
    return false;
  }

  if (!node
    || !node.childCount
    || (node.childCount === 1 && isEmptyParagraph(node.firstChild))) {
    return true;
  }

  const block: Node[] = [];
  const nonBlock: Node[] = [];

  node.forEach(child => {
    child.isInline
      ? nonBlock.push(child)
      : block.push(child);
  });

  return !nonBlock.length
    && !block.filter(childNode =>
        !!childNode.childCount && !(childNode.childCount === 1 && isEmptyParagraph(childNode.firstChild))).length;
}

export const preprocessDoc = (schema: Schema, origDoc: Node | undefined): Node | undefined => {
  if (!origDoc) {
    return;
  }

  const content: Node[] = [];
  origDoc.content.forEach(node => {
    const { taskList, decisionList } = schema.nodes;
    if((node.type !== taskList && node.type !== decisionList) ||
      node.textContent) {
      content.push(node);
    }
  });

  return schema.nodes.doc.create({}, Fragment.fromArray(content));
};
