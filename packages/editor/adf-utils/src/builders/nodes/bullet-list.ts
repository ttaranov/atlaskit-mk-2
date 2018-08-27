import {
  BulletListDefinition,
  ListItemDefinition,
} from '@atlaskit/editor-common';

export const bulletList = (
  ...content: Array<ListItemDefinition>
): BulletListDefinition => ({
  type: 'bulletList',
  content,
});
