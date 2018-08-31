export default {
  props: {
    type: { type: 'enum', values: ['layoutSection'] },
    attrs: {
      props: {
        layoutType: {
          type: 'enum',
          values: ['two_equal', 'two_right_sidebar', 'two_left_sidebar'],
        },
      },
    },
    content: {
      type: 'array',
      items: ['layoutColumn'],
      minItems: 2,
      maxItems: 2,
    },
  },
};
