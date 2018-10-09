import {
  QuickInsertItem,
  QuickInsertProvider,
} from '../src/plugins/quick-insert/types';

const items: Array<QuickInsertItem> = [
  {
    title: 'Inline extension',
    action(insert) {
      return insert({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'inline-eh',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'Block extension',
    action(insert) {
      return insert({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'block-eh',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    title: 'Bodied extension',
    action(insert) {
      return insert({
        type: 'bodiedExtension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'bodied-eh',
          parameters: {
            macroParams: {},
            macroMetadata: {
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
            content: [],
          },
        ],
      });
    },
  },
];

export default function quickInsertProviderFactory(): QuickInsertProvider {
  return {
    getItems() {
      return new Promise(resolve => {
        setTimeout(() => resolve(items), 1000);
      });
    },
  };
}
