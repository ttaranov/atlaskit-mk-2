export default {
  props: {
    type: { type: 'enum', values: ['panel'] },
    attrs: {
      props: {
        panelType: {
          type: 'enum',
          values: ['info', 'note', 'tip', 'warning', 'error', 'success'],
        },
      },
    },
    content: {
      type: 'array',
      items: [['paragraph', 'bulletList', 'orderedList', 'heading']],
      minItems: 1,
    },
  },
};
