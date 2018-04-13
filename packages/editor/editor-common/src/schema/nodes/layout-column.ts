import { NodeSpec } from 'prosemirror-model';

export const layoutColumn: NodeSpec = {
  content: 'block+',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection/',
      tag: 'div',
    },
  ],
  toDOM() {
    return ['div', 0];
  },
};
