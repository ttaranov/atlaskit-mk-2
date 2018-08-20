export default [
  'text',
  {
    props: {
      marks: {
        type: 'array',
        items: [
          [
            'em',
            'strike',
            'strong',
            'underline',
            'subsup',
            'textColor',
            'action',
            'link',
          ],
        ],
        optional: true,
      },
    },
  },
];
