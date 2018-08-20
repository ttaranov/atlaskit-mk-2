export default {
  props: {
    type: { type: 'enum', values: ['tableRow'] },
    content: [
      { type: 'array', items: ['tableHeader'] },
      { type: 'array', items: ['tableCell'] },
    ],
  },
  required: ['content'],
};
