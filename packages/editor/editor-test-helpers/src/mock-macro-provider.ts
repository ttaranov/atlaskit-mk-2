import { Node as PmNode } from 'prosemirror-model';
import {
  ExtensionProvider,
  ExtensionAttributes,
  ExtensionType,
} from '@atlaskit/editor-core';
import { inlineExtensionData } from './mock-extension-data';

const allExtensionData = [...inlineExtensionData];

const getMacroADFNode = (macroName, macroParams): ExtensionAttributes => {
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

export class MockExtensionProvider implements ExtensionProvider {
  public config = {};

  openMacroBrowser(macroNode?: PmNode): Promise<ExtensionAttributes> {
    const index = Math.floor(Math.random() * allExtensionData.length);
    return Promise.resolve(allExtensionData[index]);
  }

  autoConvert(link: String): ExtensionAttributes | null {
    switch (link) {
      case 'www.dumbmacro.com?paramA=CFE':
        return getMacroADFNode('dumbMacro', {
          paramA: { value: 'CFE' },
        });
      case 'www.smartmacro.com?paramB=CFE':
        return getMacroADFNode('smartMacro', {
          paramB: { value: 'CFE' },
        });
      default:
        return null;
    }
  }
}

export const extensionProvider = new MockExtensionProvider();
