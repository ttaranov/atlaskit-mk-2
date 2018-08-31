export default {
  props: {
    type: { type: 'enum', values: ['layoutColumn'] },
    content: {
      type: 'array',
      items: [
        [
          'paragraph',
          'bulletList',
          'mediaSingle',
          'orderedList',
          'heading',
          'panel',
          'blockquote',
          'rule',
          'codeBlock',
          'mediaGroup',
          'applicationCard',
          'decisionList',
          'taskList',
          'extension',
          'bodiedExtension',
          'table',
        ],
      ],
      minItems: 1,
    },
  },
};
