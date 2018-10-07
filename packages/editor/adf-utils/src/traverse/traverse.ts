export type ADFNode = {
  type: string;
  attrs?: { [name: string]: any };
  content?: Array<ADFNode>;
  marks?: Array<ADFMark>;
  text?: string;
};

export type ADFMark = {
  type: string;
  attrs: { [name: string]: any };
};

export type visitor = (
  node: ADFNode,
  parent: ADFNodeParent,
) => ADFNode | false | undefined | void;

export type ADFNodeParent = { node?: ADFNode; parent?: ADFNodeParent };

export function validateVisitors(visitors: { [type: string]: visitor }) {
  return true;
}

export function traverse(adf: ADFNode, visitors: { [type: string]: visitor }) {
  if (!validateVisitors(visitors)) {
    throw new Error(
      `Visitors are not valid: "${Object.keys(visitors).join(', ')}"`,
    );
  }

  return traverseNode(adf, { node: undefined }, visitors);
}

function traverseNode(
  adfNode: ADFNode,
  parent: ADFNodeParent,
  visitors: { [type: string]: visitor },
): ADFNode | false {
  const visitor = visitors[adfNode.type] || visitors['any'];

  let newNode = { ...adfNode };
  if (visitor) {
    const processedNode = visitor({ ...newNode }, parent);

    if (processedNode === false) {
      return false;
    }

    newNode = processedNode || adfNode;
  }

  if (newNode.content) {
    newNode.content = newNode.content.reduce<Array<ADFNode>>((acc, node) => {
      const processedNode = traverseNode(
        node,
        { node: newNode, parent },
        visitors,
      );
      if (processedNode !== false) {
        acc.push(processedNode);
      }
      return acc;
    }, []);
  }

  return newNode;
}
