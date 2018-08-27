import { MediaGroupDefinition, MediaDefinition } from '@atlaskit/editor-common';

export const mediaGroup = (
  ...content: Array<MediaDefinition>
): MediaGroupDefinition => ({
  type: 'mediaGroup',
  content,
});
