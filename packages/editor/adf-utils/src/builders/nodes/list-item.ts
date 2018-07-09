import { ListItemDefinition, ListItemArray } from '@atlaskit/editor-common';

// TODO: figure this out :)
export const listItem = (content: ListItemArray): ListItemDefinition => ({
  type: 'listItem',
  content,
});
