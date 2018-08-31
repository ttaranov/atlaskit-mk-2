import { NodeSpec } from 'prosemirror-model';
import { LayoutColumnDefinition } from './layout-column';

/**
 * @name layoutSection_two_column_node
 */
export type LayoutSectionTwoColumnDefinition = {
  type: 'layoutSection';
  attrs: {
    layoutType: 'two_equal' | 'two_right_sidebar' | 'two_left_sidebar';
  };
  /**
   * @minItems 2
   * @maxItems 2
   */
  content: LayoutColumnDefinition[];
};

/**
 * @name layoutSection_three_column_node
 */
export type LayoutSectionThreeColumnDefinition = {
  type: 'layoutSection';
  attrs: {
    layoutType: 'three_equal' | 'three_with_sidebars';
  };
  /**
   * @minItems 3
   * @maxItems 3
   */
  content: LayoutColumnDefinition[];
};

/**
 * @name layoutSection_node
 * @stage 0
 */
export type LayoutSectionDefinition =
  | LayoutSectionTwoColumnDefinition
  | LayoutSectionThreeColumnDefinition;

export type LayoutSectionLayoutType = LayoutSectionDefinition['attrs']['layoutType'];
const LAYOUT_TYPES: LayoutSectionLayoutType[] = [
  'two_equal',
  'two_right_sidebar',
  'two_left_sidebar',
  'three_equal',
  'three_with_sidebars',
];

export const layoutSection: NodeSpec = {
  content: 'layoutColumn{2,3}',
  isolating: true,
  attrs: {
    layoutType: { default: 'two_equal' as LayoutSectionLayoutType },
  },
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-type]',
      skip: true,
    },
    {
      tag: 'div[data-layout-type]',
      getAttrs(dom: HTMLElement): { layoutType: LayoutSectionLayoutType } {
        const domLayoutType = (
          dom.getAttribute('data-layout-type') || ''
        ).toLowerCase();
        const layoutType =
          LAYOUT_TYPES.find(type => domLayoutType === type) || 'two_equal';
        return { layoutType };
      },
    },
  ],
  toDOM(node) {
    const attrs = { 'data-layout-type': node.attrs.layoutType };
    return ['div', attrs, 0];
  },
};
