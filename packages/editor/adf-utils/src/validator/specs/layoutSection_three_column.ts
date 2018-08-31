export default {
  props: {
    type: { type: 'enum', values: ['layoutSection'] },
    attrs: {
      props: {
        layoutType: {
          type: 'enum',
          values: ['three_equal', 'three_with_sidebars'],
        },
      },
    },
    content: {
      type: 'array',
      items: ['layoutColumn'],
      minItems: 3,
      maxItems: 3,
    },
  },
};
