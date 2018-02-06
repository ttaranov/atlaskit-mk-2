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
 * Checks if a node has any significant content.
 */
export function isEmpty(node?: Node): boolean {
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

  const content: Node[] = [];
  origDoc.content.forEach(node => {
    const { taskList, decisionList } = schema.nodes;
    if (
      (node.type !== taskList && node.type !== decisionList) ||
      node.textContent
    ) {
      content.push(node);
    }
  });

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
