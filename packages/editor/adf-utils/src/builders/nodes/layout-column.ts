import { BlockContent, LayoutColumnDefinition } from '@atlaskit/editor-common';

export const layoutColumn = (attrs: { width: number }) => (
  content: BlockContent[],
): LayoutColumnDefinition => ({
  type: 'layoutColumn',
  attrs,
  content,
});
