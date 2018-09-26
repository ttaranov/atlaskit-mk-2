import { NodeSpec } from 'prosemirror-model';

export const layoutSection: NodeSpec = {
  content: 'layoutColumn+',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-section]',
      skip: true,
    },
    {
      tag: 'div[data-layout-section]',
    },
  ],
  toDOM() {
    const attrs = { 'data-layout-section': 'true' };
    return ['div', attrs, 0];
  },
};
