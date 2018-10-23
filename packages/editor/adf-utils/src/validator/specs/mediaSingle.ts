export default {
  props: {
    type: { type: 'enum', values: ['mediaSingle'] },
    content: { type: 'array', items: ['media'], minItems: 1, maxItems: 1 },
    attrs: {
      props: {
        width: { type: 'number', minimum: 0, maximum: 100, optional: true },
        layout: {
          type: 'enum',
          values: ['wrap-right', 'center', 'wrap-left', 'wide', 'full-width'],
        },
      },
      optional: true,
    },
  },
};
