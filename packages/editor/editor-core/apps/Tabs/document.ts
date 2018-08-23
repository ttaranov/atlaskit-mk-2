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
        parameters: {
          tabs: [
            {
              name: 'Tab 1',
              id: '1',
            },
            {
              name: 'Tab 2',
              id: '2',
            },
          ],
          tabsContent: [
            {
              tabId: '1',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'P1',
                    },
                  ],
                },
              ],
            },
            {
              tabId: '2',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'P2',
                    },
                  ],
                },
              ],
            },
          ],
        },
        layout: 'default',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'P1',
            },
          ],
        },
      ],
    },
  ],
};
