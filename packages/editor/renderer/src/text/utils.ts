import { Fragment, Schema, NodeType } from 'prosemirror-model';
import { ReducedNode, nodeToReducerMapping } from './nodes';

export const reduceTree = (
  fragment: Fragment,
  schema: Schema,
): ReducedNode[] => {
  let fragmentContainsInlineNodes = false;
  let previousNodeType: NodeType | undefined;
  let textChunks = '';
  let childrenChunks: ReducedNode[] = [];

  fragment.forEach(node => {
    fragmentContainsInlineNodes = fragmentContainsInlineNodes || node.isInline;

    if (fragmentContainsInlineNodes) {
      const isTextNode = node.type === schema.nodes.text;
      const delimiter =
        previousNodeType === schema.nodes.mention &&
        isTextNode &&
        !node.text!.startsWith(' ')
          ? ' '
          : '';
      const mapping =
        nodeToReducerMapping[node.type.name] || nodeToReducerMapping.unknown;

      textChunks += delimiter + mapping(node, schema).text || '';
    } else {
      if (Object.keys(schema.nodes).indexOf(node.type.name) === -1) {
        childrenChunks.push(nodeToReducerMapping['unknown'](node, schema));
      } else if (nodeToReducerMapping[node.type.name]) {
        childrenChunks.push(nodeToReducerMapping[node.type.name](node, schema));
      } else {
        childrenChunks.push(nodeToReducerMapping['unknown'](node, schema));
      }
    }

    previousNodeType = node.type;
  });

  return fragmentContainsInlineNodes
    ? // We want to collapse multiple \n
      [{ text: textChunks.replace(/\n+/g, '\n') } as ReducedNode]
    : childrenChunks;
};
