import {
  MediaSingleDefinition,
  MediaDefinition,
  MediaSingleAttributes,
} from '@atlaskit/editor-common';

export const mediaSingle = (attrs?: MediaSingleAttributes) => (
  content: MediaDefinition,
): MediaSingleDefinition => ({
  type: 'mediaSingle',
  content: [content],
});
