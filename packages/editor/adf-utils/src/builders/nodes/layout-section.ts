import {
  LayoutColumnDefinition,
  LayoutSectionDefinition,
} from '@atlaskit/editor-common';

export const layoutSection = () => (
  content: Array<LayoutColumnDefinition>,
): LayoutSectionDefinition => ({
  type: 'layoutSection',
  content,
});
