import { Node as PMNode, Schema } from 'prosemirror-model';
import { getEditorColor } from '../color';

export function colorMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
): PMNode[] {
  const mark = schema.marks.textColor.create({
    color: getEditorColor(attrs),
  });

  const textNode = schema.text(rawContent, [mark]);

  return [textNode];
}
