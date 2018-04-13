import { Fragment, Schema } from 'prosemirror-model';
import { ReducedNode, nodeToReducerMapping } from './nodes';

export const reduceTree = (
  fragment: Fragment,
  schema: Schema,
): ReducedNode[] => {
  let fragmentContainsInlineNodes = false;
  let textChunks = '';
  let childrenChunks: ReducedNode[] = [];

  fragment.forEach(node => {
    fragmentContainsInlineNodes = fragmentContainsInlineNodes || node.isInline;

    if (fragmentContainsInlineNodes) {
      if (nodeToReducerMapping[node.type.name]) {
        textChunks +=
          nodeToReducerMapping[node.type.name](node, schema).text || '';
      } else {
        textChunks += nodeToReducerMapping['unknown'](node, schema).text || '';
      }
    } else {
      if (Object.keys(schema.nodes).indexOf(node.type.name) === -1) {
        childrenChunks.push(nodeToReducerMapping['unknown'](node, schema));
      } else if (nodeToReducerMapping[node.type.name]) {
        childrenChunks.push(nodeToReducerMapping[node.type.name](node, schema));
      } else {
        childrenChunks.push(nodeToReducerMapping['unknown'](node, schema));
      }
    }
  });

  return fragmentContainsInlineNodes
    ? // We want to collapse multiple \n
      [{ text: textChunks.replace(/\n+/g, '\n') } as ReducedNode]
    : childrenChunks;
};
