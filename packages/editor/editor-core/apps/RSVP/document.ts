import { EDITOR_APPS_EXTENSION_TYPE, RSVP_EXTENSION_KEY } from './';

export const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Sydney Big Bash 2018 - White Rabbit',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'What is Big Bash?' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Once a year each Atlassian office heads out for a day of fun, craziness and team building we call Big Bash. Big Bash runs for approximately 3-4 hours and is designed to have elements that will please everyone. In the past we have descended on a ',
        },
        {
          type: 'text',
          text: 'Medieval Village',
          marks: [
            {
              type: 'link',
              attrs: { href: 'https://vimeo.com/105094652' },
            },
          ],
        },
        { type: 'text', text: ', ' },
        {
          type: 'text',
          text: 'Saved the Internet,',
          marks: [
            {
              type: 'link',
              attrs: {
                href:
                  'https://extranet.atlassian.com/pages/viewpage.action?pageId=2287209255',
              },
            },
          ],
        },
        { type: 'text', text: ' ' },
        {
          type: 'text',
          text: 'built a Box Empire',
          marks: [
            {
              type: 'link',
              attrs: { href: 'https://vimeo.com/138151476' },
            },
          ],
        },
        { type: 'text', text: ', and even held our own ' },
        {
          type: 'text',
          text: 'gameshow',
          marks: [
            {
              type: 'link',
              attrs: { href: 'https://vimeo.com/225338967' },
            },
          ],
        },
        { type: 'text', text: '.' },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: EDITOR_APPS_EXTENSION_TYPE,
        extensionKey: RSVP_EXTENSION_KEY,
        parameters: {
          title: 'Sydney Big Bash 2018 - White Rabbit',
          location: 'The Star\nPyrmont, NSW 2009',
          showMap: true,
          dateTime: new Date(2018, 11, 16, 14, 0),
          deadline: new Date(2018, 11, 12),
          duration: 2 * 60 * 60 * 1000,
          maxAttendees: 5,
        },
        layout: 'default',
      },
    },
  ],
};
