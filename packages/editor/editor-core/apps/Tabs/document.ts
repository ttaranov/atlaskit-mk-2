import { EDITOR_APPS_EXTENSION_TYPE, TABS_EXTENSION_KEY } from './';

export const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is Editor Apps demo: Tabs.',
        },
      ],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: EDITOR_APPS_EXTENSION_TYPE,
        extensionKey: TABS_EXTENSION_KEY,
        parameters: {},
        layout: 'default',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
  ],
};
