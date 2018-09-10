import { ListItemDefinition, ListItemArray } from '@atlaskit/editor-common';

export const listItem = (content: ListItemArray): ListItemDefinition => ({
  type: 'listItem',
  content,
});
