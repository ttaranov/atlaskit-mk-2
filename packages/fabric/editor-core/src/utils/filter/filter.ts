import { JSONDocNode, JSONNode } from '../../';

const filterContent = (content: JSONNode[], types: Set<string>) => {
  return content.reduce((acc, node, index) => {
    if (types.has(node.type)) {
      if (node.content) {
        acc.push({
          ...node,
          content: filterContent(node.content, types)
        });
      } else {
        acc.push(node);
      }
    } else if (node.content) {
      filterContent(node.content, types)
        .forEach(child => acc.push(child));
    }

    return acc;
  }, [] as JSONNode[]);
};

export const filterContentByType = (doc: JSONDocNode, types: Set<string>) => {
  const { content } = doc;

  if (!content) {
    return [];
  }

  return filterContent(content, types);
};
