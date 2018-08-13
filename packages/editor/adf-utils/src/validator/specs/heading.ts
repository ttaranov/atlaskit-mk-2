export default {
  props: {
    type: { type: 'enum', values: ['heading'] },
    content: { type: 'array', items: ['inline'], minItems: 0 },
    attrs: { props: { level: { type: 'number', minimum: 1, maximum: 6 } } },
  },
};
