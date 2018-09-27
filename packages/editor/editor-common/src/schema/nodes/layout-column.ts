import { NodeSpec } from 'prosemirror-model';

export const layoutColumn: NodeSpec = {
  content: 'block+',
  isolating: true,
  attrs: {
    width: {
      default: undefined,
    },
  },
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-column]',
      skip: true,
    },
    {
      tag: 'div[data-layout-column]',
      getAttrs(dom: HTMLElement) {
        return {
          width: Number(dom.getAttribute('data-column-width')) || undefined,
        };
      },
    },
  ],
  toDOM(node) {
    const attrs = { 'data-layout-column': 'true' };
    const { width } = node.attrs;
    if (width) {
      attrs['style'] = `flex-basis: ${width}%`;
      attrs['data-column-width'] = width;
    }

    return ['div', attrs, 0];
  },
};
