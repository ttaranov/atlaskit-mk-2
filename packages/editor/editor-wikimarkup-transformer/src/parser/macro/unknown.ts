import { Node as PMNode, Schema } from 'prosemirror-model';

export function unknownMacro(
  macroName: string,
  rawAttrs: string,
  rawContent: string,
  schema: Schema,
): PMNode[] {
  const { extension } = schema.nodes;

  return [
    extension.createChecked({
      extensionKey: macroName,
      extensionType: 'com.atlassian.jira.macro',
      text: rawContent,
      parameters: {
        rawAttrs,
      },
    }),
  ];
}
