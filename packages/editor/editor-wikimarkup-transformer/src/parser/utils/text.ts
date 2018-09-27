import { Node as PMNode } from 'prosemirror-model';

/**
 * Check if the node has certain marks
 */
export function hasAnyOfMarks(node: PMNode, types: string[]): boolean {
  return (
    node.marks.findIndex(
      m => types.findIndex(t => m.type.name === t) !== -1,
    ) !== -1
  );
}
