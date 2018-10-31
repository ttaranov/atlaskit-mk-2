export default {
  props: {
    type: { type: 'enum', values: ['paragraph'] },
    content: { type: 'array', items: ['inline'], allowUnsupportedInline: true },
  },
};
