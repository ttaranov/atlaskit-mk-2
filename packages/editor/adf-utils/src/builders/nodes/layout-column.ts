import { LayoutColumnDefinition, TopLevel } from '@atlaskit/editor-common';

export const layoutColumn = () => (
  ...content: TopLevel[]
): LayoutColumnDefinition => ({
  type: 'layoutColumn',
  content,
});
