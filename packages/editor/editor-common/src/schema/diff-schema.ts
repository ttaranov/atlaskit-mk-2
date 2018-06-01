import { createSchema } from './create-schema';
import { NodeSpec } from 'prosemirror-model';
import { defaultSchema } from './default-schema';

const inlineDiff: NodeSpec = {
  content: 'inline*',
  group: 'block',
  attrs: {
    diffType: { default: '' },
  },
  toDOM() {
    return ['span', 0];
  },
};

const blockDiff: NodeSpec = {
  content: 'inline*',
  group: 'block',
  attrs: {
    diffType: { default: '' },
  },
  toDOM() {
    return ['div', 0];
  },
};

export const diffSchema = createSchema({
  nodes: Object.keys(defaultSchema.nodes),
  marks: Object.keys(defaultSchema.marks),
  customNodeSpecs: {
    inlineDiff,
    blockDiff,
  },
});
