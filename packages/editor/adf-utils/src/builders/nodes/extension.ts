import { ExtensionDefinition } from '@atlaskit/editor-common';

export const extension = (
  attrs: ExtensionDefinition['attrs'],
): ExtensionDefinition => ({
  type: 'extension',
  attrs,
});
