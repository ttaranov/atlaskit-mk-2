import {
  ExtensionType,
  ExtensionBodyType,
} from '../src/editor/plugins/macro/types';

export const inlineMacroData = [
  {
    type: 'inlineExtension' as ExtensionType,
    attrs: {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'status',
      parameters: {
        macroParams: {
          color: { value: 'Green' },
          title: { value: 'OK' },
          subtle: { value: true },
        },
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: {
                url:
                  '/wiki/plugins/servlet/confluence/placeholder/macro?definition=e3N0YXR1czpzdWJ0bGU9dHJ1ZXxjb2xvdXI9R3JlZW58dGl0bGU9T0t9&locale=en_GB&version=2',
              },
              type: 'image',
            },
          ],
        },
      },
    },
  },
  {
    type: 'inlineExtension' as ExtensionType,
    attrs: {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'status',
      parameters: {
        macroParams: {
          color: { value: 'Red' },
          title: { value: 'Fail' },
          subtle: { value: true },
        },
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: { url: '' },
              type: 'icon',
            },
          ],
        },
      },
    },
  },
];

export const blockBodylessMacroData = [
  {
    type: 'extension' as ExtensionType,
    attrs: {
      bodyType: 'none' as ExtensionBodyType,
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'gallery',
      parameters: {
        macroParams: {
          color: { value: 'Red' },
        },
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: {
                url:
                  '/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2dhbGxlcnl9&locale=en_GB&version=2',
              },
              type: 'image',
            },
          ],
        },
      },
    },
    content: [],
  },
  {
    type: 'extension' as ExtensionType,
    attrs: {
      bodyType: 'none' as ExtensionBodyType,
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'gallery',
      parameters: {
        macroParams: {
          color: { value: 'Yellow' },
        },
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: { url: '' },
              type: 'icon',
            },
          ],
        },
      },
    },
    content: [],
  },
];

export const blockPlainTextMacroData = [
  {
    type: 'extension' as ExtensionType,
    attrs: {
      bodyType: 'plain' as ExtensionBodyType,
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'code block',
      parameters: {
        macroParams: {
          language: { value: 'cpp' },
        },
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: {
                url:
                  '/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2NvZGU6bGFuZ3VhZ2U9Y3BwfQ&locale=en_GB&version=2',
              },
              type: 'image',
            },
          ],
        },
      },
    },
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Foo',
          },
        ],
      },
    ],
  },
  {
    type: 'extension' as ExtensionType,
    attrs: {
      bodyType: 'plain' as ExtensionBodyType,
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'code block',
      parameters: {
        macroParams: {
          language: { value: 'java' },
        },
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: { url: '' },
              type: 'icon',
            },
          ],
        },
      },
    },
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Bar',
          },
        ],
      },
    ],
  },
];

export const blockRichTextMacroData = [
  {
    type: 'extension' as ExtensionType,
    attrs: {
      bodyType: 'rich' as ExtensionBodyType,
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'expand',
      parameters: {
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: {
                url:
                  '/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2V4cGFuZH0&locale=en_GB&version=2',
              },
              type: 'image',
            },
          ],
        },
      },
    },
    content: [
      {
        type: 'heading',
        content: [
          {
            type: 'text',
            text: 'Heading',
          },
        ],
        attrs: {
          level: 5,
        },
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Foo',
            marks: [
              {
                type: 'underline',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'extension' as ExtensionType,
    attrs: {
      bodyType: 'rich' as ExtensionBodyType,
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'expand',
      parameters: {
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: { url: '' },
              type: 'icon',
            },
          ],
        },
      },
    },
    content: [
      {
        type: 'heading',
        content: [
          {
            type: 'text',
            text: 'Heading',
          },
        ],
        attrs: {
          level: 5,
        },
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Foo',
            marks: [
              {
                type: 'underline',
              },
            ],
          },
          {
            type: 'inlineExtension' as ExtensionType,
            attrs: {
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'status',
              parameters: {
                macroParams: {
                  color: { value: 'Green' },
                  title: { value: 'OK' },
                  subtle: { value: true },
                },
                macroMetadata: {
                  macroId: { value: new Date().valueOf() },
                  placeholder: [
                    {
                      data: {
                        url:
                          '/wiki/plugins/servlet/confluence/placeholder/macro?definition=e3N0YXR1czpzdWJ0bGU9dHJ1ZXxjb2xvdXI9R3JlZW58dGl0bGU9T0t9&locale=en_GB&version=2',
                      },
                      type: 'image',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  },
];
