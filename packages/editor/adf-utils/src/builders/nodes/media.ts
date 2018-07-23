import { MediaDefinition, MediaAttributes } from '@atlaskit/editor-common';

export const media = (attrs: MediaAttributes): MediaDefinition => ({
  type: 'media',
  attrs,
});
