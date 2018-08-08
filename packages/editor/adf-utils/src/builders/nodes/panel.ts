import { PanelDefinition, PanelAttributes } from '@atlaskit/editor-common';

export const panel = (attrs: PanelAttributes) => (
  ...content: PanelDefinition['content']
): PanelDefinition => ({
  type: 'panel',
  attrs,
  content,
});
