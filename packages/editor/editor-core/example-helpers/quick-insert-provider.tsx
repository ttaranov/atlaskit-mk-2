import * as React from 'react';
import DevIcon from '@atlaskit/icon/glyph/editor/code';
import {
  QuickInsertItem,
  QuickInsertProvider,
} from '../src/plugins/quick-insert/types';

const items: Array<QuickInsertItem> = [
  {
    title: 'Inline extension',
    icon: () => <DevIcon label="dev" />,
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
    icon: () => <DevIcon label="dev" />,
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
    title: 'Lorem ipsum',
    icon: () => <DevIcon label="dev" />,
    action(insert) {
      return insert({
        type: 'paragraph',
        content: [],
      }).insertText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
      );
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
