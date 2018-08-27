import {
  CodeBlockDefinition,
  TextDefinition,
  NoMark,
} from '@atlaskit/editor-common';

export type CodeBlockContent = TextDefinition & NoMark;

export const codeBlock = (attrs: CodeBlockDefinition['attrs'] | undefined) => (
  ...content: Array<CodeBlockContent>
): CodeBlockDefinition => ({
  type: 'codeBlock',
  attrs,
  content,
});
