import { NodeSpec } from 'prosemirror-model';

export const layoutColumn: NodeSpec = {
  content: 'block+',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-column]',
      skip: true,
    },
    {
      tag: 'div[data-layout-column]',
    },
  ],
  toDOM() {
    const attrs = { 'data-layout-column': 'true' };
    return ['div', attrs, 0];
  },
};
