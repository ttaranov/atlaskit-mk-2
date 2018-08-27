export default {
  props: {
    version: { type: 'enum', values: [1] },
    type: { type: 'enum', values: ['doc'] },
    content: 'top_level',
  },
  required: ['content'],
};
