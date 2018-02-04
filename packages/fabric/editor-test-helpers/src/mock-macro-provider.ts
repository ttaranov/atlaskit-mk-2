import { Node as PmNode } from 'prosemirror-model';
import {
  MacroProvider,
  MacroAttributes,
  ExtensionType,
} from '@atlaskit/editor-core';
import { bodiedExtensionData } from './mock-extension-data';

const getMacroADFNode = (macroName, macroParams): MacroAttributes => {
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

  autoConvert(link: String): MacroAttributes | null {
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

export const macroProvider = new MockMacroProvider();
