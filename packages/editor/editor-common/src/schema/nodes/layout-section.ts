import { NodeSpec } from 'prosemirror-model';
export const layoutSection: NodeSpec = {
  content: 'layoutColumn{2,3}',
  isolating: true,
  attrs: {
    layoutType: { default: 'two_equal' },
  },
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-type]',
      skip: true,
    },
    {
      tag: 'div[data-layout-type]',
      getAttrs(dom: HTMLElement) {
        return { layout: dom.getAttribute('data-layout-type') || 'two_equal' };
      },
    },
  ],
  toDOM(node) {
    const attrs = { 'data-layout-type': node.attrs.layoutType };
    return ['div', attrs, 0];
  },
};
