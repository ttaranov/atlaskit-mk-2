import { NodeSpec } from 'prosemirror-model';

export const layoutColumn: NodeSpec = {
  content: 'paragraph | mediaSingle | codeBlock | (paragraph)+',
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

  toDOM(node) {
    const attrs = {
      'data-layout-column': 'true',
    };

    return ['div', attrs, 0];
  },
};
