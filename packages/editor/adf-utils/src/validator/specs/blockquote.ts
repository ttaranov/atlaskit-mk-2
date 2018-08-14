export default {
  props: {
    type: { type: 'enum', values: ['blockquote'] },
    content: { type: 'array', items: ['paragraph'], minItems: 1 },
  },
};
