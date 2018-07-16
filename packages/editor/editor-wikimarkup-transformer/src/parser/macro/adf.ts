import { Node as PMNode, Schema } from 'prosemirror-model';

export function adfMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
): PMNode[] {
  const json = JSON.parse(rawContent);
  const node = schema.nodeFromJSON(json);

  return [node];
}
