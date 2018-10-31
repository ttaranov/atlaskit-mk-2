export default {
  props: {
    type: { type: 'enum', values: ['blockCard'] },
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
