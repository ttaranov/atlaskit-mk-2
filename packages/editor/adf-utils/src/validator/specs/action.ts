export default {
  props: {
    type: { type: 'enum', values: ['action'] },
    attrs: {
      props: {
        title: { type: 'string' },
        key: { type: 'string', optional: true },
        target: {
          props: {
            receiver: { type: 'string', optional: true },
            key: { type: 'string' },
          },
        },
        parameters: { optional: true },
      },
    },
  },
};
