import { NodeSpec } from 'prosemirror-model';

const name = 'unknownBlock';

export default {
  group: 'block',
  content: '(text | hardBreak | image | inlineExtension | emoji | mention)*',
  marks: '_',
  toDOM() {
    return ['div', { 'data-node-type': name }, 0];
  },
  parseDOM: [{ tag: `div[data-node-type="${name}"]` }],
} as NodeSpec;
