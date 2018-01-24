import { Node as PmNode } from 'prosemirror-model';
import {
  MacroProvider,
  MacroAttributes,
  ExtensionType,
} from '@atlaskit/editor-core';
import { bodiedExtensionData } from './mock-extension-data';

const getMacroADFNode = (macroName, macroParams) => {
  return {
    type: 'inlineExtension' as ExtensionType,
    attrs: {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: macroName,
      parameters: {
        macroParams,
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
  };
};

export class MockMacroProvider implements MacroProvider {
  public config = {};

  openMacroBrowser(macroNode?: PmNode): Promise<MacroAttributes> {
    const index = Math.floor(Math.random() * bodiedExtensionData.length);
    return Promise.resolve(bodiedExtensionData[index]);
  }

  autoConvert(link: String) {
    switch (link) {
      case 'www.trello.com?board=CFE':
        return getMacroADFNode('trello', {
          board: { value: 'CFE' },
        });
      case 'www.trello.com':
        return getMacroADFNode('trello', {});
      case 'www.twitter.com':
        return getMacroADFNode('twitter', {});
      default:
        return null;
    }
  }
}

export const macroProvider = new MockMacroProvider();
