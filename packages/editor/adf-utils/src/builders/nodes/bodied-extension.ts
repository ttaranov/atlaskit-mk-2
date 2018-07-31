import {
  BodiedExtensionDefinition,
  ExtensionContent,
} from '@atlaskit/editor-common';

export const bodiedExtension = (attrs: BodiedExtensionDefinition['attrs']) => (
  ...content: ExtensionContent
): BodiedExtensionDefinition => ({
  type: 'bodiedExtension',
  attrs,
  content,
});
