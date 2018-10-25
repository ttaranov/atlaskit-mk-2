export default {
  props: {
    type: { type: 'enum', values: ['inlineCard'] },
    attrs: {
      props: {
        url: {
          type: 'string',
          optional: true,
        },
        data: {
          optional: true,
        },
      },
    },
  },
  required: ['attrs'],
};
