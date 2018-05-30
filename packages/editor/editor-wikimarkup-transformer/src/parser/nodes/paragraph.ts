import { Node as PMNode, Schema } from 'prosemirror-model';

export function createParagraphNode(input: string, schema: Schema): PMNode {
  const { paragraph } = schema.nodes;

  const textNode = schema.text(input);
  return paragraph.createChecked({}, textNode);
}

export function createParagraphNodeFromInlineNodes(
  inlineNodes: PMNode[],
  schema: Schema,
): PMNode {
  const { paragraph } = schema.nodes;

  return paragraph.createChecked({}, inlineNodes);
}
