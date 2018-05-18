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
  private mockExtensionData;

  constructor(mockExtensionData) {
    this.mockExtensionData = mockExtensionData;
  }

  openMacroBrowser(macroNode?: PmNode): Promise<MacroAttributes> {
    return Promise.resolve(this.mockExtensionData);
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

export const macroProvider = new MockMacroProvider(bodiedExtensionData[0]);
