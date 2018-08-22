export default {
  props: {
    type: { type: 'enum', values: ['listItem'] },
    content: {
      type: 'array',
      items: [
        ['paragraph', 'mediaSingle'],
        ['paragraph', 'bulletList', 'mediaSingle', 'orderedList'],
      ],
      minItems: 1,
    },
  },
};
