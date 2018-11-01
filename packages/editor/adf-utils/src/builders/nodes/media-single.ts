import {
  MediaSingleDefinition,
  MediaDefinition,
  MediaSingleAttributes,
} from '@atlaskit/editor-common';

export const mediaSingle = (attrs: MediaSingleAttributes | undefined) => (
  content: MediaDefinition,
): MediaSingleDefinition => ({
  type: 'mediaSingle',
  attrs,
  content: [content],
});
