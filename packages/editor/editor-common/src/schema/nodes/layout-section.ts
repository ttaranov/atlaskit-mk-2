import { NodeSpec } from 'prosemirror-model';

export type LayoutSectionLayoutType =
  | 'two_equal'
  | 'two_right_sidebar'
  | 'two_left_sidebar'
  | 'three_equal'
  | 'three_with_sidebars';

const LAYOUT_TYPES: LayoutSectionLayoutType[] = [
  'two_equal',
  'two_right_sidebar',
  'two_left_sidebar',
  'three_equal',
  'three_with_sidebars',
];

export const layoutSection: NodeSpec = {
  content: 'layoutColumn+',
  isolating: true,
  attrs: {
    layoutType: { default: 'two_equal' as LayoutSectionLayoutType },
    size: { default: 100 },
  },
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-type]',
      skip: true,
    },
    {
      tag: 'div[data-layout-type]',
      getAttrs(
        dom: HTMLElement,
      ): { layoutType: LayoutSectionLayoutType; size: number } {
        const domLayoutType = (
          dom.getAttribute('data-layout-type') || ''
        ).toLowerCase();
        const layoutType =
          LAYOUT_TYPES.find(type => domLayoutType === type) || 'two_equal';
        return {
          layoutType,
          size: parseInt(dom.getAttribute('data-size') || '', 10) || 100,
        };
      },
    },
  ],
  toDOM(node) {
    const attrs = {
      'data-layout-type': node.attrs.layoutType,
      class: 'editor-layout-section',
      'data-size': node.attrs.size,
    };
    return ['div', attrs, 0];
  },
};
