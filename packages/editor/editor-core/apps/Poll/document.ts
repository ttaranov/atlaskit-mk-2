import { EDITOR_APPS_EXTENSION_TYPE, POLL_EXTENSION_KEY } from './';
import { generateUuid } from '@atlaskit/editor-common';

export const getPollDefaultNode = () => ({
  type: 'extension',
  attrs: {
    extensionType: EDITOR_APPS_EXTENSION_TYPE,
    extensionKey: POLL_EXTENSION_KEY,
    parameters: {
      id: `${generateUuid()}`,
      title: 'Title',
      choices: [
        {
          id: `${generateUuid()}`,
          value: 'Option 1',
        },
        {
          id: `${generateUuid()}`,
          value: 'Option 2',
        },
      ],
      createDate: 1534859278962,
      finishDate: 1535551200000,
    },
    layout: 'default',
  },
});

export const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is Editor Apps demo: Poll.',
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: EDITOR_APPS_EXTENSION_TYPE,
        extensionKey: POLL_EXTENSION_KEY,
        parameters: {
          id: '123',
          title: 'Tabs or spaces?',
          choices: [
            {
              id: `1`,
              value: 'Tabs',
            },
            {
              id: `2`,
              value: 'Spaces',
            },
          ],
          createDate: 1534859278962,
          finishDate: 1535551200000,
        },
        layout: 'default',
      },
    },
  ],
};
