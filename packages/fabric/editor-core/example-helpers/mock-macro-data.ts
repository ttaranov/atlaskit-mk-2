import { MacroType } from '../src/editor/plugins/macro/types';

export const inlineMacroData = [
  {
    type: 'inlineExtension' as MacroType,
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
    type: 'inlineExtension' as MacroType,
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
