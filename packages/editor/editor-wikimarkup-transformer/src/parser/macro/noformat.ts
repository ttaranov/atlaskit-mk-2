import { Node as PMNode, Schema } from 'prosemirror-model';

export function noformatMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
): PMNode[] {
  const { codeBlock } = schema.nodes;

  const textNode = schema.text(rawContent);

  return [codeBlock.createChecked(attrs, textNode)];
}
