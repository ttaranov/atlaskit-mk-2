export default href => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Some words',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A link',
          marks: [
            {
              type: 'link',
              attrs: {
                href,
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'More words',
        },
      ],
    },
  ],
});
