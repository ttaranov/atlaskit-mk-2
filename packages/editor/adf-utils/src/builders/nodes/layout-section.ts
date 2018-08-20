import {
  LayoutSectionDefinition,
  LayoutColumnDefinition,
  LayoutSectionLayoutType,
} from '@atlaskit/editor-common';

export const layoutSection = (attrs: {
  layoutType: LayoutSectionLayoutType;
}) => (content: LayoutColumnDefinition[]): LayoutSectionDefinition =>
  ({
    type: 'layoutSection',
    attrs,
    content,
  } as LayoutSectionDefinition);
