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
) => Promise<ADFNode | false | undefined | void>;

export type ADFNodeParent = { node?: ADFNode; parent?: ADFNodeParent };

export function validateVisitors(visitors: { [type: string]: visitor }) {
  return true;
}

export async function asyncTraverse(
  adf: ADFNode,
  visitors: { [type: string]: visitor },
) {
  if (!validateVisitors(visitors)) {
    throw new Error(
      `Visitors are not valid: "${Object.keys(visitors).join(', ')}"`,
    );
  }

  return traverseNode(adf, { node: undefined }, visitors);
}

async function traverseNode(
  adfNode: ADFNode,
  parent: ADFNodeParent,
  visitors: { [type: string]: visitor },
): Promise<ADFNode | false> {
  const visitor = visitors[adfNode.type] || visitors['any'];

  let newNode = { ...adfNode };
  if (visitor) {
    const processedNode = await visitor({ ...newNode }, parent);

    if (processedNode === false) {
      return false;
    }

    newNode = processedNode || adfNode;
  }

  if (newNode.content) {
    newNode.content = await newNode.content.reduce<Promise<ADFNode[]>>(
      async (acc, node) => {
        const processedNode = await traverseNode(
          node,
          { node: newNode, parent },
          visitors,
        );
        const resolvedAcc = await acc;
        if (processedNode !== false) {
          resolvedAcc.push(processedNode);
        }
        return resolvedAcc;
      },
      Promise.resolve([]),
    );
  }

  return newNode;
}
