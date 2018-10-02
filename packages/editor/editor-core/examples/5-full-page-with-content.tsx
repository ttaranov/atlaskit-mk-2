import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-document';

const doc = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            "Where appropriate, we enable people to introduce their own color palettes. Our products adapt intelligently and flexibly to cater for the user's preference. We are also committed to complying with AA standard contrast ratios.",
        },
      ],
    },
    {
      type: 'paragraph',
      marks: [{ type: 'indent' }],
      content: [
        {
          type: 'text',
          text: 'To do this, choose ',
        },
        {
          type: 'text',
          text: 'primary',
          marks: [
            {
              type: 'code',
            },
          ],
        },
        {
          type: 'text',
          text: ', ',
        },
        {
          type: 'text',
          text: 'secondary',
          marks: [
            {
              type: 'code',
            },
          ],
        },
        {
          type: 'text',
          text: ' and ',
        },
        {
          type: 'text',
          text: 'extended',
          marks: [
            {
              type: 'code',
            },
          ],
        },
        {
          type: 'text',
          text:
            ' colors that support usability by ensuring sufficient color contrast between elements so that users with low vision can see and use the interface. Some date: 18 Jul 2018.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Mention ',
        },
        {
          type: 'mention',
          attrs: {
            id: '0',
            text: '@Carolyn',
            accessLevel: '',
          },
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
  ],
};

export default function Example() {
  return FullPageExample({ defaultValue: doc });
}
