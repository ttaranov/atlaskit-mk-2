import { Node, Fragment, Schema } from 'prosemirror-model';

/**
 * Checks if node is an empty paragraph.
 */
export function isEmptyParagraph(node?: Node | null): boolean {
  return (
    !node ||
    (node.type.name === 'paragraph' && !node.textContent && !node.childCount)
  );
}

/**
 * Returns false if node contains only empty inline nodes and hardBreaks.
 */
export function hasVisibleContent(node: Node): boolean {
  const isInlineNodeHasVisibleContent = (inlineNode: Node) => {
    return inlineNode.isText
      ? !!inlineNode.textContent.trim()
      : inlineNode.type.name !== 'hardBreak';
  };

  if (node.isInline) {
    return isInlineNodeHasVisibleContent(node);
  } else if (node.isBlock && node.isLeaf) {
    return true;
  } else if (!node.childCount) {
    return false;
  }

  for (let index = 0; index < node.childCount; index++) {
    const child = node.child(index);

    if (hasVisibleContent(child)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a node has any content. Ignores node that only contain emoty block nodes.
 */
export function isEmptyNode(node?: Node): boolean {
  if (node && node.textContent) {
    return false;
  }

  if (
    !node ||
    !node.childCount ||
    (node.childCount === 1 && isEmptyParagraph(node.firstChild))
  ) {
    return true;
  }

  const block: Node[] = [];
  const nonBlock: Node[] = [];

  node.forEach(child => {
    child.isInline ? nonBlock.push(child) : block.push(child);
  });

  return (
    !nonBlock.length &&
    !block.filter(
      childNode =>
        (!!childNode.childCount &&
          !(
            childNode.childCount === 1 && isEmptyParagraph(childNode.firstChild)
          )) ||
        childNode.isAtom,
    ).length
  );
}

/**
 * Checks if a node looks like an empty document
 */
export function isEmptyDocument(node: Node): boolean {
  const nodeChild = node.content.firstChild;

  if (node.childCount !== 1 || !nodeChild) {
    return false;
  }
  return (
    nodeChild.type.name === 'paragraph' &&
    !nodeChild.childCount &&
    nodeChild.nodeSize === 2
  );
}

export const preprocessDoc = (
  schema: Schema,
  origDoc: Node | undefined,
): Node | undefined => {
  if (!origDoc) {
    return;
  }

  let content: Node[] = [];
  // Number of empty Paragraphs from bottom of the node
  const emptyPfromBottom = {
    numOfEmptyP: 0,
    isLastP: true,
  };
  origDoc.content.forEach((node, _, index) => {
    const { taskList, decisionList } = schema.nodes;

    if (
      (node.type !== taskList && node.type !== decisionList) ||
      node.textContent
    ) {
      const child = origDoc.content.child(
        origDoc.content.childCount - index - 1,
      );
      if (
        emptyPfromBottom.isLastP &&
        child.type.name === 'paragraph' &&
        child.content.size === 0
      ) {
        emptyPfromBottom.numOfEmptyP++;
      } else {
        emptyPfromBottom.isLastP = false;
      }
      content.push(node);
    }
  });
  if (emptyPfromBottom.numOfEmptyP) {
    content = content.slice(0, content.length - emptyPfromBottom.numOfEmptyP);
  }
  return schema.nodes.doc.create({}, Fragment.fromArray(content));
};

export function processRawValue(
  schema: Schema,
  value?: string | Object,
): Node | undefined {
  if (!value) {
    return;
  }

  let node: Object;
  if (typeof value === 'string') {
    try {
      node = JSON.parse(value);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(`Error processing value: ${value} isn't a valid JSON`);
      return;
    }
  } else {
    node = value;
  }

  if (Array.isArray(node)) {
    // tslint:disable-next-line:no-console
    console.error(
      `Error processing value: ${node} is an array, but it must be an object.`,
    );
    return;
  }

  try {
    const parsedDoc = Node.fromJSON(schema, node);
    // throws an error if the document is invalid
    parsedDoc.check();
    return parsedDoc;
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(`Error processing value: ${node} – ${e.message}`);
    return;
  }
}
