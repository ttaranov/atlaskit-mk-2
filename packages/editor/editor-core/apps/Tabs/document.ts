import { EDITOR_APPS_EXTENSION_TYPE, TABS_EXTENSION_KEY } from './';

import { generateUuid } from '@atlaskit/editor-common';

export const getTabsDefaultNode = () => {
  const tab1Id = `${generateUuid()}`;
  const tab2Id = `${generateUuid()}`;

  return {
    type: 'bodiedExtension',
    attrs: {
      extensionType: EDITOR_APPS_EXTENSION_TYPE,
      extensionKey: TABS_EXTENSION_KEY,
      parameters: {
        tabs: [
          {
            name: 'Tab 1',
            id: tab1Id,
          },
          {
            name: 'Tab 2',
            id: tab2Id,
          },
        ],
        tabsContent: [
          {
            tabId: tab1Id,
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          {
            tabId: tab2Id,
            content: [
              {
                type: 'paragraph',
                content: [],
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
        content: [],
      },
    ],
  };
};

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
    { ...getTabsDefaultNode() },
  ],
};
