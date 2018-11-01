export default {
  props: {
    type: { type: 'enum', values: ['layoutSection'] },
    content: { type: 'array', items: ['layoutColumn'], minItems: 1 },
  },
};
