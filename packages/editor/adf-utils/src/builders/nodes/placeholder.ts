import { PlaceholderDefinition } from '@atlaskit/editor-common';

export const placeholder = (
  attrs: PlaceholderDefinition['attrs'],
): PlaceholderDefinition => ({
  type: 'placeholder',
  attrs,
});
