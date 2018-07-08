import { Inline, HeadingDefinition } from '@atlaskit/editor-common';

export const heading = (attrs: HeadingDefinition['attrs']) => (
  ...content: Array<Inline>
): HeadingDefinition => ({
  type: 'heading',
  attrs,
  content,
});
