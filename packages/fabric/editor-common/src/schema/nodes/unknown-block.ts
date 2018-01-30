import { NodeSpec } from 'prosemirror-model';
import { inlineNodes } from '../inline-nodes';

const name = 'unknownBlock';

export default {
  group: 'block',
  content: `(${Array.from(inlineNodes.values()).join(' | ')})*`,
  marks: '_',
  toDOM() {
    return ['div', { 'data-node-type': name }, 0];
  },
  parseDOM: [{ tag: `div[data-node-type="${name}"]` }],
} as NodeSpec;
