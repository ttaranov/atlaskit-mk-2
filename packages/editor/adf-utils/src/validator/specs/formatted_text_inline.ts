export default [
  'text',
  {
    props: {
      marks: {
        type: 'array',
        items: [
          [
            'link',
            'em',
            'strong',
            'strike',
            'subsup',
            'underline',
            'textColor',
            'action',
          ],
        ],
        optional: true,
      },
    },
  },
];
