import { InlineExtensionDefinition } from '@atlaskit/editor-common';

export const inlineExtension = (
  attrs: InlineExtensionDefinition['attrs'],
) => (): InlineExtensionDefinition => ({
  type: 'inlineExtension',
  attrs,
});
