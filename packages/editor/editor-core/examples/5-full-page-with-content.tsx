import { default as FullPageExample } from './5-full-page';

const defaultValue = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Exercitation labore consequat',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Exercitation labore consequat Lorem laboris commodo fugiat aliquip ullamco sunt. Dolor proident elit anim anim aliqua dolor. Minim nulla cupidatat et ea dolor cupidatat fugiat tempor do nulla. Deserunt ad reprehenderit ut enim velit nisi ad anim anim ut.',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {},
      marks: [{ type: 'breakout', attrs: { mode: 'full-width' } }],
      content: [
        {
          type: 'text',
          text:
            'export default function Example() {\n  return FullPageExample({ defaultValue });\n}',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Exercitation labore consequat Lorem laboris commodo fugiat aliquip ullamco sunt. Dolor proident elit anim anim aliqua dolor. Minim nulla cupidatat et ea dolor cupidatat fugiat tempor do nulla. Deserunt ad reprehenderit ut enim velit nisi ad anim anim ut.',
        },
      ],
    },
  ],
};

export default function Example() {
  return FullPageExample({ defaultValue });
}
